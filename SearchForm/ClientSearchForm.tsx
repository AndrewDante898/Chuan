import React from 'react';
import styles from '../pages/ClientTable.module.css';

interface SearchFormProps {
    filters: {
        searchTerm: string;
        ic: string;
        phone: string;
        roomNumber: string;
        startDate: string;
        endDate: string;
    };
    isExpanded: boolean;
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onToggle: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
                                                   filters,
                                                   isExpanded,
                                                   onFilterChange,
                                                   onSearchSubmit,
                                                   onToggle,
                                               }) => {
    return (
        <form className={`${styles.searchForm} ${isExpanded ? styles.expanded : styles.collapsed}`} onSubmit={onSearchSubmit}>
            <input
                className={styles.searchInput}
                type="text"
                name="searchTerm"
                placeholder="Search by name..."
                value={filters.searchTerm}
                onChange={onFilterChange}
            />
            {isExpanded && (
                <>
                    <input
                        className={styles.searchInput}
                        type="text"
                        name="ic"
                        placeholder="Filter by IC number..."
                        value={filters.ic}
                        onChange={onFilterChange}
                    />
                    <input
                        className={styles.searchInput}
                        type="text"
                        name="phone"
                        placeholder="Filter by phone number..."
                        value={filters.phone}
                        onChange={onFilterChange}
                    />
                    <input
                        className={styles.searchInput}
                        type="text"
                        name="roomNumber"
                        placeholder="Filter by room number..."
                        value={filters.roomNumber}
                        onChange={onFilterChange}
                    />
                    <div className={styles.dateRange}>
                        <label className={styles.searchLabel} htmlFor="startDate">Start Date</label>
                        <input
                            className={styles.searchInput}
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={filters.startDate}
                            onChange={onFilterChange}
                        />
                        <label className={styles.searchLabel} htmlFor="endDate">End Date</label>
                        <input
                            className={styles.searchInput}
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={filters.endDate}
                            onChange={onFilterChange}
                        />
                    </div>
                </>
            )}
            <div className={styles.toggleContainer}>
                <label className={styles.switch}>
                    <input
                        type="checkbox"
                        checked={isExpanded}
                        onChange={onToggle}
                    />
                    <span className={styles.slider}></span>
                </label>
                <span className={styles.toggleLabel}>
                    {isExpanded ? 'Hide Filters' : 'Show Filters'}
                </span>
            </div>
            <div className={styles.buttonGroup}>
                <button className={styles.searchButton} type="submit">Search</button>
                <button className={styles.toggleButton} type="button" onClick={onToggle}>
                    {isExpanded ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>
        </form>
    );
};

export default SearchForm;
