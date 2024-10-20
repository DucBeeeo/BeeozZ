import { t } from '../trpc'; // Khởi tạo router với tRPC
import { z } from 'zod'; // Thư viện giúp validate dữ liệu input

// Giả lập một database đơn giản bằng mảng trong bộ nhớ
const employees = [
  { id: 1, name: 'John Doe', age: 30, position: 'Developer' },
  { id: 2, name: 'Jane Smith', age: 25, position: 'Designer' },
];

// Định nghĩa các procedure cho router `employee`
export const employeeRouter = t.router({
  // Procedure lấy tất cả các employee
  getAll: t.procedure.query(() => {
    return employees; // Trả về danh sách employee
  }),

  // Procedure lấy chi tiết một employee dựa vào ID
  getById: t.procedure.input(z.number()).query(({ input }) => {
    const employee = employees.find(emp => emp.id === input);
    if (!employee) throw new Error('Employee not found');
    return employee;
  }),

  // Procedure tạo mới một employee, với input validation
  create: t.procedure
    .input(z.object({
      name: z.string(), 
      age: z.number(),
      position: z.string(),
    }))
    .mutation(({ input }) => {
      const newEmployee = {
        id: employees.length + 1,
        ...input,
      };
      employees.push(newEmployee); // Thêm employee mới vào danh sách
      return newEmployee;
    }),

  // Procedure chỉnh sửa thông tin employee
  update: t.procedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      age: z.number().optional(),
      position: z.string().optional(),
    }))
    .mutation(({ input }) => {
      const index = employees.findIndex(emp => emp.id === input.id);
      if (index === -1) throw new Error('Employee not found');
      
      employees[index] = {
        ...employees[index],
        ...input,
      };
      return employees[index];
    }),

  // Procedure xóa employee
  delete: t.procedure.input(z.number()).mutation(({ input }) => {
    const index = employees.findIndex(emp => emp.id === input);
    if (index === -1) throw new Error('Employee not found');
    
    const [removedEmployee] = employees.splice(index, 1); // Xóa employee khỏi danh sách
    return removedEmployee;
  }),
});
