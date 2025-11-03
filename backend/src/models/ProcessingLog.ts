import mongoose, { Schema, Document } from 'mongoose';

export interface IProcessingLog extends Document {
  phoneNumber: string;
  status: 'valid' | 'invalid' | 'duplicate';
  createdAt: Date;
}

const ProcessingLogSchema: Schema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['valid', 'invalid', 'duplicate'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ProcessingLogSchema.index({ status: 1 });

export default mongoose.model<IProcessingLog>('ProcessingLog', ProcessingLogSchema);
