
import { ReactElement } from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface CardProps {
  cardTitle?: string;
  description?: ReactElement;
  onClick?: () => void;
  cardClassNames?: string;
  href?: string;
  icon?: LucideIcon;
  iconColor?: string;
  subtitle?: string;
  value?: string;
  valueColor?: string;
  hoverBorder?: boolean;
  children?: ReactElement;
}

const Card = (props: CardProps) => {
  const {
    cardTitle,
    description,
    onClick,
    cardClassNames = "",
    href,
    icon: Icon,
    iconColor,
    subtitle,
    value,
    valueColor,
    hoverBorder,
    children,
  } = props;

  const baseClasses = `bg-gray-900/60 backdrop-blur rounded-xl p-6 border border-gray-700 ${
    hoverBorder ? "hover:border-blue-500 transition-colors" : ""
  } ${cardClassNames}`;

  const content = (
    <>
      {/* Icon + label row (for stat cards) */}
      {Icon && (
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-5 h-5 ${iconColor ?? ""}`} />
          {subtitle && <span className="text-sm text-gray-400">{subtitle}</span>}
        </div>
      )}

      {/* Large value (for stat cards) */}
      {value && (
        <p className={`text-2xl font-bold ${valueColor ?? ""}`}>{value}</p>
      )}

      {/* Title + description (for content cards) */}
      {cardTitle && (
        <h3
          className={`text-xl font-semibold ${
            description || children ? "mb-3" : "mb-1"
          } ${hoverBorder ? "group-hover:text-blue-400 transition-colors" : ""}`}
        >
          {cardTitle}
        </h3>
      )}

      {description && (
        <div className="text-sm text-gray-400">{description}</div>
      )}

      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`group block ${baseClasses}`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {content}
    </div>
  );
};

export default Card;