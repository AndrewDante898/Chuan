"use client";

import { useState } from 'react';
import axios from 'axios';
import styles from './index.module.css';

export default function Home() {
  const [name, setName] = useState('');
  const [ic, setIc] = useState('');
  const [phone, setPhone] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [entries, setEntries] = useState<{ name: string; ic: string; phone: string; roomNumber: string; created_at: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentTime = new Date().toLocaleString(); // Get the current date and time
    const newEntry = { name, ic, phone, roomNumber, created_at: currentTime };

    try {
      // Send POST request to the API route
      const response = await axios.post('/api/InsertCustomerData', newEntry);

      if (response.status === 200) {
        // Add new entry to the list
        setEntries([...entries, newEntry]);

        // Set success message and clear form fields
        setSuccess('Data submitted successfully!');
        setName('');
        setIc('');
        setPhone('');
        setRoomNumber('');

        // Clear success message after a few seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

  return (
      <main className={styles.main}>
        <div className={styles.adminForm}>
          <h2>Admin Data Entry</h2>
          {success && <div className={styles.successMessage}>{success}</div>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formField}>
              <label htmlFor="name" className={styles.label}>Name:</label>
              <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={styles.input}
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="ic" className={styles.label}>IC:</label>
              <input
                  id="ic"
                  type="text"
                  value={ic}
                  onChange={(e) => setIc(e.target.value)}
                  required
                  className={styles.input}
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="phone" className={styles.label}>Phone:</label>
              <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className={styles.input}
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="roomNumber" className={styles.label}>Room Number:</label>
              <input
                  id="roomNumber"
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                  className={styles.input}
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
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
              <th>Time Submitted</th> {/* New column for time */}
            </tr>
            </thead>
            <tbody>
            {entries.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.name}</td>
                  <td>{entry.ic}</td>
                  <td>{entry.phone}</td>
                  <td>{entry.roomNumber}</td>
                  <td>{entry.created_at}</td> {/* Display the time */}
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </main>
  );
}
