import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, ic, phone, roomNumber } = req.body;

        // Connect to the database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root', // replace with your MySQL password
            database: 'chuan', // replace with your database name
        });

        try {
            // Insert data into the database
            const [result] = await connection.execute(
                "INSERT INTO customer (name, ic, phone, roomNumber) VALUES (?, ?, ?, ?)",
                [name, ic, phone, roomNumber]
            );

            // Close the database connection
            await connection.end();

            // Send a success response
            res.status(200).json({ message: 'Data inserted successfully!' });
        } catch (error) {
            // Handle any errors
            res.status(500).json({ message: 'An error occurred', error });
        }
    } else {
        // Handle any non-POST requests
        res.status(405).json({ message: 'Method not allowed' });
    }
}