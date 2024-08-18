"use client";

import { useEffect, useState } from 'react';
import styles from './ClientTable.module.css';
import * as XLSX from 'xlsx';

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
    const [filters, setFilters] = useState({
        searchTerm: '',
        ic: '',
        phone: '',
        roomNumber: '',
        startDate: '',
        endDate: '',
    });
    const [appliedFilters, setAppliedFilters] = useState(filters);

    useEffect(() => {
        async function fetchClients() {
            const query = new URLSearchParams(appliedFilters).toString();
            const response = await fetch(`/api/getClient?${query}`);
            const data = await response.json();
            setClients(data);
        }

        fetchClients();
    }, [appliedFilters]);

    const indexOfLastClient = currentPage * itemsPerPage;
    const indexOfFirstClient = indexOfLastClient - itemsPerPage;
    const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAppliedFilters(filters);
        setCurrentPage(1);
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(clients); // Export entire filtered dataset
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
        XLSX.writeFile(workbook, "ClientsData.xlsx");
    };

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(clients.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className={styles.main}>
            <div className={styles.tableContainer}>
                <h1>Client Table</h1>
                <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                    <input
                        type="text"
                        name="searchTerm"
                        placeholder="Search by name..."
                        value={filters.searchTerm}
                        onChange={handleFilterChange}
                        className={styles.searchInput}
                    />
                    <input
                        type="text"
                        name="ic"
                        placeholder="Filter by IC number..."
                        value={filters.ic}
                        onChange={handleFilterChange}
                        className={styles.searchInput}
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Filter by phone number..."
                        value={filters.phone}
                        onChange={handleFilterChange}
                        className={styles.searchInput}
                    />
                    <input
                        type="text"
                        name="roomNumber"
                        placeholder="Filter by room number..."
                        value={filters.roomNumber}
                        onChange={handleFilterChange}
                        className={styles.searchInput}
                    />
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className={styles.searchInput}
                    />
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className={styles.searchInput}
                    />
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.searchButton}>Search</button>
                        <button onClick={exportToExcel} className={styles.exportButton}>Export to Excel</button>
                    </div>
                </form>
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
