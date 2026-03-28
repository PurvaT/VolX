import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";
const WS_BASE_URL = "ws://localhost:8000";

export interface PositionData {
  commodity: string;
  quantity: number;
  purchasePrice: number;
  pnl: number;
  lockedMargin: number;
  [key: string]: unknown;
}

export interface CommodityData {
  Close: number;
  High: number;
  Low: number;
  Open: number;
  Volume: number;
}

export const getPortfolio = async (): Promise<PositionData[]> => {
  const res = await fetch(`${BASE_URL}/portfolio`);
  return res.json();
};

export const getCommodity = async (commodityId: string): Promise<CommodityData[]> => {
  const res = await axios.get(`${BASE_URL}/commodity/${commodityId}`);
  return res.data;
};

export const createVolatilityWebSocket = (symbol: string, days: number): WebSocket => {
  return new WebSocket(`${WS_BASE_URL}/ws/${symbol}?days=${days}`);
};
