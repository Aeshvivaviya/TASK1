/**
 * Candidate Model - stores applicant data and AI-generated task
 */
const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Please provide at least one skill',
      },
    },
    experience: {
      type: String,
      required: [true, 'Experience level is required'],
      enum: ['0-1 years', '1-2 years', '2-4 years', '4-6 years', '6+ years'],
    },
    portfolioLink: {
      type: String,
      trim: true,
      default: '',
    },
    // AI-generated task details
    generatedTask: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      requirements: { type: [String], default: [] },
      deadline: { type: String, default: '7 days' },
      difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', ''],
        default: '',
      },
    },
    // Email delivery status
    emailSent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'task_assigned', 'under_review', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Candidate', CandidateSchema);
