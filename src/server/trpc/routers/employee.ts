import { Employee } from "@/src/types/Employees";
import { router, publicProcedure } from "../../trpc";
import { z } from 'zod';
import axios from "axios";
let employeesData = [
  { id: "1", name: "Nguyen Van A", department: "Administration", phone: "+84 777 797 979" },
  { id: "2", name: "Ho Van B", department: "Customer Service", phone: "+84 777 123 456" },
  { id: "3", name: "Duong Thi C", department: "Human Resources", phone: "+84 777 456 789" },
  { id: "4", name: "Ho Thi D", department: "Human Resources", phone: "+84 777 456 321" },
  { id: "5", name: "Cao Thi E", department: "Human Resources", phone: "+84 777 456 787" }
];
let idCounter = 6; 

export const employeeRouter = router({

  getDepartments: publicProcedure.query(async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/departments");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch departments");
    }
  }),

  getAll: publicProcedure.query(() => employeesData),

  create: publicProcedure
    .input(z.object({
      name: z.string(),
      department: z.string(),
      phone: z.string(),
    }))
    .mutation(({ input }) => {
      const newEmployee: Employee = {
        ...input,
        id: (idCounter++).toString(),
      };
      employeesData.push(newEmployee);
      return newEmployee;
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      department: z.string().optional(),
      phone: z.string().optional(),
    }))
    .mutation(({ input }) => {
      const index = employeesData.findIndex(emp => emp.id === input.id);
      if (index === -1) throw new Error("Employee not found");

      employeesData[index] = { ...employeesData[index], ...input };
      return employeesData[index];
    }),

  delete: publicProcedure
    .input(z.string())
    .mutation(({ input }) => {
      const index = employeesData.findIndex(emp => emp.id === input);
      if (index === -1) throw new Error("Employee not found");
      const [deleted] = employeesData.splice(index, 1);
      return deleted;
    }),
});

export type EmployeeRouter = typeof employeeRouter;
