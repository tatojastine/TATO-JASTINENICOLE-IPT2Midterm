// Import required packages
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

// Create the Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
async function testDatabase() {
    try {
        const connection = await db.getConnection();
        console.log("MySQL database connected successfully!");
        connection.release();
    } catch (error) {
        console.error("MySQL connection failed:");
        console.error(error.message);
    }
}

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Textbook Borrowing Tracker API is running!"
    });
});

// GET - Retrieve all textbook loans
app.get("/api/loans", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM loans ORDER BY id DESC"
        );

        res.json(rows);
    } catch (error) {
        console.error("GET /api/loans error:", error);

        res.status(500).json({
            message: "Failed to retrieve loans",
            error: error.message
        });
    }
});

// POST - Add a new textbook loan
app.post("/api/loans", async (req, res) => {
    try {
        const {
            book_title,
            borrower,
            date_borrowed,
            due_date,
            returned
        } = req.body;

        if (!book_title || !borrower || !date_borrowed || !due_date) {
            return res.status(400).json({
                message: "Please complete all required fields."
            });
        }

        const [result] = await db.query(
            `INSERT INTO loans
            (book_title, borrower, date_borrowed, due_date, returned)
            VALUES (?, ?, ?, ?, ?)`,
            [
                book_title,
                borrower,
                date_borrowed,
                due_date,
                returned || false
            ]
        );

        res.status(201).json({
            message: "Loan added successfully",
            id: result.insertId
        });

    } catch (error) {
        console.error("POST /api/loans error:", error);

        res.status(500).json({
            message: "Failed to add loan",
            error: error.message
        });
    }
});

// PUT - Update an existing textbook loan
app.put("/api/loans/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            book_title,
            borrower,
            date_borrowed,
            due_date,
            returned
        } = req.body;

        const [result] = await db.query(
            `UPDATE loans
             SET book_title = ?,
                 borrower = ?,
                 date_borrowed = ?,
                 due_date = ?,
                 returned = ?
             WHERE id = ?`,
            [
                book_title,
                borrower,
                date_borrowed,
                due_date,
                returned,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Loan not found"
            });
        }

        res.json({
            message: "Loan updated successfully"
        });

    } catch (error) {
        console.error("PUT /api/loans/:id error:", error);

        res.status(500).json({
            message: "Failed to update loan",
            error: error.message
        });
    }
});

// DELETE - Delete a textbook loan
app.delete("/api/loans/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM loans WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Loan not found"
            });
        }

        res.json({
            message: "Loan deleted successfully"
        });

    } catch (error) {
        console.error("DELETE /api/loans/:id error:", error);

        res.status(500).json({
            message: "Failed to delete loan",
            error: error.message
        });
    }
});

// Server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await testDatabase();
});