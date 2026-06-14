interface CapacityBarProps {
  available: number;
  total: number;
  label: string;
}

export const CapacityBar = ({ available, total, label }: CapacityBarProps) => {
  const percentage = (available / total) * 100;
  const isLow = percentage < 30;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-10 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isLow ? 'bg-red-400' : 'bg-secondary-400'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-gray-600 w-12 text-right shrink-0">
        剩{available}/{total}
      </span>
    </div>
  );
};
