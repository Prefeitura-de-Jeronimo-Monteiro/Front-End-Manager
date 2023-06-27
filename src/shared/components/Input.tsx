import { Field } from "formik";
import { Error } from "./Error";

interface FormInput {
  id?: string;
  type?: string;
  name: string;
  placeholder?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
  error: string | null;
}

export const FormInput = ({
  id,
  type,
  name,
  placeholder,
  iconLeft,
  iconRight,
  className,
  error,
}: FormInput) => {
  return (
    <>
      <div className="flex w-full items-center gap-3 py-3 px-3 rounded-md border-2 focus-within:ring-1 ring-secondary">
        {iconLeft}
        <Field
          type={type}
          name={name}
          id={id}
          placeholder={placeholder}
          className={`bg-transparent h-full w-full flex-1 placeholder:text-gray-400 outline-none ${className}`}
        />
        {iconRight}
      </div>
      {error ? <Error text={error} /> : null}
    </>
  );
};
