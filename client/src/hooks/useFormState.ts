import { useState, ChangeEvent } from 'react';
/**
 * Custom hook for managing form state
 */
export function useFormState<T extends Record<string, any>>(initialState: T) {
  // State to hold the current form values
  const [values, setValues] = useState<T>(initialState);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => setValues(initialState);

  return {
    values,
    handleChange,
    setValues,
    resetForm,
  };
}
