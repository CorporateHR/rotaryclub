import styles from './Textarea.module.css';

const Textarea = ({ 
  label, 
  value, 
  onChange, 
  placeholder,
  error,
  rows = 4,
  className = '',
  ...props 
}) => {
  return (
    <div className={`${styles.textareaGroup} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`${styles.textarea} ${error ? styles.error : ''}`}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default Textarea;

