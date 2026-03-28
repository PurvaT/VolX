import Link from "next/link";
import { BarChart3, User } from "lucide-react";

interface HeaderProps {
  avatarUrl?: string;
}

const Header = ({ avatarUrl }: HeaderProps) => {
  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <BarChart3 className="w-7 h-7 text-blue-400" />
          <span className="text-xl font-bold text-white">VolX Trading Platform</span>
        </Link>
        <div className="w-9 h-9 rounded-full bg-gray-700 border-2 border-gray-600 overflow-hidden flex items-center justify-center cursor-pointer">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
