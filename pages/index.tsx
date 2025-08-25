"use client";

import { useState } from 'react';
import axios from 'axios';
import styles from './index.module.css';

type Entry = {
  docNo: string;                 // ✅ new
  name: string;
  ic: string;
  phone: string;
  roomNumber: string;
  created_at: string;            // ISO string for check-in
  checked_out_at: string | null; // ✅ new, for later use
};

export default function Home() {
  const [name, setName] = useState('');
  const [ic, setIc] = useState('');
  const [phone, setPhone] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);

  // ✅ client-side generator (server will also enforce uniqueness)
  function generateDocNo() {
    const dt = new Date();
    const ymd = dt.toISOString().slice(0,10).replace(/-/g, ''); // YYYYMMDD
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase(); // 6 chars
    return `LGH-${ymd}-${rand}`;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newEntry: Entry = {
      docNo: generateDocNo(),
      name,
      ic,
      phone,
      roomNumber,
      created_at: new Date().toISOString(), // ✅ store ISO for reliable date filters/exports
      checked_out_at: null,                 // ✅ set now, we'll fill on check-out later
    };

    try {
      // POST to API; server will also generate a docNo if missing and return saved record
      const response = await axios.post('/api/InsertCustomerData', newEntry);

      if (response.status === 200) {
        const saved: Entry = response.data?.record ?? newEntry;

        setEntries(prev => [...prev, saved]);
        setSuccess(`Saved! Doc No: ${saved.docNo}`);
        setName(''); setIc(''); setPhone(''); setRoomNumber('');

        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

  return (
      <div className={styles.pageWrapper}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.adminForm}>
              <h2>Admin Data Entry</h2>
              {success && <div className={styles.successMessage}>{success}</div>}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formField}>
                  <label htmlFor="name" className={styles.label}>Name:</label>
                  <input id="name" type="text" value={name}
                         onChange={(e) => setName(e.target.value)} required className={styles.input} />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="ic" className={styles.label}>IC:</label>
                  <input id="ic" type="text" value={ic}
                         onChange={(e) => setIc(e.target.value)} required className={styles.input} />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="phone" className={styles.label}>Phone:</label>
                  <input id="phone" type="tel" value={phone}
                         onChange={(e) => setPhone(e.target.value)} required className={styles.input} />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="roomNumber" className={styles.label}>Room Number:</label>
                  <input id="roomNumber" type="text" value={roomNumber}
                         onChange={(e) => setRoomNumber(e.target.value)} required className={styles.input} />
                </div>

                <button type="submit" className={styles.submitButton}>Submit</button>
              </form>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                <tr>
                  <th>Name</th>
                  <th>IC</th>
                  <th>Phone</th>
                  <th>Room Number</th>
                  <th>Time Submitted</th>
                </tr>
                </thead>
                <tbody>
                {entries.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.name}</td>
                      <td>{entry.ic}</td>
                      <td>{entry.phone}</td>
                      <td>{entry.roomNumber}</td>
                      {/* we now store ISO; render as local string */}
                      <td>{new Date(entry.created_at).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>

          </div>
        </main>
      </div>
  );
}
