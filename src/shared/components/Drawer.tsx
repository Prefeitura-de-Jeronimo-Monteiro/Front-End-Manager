import { useEffect, useState } from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Drawer = ({ isOpen, onClose, children }: DrawerProps) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAnimationClass('translate-x-0');
    } else {
      setAnimationClass('-translate-x-full');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="absolute left-0 top-0 w-screen h-screen">
        <div
          onClick={onClose}
          className="absolute w-full h-full bg-black opacity-75"
        />

        <div
          className={`bg-white h-full w-[20%] transition-transform transform ${animationClass} overflow-auto scrollbar-thin scrollbar-thumb-gray-700`}
        >
          {children}
        </div>
      </div>
    </>
  );
};
