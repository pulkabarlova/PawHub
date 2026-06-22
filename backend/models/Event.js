import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String },
    type: {
      type: String,
      enum: ['adoption_day', 'vaccination_clinic', 'fundraiser'],
      default: 'adoption_day',
    },
    imageUrl: { type: String },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
