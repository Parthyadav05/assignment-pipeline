import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  phoneNumber: string;
  createdAt: Date;
}

const ContactSchema: Schema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ContactSchema.index({ phoneNumber: 1 });

export default mongoose.model<IContact>('Contact', ContactSchema);
