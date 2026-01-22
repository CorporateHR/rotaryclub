import styles from './ProgressBar.module.css';

const ProgressBar = ({ value, max = 100, className = '' }) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`${styles.progressBar} ${className}`}>
      <div 
        className={styles.progressFill}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;

