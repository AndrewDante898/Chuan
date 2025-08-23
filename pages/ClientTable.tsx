"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks';
import { toggleSearchForm } from '@/Redux/Reducers/SearchFormSlice';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt';
import styles from "./ClientTable.module.css";

interface Client {
    created_at: string;
    name: string;
    ic: string;
    phone: string;
    roomNumber: string;
}

interface DataParams {
    searchTerm?: string;
    ic?: string;
    phone?: string;
    roomNumber?: string;
    startDate?: string;
    endDate?: string;
}

export default function ClientTable() {
    const dispatch = useAppDispatch();
    const isSearchFormExpanded = useAppSelector((state) => state.searchForm.isExpanded);

    useEffect(() => {
        const table = $('#clientTable').DataTable({
            ajax: {
                url: '/api/getClient',
                dataSrc: '',
                data: function (d: DataParams) {
                    d.searchTerm = $('#searchTerm').val() as string;
                    d.ic = $('#ic').val() as string;
                    d.phone = $('#phone').val() as string;
                    d.roomNumber = $('#roomNumber').val() as string;
                    d.startDate = $('#startDate').val() as string;
                    d.endDate = $('#endDate').val() as string;
                    return d;
                },
            },
            columns: [
                { data: 'created_at', render: (data) => new Date(data).toLocaleDateString() },
                { data: 'name' },
                { data: 'ic' },
                { data: 'phone' },
                { data: 'roomNumber' }
            ],
            order: [[0, 'desc']],
            paging: true,       // Enable pagination
            lengthMenu: [5, 10, 25, 50], // Page size options
            info: true,        // Enable table information (Showing entries)
            searching: false,   // Keep searching off, as you have a custom form
            pageLength: 10,     // Default page size
        });

        // Cleanup DataTable on component unmount
        return () => {
            table.destroy();
        };
    }, []);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        $('#clientTable').DataTable().ajax.reload();
    };

    const handleToggle = () => {
        dispatch(toggleSearchForm());
    };

    return (
        <div className={styles.main}>
            <div className={styles.tableContainer}>
                <h2 className={styles.sectionTitle}>Search & Export</h2>

                <form
                    onSubmit={handleSearchSubmit}
                    className={`${styles.searchForm} ${isSearchFormExpanded ? styles.expanded : styles.collapsed}`}
                >
                    <input
                        type="text"
                        id="searchTerm"
                        placeholder="Search by name..."
                        className={styles.searchInput}
                    />
                    {isSearchFormExpanded && (
                        <>
                            <input
                                type="text"
                                id="ic"
                                placeholder="Filter by IC number..."
                                className={styles.searchInput}
                            />
                            <input
                                type="text"
                                id="phone"
                                placeholder="Filter by phone number..."
                                className={styles.searchInput}
                            />
                            <input
                                type="text"
                                id="roomNumber"
                                placeholder="Filter by room number..."
                                className={styles.searchInput}
                            />
                            <div className={styles.dateRange}>
                                <label htmlFor="startDate" className={styles.searchLabel}>Start Date</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    className={styles.searchInput}
                                />
                                <label htmlFor="endDate" className={styles.searchLabel}>End Date</label>
                                <input
                                    type="date"
                                    id="endDate"
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
                    </div>
                </form>
            </div>

            <div className={styles.tableContainer}>
                <h2 className={styles.sectionTitle}>Client Data</h2>
                <table id="clientTable" className={`display ${styles.dataTable}`}>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>IC</th>
                        <th>Phone</th>
                        <th>Room Number</th>
                    </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    );
}
