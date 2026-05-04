/**
 * Email Service - Sends task assignment emails to candidates
 * Uses Nodemailer with SMTP configuration
 */
const nodemailer = require('nodemailer');
const { generateTaskPDF } = require('./pdfService');

/**
 * Creates and returns a configured Nodemailer transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for port 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Generates the HTML email template for task assignment
 * @param {Object} candidate - Candidate data
 * @param {Object} task - Generated task data
 * @returns {string} HTML email content
 */
const generateEmailTemplate = (candidate, task) => {
  const requirementsList = task.requirements
    .map(
      (req, i) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #6366f1; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 10px;">${i + 1}</span>
          ${req}
        </td>
      </tr>`
    )
    .join('');

  const difficultyColor =
    task.difficulty === 'Beginner'
      ? '#22c55e'
      : task.difficulty === 'Intermediate'
      ? '#f59e0b'
      : '#ef4444';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Technical Task - Career Portal</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc;">

  <!-- Header -->
  <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
      🚀 Career Portal
    </h1>
    <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px;">
      Smart Hiring Platform
    </p>
  </div>

  <!-- Main Content -->
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">

    <!-- Greeting Card -->
    <div style="background: white; border-radius: 16px; padding: 32px; margin: 20px 0; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
      <h2 style="color: #1e293b; margin: 0 0 12px; font-size: 22px;">
        Hello, ${candidate.fullName}! 👋
      </h2>
      <p style="color: #64748b; line-height: 1.7; margin: 0;">
        Thank you for applying to our team! We've reviewed your profile and are excited to move forward. 
        Based on your skills in <strong style="color: #6366f1;">${candidate.skills.join(', ')}</strong> 
        and your <strong>${candidate.experience}</strong> of experience, we've prepared a personalized 
        technical task just for you.
      </p>
    </div>

    <!-- Task Card -->
    <div style="background: white; border-radius: 16px; padding: 32px; margin: 20px 0; box-shadow: 0 2px 12px rgba(0,0,0,0.08); border-left: 4px solid #6366f1;">
      
      <!-- Task Header -->
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <div style="background: #f0f0ff; border-radius: 10px; padding: 10px; margin-right: 16px;">
          <span style="font-size: 24px;">💻</span>
        </div>
        <div>
          <p style="margin: 0; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your Assignment</p>
          <h3 style="margin: 4px 0 0; color: #1e293b; font-size: 20px;">${task.title}</h3>
        </div>
      </div>

      <!-- Badges -->
      <div style="margin-bottom: 20px;">
        <span style="display: inline-block; background: ${difficultyColor}20; color: ${difficultyColor}; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-right: 8px;">
          ${task.difficulty}
        </span>
        <span style="display: inline-block; background: #f0f0ff; color: #6366f1; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">
          ⏰ ${task.deadline}
        </span>
      </div>

      <!-- Description -->
      <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
        <p style="color: #475569; line-height: 1.8; margin: 0; white-space: pre-line;">${task.description}</p>
      </div>

      <!-- Requirements -->
      <h4 style="color: #1e293b; margin: 0 0 16px; font-size: 16px;">📋 Requirements:</h4>
      <table style="width: 100%; border-collapse: collapse; color: #475569; font-size: 14px; line-height: 1.6;">
        ${requirementsList}
      </table>
    </div>

    <!-- Submission Instructions -->
    <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 16px; padding: 28px; margin: 20px 0; border: 1px solid #bae6fd;">
      <h4 style="color: #0369a1; margin: 0 0 16px; font-size: 16px;">📤 Submission Instructions</h4>
      <ol style="color: #0c4a6e; line-height: 2; margin: 0; padding-left: 20px;">
        <li>Complete the task within <strong>${task.deadline}</strong></li>
        <li>Push your code to a <strong>public GitHub repository</strong></li>
        <li>Include a detailed <strong>README.md</strong> with setup instructions</li>
        <li>Reply to this email with your <strong>GitHub repository link</strong></li>
        <li>Optionally, include a <strong>live demo link</strong> (Vercel, Netlify, etc.)</li>
      </ol>
    </div>

    <!-- Tips -->
    <div style="background: #fffbeb; border-radius: 16px; padding: 24px; margin: 20px 0; border: 1px solid #fde68a;">
      <h4 style="color: #92400e; margin: 0 0 12px; font-size: 15px;">💡 Pro Tips</h4>
      <ul style="color: #78350f; line-height: 1.9; margin: 0; padding-left: 20px; font-size: 14px;">
        <li>Write clean, well-commented code</li>
        <li>Follow best practices for your tech stack</li>
        <li>Add proper error handling</li>
        <li>Make it responsive and user-friendly</li>
      </ul>
    </div>

    <!-- CTA -->
    <div style="text-align: center; margin: 32px 0;">
      <p style="color: #64748b; font-size: 14px; margin-bottom: 16px;">
        Questions? Reply to this email and we'll get back to you within 24 hours.
      </p>
      <p style="color: #1e293b; font-weight: 600; font-size: 16px;">
        Best of luck! We're rooting for you. 🎯
      </p>
    </div>

  </div>

  <!-- Footer -->
  <div style="background: #1e293b; padding: 24px; text-align: center; margin-top: 20px;">
    <p style="color: #94a3b8; margin: 0; font-size: 13px;">
      © 2024 Career Portal. All rights reserved.
    </p>
    <p style="color: #64748b; margin: 8px 0 0; font-size: 12px;">
      This email was sent because you applied through our career portal.
    </p>
  </div>

</body>
</html>
  `;
};

/**
 * Sends task assignment email to the candidate
 * @param {Object} candidate - Candidate document from MongoDB
 * @param {Object} task - Generated task object
 * @returns {boolean} - true if sent successfully
 */
const sendTaskEmail = async (candidate, task) => {
  // Skip if email credentials not configured
  if (
    !process.env.EMAIL_USER ||
    process.env.EMAIL_USER === 'your_email@gmail.com' ||
    !process.env.EMAIL_PASS ||
    process.env.EMAIL_PASS === 'your_app_password_here' ||
    process.env.EMAIL_PASS === 'your_16_char_app_password' ||
    process.env.EMAIL_PASS.startsWith('your_')
  ) {
    console.warn('⚠️  Email credentials not configured in .env — skipping email send');
    return false;
  }

  try {
    const transporter = createTransporter();

    // Verify connection
    await transporter.verify();

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Career Portal" <${process.env.EMAIL_USER}>`,
      to: candidate.email,
      subject: `🎯 Your Technical Task - ${task.title} | Career Portal`,
      html: generateEmailTemplate(candidate, task),
      text: `
Hello ${candidate.fullName},

Thank you for applying! Here is your technical task:

TASK: ${task.title}
DIFFICULTY: ${task.difficulty}
DEADLINE: ${task.deadline}

DESCRIPTION:
${task.description}

REQUIREMENTS:
${task.requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}

SUBMISSION:
- Complete within ${task.deadline}
- Push to a public GitHub repository
- Reply with your GitHub link

Best of luck!
Career Portal Team
      `,
      attachments: [],
    };

    // Generate and attach PDF
    try {
      const pdfBuffer = await generateTaskPDF(candidate, task);
      const safeName = candidate.fullName.replace(/[^a-z0-9]/gi, '_');
      mailOptions.attachments.push({
        filename: `Task_${safeName}_CareerPortal.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      });
      console.log(`📎 PDF generated and attached for ${candidate.fullName}`);
    } catch (pdfError) {
      console.error('⚠️  PDF generation failed (sending email without attachment):', pdfError.message);
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${candidate.email}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return false;
  }
};

module.exports = { sendTaskEmail };
