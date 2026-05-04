/**
 * Application Routes
 * POST /api/apply - Submit a new job application
 */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { submitApplication } = require('../controllers/applicationController');

// Validation rules for application form
const applicationValidation = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[+]?[\d\s\-().]{7,25}$/).withMessage('Please enter a valid phone number'),

  body('skills')
    .notEmpty().withMessage('Skills are required')
    .custom((value) => {
      const skills = Array.isArray(value) ? value : value.split(',').map((s) => s.trim());
      if (skills.length === 0 || skills.every((s) => !s)) {
        throw new Error('Please provide at least one skill');
      }
      return true;
    }),

  body('experience')
    .notEmpty().withMessage('Experience level is required')
    .isIn(['0-1 years', '1-2 years', '2-4 years', '4-6 years', '6+ years'])
    .withMessage('Please select a valid experience level'),

  body('portfolioLink')
    .optional({ checkFalsy: true })
    .isURL({ require_protocol: true }).withMessage('Please enter a valid URL (include http:// or https://)'),
];

// POST /api/apply
router.post('/', applicationValidation, submitApplication);

module.exports = router;
