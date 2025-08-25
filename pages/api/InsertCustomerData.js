import mysql from "mysql2/promise";

// ✅ MySQL connection
const dbConfig = {
    host: "localhost",      // change if needed
    user: "root",           // change
    password: "root",           // change
    database: "chuan",   // change
};

// ✅ Generate DocNo like DOC-2025-00001
function generateDocNo() {
    const now = new Date();
    return `DOC-${now.getFullYear()}-${Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0")}`;
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        const { name, ic, phone, roomNumber, docNo, created_at, checked_out_at } = req.body;



        // ✅ Generate UID + DocNo + Timestamps
        const uid16 = generateUUID();
        const finalDocNo = docNo || generateDocNo();
        const finalCreated = created_at ? new Date(created_at) : new Date();
        const finalCheckout = checked_out_at ? new Date(checked_out_at) : null;

        // ✅ Insert into DB
        const [result] = await connection.execute(
            `INSERT INTO customer 
      (uid16, docNo, name, ic, phone, roomNumber, created_at, checked_out_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [uid16, finalDocNo, name, ic, phone, roomNumber, finalCreated, finalCheckout]
        );

        res.status(200).json({
            message: "Data inserted successfully!",
            record: {
                uid16,
                docNo: finalDocNo,
                name,
                ic,
                phone,
                roomNumber,
                created_at: finalCreated,
                checked_out_at: finalCheckout,
            },
        });
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        if (connection) await connection.end();
    }
}
