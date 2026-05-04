/**
 * Admin Controller
 * Routes for viewing and managing all candidates (debug/admin use)
 */
const Candidate = require('../models/Candidate');
const { sendTaskEmail } = require('../services/emailService');

/**
 * GET /api/admin/candidates
 * Returns all candidates with their tasks
 */
const getAllCandidates = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Candidate.countDocuments(filter);
    const candidates = await Candidate.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-__v');

    return res.json({
      success: true,
      data: {
        candidates,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Admin fetch error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch candidates' });
  }
};

/**
 * GET /api/admin/candidates/:id
 * Returns a single candidate by ID
 */
const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).select('-__v');
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    return res.json({ success: true, data: candidate });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch candidate' });
  }
};

/**
 * PATCH /api/admin/candidates/:id/status
 * Update candidate status
 */
const updateCandidateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'task_assigned', 'under_review', 'accepted', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    return res.json({ success: true, message: 'Status updated', data: candidate });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};

/**
 * GET /api/admin/stats
 * Returns summary statistics
 */
const getStats = async (req, res) => {
  try {
    const total = await Candidate.countDocuments();
    const byStatus = await Candidate.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const emailsSent = await Candidate.countDocuments({ emailSent: true });
    const recent = await Candidate.find().sort({ createdAt: -1 }).limit(5).select('fullName email status createdAt');

    return res.json({
      success: true,
      data: {
        total,
        emailsSent,
        byStatus: byStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
        recentApplications: recent,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

/**
 * POST /api/admin/candidates/:id/resend-email
 * Resend task assignment email to a candidate
 */
const resendTaskEmail = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).select('-__v');
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    if (!candidate.generatedTask?.title) {
      return res.status(400).json({ success: false, message: 'No task generated for this candidate yet' });
    }

    const emailSent = await sendTaskEmail(candidate, candidate.generatedTask);

    if (emailSent) {
      candidate.emailSent = true;
      await candidate.save();
      return res.json({ success: true, message: 'Email resent successfully' });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to send email. Check email credentials in .env' });
    }
  } catch (error) {
    console.error('Resend email error:', error);
    return res.status(500).json({ success: false, message: 'Failed to resend email' });
  }
};

module.exports = { getAllCandidates, getCandidateById, updateCandidateStatus, getStats, resendTaskEmail };
