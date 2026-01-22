import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from './SearchBar.module.css';

const SearchBar = ({ placeholder = 'Search...', onSearch, className = '' }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`${styles.searchBar} ${className}`}>
      <FiSearch className={styles.icon} />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className={styles.input}
      />
    </div>
  );
};

export default SearchBar;

