import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise'; // Ensure you have installed `mysql2` or `mysql`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'chuan'
    });

    const [rows] = await connection.execute('SELECT * FROM customer');
    res.status(200).json(rows);
}