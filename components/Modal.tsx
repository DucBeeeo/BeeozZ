"use client";
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from './Button';
import styles from '../styles/Modal.module.css';
import { Employee } from '../types';
import DeleteModal from './DeleteModal';

type FormData = Omit<Employee, 'id'>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: SubmitHandler<FormData>;
  onConfirm?: () => void;
  employee?: Employee;
  isDelete?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onConfirm,
  employee,
  isDelete = false,
}) => {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: employee
      ? { name: employee.name, department: employee.department, phone: employee.phone }
      : { name: '', department: '', phone: '' },
  });

  if (!isOpen) return null;

  return isDelete ? (
    <div className={styles.deleteOverlay}>
      <DeleteModal onClose={onClose} onConfirm={onConfirm || (() => {})} />
    </div>
  ) : (
    <div className={styles.formOverlay}>
      <div className={styles.modal}>
        {onSubmit ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Name</label>
              <input
                type="text"
                placeholder="Enter name"
                {...register('name', { required: true })}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Department</label>
              <select
                {...register('department', { required: true })}
                className={styles.input}
              >
                <option value="">Select Department</option>
                <option value="Administration">Administration</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="text"
                placeholder="Enter phone. Ex: +84 xxx xxx xxx"
                {...register('phone', { required: true })}
                className={styles.input}
              />
            </div>
            <div className={styles.actions}>
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Submit
              </Button>
            </div>
          </form>
        ) : (
          <p>Error: Form submission handler is missing.</p>
        )}
      </div>
    </div>
  );
};

export default Modal;
