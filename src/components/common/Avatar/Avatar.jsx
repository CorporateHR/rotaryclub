import styles from './Avatar.module.css';

const Avatar = ({ name, size = 'md', className = '' }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className={`${styles.avatar} ${styles[size]} ${className}`}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;

