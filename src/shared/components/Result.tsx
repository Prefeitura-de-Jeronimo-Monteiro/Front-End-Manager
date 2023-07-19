import { Check, WarningDiamond, X } from '@phosphor-icons/react';

interface ResultProps {
  text: string;
  status: boolean;
  open: boolean;
  onClose: () => void;
}

export const Result = ({ text, status, open, onClose }: ResultProps) => {
  return (
    <>
      {open ? (
        <div
          className={`${
            status ? 'bg-green-600' : 'bg-red-600'
          } absolute bottom-2 left-2 flex items-center gap-6  text-white rounded py-1 px-2`}
        >
          {status ? (
            <div className="flex gap-2 items-center text-lg">
              <Check size={20} weight="bold" /> {text}
            </div>
          ) : (
            <div className="flex gap-2 items-center text-lg">
              <WarningDiamond size={20} weight="bold" /> {text}
            </div>
          )}

          <X
            onClick={onClose}
            size={20}
            weight="bold"
            className="cursor-pointer"
          />
        </div>
      ) : null}
    </>
  );
};
