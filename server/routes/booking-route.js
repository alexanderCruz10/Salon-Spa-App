/* eslint-disable no-undef */
const router = require('express').Router();
const Booking = require('../models/booking-model');
const Salon = require('../models/salon-model');
const { verifyToken } = require('../middleware/auth-middleware');

// Create a new booking (User only)
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { salonId, services, date, time, notes, totalAmount } = req.body;
    
    // Validate required fields
    if (!salonId || !services || services.length === 0 || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Salon ID, services, date, and time are required'
      });
    }

    // Verify salon exists and is active
    const salon = await Salon.findById(salonId);
    if (!salon) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    if (!salon.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This salon is currently not accepting bookings'
      });
    }

    // Validate date is not in the past
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book appointments in the past'
      });
    }

    // Check if user is trying to book their own salon (if they're an owner)
    if (req.user.role === 'owner') {
      const userSalon = await Salon.findOne({ ownerId: req.user.userId, _id: salonId });
      if (userSalon) {
        return res.status(400).json({
          success: false,
          message: 'Owners cannot book their own salons'
        });
      }
    }

    // Create booking with user and salon details
    const booking = new Booking({
      userId: req.user.userId,
      salonId,
      services,
      date: bookingDate,
      time,
      notes: notes || '',
      totalAmount: totalAmount || 0,
      // Customer details
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerPhone: req.user.phone || '',
      // Salon details
      salonName: salon.name,
      salonAddress: `${salon.address}, ${salon.city}, ${salon.province}`,
      salonPhone: salon.phoneNumber || ''
    });

    await booking.save();

    // Populate references before sending response
    await booking.populate('userId', 'name email');
    await booking.populate('salonId', 'name address city province');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking'
    });
  }
});

// Get user's bookings
router.get('/my-bookings', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .populate('salonId', 'name address city province phoneNumber')
      .sort({ date: -1, time: -1 });

    res.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
});

// Get salon's bookings (Owner only)
router.get('/salon/:salonId', verifyToken, async (req, res) => {
  try {
    const { salonId } = req.params;

    // Verify the salon belongs to the requesting user
    const salon = await Salon.findById(salonId);
    if (!salon) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    if (salon.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view these bookings'
      });
    }

    // Get all bookings for this salon
    const bookings = await Booking.find({ salonId })
      .populate('userId', 'name email phone')
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.error('Error fetching salon bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch salon bookings'
    });
  }
});

// Get booking by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('salonId', 'name address city province phoneNumber');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify user has access to this booking
    const salon = await Salon.findById(booking.salonId);
    const isOwner = salon && salon.ownerId.toString() === req.user.userId;
    const isCustomer = booking.userId._id.toString() === req.user.userId;

    if (!isOwner && !isCustomer) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking'
    });
  }
});

// Update booking status (Owner or User)
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check permissions
    const salon = await Salon.findById(booking.salonId);
    const isOwner = salon && salon.ownerId.toString() === req.user.userId;
    const isCustomer = booking.userId.toString() === req.user.userId;

    if (!isOwner && !isCustomer) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this booking'
      });
    }

    // Users can only cancel their own bookings
    if (isCustomer && !isOwner && status !== 'cancelled') {
      return res.status(403).json({
        success: false,
        message: 'Users can only cancel bookings'
      });
    }

    // Check if booking can be modified
    if (!booking.canBeCancelled() && status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking cannot be cancelled'
      });
    }

    // Update booking
    booking.status = status;
    
    if (status === 'cancelled') {
      booking.cancelledAt = new Date();
      booking.cancelledBy = isOwner ? 'owner' : 'user';
      if (cancellationReason) {
        booking.cancellationReason = cancellationReason;
      }
    }

    await booking.save();

    // Populate before sending response
    await booking.populate('userId', 'name email');
    await booking.populate('salonId', 'name address city province');

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      data: booking
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking'
    });
  }
});

// Cancel booking (convenience endpoint)
router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has permission to cancel
    const salon = await Salon.findById(booking.salonId);
    const isOwner = salon && salon.ownerId.toString() === req.user.userId;
    const isCustomer = booking.userId.toString() === req.user.userId;

    if (!isOwner && !isCustomer) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to cancel this booking'
      });
    }

    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'This booking cannot be cancelled'
      });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancelledBy = isOwner ? 'owner' : 'user';
    if (cancellationReason) {
      booking.cancellationReason = cancellationReason;
    }

    await booking.save();

    await booking.populate('userId', 'name email');
    await booking.populate('salonId', 'name address city province');

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
});

module.exports = router;
