"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { toggleSearchForm } from "@/Redux/Reducers/SearchFormSlice";
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt";
import { jsPDF } from "jspdf"; // still needed for Invoice
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import * as XLSX from "xlsx";   // ✅ Excel export

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
    const isSearchFormExpanded = useAppSelector(
        (state) => state.searchForm.isExpanded
    );

    // ✅ Initialize DataTable once
    useEffect(() => {
        const table = $("#clientTable").DataTable({
            ajax: {
                url: "/api/getClient",
                dataSrc: "",
                data: function (d: DataParams) {
                    d.searchTerm = $("#searchTerm").val() as string;
                    d.ic = $("#ic").val() as string;
                    d.phone = $("#phone").val() as string;
                    d.roomNumber = $("#roomNumber").val() as string;
                    d.startDate = $("#startDate").val() as string;
                    d.endDate = $("#endDate").val() as string;
                    return d;
                },
            },
            columns: [
                {
                    data: "created_at",
                    render: (data) => new Date(data).toLocaleDateString(),
                },
                { data: "name" },
                { data: "ic" },
                { data: "phone" },
                { data: "roomNumber" },
                {
                    data: null,
                    render: function () {
                        return `<button class="invoice-btn">Invoice</button>`;
                    },
                },
            ],
            order: [[0, "desc"]],
            paging: true,
            lengthMenu: [5, 10, 25, 50],
            info: true,
            searching: false,
            pageLength: 10,
        });

        // ✅ Invoice button click
        $("#clientTable").on("click", ".invoice-btn", function () {
            const rowData = table.row($(this).parents("tr")).data() as Client;
            generateInvoice(rowData);
        });

        return () => {
            table.destroy();
            $("#clientTable").off("click", ".invoice-btn");
        };
    }, []);

    // ✅ Initialize Flatpickr when filters are visible
    useEffect(() => {
        if (!isSearchFormExpanded) return;

        let fpStart: flatpickr.Instance;
        let fpEnd: flatpickr.Instance;

        fpStart = flatpickr("#startDate", {
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "F j, Y",
            allowInput: false,
            onChange: function (selectedDates) {
                if (selectedDates[0]) {
                    fpEnd.set("minDate", selectedDates[0]);
                } else {
                    fpEnd.set("minDate", null);
                }
            },
        }) as flatpickr.Instance;

        fpEnd = flatpickr("#endDate", {
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "F j, Y",
            allowInput: false,
            onChange: function (selectedDates) {
                if (selectedDates[0]) {
                    fpStart.set("maxDate", selectedDates[0]);
                } else {
                    fpStart.set("maxDate", null);
                }
            },
        }) as flatpickr.Instance;

        return () => {
            try { fpStart.destroy(); } catch {}
            try { fpEnd.destroy(); } catch {}
        };
    }, [isSearchFormExpanded]);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        $("#clientTable").DataTable().ajax.reload();
    };

    const handleToggle = () => {
        dispatch(toggleSearchForm());
    };

    // ✅ Invoice generator (keep as is with jsPDF)
    function generateInvoice(data: Client) {
        const doc = new jsPDF();

        doc.setFillColor(52, 152, 219);
        doc.rect(0, 0, 210, 30, "F");
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("Lea's Guest House", 105, 20, { align: "center" });

        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text("Booking Invoice", 105, 45, { align: "center" });

        doc.setFillColor(236, 240, 241);
        doc.rect(20, 55, 170, 60, "F");
        doc.setFontSize(12);
        doc.setTextColor(44, 62, 80);

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

        y += 15;
        doc.setDrawColor(52, 152, 219);
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y);

        y += 20;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(12);
        doc.setTextColor(52, 73, 94);
        doc.text("Thank you for choosing Lea's Guest House!", 105, y, {
            align: "center",
        });

        y += 10;
        doc.setFillColor(52, 152, 219);
        doc.rect(0, y, 210, 10, "F");

        doc.save(`invoice_${data.name}_${data.roomNumber}.pdf`);
    }

    // ✅ Export Filtered Results to Excel
    function handleExport() {
        const table = $("#clientTable").DataTable();
        const filteredData = table.rows({ search: "applied" }).data().toArray() as Client[];

        if (filteredData.length === 0) {
            alert("No data to export!");
            return;
        }

        // Convert to worksheet with correct column labels
        const worksheetData = filteredData.map((row) => ({
            Date: new Date(row.created_at).toLocaleDateString(),
            Name: row.name,
            IC: row.ic,
            Phone: row.phone,
            "Room Number": row.roomNumber,
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");

        // Export to Excel
        XLSX.writeFile(workbook, "filtered_clients.xlsx");
    }

    return (
        <div className={styles.main}>
            <div className={styles.tableContainer}>
                <h2 className={styles.sectionTitle}>Search & Export</h2>
                <form
                    onSubmit={handleSearchSubmit}
                    className={`${styles.searchForm} ${
                        isSearchFormExpanded ? styles.expanded : styles.collapsed
                    }`}
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

                            {/* ✅ Date pickers with calendar */}
                            <div className={styles.dateRange}>
                                <label htmlFor="startDate" className={styles.searchLabel}>
                                    Start Date
                                </label>
                                <input
                                    type="text"
                                    id="startDate"
                                    className={styles.searchInput}
                                    placeholder="Select start date"
                                />

                                <label htmlFor="endDate" className={styles.searchLabel}>
                                    End Date
                                </label>
                                <input
                                    type="text"
                                    id="endDate"
                                    className={styles.searchInput}
                                    placeholder="Select end date"
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
                            {isSearchFormExpanded ? "Hide Filters" : "Show Filters"}
                        </span>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.searchButton}>
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
             bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500
             text-white font-semibold tracking-wide shadow-md
             hover:shadow-lg hover:from-emerald-600 hover:to-teal-600
             active:scale-95 transition-all duration-200 ease-out"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 24 24" strokeWidth="1.8"
                                 stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M12 4v12m0 0l-4-4m4 4l4-4m-9 8h10a2 2 0 002-2V6a2 2 0 00-2-2H9l-2 2" />
                            </svg>
                            Export to Excel
                        </button>

                        <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.searchButton}>
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
             bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500
             text-white font-semibold tracking-wide shadow-md
             hover:shadow-lg hover:from-emerald-600 hover:to-teal-600
             active:scale-95 transition-all duration-200 ease-out"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 24 24" strokeWidth="1.8"
                                 stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M12 4v12m0 0l-4-4m4 4l4-4m-9 8h10a2 2 0 002-2V6a2 2 0 00-2-2H9l-2 2" />
                            </svg>
                            Export to Excel
                        </button>

                    </div>
                </form>
            </div>

            <div className={styles.tableContainer}>
                <h2 className={styles.sectionTitle}>Client Data</h2>
                <table
                    id="clientTable"
                    className={`display ${styles.dataTable}`}
                >
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>IC</th>
                        <th>Phone</th>
                        <th>Room Number</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    );
}
