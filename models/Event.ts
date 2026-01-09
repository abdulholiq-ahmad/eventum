import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type Visibility = 'public' | 'private';

export interface IEvent extends Document {
  title: string;
  description?: string;
  startsAt: Date;
  endsAt: Date;
  timezone?: string;
  visibility: Visibility;
  location?: {
    name?: string;
    address?: string;
    coords?: string;
    link?: string;
    type?: 'physical' | 'online';
  };
  requiresApproval: boolean;
  capacity?: number;
  image?: string;
  host: Types.ObjectId;
  attendees: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema(
  {
    name: String,
    address: String,
    coords: String,
    link: String,
    type: { type: String, enum: ['physical', 'online'] },
  },
  { _id: false }
);

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    timezone: { type: String },
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    location: { type: LocationSchema },
    requiresApproval: { type: Boolean, default: false },
    capacity: { type: Number },
    image: { type: String },
    host: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    attendees: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
  },
  { timestamps: true }
);

export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
