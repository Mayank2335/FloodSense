import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  location?: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: false },
  googleId: { type: String, unique: true, sparse: true },
  location: { type: String, required: false },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
