import { WarningCircle } from '@phosphor-icons/react';

interface ErrorProps {
  text?: string | null;
}

export const Error = ({ text }: ErrorProps) => {
  return (
    <span className="flex gap-1 text-red-500 items-center font-semibold mt-1">
      <WarningCircle size={20} /> {text}
    </span>
  );
};
