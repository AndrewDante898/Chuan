import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'chuan',
    });

    let query = 'SELECT * FROM customer WHERE 1=1';
    const queryParams: string[] = [];

    if (req.query.searchTerm) {
        query += ' AND name LIKE ?';
        queryParams.push(`${req.query.searchTerm}%`);
    }
    if (req.query.ic) {
        query += ' AND ic LIKE ?';
        queryParams.push(`${req.query.ic}%`);
    }
    if (req.query.phone) {
        query += ' AND phone LIKE ?';
        queryParams.push(`${req.query.phone}%`);
    }
    if (req.query.roomNumber) {
        query += ' AND roomNumber LIKE ?';
        queryParams.push(`${req.query.roomNumber}%`);
    }
    if (req.query.startDate) {
        query += ' AND created_at >= ?';
        queryParams.push(`${req.query.startDate} 00:00:00`);
    }
    if (req.query.endDate) {
        query += ' AND created_at <= ?';
        queryParams.push(`${req.query.endDate} 23:59:59`);
    }

    const [rows] = await connection.execute(query, queryParams);
    res.status(200).json(rows);
}
