// Salon-related TypeScript types

export interface OpeningHours {
  monday: { open: string; close: string; closed: boolean }
  tuesday: { open: string; close: string; closed: boolean }
  wednesday: { open: string; close: string; closed: boolean }
  thursday: { open: string; close: string; closed: boolean }
  friday: { open: string; close: string; closed: boolean }
  saturday: { open: string; close: string; closed: boolean }
  sunday: { open: string; close: string; closed: boolean }
}

export interface Service {
  name: string
  price?: number
}

export interface SalonFormData {
  name: string
  description: string
  address: string
  city: string
  province: string
  postalCode: string
  phone: string
  email: string
  website: string
  services: Service[]
  openingHours: OpeningHours
}

export interface Salon extends SalonFormData {
  _id: string
  ownerId: string
  createdAt: string
  updatedAt: string
  rating?: number
  reviewCount?: number
  isActive?: boolean
  location?: {
    type: string
    coordinates: [number, number] // [longitude, latitude]
  }
}

export interface CreateSalonDTO {
  name: string
  description?: string
  address: string
  city: string
  province: string
  postalCode?: string
  phone?: string
  email?: string
  website?: string
  services: Service[]
  openingHours: OpeningHours
}

export type UpdateSalonDTO = Partial<CreateSalonDTO>;
