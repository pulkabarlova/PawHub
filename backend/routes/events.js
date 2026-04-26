import express from 'express';
const router = express.Router();
import Event from '../models/Event.js';

// GET all
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET one by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new event
router.post('/', async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT/PATCH update event
router.put('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE event
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
