import { Router } from 'express';
import data from './productsList';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const totalGeneral = [];

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

// Actualizar existencias
router.put('/:id', (req, res) => {
  const product = data.find(p => p.id === req.params.id);
  if (product) {
    product.stock++;
    return res.json(product);
  }
  res.status(404).json({ error: `El producto con el id ${req.params.id} no se ha encontrado` });
});

// Ver total vendido en general y actualizar existencias
router.post('/buy', (req, res) => {
  const product = {
    name: req.body.product,
    qty: +req.body.quantity
  };

  if (!product.name || !product.qty)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });

  if (!data.some(prod => prod.name === product.name))
    return res.status(404).json({ error: `El producto ${product.name} no fue encontrado` });

  const productBuyed = data.find(prod => prod.name === product.name);

  if (productBuyed.stock < product.qty)
    res.status(400).json({ error: 'No tenemos la cantidad solicitada en existencia' });

  totalGeneral.push(productBuyed.value * product.qty);

  productBuyed.stock -= product.qty;

  const total = totalGeneral.reduce((acumulador, valorAcutal) => acumulador + valorAcutal);

  res.json({ msg: 'Tu compra fue realizada con exito', totalBuyed: total });
});

module.exports = router;
