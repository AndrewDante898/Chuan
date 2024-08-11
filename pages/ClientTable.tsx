"use client";

import { useEffect, useState } from 'react';
import styles from './ClientTable.module.css'; // Ensure the CSS file is imported

interface Client {
    created_at: string;
    name: string;
    ic: string;
    phone: string;
    roomNumber: string;
}

export default function ClientTable() {
    const [clients, setClients] = useState<Client[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        async function fetchClients() {
            const response = await fetch('/api/getClient');
            const data = await response.json();
            setClients(data);
        }

        fetchClients();
    }, []);

    // Calculate the index of the last client on the current page
    const indexOfLastClient = currentPage * itemsPerPage;
    const indexOfFirstClient = indexOfLastClient - itemsPerPage;
    const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

    // Handle page change
    const handlePageChange = (page: number) => setCurrentPage(page);

    // Handle items per page change
    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page on items per page change
    };

    // Create page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(clients.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className={styles.main}>
            <div className={styles.tableContainer}>
                <h1>Client Table</h1>
                <table className={styles.dataTable}>
                    <thead>
                    <tr>
                        <th>Date & Time</th>
                        <th>Name</th>
                        <th>IC Number</th>
                        <th>Phone Number</th>
                        <th>Room Number</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentClients.map((client, index) => (
                        <tr key={index}>
                            <td>{new Date(client.created_at).toLocaleString()}</td>
                            <td>{client.name}</td>
                            <td>{client.ic}</td>
                            <td>{client.phone}</td>
                            <td>{client.roomNumber}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className={styles.paginationContainer}>
                    <select onChange={handleItemsPerPageChange} value={itemsPerPage} className={styles.dropdown}>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <div className={styles.pagination}>
                        {pageNumbers.map(number => (
                            <button
                                key={number}
                                onClick={() => handlePageChange(number)}
                                className={number === currentPage ? styles.active : ''}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
