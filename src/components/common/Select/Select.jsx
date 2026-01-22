import styles from './Select.module.css';

const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [],
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className={`${styles.selectGroup} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className={`${styles.select} ${error ? styles.error : ''}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default Select;

