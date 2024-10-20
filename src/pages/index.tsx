import { useState, useEffect } from 'react';
import { trpc } from '../utils/trpc'; // Import các hooks từ tRPC
import React from 'react';


export default function EmployeePage() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [position, setPosition] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const { data: employees = [], refetch } = trpc.employee.getAll.useQuery(); // Lấy danh sách employee
  const createEmployee = trpc.employee.create.useMutation({ onSuccess: () => refetch() }); // Tạo employee mới
  const updateEmployee = trpc.employee.update.useMutation({ onSuccess: () => refetch() }); // Cập nhật employee
  const deleteEmployee = trpc.employee.delete.useMutation({ onSuccess: () => refetch() }); // Xóa employee

  useEffect(() => {
    const initializeData = () => {
      const existingData = localStorage.getItem('employees');
      if (!existingData) {
        const initialEmployees = [
          { id: 1, name: 'John Doe', age: 30, position: 'Developer' },
          { id: 2, name: 'Jane Smith', age: 25, position: 'Designer' },
          { id: 3, name: 'Alice Johnson', age: 28, position: 'Project Manager' },
          { id: 4, name: 'Bob Brown', age: 35, position: 'Product Owner' },
          { id: 5, name: 'Charlie White', age: 40, position: 'QA Engineer' },
        ];
        localStorage.setItem('employees', JSON.stringify(initialEmployees)); // Lưu dữ liệu vào localStorage
      }
    };
    initializeData();
  }, []); // Chạy 1 lần khi component được mount

  const handleSubmit = () => {
    if (selectedId) {
      // Nếu đã chọn ID, cập nhật employee
      updateEmployee.mutate({ id: selectedId, name, age, position });
    } else {
      // Nếu chưa chọn ID, tạo employee mới
      createEmployee.mutate({ name, age, position });
    }
    resetForm();
  };

  const handleEdit = (emp: { id: number, name: string, age: number, position: string }) => {
    setSelectedId(emp.id);
    setName(emp.name);
    setAge(emp.age);
    setPosition(emp.position);
  };

  const resetForm = () => {
    setSelectedId(null);
    setName('');
    setAge(0);
    setPosition('');
  };

  return (
    <div>
      <h1>Employee Management</h1>

      {/* Form để thêm hoặc chỉnh sửa employee */}
      <div>
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Age" 
          value={age} 
          onChange={(e) => setAge(Number(e.target.value))} 
        />
        <input 
          type="text" 
          placeholder="Position" 
          value={position} 
          onChange={(e) => setPosition(e.target.value)} 
        />
        <button onClick={handleSubmit}>
          {selectedId ? 'Update Employee' : 'Add Employee'}
        </button>
        {selectedId && <button onClick={resetForm}>Cancel</button>}
      </div>

      {/* Danh sách employee */}
      <ul>
        {employees.map(emp => (
          <li key={emp.id}>
            {emp.name} ({emp.age}) - {emp.position}
            <button onClick={() => handleEdit(emp)}>Edit</button>
            <button onClick={() => deleteEmployee.mutate(emp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
