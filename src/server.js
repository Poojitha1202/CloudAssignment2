const express = require('express');
const bodyParser = require('body-parser');
const aurora = require('./db'); 

const app = express();
app.use(bodyParser.json());

// POST endpoint to store products
app.post('/store-products', async (req, res) => {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: 'Invalid input' });
    }
  
    try {
      const insertPromises = products.map(product => {
        const { name, price, availability } = product;
        return aurora.query(
          'INSERT INTO products (name, price, availability) VALUES (?, ?, ?)',
          [name, price, availability]
        );
      });
      
      await Promise.all(insertPromises);
      res.status(200).json({ message: 'Success.' });
    } catch (error) {
      
      res.status(500).json({ message: 'Error inserting data', error: error.message });
    }
  });

// GET endpoint to list all products
app.get('/list-products', async (req, res) => {
    try {
   
      const [rows] = await aurora.query('SELECT name, price, availability FROM products');
      const response = {
        products: rows.map(row => ({
          name: row.name,
          price: row.price,
          availability: row.availability
        }))
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Error fetching data from the database', error: error.message });
    }
  });

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});