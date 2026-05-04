/**
 * Admin Routes
 * Protected routes for viewing and managing candidates
 */
const express = require('express');
const router = express.Router();
const {
  getAllCandidates,
  getCandidateById,
  updateCandidateStatus,
  getStats,
  resendTaskEmail,
} = require('../controllers/adminController');

// GET /api/admin/stats - Dashboard statistics
router.get('/stats', getStats);

// GET /api/admin/candidates - List all candidates (with pagination & filters)
router.get('/candidates', getAllCandidates);

// GET /api/admin/candidates/:id - Get single candidate
router.get('/candidates/:id', getCandidateById);

// PATCH /api/admin/candidates/:id/status - Update candidate status
router.patch('/candidates/:id/status', updateCandidateStatus);

// POST /api/admin/candidates/:id/resend-email - Resend task email
router.post('/candidates/:id/resend-email', resendTaskEmail);

module.exports = router;
