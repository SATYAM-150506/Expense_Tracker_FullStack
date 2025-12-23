const express = require('express');
const { body, validationResult } = require('express-validator');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateBudget = [
  body('category')
    .isIn(['Food', 'Transportation', 'Entertainment', 'Healthcare', 'Shopping', 'Bills', 'Education', 'Travel', 'Other'])
    .withMessage('Invalid category'),
  body('limit')
    .isFloat({ min: 0.01 })
    .withMessage('Budget limit must be a positive number'),
  body('month')
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('Month must be in YYYY-MM format'),
  body('alert_threshold')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Alert threshold must be between 1 and 100'),
  body('description')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters')
];

// @desc    Get all budgets for logged in user
// @route   GET /api/budgets
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { month } = req.query;
    const filter = { user: req.user.id, isActive: true };

    if (month) {
      filter.month = month;
    }

    const budgets = await Budget.find(filter).sort({ category: 1 });

    res.status(200).json({
      success: true,
      count: budgets.length,
      budgets
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch budgets'
    });
  }
});

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        error: 'Budget not found'
      });
    }

    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this budget'
      });
    }

    res.status(200).json({
      success: true,
      budget
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch budget'
    });
  }
});

// @desc    Create budget
// @route   POST /api/budgets
// @access  Private
router.post('/', auth, validateBudget, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { category, limit, month, alert_threshold, description } = req.body;

    // Check if budget already exists for this category and month
    const existingBudget = await Budget.findOne({
      user: req.user.id,
      category,
      month
    });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        error: 'Budget already exists for this category and month'
      });
    }

    const budget = new Budget({
      user: req.user.id,
      category,
      limit,
      month,
      alert_threshold: alert_threshold || 80,
      description
    });

    await budget.save();

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      budget
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to create budget'
    });
  }
});

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
router.put('/:id', auth, validateBudget, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        error: 'Budget not found'
      });
    }

    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this budget'
      });
    }

    const { category, limit, month, alert_threshold, description } = req.body;

    // Check for duplicate if category or month changed
    if (category !== budget.category || month !== budget.month) {
      const existingBudget = await Budget.findOne({
        user: req.user.id,
        category,
        month,
        _id: { $ne: req.params.id }
      });

      if (existingBudget) {
        return res.status(400).json({
          success: false,
          error: 'Budget already exists for this category and month'
        });
      }
    }

    budget.category = category;
    budget.limit = limit;
    budget.month = month;
    budget.alert_threshold = alert_threshold || budget.alert_threshold;
    budget.description = description;

    await budget.save();

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      budget
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to update budget'
    });
  }
});

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        error: 'Budget not found'
      });
    }

    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this budget'
      });
    }

    await Budget.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete budget'
    });
  }
});

module.exports = router;
