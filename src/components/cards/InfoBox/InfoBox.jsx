import styles from './InfoBox.module.css';

const InfoBox = ({ children, type = 'info', className = '' }) => {
  return (
    <div className={`${styles.infoBox} ${styles[type]} ${className}`}>
      {children}
    </div>
  );
};

export default InfoBox;

