"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks';
import { toggleSearchForm } from '@/Redux/Reducers/SearchFormSlice';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt';
import { jsPDF } from "jspdf"; // ✅ added for PDF
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
                { data: 'roomNumber' },
                {   // ✅ New Invoice column
                    data: null,
                    render: function (data, type, row) {
                        return `<button class="invoice-btn">Invoice</button>`;
                    }
                }
            ],
            order: [[0, 'desc']],
            paging: true,
            lengthMenu: [5, 10, 25, 50],
            info: true,
            searching: false,
            pageLength: 10,
        });

        // ✅ Attach click handler for invoice button
        $('#clientTable').on('click', '.invoice-btn', function () {
            const rowData = table.row($(this).parents('tr')).data() as Client;
            generateInvoice(rowData);
        });

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

    // ✅ PDF generator
    function generateInvoice(data: Client) {
        const doc = new jsPDF();

        // === Header Background ===
        doc.setFillColor(52, 152, 219); // nice blue
        doc.rect(0, 0, 210, 30, "F"); // full-width bar (A4 width = 210mm)

        // === Header Text ===
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255); // white text
        doc.setFont("helvetica", "bold");
        doc.text("Lea's Guest House", 105, 20, { align: "center" });

        // === Invoice Title ===
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0); // reset back to black
        doc.text("Booking Invoice", 105, 45, { align: "center" });

        // === Guest Details Box ===
        doc.setFillColor(236, 240, 241); // light grey background
        doc.rect(20, 55, 170, 60, "F");

        doc.setFontSize(12);
        doc.setTextColor(44, 62, 80); // dark grey/blue text
        let y = 65;
        doc.text(`Date: ${new Date(data.created_at).toLocaleDateString()}`, 25, y);
        y += 10;
        doc.text(`Guest Name: ${data.name}`, 25, y);
        y += 10;
        doc.text(`IC Number: ${data.ic}`, 25, y);
        y += 10;
        doc.text(`Phone: ${data.phone}`, 25, y);
        y += 10;
        doc.text(`Room Number: ${data.roomNumber}`, 25, y);

        // === Divider Line ===
        y += 15;
        doc.setDrawColor(52, 152, 219); // blue line
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y);

        // === Footer / Thanks ===
        y += 20;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(12);
        doc.setTextColor(52, 73, 94);
        doc.text("Thank you for choosing Lea's Guest House!", 105, y, { align: "center" });

        // === Footer Highlight Bar ===
        y += 10;
        doc.setFillColor(52, 152, 219);
        doc.rect(0, y, 210, 10, "F");

        // Save PDF
        doc.save(`invoice_${data.name}_${data.roomNumber}.pdf`);
    }

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
                        <th>Action</th> {/* ✅ New header */}
                    </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    );
}
