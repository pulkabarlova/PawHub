import Pet from '../models/Pet.js';
import { emitAdoptionAlert } from '../config/socket.js';

// GET /api/pets — public
export const listPets = async (req, res) => {
  res.json(await Pet.find());
};

// GET /api/pets/:id — public
export const getPet = async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) return res.status(404).json({ error: 'Pet not found' });
  res.json(pet);
};

// POST /api/pets — private. Emits `new_adoption_alert` for adoptable pets.
export const createPet = async (req, res) => {
  const pet = await Pet.create({ ...req.body, ownerId: req.user.id });
  if (pet.status === 'adoptable') emitAdoptionAlert(pet);
  res.status(201).json(pet);
};

// PUT /api/pets/:id — private, owner only.
export const updatePet = async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) return res.status(404).json({ error: 'Pet not found' });
  if (pet.ownerId?.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to modify this pet' });
  }
  delete req.body.ownerId; // owner cannot be reassigned via update
  const updated = await Pet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json(updated);
};

// DELETE /api/pets/:id — private, owner only.
export const deletePet = async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) return res.status(404).json({ error: 'Pet not found' });
  if (pet.ownerId?.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to delete this pet' });
  }
  await pet.deleteOne();
  res.json({ message: 'Pet deleted successfully' });
};
