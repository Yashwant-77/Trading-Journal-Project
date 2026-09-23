

function StatCard({
  title,
  value,
  subtitle,
  valueColor = "text-white",
}) {
  return (
    <div className="bg-[#1E1E1E] border border-zinc-800 rounded-xl p-5">

      <p className="text-sm text-zinc-400">
        {title}
      </p>

      <p
        className={`text-2xl font-bold mt-2 ${valueColor}`}
      >
        {value}
      </p>

      {subtitle && (
        <p className="text-xs text-zinc-500 mt-1">
          {subtitle}
        </p>
      )}

    </div>
  );
}

export default StatCard;

