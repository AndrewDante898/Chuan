"use client";

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks';
import { toggleSearchForm } from '@/Redux/Reducers/SearchFormSlice';
import styles from './ClientTable.module.css';
import * as XLSX from 'xlsx';

interface Client {
    created_at: string;
    name: string;
    ic: string;
    phone: string;
    roomNumber: string;
}

type SortDirection = 'asc' | 'desc' | '';

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
    const [sortColumn, setSortColumn] = useState<string>('created_at');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const dispatch = useAppDispatch();
    const isSearchFormExpanded = useAppSelector((state) => state.searchForm.isExpanded);

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
    const currentClients = clients
        .sort((a, b) => {
            if (sortDirection === '') return 0;
            const aVal = a[sortColumn as keyof Client] as unknown as string;
            const bVal = b[sortColumn as keyof Client] as unknown as string;
            if (sortDirection === 'asc') return aVal.localeCompare(bVal);
            return bVal.localeCompare(aVal);
        })
        .slice(indexOfFirstClient, indexOfLastClient);

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

    const totalRecords = clients.length;
    const displayedFrom = indexOfFirstClient + 1;
    const displayedTo = Math.min(indexOfLastClient, totalRecords);

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const handleToggle = () => {
        dispatch(toggleSearchForm());
    };

    return (
        <div className={styles.main}>
            <div className={`${styles.tableContainer} ${styles.section}`}>
                <h2 className={styles.sectionTitle}>Search & Export</h2>

                <form
                    onSubmit={handleSearchSubmit}
                    className={`${styles.searchForm} ${isSearchFormExpanded ? styles.expanded : styles.collapsed}`}
                >
                    <input
                        type="text"
                        name="searchTerm"
                        placeholder="Search by name..."
                        value={filters.searchTerm}
                        onChange={handleFilterChange}
                        className={styles.searchInput}
                    />
                    {isSearchFormExpanded && (
                        <>
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
                            <div className={styles.dateRange}>
                                <label className={styles.searchLabel} htmlFor="startDate">Start Date</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={handleFilterChange}
                                    className={styles.searchInput}
                                />
                                <label className={styles.searchLabel} htmlFor="endDate">End Date</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={handleFilterChange}
                                    className={styles.searchInput}
                                />
                            </div>
                        </>
                    )}
                    <div className={styles.toggleContainer}>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={isSearchFormExpanded}
                                onChange={handleToggle}
                            />
                            <span className={styles.slider}></span>
                        </label>
                        <span className={styles.toggleLabel}>
                        {isSearchFormExpanded ? 'Hide Filters' : 'Show Filters'}
                    </span>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.searchButton}>Search</button>
                        <button type="button" onClick={exportToExcel} className={styles.exportButton}>Export to Excel
                        </button>
                    </div>
                </form>
            </div>

            <div className={`${styles.tableContainer} ${styles.section}`}>
                <h2 className={styles.sectionTitle}>Client Data</h2>
                <div className={styles.paginationSummary}>
                    Showing {displayedFrom} to {displayedTo} of {totalRecords} records
                </div>
                <table className={styles.dataTable}>
                    <thead>
                    <tr>
                        <th onClick={() => handleSort('created_at')}
                            className={`${styles.sortableHeader} ${sortColumn === 'created_at' ? styles.active : ''}`}>
                        Date
                            <div className={`${styles.sortArrow} ${sortColumn === 'created_at' ? styles[sortDirection] : ''}`}></div>
                        </th>
                        <th onClick={() => handleSort('name')} className={`${styles.sortableHeader} ${sortColumn === 'name' ? styles.active : ''}`}>
                            Name
                            <div className={`${styles.sortArrow} ${sortColumn === 'name' ? styles[sortDirection] : ''}`}></div>
                        </th>
                        <th onClick={() => handleSort('ic')} className={`${styles.sortableHeader} ${sortColumn === 'ic' ? styles.active : ''}`}>
                            IC Number
                            <div className={`${styles.sortArrow} ${sortColumn === 'ic' ? styles[sortDirection] : ''}`}></div>
                        </th>
                        <th onClick={() => handleSort('phone')} className={`${styles.sortableHeader} ${sortColumn === 'phone' ? styles.active : ''}`}>
                            Phone Number
                            <div className={`${styles.sortArrow} ${sortColumn === 'phone' ? styles[sortDirection] : ''}`}></div>
                        </th>
                        <th onClick={() => handleSort('roomNumber')} className={`${styles.sortableHeader} ${sortColumn === 'roomNumber' ? styles.active : ''}`}>
                            Room Number
                            <div className={`${styles.sortArrow} ${sortColumn === 'roomNumber' ? styles[sortDirection] : ''}`}></div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentClients.map((client, index) => (
                        <tr key={index}>
                            <td>{new Date(client.created_at).toLocaleDateString()}</td>
                            <td>{client.name}</td>
                            <td>{client.ic}</td>
                            <td>{client.phone}</td>
                            <td>{client.roomNumber}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className={styles.paginationContainer}>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className={styles.dropdown}
                    >
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
                                className={`${styles.pageButton} ${currentPage === number ? styles.activePage : ''}`}
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
