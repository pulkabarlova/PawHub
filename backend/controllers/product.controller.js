import Product from '../models/Product.js';

// GET /api/products — public (optional ?category= filter)
export const listProducts = async (req, res) => {
  const filter = req.query.category ? { category: req.query.category } : {};
  res.json(await Product.find(filter));
};

// GET /api/products/:id — public
export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
};

// POST /api/products — private (seller = current user)
export const createProduct = async (req, res) => {
  const product = await Product.create({ ...req.body, sellerId: req.user.id });
  res.status(201).json(product);
};

// PUT /api/products/:id — public
export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
};

// DELETE /api/products/:id — public
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deleted successfully' });
};
