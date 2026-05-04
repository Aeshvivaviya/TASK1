/**
 * Application Controller
 * Handles candidate form submission, AI task generation, and email dispatch
 */
const { validationResult } = require('express-validator');
const Candidate = require('../models/Candidate');
const { generateTask } = require('../services/aiService');
const { sendTaskEmail } = require('../services/emailService');

/**
 * POST /api/apply
 */
const submitApplication = async (req, res) => {
  // 1. Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  const { fullName, email, phone, skills, experience, portfolioLink } = req.body;

  // 2. Check MongoDB is connected
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    console.error('❌ MongoDB not connected. readyState:', mongoose.connection.readyState);
    return res.status(500).json({
      success: false,
      message: 'Database connection error. Please try again later.',
    });
  }

  try {
    // 3. Parse skills — accept array or comma-separated string
    const skillsArray = Array.isArray(skills)
      ? skills.filter(Boolean)
      : String(skills).split(',').map((s) => s.trim()).filter(Boolean);

    if (skillsArray.length === 0) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'skills', message: 'Please provide at least one skill' }],
      });
    }

    // 4. Save candidate to database
    const candidate = new Candidate({
      fullName,
      email: email.toLowerCase(),
      phone,
      skills: skillsArray,
      experience,
      portfolioLink: portfolioLink || '',
    });

    await candidate.save();
    console.log(`📝 New candidate saved: ${fullName} (${email})`);

    // 6. Generate AI task — always falls back gracefully
    let generatedTask;
    try {
      generatedTask = await generateTask({
        fullName,
        skills: candidate.skills,
        experience,
        portfolioLink,
      });
      console.log(`🤖 AI task generated for: ${fullName}`);
    } catch (aiError) {
      console.error('⚠️  AI generation error (using fallback):', aiError.message);
      generatedTask = {
        title: 'Technical Assessment Task',
        description:
          'Complete a relevant technical project based on your skills. Focus on clean code, proper documentation, and best practices.',
        requirements: [
          'Write clean, well-documented code',
          'Include a detailed README with setup instructions',
          'Push your code to a public GitHub repository',
          'Ensure the project runs without errors',
          'Follow best practices for your tech stack',
        ],
        deadline: '7 days',
        difficulty: 'Intermediate',
      };
    }

    // 7. Update candidate with generated task
    candidate.generatedTask = generatedTask;
    candidate.status = 'task_assigned';
    await candidate.save();

    // 8. Send email — non-blocking, failure doesn't break the response
    let emailSent = false;
    try {
      emailSent = await sendTaskEmail(candidate, generatedTask);
    } catch (emailError) {
      console.error('⚠️  Email sending error (non-fatal):', emailError.message);
    }

    candidate.emailSent = emailSent;
    await candidate.save();

    // 9. Return success
    return res.status(201).json({
      success: true,
      message: emailSent
        ? 'Application submitted! Check your email for your personalized task.'
        : 'Application submitted successfully! Task has been generated. (Email delivery failed — please check your inbox or contact support.)',
      data: {
        candidateId: candidate._id,
        name: candidate.fullName,
        taskTitle: generatedTask.title,
        emailSent,
      },
    });
  } catch (error) {
    console.error('❌ Application submission error:', error);

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const fields = Object.keys(error.errors).map((key) => ({
        field: key,
        message: error.errors[key].message,
      }));
      return res.status(422).json({
        success: false,
        message: 'Data validation failed',
        errors: fields,
      });
    }

    // Mongoose duplicate key
    if (error.code === 11000) {
      // Allow duplicate emails — just treat as a new application
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to process your application. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = { submitApplication };
