import Link from "next/link";
import { BarChart3 } from "lucide-react";

const instruments = [
  { name: "BTC-USD", description: "Bitcoin / US Dollar" },
  { name: "ETH-USD", description: "Ethereum / US Dollar" },
  { name: "SOL-USD", description: "Solana / US Dollar" },
  { name: "XRP-USD", description: "Ripple / US Dollar" },
  { name: "DOGE-USD", description: "Dogecoin / US Dollar" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Breadcrumb */}
      <nav className="bg-gray-900 px-6 py-3 text-sm text-gray-400 border-b border-gray-700">
        <ol className="flex items-center gap-2">
          <li className="text-gray-200">Home</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="px-6 pt-10 pb-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold">VolX Trading Platform</h1>
        </div>
        <p className="text-gray-400">Select an instrument to view live volatility data and trade.</p>
      </header>

      {/* Cards grid */}
      <main className="px-6 pb-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instruments.map((item) => (
            <Link
              key={item.name}
              href={`/${item.name}`}
              className="group bg-gray-900/60 backdrop-blur rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                {item.name}
              </h3>
              <p className="text-sm text-gray-400">{item.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}