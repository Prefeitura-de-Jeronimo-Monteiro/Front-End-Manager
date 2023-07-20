interface CardProps {
  title: string;
  icon: React.ReactNode;
  value: number;
  description: string;
  onClick?: () => void;
}

export const Card = ({
  title,
  icon,
  value,
  description,
  onClick,
}: CardProps) => {
  return (
    <div
      className="w-64 flex flex-col gap-4 shadow-md rounded-md p-4 cursor-pointer"
      onClick={onClick}
    >
      <h6 className="text-lg flex flex-col">
        {title}
        <span className="text-xs">{description}</span>
      </h6>

      <div className="flex items-center justify-between">
        {icon}
        <span className="text-2xl">{value}</span>
      </div>
    </div>
  );
};
