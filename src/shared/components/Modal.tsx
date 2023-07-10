interface Modal {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({isOpen, onClose, children}: Modal) => {
  return (
    <>
      {isOpen ? (
        <div className="absolute left-0 top-0 flex w-screen h-screen items-center justify-center">
          <div
            className="absolute w-screen h-screen bg-black opacity-75"
            onClick={onClose}
          />
          <div className="relative z-10 bg-background-600 text-white p-4 rounded-md">
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
};
