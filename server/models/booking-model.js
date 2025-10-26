const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: [true, 'Salon ID is required']
  },
  services: [{
    type: String,
    required: true,
    trim: true
  }],
  date: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  time: {
    type: String,
    required: [true, 'Booking time is required'],
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    min: 0
  },
  // Customer details (snapshot at booking time)
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String
  },
  // Salon details (snapshot at booking time)
  salonName: {
    type: String,
    required: true
  },
  salonAddress: {
    type: String
  },
  salonPhone: {
    type: String
  },
  // Cancellation info
  cancellationReason: {
    type: String,
    trim: true
  },
  cancelledAt: {
    type: Date
  },
  cancelledBy: {
    type: String,
    enum: ['user', 'owner', 'admin']
  }
}, {
  timestamps: true
});

// Create compound index for efficient queries
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ salonId: 1, date: 1 });
bookingSchema.index({ status: 1, date: 1 });

// Virtual for formatted date
bookingSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  if (this.status === 'cancelled' || this.status === 'completed') {
    return false;
  }
  
  // Can't cancel if booking is in the past
  const bookingDateTime = new Date(`${this.date.toISOString().split('T')[0]}T${this.time}`);
  return bookingDateTime > new Date();
};

// Ensure virtuals are included in JSON
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
