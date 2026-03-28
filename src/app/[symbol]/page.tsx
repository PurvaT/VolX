"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import VolatilityTradingPlatform from "../../components/btc-volatility-platform";

export default function SymbolPage() {
  const params = useParams();
  const symbol = params.symbol as string;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="bg-gray-900 px-6 py-3 text-sm text-gray-400 border-b border-gray-700">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-200">{decodeURIComponent(symbol)}</li>
        </ol>
      </nav>

      {/* Page content */}
      <VolatilityTradingPlatform symbol={decodeURIComponent(symbol)} />
    </div>
  );
}
