interface VegNonVegIconProps {
  isVeg: boolean;
  size?: number;
  className?: string;
}

export default function VegNonVegIcon({
  isVeg,
  size = 14,
  className = "",
}: VegNonVegIconProps) {
  const color = isVeg ? "#22a84a" : "#7B3F00";
  const label = isVeg ? "Veg" : "Non-Veg";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
      className={`inline-block flex-shrink-0 ${className}`}
    >
      <title>{label}</title>
      <rect
        x="0.75"
        y="0.75"
        width="12.5"
        height="12.5"
        rx="1.5"
        stroke={color}
        strokeWidth="1.5"
      />
      <circle cx="7" cy="7" r="3.5" fill={color} />
    </svg>
  );
}
