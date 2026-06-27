import { useState } from "react";

export const useField = ({ type, label, size }) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    label,
    size,
    value,
    onChange,
  };
};
