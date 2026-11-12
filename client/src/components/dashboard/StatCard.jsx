export default function StatCard({
  title,
  value,
  unit = "",
  subtitle,
  badge,
  badgeType = "neutral",
  icon: Icon,
  trend,
}) {
  const badgeStyles = {
    rose: "bg-[#FCE4E4] text-[#A83D55] border-[#F6BFC1]/50",
    berry: "bg-[#542B35]/10 text-[#542B35] border-[#542B35]/20",
    peach: "bg-[#FDECDA] text-[#9A5A35] border-[#F5D7BB]",
    neutral: "bg-[#FAF0EA] text-[#806B68] border-[#EAD0C4]",
    success: "bg-[#E6F4EA] text-[#2D6A4F] border-[#B7E4C7]",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#F0DDD5] bg-white/90 p-5 shadow-[0_4px_20px_rgba(84,43,53,0.03)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_8px_25px_rgba(84,43,53,0.07)] hover:border-[#E8C7BC]">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-[#947875]">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="font-serif text-3xl font-semibold text-[#542B35]">
              {value}
            </span>
            {unit && (
              <span className="text-sm font-medium text-[#806B68]">{unit}</span>
            )}
          </div>
        </div>

        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFF4ED] to-[#FCE6E6] text-[#A83D55] shadow-xs">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#F7EDE8] pt-3 text-xs">
        {subtitle && (
          <span className="text-[#806B68] truncate pr-2">{subtitle}</span>
        )}

        {badge && (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium shrink-0 ${
              badgeStyles[badgeType] || badgeStyles.neutral
            }`}
          >
            {badge}
          </span>
        )}

        {trend && (
          <span className="text-[11px] font-medium text-[#A83D55] shrink-0">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
