import { Router } from 'express';
import data from './productsList';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/', (req, res) => {
  res.json(data);
});

// Agregar un producto
router.post('/', (req, res) => {
  const product = {
    id: uuidv4(),
    name: req.body.name,
    stock: req.body.stock,
    value: req.body.value
  };

  if (!product.name || !product.stock || !product.value)
    return res.status(400).json({ error: 'Todos los campos son requerido' });
  data.push(product);
  res.json(product);
});

// Eliminar un producto
router.delete('/:id', (req, res) => {
  const product = data.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'El producto con ese id no fue encontrado' });

  const index = data.indexOf(product);
  data.splice(index, 1);
  res.json(product);
});

module.exports = router;
