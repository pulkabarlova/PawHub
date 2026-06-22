import Event from '../models/Event.js';

// GET /api/events — public (sorted by upcoming date)
export const listEvents = async (req, res) => {
  res.json(await Event.find().sort({ date: 1 }));
};

// GET /api/events/:id — public
export const getEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
};

// POST /api/events — private (organizer = current user)
export const createEvent = async (req, res) => {
  const event = await Event.create({ ...req.body, organizerId: req.user.id });
  res.status(201).json(event);
};

// PUT /api/events/:id — public
export const updateEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
};

// DELETE /api/events/:id — public
export const deleteEvent = async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json({ message: 'Event deleted successfully' });
};
