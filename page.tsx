"use client";
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Employee } from '../app/types'; // Adjusted path (relative to app/)
import Table from '../app//components/Table'; // Adjusted path
import Modal from '../app/components/Modal'; // Adjusted path
import Button from '../app/components/Button'; // Adjusted path
import Search from '../app/components/Search'; // Adjusted path
import styles from '../app/styles/Home.module.css'; // Adjusted path

type FormData = Omit<Employee, 'id'>;

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('employees');
    if (stored) {
      const parsed = JSON.parse(stored);
      setEmployees(parsed);
      setFilteredEmployees(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
    setFilteredEmployees(
      employees.filter((emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [employees, search]);

  const handleAddEdit = (data: FormData) => {
    if (selectedEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === selectedEmployee.id ? { ...emp, ...data } : emp
        )
      );
    } else {
      setEmployees([...employees, { ...data, id: uuidv4() }]);
    }
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      setEmployees(employees.filter((emp) => emp.id !== deleteId));
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const totalEmployees = filteredEmployees.length;
  const customerServiceCount = filteredEmployees.filter(
    (emp) => emp.department === 'Customer Service'
  ).length;
  const humanResourcesCount = filteredEmployees.filter(
    (emp) => emp.department === 'Human Resources'
  ).length;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Employee Management</h1>
      <div className={styles.header}>
        <Search value={search} onChange={setSearch} />
        <Button onClick={() => setIsModalOpen(true)} variant="primary">
          <span className={styles.addIcon}>+</span> Add New
        </Button>
      </div>
      <Table
        employees={filteredEmployees}
        onEdit={(emp) => {
          setSelectedEmployee(emp);
          setIsModalOpen(true);
        }}
        onDelete={(id) => {
          setDeleteId(id);
          setIsDeleteModalOpen(true);
        }}
      />
      <div className={styles.summary}>
        <span>Total Employee: {totalEmployees}</span>
        <span>Customer Service: {customerServiceCount}</span>
        <span>Human Resources: {humanResourcesCount}</span>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSubmit={handleAddEdit}
        employee={selectedEmployee}
      />
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDelete
      />
    </div>
  );
}