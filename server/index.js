const express = require('express');
const cors = require('cors');
const { db, auth } = require('./firebase'); // Auth bhi import kiya
const { collection, addDoc } = require("firebase/firestore");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Route for Contact Form / Product Inquiries
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, quantity, destination, message } = req.body;
    
    // Firestore mein data save karna
    await addDoc(collection(db, "contacts"), {
      name,
      email,
      quantity,
      destination,
      message,
      date: new Date()
    });
    
    res.status(201).json({ message: "Inquiry saved successfully!" });
  } catch (error) {
    console.error("Firestore Error: ", error);
    res.status(500).json({ error: "Failed to save inquiry" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});