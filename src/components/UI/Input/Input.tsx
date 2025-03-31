import { UseFormRegister } from 'react-hook-form';
import styles from './Input.module.css';

interface InputProps {
  label: string;
  name: string;
  type?: string;
  register: UseFormRegister<any>;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ label, name, type = 'text', register, required = false }) => {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        {...register(name, { required })}
        className={styles.input}
      />
    </div>
  );
};

export default Input;