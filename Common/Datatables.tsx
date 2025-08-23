import React from 'react';
import styles from '../pages/ClientTable.module.css';

interface DataTableProps<T> {
    data: T[];
    columns: {
        key: keyof T;
        label: string;
        sortable?: boolean;
    }[];
    sortColumn: keyof T;
    sortDirection: 'asc' | 'desc' | '';
    onSort: (column: keyof T) => void;
}

const DataTable = <T,>({ data, columns, sortColumn, sortDirection, onSort }: DataTableProps<T>) => {
    return (
        <table className={styles.dataTable}>
            <thead>
            <tr>
                {columns.map(column => (
                    <th
                        key={String(column.key)}
                        onClick={() => column.sortable && onSort(column.key)}
                        className={styles.sortableHeader}
                    >
                        {column.label}
                        {column.sortable && (
                            <span
                                className={`${styles.sortArrow} ${sortDirection === 'asc' ? styles.asc : styles.desc}`}
                            >
                                    &#9660;
                                </span>
                        )}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((item, index) => (
                <tr key={index}>
                    {columns.map(column => (
                        <td key={String(column.key)}>
                            {item[column.key] as string | number | JSX.Element}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default DataTable;
