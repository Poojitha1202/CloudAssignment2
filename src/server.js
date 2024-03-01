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
      // Create a list of promises for each insert operation
      const insertPromises = products.map(product => {
        const { name, price, availability } = product;
        return aurora.query(
          'INSERT INTO products (name, price, availability) VALUES (?, ?, ?)',
          [name, price, availability]
        );
      });
      // Execute all insert operations
      await Promise.all(insertPromises);
  
      // If all goes well
      res.status(200).json({ message: 'Success.' });
    } catch (error) {
      // If there's an error
      res.status(500).json({ message: 'Error inserting data', error: error.message });
    }
  });

// GET endpoint to list all products
app.get('/list-products', async (req, res) => {
    try {
      // Query the products table
      const [rows] = await pool.query('SELECT name, price, availability FROM products');
      
      // Construct the response object
      const response = {
        products: rows.map(row => ({
          name: row.name,
          price: row.price,
          availability: row.availability
        }))
      };
      
      // Send the response with a 200 status code
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Error fetching data from the database', error: error.message });
    }
  });

  const PORT = process.env.PORT || 3000; // Use the PORT environment variable or 3000 if it's not set
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});