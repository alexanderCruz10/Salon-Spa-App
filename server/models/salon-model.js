const mongoose = require('mongoose');

const openingHoursSchema = new mongoose.Schema({
  open: {
    type: String,
    required: true,
    default: '09:00'
  },
  close: {
    type: String,
    required: true,
    default: '18:00'
  },
  closed: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const salonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Salon name is required'],
    trim: true,
    maxlength: [100, 'Salon name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  province: {
    type: String,
    required: [true, 'Province is required'],
    trim: true
  },
  postalCode: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  website: {
    type: String,
    trim: true
  },
  services: [{
    type: String,
    trim: true
  }],
  openingHours: {
    monday: {
      type: openingHoursSchema,
      default: { open: '09:00', close: '18:00', closed: false }
    },
    tuesday: {
      type: openingHoursSchema,
      default: { open: '09:00', close: '18:00', closed: false }
    },
    wednesday: {
      type: openingHoursSchema,
      default: { open: '09:00', close: '18:00', closed: false }
    },
    thursday: {
      type: openingHoursSchema,
      default: { open: '09:00', close: '18:00', closed: false }
    },
    friday: {
      type: openingHoursSchema,
      default: { open: '09:00', close: '18:00', closed: false }
    },
    saturday: {
      type: openingHoursSchema,
      default: { open: '10:00', close: '16:00', closed: false }
    },
    sunday: {
      type: openingHoursSchema,
      default: { open: '10:00', close: '16:00', closed: true }
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required']
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  images: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
salonSchema.index({ location: '2dsphere' });

// Create index for owner lookups
salonSchema.index({ ownerId: 1 });

// Create text index for search
salonSchema.index({ name: 'text', description: 'text', city: 'text', services: 'text' });

// Virtual for full address
salonSchema.virtual('fullAddress').get(function() {
  return `${this.address}, ${this.city}, ${this.state} ${this.zipCode || ''}`.trim();
});

// Method to calculate distance from a point
salonSchema.methods.getDistanceFrom = function(longitude, latitude) {
  if (!this.location || !this.location.coordinates) {
    return null;
  }
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = this.toRad(latitude - this.location.coordinates[1]);
  const dLon = this.toRad(longitude - this.location.coordinates[0]);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(this.location.coordinates[1])) * 
            Math.cos(this.toRad(latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
};

salonSchema.methods.toRad = function(value) {
  return value * Math.PI / 180;
};

// Ensure virtuals are included in JSON
salonSchema.set('toJSON', { virtuals: true });
salonSchema.set('toObject', { virtuals: true });

const Salon = mongoose.model('Salon', salonSchema);

module.exports = Salon;
