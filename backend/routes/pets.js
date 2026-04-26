import express from 'express';
const router = express.Router();
import Pet from '../models/Pet.js';
import auth from '../middleware/auth.js';

// GET all
router.get('/', async (req, res) => {
    try {
        const pets = await Pet.find();
        res.status(200).json(pets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET one by ID
router.get('/:id', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) return res.status(404).json({ error: 'Pet not found' });
        res.status(200).json(pet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new pet
router.post('/', auth, async (req, res) => {
    try {
        const petData = { ...req.body, ownerId: req.user.id };
        const pet = await Pet.create(petData);
        
        // Emit websocket event if status is 'adoptable'
        if (pet.status === 'adoptable' && req.io) {
            req.io.emit('new_adoption_alert', pet);
        }
        
        res.status(201).json(pet);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT/PATCH update pet
router.put('/:id', async (req, res) => {
    try {
        const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        if (!pet) return res.status(404).json({ error: 'Pet not found' });
        res.status(200).json(pet);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE pet
router.delete('/:id', async (req, res) => {
    try {
        const pet = await Pet.findByIdAndDelete(req.params.id);
        if (!pet) return res.status(404).json({ error: 'Pet not found' });
        res.status(200).json({ message: 'Pet deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
