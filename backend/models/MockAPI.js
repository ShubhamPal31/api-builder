const mongoose = require('mongoose');

const mockApiSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    method: { type: String, required: true },
    endpoint: { type: String, required: true },
    response: { type: Object, required: true },
  },
  { timestamps: true }
);

const MockAPI =
  mongoose.models.MockAPI || mongoose.model('MockAPI', mockApiSchema);

module.exports = MockAPI;
