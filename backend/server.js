import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import todoRoutes from './routes/todoRoutes.js';
app.use("/api/todos", todoRoutes);

app.get("/", (req, res) => {
    res.send("Server is running...");
});

// Start server
app.listen(5000, () => {
    connectDB();
    console.log("Server started at http://localhost:5000");
});
