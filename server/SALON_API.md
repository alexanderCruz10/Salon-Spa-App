# Salon API Documentation

## Base URL
`http://localhost:3001/api/salons`

## Endpoints

### 1. Create Salon (Owner Only)
**POST** `/api/salons`

**Authentication Required:** Yes (Owner role)

**Request Body:**
```json
{
  "name": "Luxury Spa & Salon",
  "description": "Premium spa and salon services in the heart of the city",
  "address": "123 Main Street",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001",
  "phone": "(555) 123-4567",
  "email": "info@luxuryspa.com",
  "website": "https://www.luxuryspa.com",
  "services": ["Haircut", "Manicure", "Pedicure", "Massage", "Facial"],
  "openingHours": {
    "monday": { "open": "09:00", "close": "18:00", "closed": false },
    "tuesday": { "open": "09:00", "close": "18:00", "closed": false },
    "wednesday": { "open": "09:00", "close": "18:00", "closed": false },
    "thursday": { "open": "09:00", "close": "18:00", "closed": false },
    "friday": { "open": "09:00", "close": "18:00", "closed": false },
    "saturday": { "open": "10:00", "close": "16:00", "closed": false },
    "sunday": { "open": "10:00", "close": "16:00", "closed": true }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Salon created successfully",
  "data": {
    "_id": "...",
    "name": "Luxury Spa & Salon",
    "ownerId": "...",
    "location": {
      "type": "Point",
      "coordinates": [-118.2437, 34.0522]
    },
    ...
  }
}
```

---

### 2. Get All Salons
**GET** `/api/salons`

**Query Parameters:**
- `latitude` (optional): User's latitude for distance-based search
- `longitude` (optional): User's longitude for distance-based search
- `maxDistance` (optional): Maximum distance in kilometers (default: 50)
- `city` (optional): Filter by city name
- `services` (optional): Comma-separated list of services (e.g., "Haircut,Massage")
- `search` (optional): Text search in name, description, city, services
- `limit` (optional): Number of results per page (default: 20)
- `page` (optional): Page number (default: 1)

**Example:**
```
GET /api/salons?city=Los Angeles&services=Haircut,Massage&limit=10
GET /api/salons?latitude=34.0522&longitude=-118.2437&maxDistance=10
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

---

### 3. Get Owner's Salons
**GET** `/api/salons/owner/my-salons`

**Authentication Required:** Yes (Owner role)

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

---

### 4. Get Salon by ID
**GET** `/api/salons/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Luxury Spa & Salon",
    "ownerId": {
      "name": "John Doe",
      "email": "owner@example.com",
      "phone": "..."
    },
    ...
  }
}
```

---

### 5. Update Salon (Owner Only)
**PUT** `/api/salons/:id`

**Authentication Required:** Yes (Owner role, must own the salon)

**Request Body:** (All fields optional)
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "phone": "(555) 999-8888",
  "services": ["New Service 1", "New Service 2"],
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Salon updated successfully",
  "data": {...}
}
```

---

### 6. Delete Salon (Owner Only)
**DELETE** `/api/salons/:id`

**Authentication Required:** Yes (Owner role, must own the salon)

**Response:**
```json
{
  "success": true,
  "message": "Salon deleted successfully"
}
```

**Note:** This performs a soft delete (marks salon as inactive). To hard delete, modify the route.

---

### 7. Search Nearby Salons
**POST** `/api/salons/search/nearby`

**Request Body:**
```json
{
  "latitude": 34.0522,
  "longitude": -118.2437,
  "maxDistance": 10
}
```

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

---

## Database Schema Features

### Geospatial Support
- Uses MongoDB's 2dsphere index for location-based queries
- Automatically geocodes addresses (currently using city approximations)
- **TODO:** Integrate with Google Maps Geocoding API for accurate coordinates

### Indexes
- **Geospatial Index:** `location` (2dsphere) for nearby searches
- **Owner Index:** `ownerId` for fast owner lookups
- **Text Index:** `name`, `description`, `city`, `services` for full-text search

### Virtual Fields
- `fullAddress`: Computed field combining address, city, state, zipCode

### Methods
- `getDistanceFrom(longitude, latitude)`: Calculate distance from a point
- `toRad(value)`: Convert degrees to radians for distance calculations

---

## Frontend Integration

The frontend is already configured with `salonAPI` in `/client/src/lib/api.ts`:

```typescript
import { salonAPI } from '@/lib/api'

// Create salon
await salonAPI.create(formData)

// Get all salons
const salons = await salonAPI.getAll()

// Get salon by ID
const salon = await salonAPI.getById(id)

// Update salon
await salonAPI.update(id, updateData)

// Delete salon
await salonAPI.delete(id)

// Get owner's salons
const mySalons = await salonAPI.getOwnerSalons()
```

---

## Next Steps

1. **Add Google Maps Geocoding API:**
   - Get API key from Google Cloud Console
   - Replace `geocodeAddress` function in `salon-route.js`
   - Convert addresses to accurate lat/lng coordinates

2. **Add Image Upload:**
   - Integrate with Cloudinary or AWS S3
   - Allow owners to upload salon images

3. **Add Reviews & Ratings:**
   - Create Review model
   - Calculate average ratings
   - Display reviews on salon pages

4. **Add Appointments:**
   - Create Appointment model
   - Link appointments to salons and users
   - Add booking functionality
