import Application from '../models/Application.js';
import Pet from '../models/Pet.js';

// POST /api/applications — apply to adopt a pet. Private. Idempotent: applying
// again for the same pet returns the existing application instead of duplicating.
export const applyForAdoption = async (req, res) => {
  const { petId } = req.body;
  if (!petId) return res.status(400).json({ error: 'petId is required' });

  const pet = await Pet.findById(petId);
  if (!pet) return res.status(404).json({ error: 'Pet not found' });
  if (pet.status !== 'adoptable') {
    return res.status(400).json({ error: 'This pet is not available for adoption' });
  }

  const existing = await Application.findOne({ petId, applicantId: req.user.id });
  if (existing) return res.status(200).json(existing);

  try {
    const application = await Application.create({ petId, applicantId: req.user.id });
    res.status(201).json(application);
  } catch (err) {
    // Unique-index race: another request created it first — return that one.
    if (err.code === 11000) {
      const application = await Application.findOne({ petId, applicantId: req.user.id });
      return res.status(200).json(application);
    }
    throw err;
  }
};

// GET /api/applications/me — the current user's adoption applications. Private.
export const myApplications = async (req, res) => {
  const applications = await Application.find({ applicantId: req.user.id })
    .populate('petId', 'name species breed pictures status')
    .sort({ createdAt: -1 });
  res.json(applications);
};

// DELETE /api/applications/:id — withdraw an application. Private, applicant only.
export const cancelApplication = async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) return res.status(404).json({ error: 'Application not found' });
  if (application.applicantId.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to cancel this application' });
  }
  await application.deleteOne();
  res.json({ message: 'Application withdrawn' });
};
