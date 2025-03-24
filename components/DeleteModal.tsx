import Button from './Button';
import styles from '../styles/Modal.module.css';

interface DeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div className={styles.modal}>
      <h3>Delete Employee</h3>
      <p>Are you sure you want to delete this record?</p>
      <div className={styles.actions}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default DeleteModal;
