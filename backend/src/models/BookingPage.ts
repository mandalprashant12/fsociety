import mongoose, { Document, Schema } from 'mongoose';

export interface IBookingPage extends Document {
  userId: mongoose.Types.ObjectId;
  slug: string; // for URL like /username
  title: string;
  description?: string;
  meetingTypes: {
    id: string;
    name: string;
    duration: number; // in minutes
    description?: string;
    price?: number;
    isActive: boolean;
    bufferTime: number; // in minutes
    locations?: string[];
  }[];
  availability: {
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    startTime: string; // "09:00"
    endTime: string;   // "17:00"
    isAvailable: boolean;
    bufferTime: number; // in minutes
  }[];
  timezone: string;
  isActive: boolean;
  customFields?: {
    id: string;
    name: string;
    type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox';
    required: boolean;
    options?: string[];
    placeholder?: string;
  }[];
  settings: {
    requireApproval: boolean;
    allowRescheduling: boolean;
    allowCancellation: boolean;
    advanceBookingDays: number;
    minBookingNotice: number; // in hours
  };
  createdAt: Date;
  updatedAt: Date;
}

const BookingPageSchema = new Schema<IBookingPage>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  meetingTypes: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true,
      min: 5
    },
    description: {
      type: String
    },
    price: {
      type: Number,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    bufferTime: {
      type: Number,
      default: 0,
      min: 0
    },
    locations: [{
      type: String
    }]
  }],
  availability: [{
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    bufferTime: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  timezone: {
    type: String,
    required: true,
    default: 'UTC'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  customFields: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'email', 'phone', 'textarea', 'select', 'checkbox'],
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    options: [{
      type: String
    }],
    placeholder: {
      type: String
    }
  }],
  settings: {
    requireApproval: {
      type: Boolean,
      default: false
    },
    allowRescheduling: {
      type: Boolean,
      default: true
    },
    allowCancellation: {
      type: Boolean,
      default: true
    },
    advanceBookingDays: {
      type: Number,
      default: 30,
      min: 1
    },
    minBookingNotice: {
      type: Number,
      default: 2,
      min: 0
    }
  }
}, {
  timestamps: true
});

// Indexes
BookingPageSchema.index({ userId: 1 });
BookingPageSchema.index({ slug: 1 });
BookingPageSchema.index({ isActive: 1 });

export const BookingPage = mongoose.model<IBookingPage>('BookingPage', BookingPageSchema);
