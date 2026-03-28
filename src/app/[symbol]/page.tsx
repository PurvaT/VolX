"use client";
import { useParams } from "next/navigation";
import VolatilityTradingPlatform from "../../components/btc-volatility-platform";
import Breadcrumb from "app/assets/common/breadcrumb";

export default function SymbolPage() {
  const params = useParams();
  const symbol = params.symbol as string;

  return (
    <div>
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: decodeURIComponent(symbol) },
      ]} />

      {/* Page content */}
      <VolatilityTradingPlatform symbol={decodeURIComponent(symbol)} />
    </div>
  );
}
