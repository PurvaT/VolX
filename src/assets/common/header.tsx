import { BarChart3 } from "lucide-react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header = ({
  title = "VolX Trading Platform",
  subtitle = "Select an instrument to view live volatility data and trade.",
}: HeaderProps) => {
  return (
    <header className="px-6 pt-10 pb-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <BarChart3 className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      {subtitle && <p className="text-gray-400">{subtitle}</p>}
    </header>
  );
};

export default Header;
