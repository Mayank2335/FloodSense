import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reporterName: string;
  location: string;
  description: string;
  status: 'pending' | 'verified' | 'resolved';
  createdAt: Date;
}

const ReportSchema: Schema = new Schema({
  reporterName: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'verified', 'resolved'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model<IReport>('Report', ReportSchema);
