import styles from './FilterChips.module.css';

const FilterChips = ({ options = [], selected, onChange, className = '' }) => {
  return (
    <div className={`${styles.filterChips} ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          className={`${styles.chip} ${selected === option.value ? styles.active : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default FilterChips;

