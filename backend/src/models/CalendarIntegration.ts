import mongoose, { Document, Schema } from 'mongoose';

export interface ICalendarIntegration extends Document {
  userId: mongoose.Types.ObjectId;
  provider: 'google' | 'outlook' | 'apple' | 'caldav';
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  calendarId: string;
  isActive: boolean;
  lastSyncAt?: Date;
  userEmail?: string;
  userName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CalendarIntegrationSchema = new Schema<ICalendarIntegration>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: String,
    enum: ['google', 'outlook', 'apple', 'caldav'],
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String
  },
  expiresAt: {
    type: Date
  },
  calendarId: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastSyncAt: {
    type: Date
  },
  userEmail: {
    type: String
  },
  userName: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes
CalendarIntegrationSchema.index({ userId: 1, provider: 1 });
CalendarIntegrationSchema.index({ isActive: 1 });

export const CalendarIntegration = mongoose.model<ICalendarIntegration>('CalendarIntegration', CalendarIntegrationSchema);
