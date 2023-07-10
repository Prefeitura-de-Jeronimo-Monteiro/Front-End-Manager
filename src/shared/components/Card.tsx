interface CardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
}

export const Card = ({title, icon, value}: CardProps) => {
  return (
    <div className="w-64 flex flex-col gap-4 shadow-md rounded-md p-4">
      <h6 className="text-lg">{title}</h6>

      <div className="flex items-center justify-between">
        {icon}
        <span className="text-2xl">{value}</span>
      </div>
    </div>
  );
};
