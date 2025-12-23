const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user ID'],
    index: true
  },
  category: {
    type: String,
    enum: ['Food', 'Transportation', 'Entertainment', 'Healthcare', 'Shopping', 'Bills', 'Education', 'Travel', 'Other'],
    required: [true, 'Please provide a category']
  },
  limit: {
    type: Number,
    required: [true, 'Please provide a budget limit'],
    min: [0, 'Budget limit must be positive'],
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: 'Budget limit must be greater than 0'
    }
  },
  month: {
    type: String,
    required: [true, 'Please provide a month (YYYY-MM format)'],
    match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format']
  },
  alert_threshold: {
    type: Number,
    default: 80,
    min: [1, 'Alert threshold must be at least 1%'],
    max: [100, 'Alert threshold cannot exceed 100%'],
    description: 'Percentage at which to trigger alerts'
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for querying user budgets by month
budgetSchema.index({ user: 1, month: 1 });
budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
