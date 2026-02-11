import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  location: string;
  active: boolean;
  createdAt: Date;
}

const AlertSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ['high', 'medium', 'low'], required: true },
  location: { type: String, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IAlert>('Alert', AlertSchema);
