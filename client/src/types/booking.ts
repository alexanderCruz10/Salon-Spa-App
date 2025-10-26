export interface Booking {
  _id: string;
  userId: string | {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  salonId: string | {
    _id: string;
    name: string;
    address: string;
    city: string;
    province: string;
    phoneNumber?: string;
  };
  services: string[];
  date: string | Date;
  time: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount?: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  salonName: string;
  salonAddress?: string;
  salonPhone?: string;
  cancellationReason?: string;
  cancelledAt?: string | Date;
  cancelledBy?: 'user' | 'owner' | 'admin';
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateBookingDTO {
  salonId: string;
  services: string[];
  date: string;
  time: string;
  notes?: string;
  totalAmount?: number;
}

export interface UpdateBookingStatusDTO {
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  cancellationReason?: string;
}
