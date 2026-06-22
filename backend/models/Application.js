import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending'], default: 'pending' },
  },
  { timestamps: true }
);

// One application per (pet, applicant) — enforces idempotent "apply to adopt".
applicationSchema.index({ petId: 1, applicantId: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
