interface StatCardProps {
  label: string;
  value: string | number;
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className={`p-6 sm:p-8 lg:p-10 bg-white border border-[#f0f0f0] rounded transition-all`}>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</span>
        </div>
      </div>
    </div>
  );
}
