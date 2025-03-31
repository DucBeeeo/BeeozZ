"use client";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "../../../utils/trpc"; // Import tRPC
import Button from "../Button/Button";
import styles from "./Register.module.css";
import { Employee } from "../../../types/Employees";
import DeleteModal from "../ModalDelete/DeleteModal";

type FormData = Omit<Employee, "id">;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: SubmitHandler<FormData>;
  onConfirm?: () => void;
  employee?: Employee | null;
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
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const { data: departments, isLoading } = trpc.employee.getDepartments.useQuery();

  useEffect(() => {
    if (employee) {
      reset({
        name: employee.name,
        department: employee.department,
        phone: employee.phone,
      });
    } else {
      reset({ name: "", department: "", phone: "" });
    }
  }, [employee, reset]);

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
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 3, message: "Name must be at least 3 characters" },
                  pattern: { value: /^[A-Za-zÀ-ỹ\s]+$/, message: "Name must not contain numbers or special characters" }
                })}
                className={styles.input}
              />
              {errors.name && <span className={styles.error}>{errors.name.message}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Department</label>
              <select {...register("department", { required: "Department is required" })} className={styles.input}>
                <option value="">Select Department</option>
                {isLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  departments?.map((dept: { id: number; name: string }) => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))
                )}
              </select>
              {errors.department && <span className={styles.error}>{errors.department.message}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="text"
                placeholder="Enter phone. Ex: +84 xxx xxx xxx"
                {...register("phone", {
                  required: "Phone is required",
                  pattern: { value: /^0\d{10}$/, message: "Invalid phone format (must be 11 digits and start with 0)" }
                })}
                className={styles.input}
              />
              {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
            </div>

            <div className={styles.actions}>
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="primary" onClick={() => {}}>
                {employee ? "Update" : "Submit"}
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
