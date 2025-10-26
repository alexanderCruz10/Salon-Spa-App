const express = require('express');
const router = express.Router();
const Salon = require('../models/salon-model');
const { verifyToken } = require('../middleware/auth-middleware');

// Helper function to geocode address (using a simple approximation for now)
// In production, you should use a real geocoding service like Google Maps API
const geocodeAddress = async (address, city, state, zipCode) => {
  // This is a placeholder - in production, use Google Maps Geocoding API or similar
  // For now, we'll return approximate coordinates for major US cities
  const cityCoordinates = {
    'los angeles': [-118.2437, 34.0522],
    'new york': [-74.0060, 40.7128],
    'chicago': [-87.6298, 41.8781],
    'houston': [-95.3698, 29.7604],
    'phoenix': [-112.0740, 33.4484],
    'philadelphia': [-75.1652, 39.9526],
    'san antonio': [-98.4936, 29.4241],
    'san diego': [-117.1611, 32.7157],
    'dallas': [-96.7970, 32.7767],
    'san jose': [-121.8863, 37.3382],
    'miami': [-80.1918, 25.7617],
    'atlanta': [-84.3880, 33.7490],
    'seattle': [-122.3321, 47.6062],
    'boston': [-71.0589, 42.3601],
    'denver': [-104.9903, 39.7392]
  };
  
  const cityKey = city.toLowerCase().trim();
  const coords = cityCoordinates[cityKey] || [-118.2437, 34.0522]; // Default to LA
  
  return {
    type: 'Point',
    coordinates: coords // [longitude, latitude]
  };
};

// Create a new salon (Owner only)
router.post('/', verifyToken, async (req, res) => {
  try {
    // Verify user is an owner
    if (req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only owners can create salons'
      });
    }

    const {
      name,
      description,
      address,
      city,
      province,
      postalCode,
      phone,
      email,
      website,
      services,
      openingHours
    } = req.body;

    // Geocode the address to get coordinates
    const location = await geocodeAddress(address, city, province, postalCode);

    // Create new salon
    const salon = new Salon({
      name,
      description,
      address,
      city,
      province,
      postalCode,
      phone,
      email,
      website,
      services,
      openingHours,
      location,
      ownerId: req.user.userId
    });

    await salon.save();

    res.status(201).json({
      success: true,
      message: 'Salon created successfully',
      data: salon
    });
  } catch (error) {
    console.error('Error creating salon:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create salon'
    });
  }
});

// Get all salons (with optional filters)
router.get('/', async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      maxDistance, // in kilometers
      city,
      services,
      search,
      limit = 20,
      page = 1
    } = req.query;

    let query = { isActive: true };
    let sort = {};

    // Geospatial search if coordinates provided
    if (latitude && longitude) {
      const maxDist = maxDistance ? parseFloat(maxDistance) * 1000 : 50000; // Default 50km
      
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: maxDist
        }
      };
    }

    // City filter
    if (city) {
      query.city = new RegExp(city, 'i');
    }

    // Services filter
    if (services) {
      const serviceArray = services.split(',').map(s => s.trim());
      query.services = { $in: serviceArray };
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
      sort.score = { $meta: 'textScore' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const salons = await Salon.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('ownerId', 'name email');

    const total = await Salon.countDocuments(query);

    res.json({
      success: true,
      data: salons,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching salons:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch salons'
    });
  }
});

// Get salons by owner (authenticated owner only)
router.get('/owner/my-salons', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only owners can access this endpoint'
      });
    }

    const salons = await Salon.find({ ownerId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: salons
    });
  } catch (error) {
    console.error('Error fetching owner salons:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch salons'
    });
  }
});

// Get salon by ID
router.get('/:id', async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id)
      .populate('ownerId', 'name email phone');

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    res.json({
      success: true,
      data: salon
    });
  } catch (error) {
    console.error('Error fetching salon:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch salon'
    });
  }
});

// Update salon (Owner only - their own salon)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only owners can update salons'
      });
    }

    const salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    // Verify ownership
    if (salon.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own salons'
      });
    }

    const {
      name,
      description,
      address,
      city,
      province,
      postalCode,
      phone,
      email,
      website,
      services,
      openingHours,
      isActive
    } = req.body;

    // Update fields
    if (name !== undefined) salon.name = name;
    if (description !== undefined) salon.description = description;
    if (address !== undefined) salon.address = address;
    if (city !== undefined) salon.city = city;
    if (province !== undefined) salon.province = province;
    if (postalCode !== undefined) salon.postalCode = postalCode;
    if (phone !== undefined) salon.phone = phone;
    if (email !== undefined) salon.email = email;
    if (website !== undefined) salon.website = website;
    if (services !== undefined) salon.services = services;
    if (openingHours !== undefined) salon.openingHours = openingHours;
    if (isActive !== undefined) salon.isActive = isActive;

    // Re-geocode if address changed
    if (address || city || province || postalCode) {
      salon.location = await geocodeAddress(
        salon.address,
        salon.city,
        salon.province,
        salon.postalCode
      );
    }

    // Skip validation if only updating isActive (for reactivating old salons with old service format)
    const saveOptions = Object.keys(req.body).length === 1 && isActive !== undefined 
      ? { validateBeforeSave: false } 
      : {};
    
    await salon.save(saveOptions);

    res.json({
      success: true,
      message: 'Salon updated successfully',
      data: salon
    });
  } catch (error) {
    console.error('Error updating salon:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update salon'
    });
  }
});

// Delete salon (Owner only - their own salon)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only owners can delete salons'
      });
    }

    const salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    // Verify ownership
    if (salon.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own salons'
      });
    }

    // Soft delete using update to bypass validation
    await Salon.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { runValidators: false }
    );

    // Or hard delete:
    // await Salon.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Salon deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting salon:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete salon'
    });
  }
});

// Search salons near coordinates
router.post('/search/nearby', async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 50 } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const salons = await Salon.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseFloat(maxDistance) * 1000 // Convert km to meters
        }
      },
      isActive: true
    }).limit(20);

    res.json({
      success: true,
      data: salons
    });
  } catch (error) {
    console.error('Error searching nearby salons:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to search salons'
    });
  }
});

module.exports = router;
