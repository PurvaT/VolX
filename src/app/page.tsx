"use client";

import { Wallet, TrendingUp, Lock, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import Breadcrumb from "app/assets/common/breadcrumb";
import Table, { TableColumn } from "app/assets/common/table";
import Card from "app/assets/common/card";
import Header from "app/assets/common/header";
import Footer from "app/assets/common/footer";
import { getPortfolio, PositionData } from "app/services/api";

const instruments = [
  { name: "BTC-USD", description: "Bitcoin / US Dollar" },
  { name: "ETH-USD", description: "Ethereum / US Dollar" },
  { name: "SOL-USD", description: "Solana / US Dollar" },
  { name: "XRP-USD", description: "Ripple / US Dollar" },
  { name: "DOGE-USD", description: "Dogecoin / US Dollar" },
];

const fmt = (n: number) => {
  const prefix = n >= 0 ? (n > 0 ? "+$" : "$") : "-$";
  return `${prefix}${Math.abs(n).toFixed(2)}`;
};

const fmtUsd = (n: number) => `$${n.toFixed(2)}`;

const positionColumns: TableColumn<PositionData>[] = [
  { key: "commodity", label: "Commodity" },
  { key: "quantity", label: "Quantity" },
  {
    key: "purchasePrice",
    label: "Purchase Price",
    render: (value) => fmtUsd(value as number),
  },
  {
    key: "pnl",
    label: "P&L",
    render: (value) => {
      const n = value as number;
      return <span className={n < 0 ? "text-red-400" : "text-green-400"}>{fmt(n)}</span>;
    },
  },
  {
    key: "lockedMargin",
    label: "Locked Margin",
    render: (value) => fmtUsd(value as number),
  },
];

export default function Home() {
  const [positions, setPositions] = useState<PositionData[]>([]);

  useEffect(() => {
    getPortfolio()
      .then((data) => {
        setPositions(data);
      })
      .catch((err) => console.error("Failed to fetch portfolio:", err));
  }, []);

  const totalSpent = positions.reduce((sum, p) => sum + p.quantity * p.purchasePrice, 0);
  const totalLockedMargin = positions.reduce((sum, p) => sum + p.lockedMargin, 0);
  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);
  const availableBalance = 1000 - totalSpent;
  const totalEquity = availableBalance + totalLockedMargin + totalPnl;

  const portfolioItems = [
    { label: "Available Balance", value: fmtUsd(availableBalance), icon: Wallet, color: "text-green-400" },
    { label: "Total Equity", value: fmtUsd(totalEquity), icon: TrendingUp, color: "text-blue-400" },
    { label: "Locked Margin", value: fmtUsd(totalLockedMargin), icon: Lock, color: "text-yellow-400" },
    { label: "P&L", value: fmt(totalPnl), icon: DollarSign, color: totalPnl >= 0 ? "text-green-400" : "text-red-400" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Breadcrumb items={[{ label: "Home" }]} />

      <Header />

      {/* Cards grid */}
      <main className="px-6 pb-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instruments.map((item) => (
            <Card
              key={item.name}
              href={`/${item.name}`}
              cardTitle={item.name}
              description={<p>{item.description}</p>}
              hoverBorder
            />
          ))}
        </div>
      </main>

      {/* Portfolio Section */}
      <section className="px-6 pb-12 max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Your Portfolio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {portfolioItems.map((item) => (
            <Card
              key={item.label}
              icon={item.icon}
              iconColor={item.color}
              subtitle={item.label}
              value={item.value}
              valueColor={item.color}
              cardClassNames="p-5"
            />
          ))}
        </div>

        {/* Positions Table */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Positions</h3>
          <Table columns={positionColumns} data={positions} pageSize={5} />
        </div>
      </section>

      <Footer />
    </div>
  );
}