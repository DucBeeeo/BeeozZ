"use client";
import { Employee } from '../../../types/Employees';
import Button from '../Button/Button';
import styles from './Table.module.css';

interface TableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const Table: React.FC<TableProps> = ({ employees, onEdit, onDelete }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Department</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee.id}>
            <td>{employee.name}</td>
            <td>{employee.department}</td>
            <td>{employee.phone}</td>
            <td className={styles.actions}>
              <Button variant="warning" onClick={() => onEdit(employee)}>
                ✏️
              </Button>
              <Button variant="danger" onClick={() => onDelete(employee.id)}>
                🗑️
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;