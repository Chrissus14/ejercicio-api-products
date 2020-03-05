import express from 'express';
import router from './productsRoutes';

const app = express();

app.use(express.json());
app.use('/products', router);

app.listen(3000, (req, res) => {
  console.log('Server on port 3000');
});
