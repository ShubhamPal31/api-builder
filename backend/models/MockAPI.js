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

module.exports = mongoose.model('MockAPI', mockApiSchema);
