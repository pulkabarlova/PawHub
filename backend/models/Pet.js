import mongoose from 'mongoose';

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String },
    age: { type: Number },
    healthNotes: { type: String },
    status: { type: String, enum: ['owned', 'adoptable', 'lost'], default: 'adoptable' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pictures: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Pet', petSchema);
