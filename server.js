const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const { ObjectID } = require('mongodb');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(express.static('public', { index: 'index.html' }));

// MongoDB Connection
const uri = "mongodb+srv://yashrajs927:6nmXhZs0LekAvMw9@cluster0.zzqw0b9.mongodb.net/?retryWrites=true&w=majority"; //  MongoDB connection URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

connectDB();

const collectionName = "anudeepindustries"; //  MongoDB collection name

// Get products from MongoDB
app.get('/api/products', async (req, res) => {
    try {
        const productsCollection = client.db().collection(collectionName);
        const products = await productsCollection.find().toArray();
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Add a product to MongoDB
app.post('/api/products', async (req, res) => {
    try {
        const { name, description, link, image } = req.body;

        if (!name || !description || !link || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const productsCollection = client.db().collection(collectionName);
        const newProduct = {
            name,
            description,
            link,
            image,
        };

        const result = await productsCollection.insertOne(newProduct);

        if (result.insertedCount === 1) {
            res.json({ message: 'Product added successfully' });
        } else {
            res.status(500).json({ message: 'Failed to add product' });
        }
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete a product by ID
app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        const productsCollection = client.db().collection(collectionName);
        const result = await productsCollection.deleteOne({ _id: new ObjectID(productId) });

        if (result.deletedCount === 1) {
            res.json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
