import { Field } from "formik";

interface FormInput {
  type: string;
  name: string;
  placeholder: string;
}

export const FormInput = ({ type, name, placeholder }: FormInput) => {
  return (
    <Field
      type={type}
      name={name}
      placeholder={placeholder}
      className="border-2 rounded px-1 py-2"
    />
  );
};
