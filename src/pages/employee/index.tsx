"use client";

import { useEffect, useState } from "react";
import { Employee } from "../../types/Employees"; 
import Table from "../../components/UI/Table/Table"; 
import Modal from "../../components/UI/ModalRegister/Register"; 
import Button from "../../components/UI/Button/Button"; 
import Search from "../../components/UI/ModalSearch/Search"; 
import styles from "../../styles/common.module.css";
import { trpc } from "../../utils/trpc";
import ModalRegister from "../../components/UI/ModalRegister/Register";

export default function Home() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  useEffect(() => {
    if (selectedEmployee) {
      setIsModalOpen(true);
    }
  }, [selectedEmployee]);



  const { data: employees = [], refetch } = trpc.employee.getAll.useQuery() ?? { data: [] };
  const createMutation = trpc.employee.create.useMutation({ onSuccess: () => refetch() });
  const updateMutation = trpc.employee.update.useMutation({ onSuccess: () => refetch() });
  const deleteMutation = trpc.employee.delete.useMutation({ onSuccess: () => refetch() });


  const filteredEmployees = employees?.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleAddEdit = (data: Omit<Employee, "id">) => {
    if (selectedEmployee?.id) {
      const employeeToUpdate = employees.find(emp => emp.id === selectedEmployee.id);

      if (employeeToUpdate) {
        updateMutation.mutate({ ...data, id: selectedEmployee.id });
      }
    } else {
      createMutation.mutate(data);
    }
  
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const totalEmployees = filteredEmployees.length;
  const customerServiceCount = filteredEmployees.filter(
    (emp) => emp.department === "Customer Service"
  ).length;
  const humanResourcesCount = filteredEmployees.filter(
    (emp) => emp.department === "Human Resources"
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
      <ModalRegister
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSubmit={handleAddEdit}
        employee={selectedEmployee}
      />
      {isDeleteModalOpen && (
        <ModalRegister
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          isDelete />
      )}
    </div>
  );
}