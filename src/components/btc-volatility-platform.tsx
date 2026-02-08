"use client";
import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Plus } from 'lucide-react';
import Card from '../assets/common/card';
import Button from 'app/assets/common/button';
import List from 'app/assets/common/list';

export interface Trade {
  id: number;
  direction: 'long' | 'short';
  lots: number;
  leverage: number;
  strikeVol: number;
  timeframe: '7d' | '30d';
  timestamp: string;
  entryTime: number;
}

const VolatilityTradingPlatform = () => {
  const wsRef = useRef<WebSocket | null>(null);

  const [currentVol7d, setCurrentVol7d] = useState(20);
  const [currentVol30d, setCurrentVol30d] = useState(18.5);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [livePrice, setLivePrice] = useState('');
  const [stdev, setStdev] = useState('');
  const [selectedDays, setSelectedDays] = useState(7);
  const [numSlots, setNumSlots] = useState(1);
  const [accountBalance, setAccountBalance] = useState(1000);
  const [tradeForm, setTradeForm] = useState<Trade>({
    direction: 'long',
    lots: 0,
    leverage: 1,
    strikeVol: 20,
    timeframe: '7d',
    entryTime: Date.now(),
    timestamp: new Date().toLocaleString(),
    id: Date.now()
  });

  // Generate dummy historical volatility data for last 60 days (candlestick format)
  const generateHistoricalData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 59; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate realistic volatility values with OHLC data
      const base7d = 20 + (Math.random() - 0.5) * 6;
      const base30d = 18.5 + (Math.random() - 0.5) * 5;
      
      // Create OHLC for 7d volatility
      const open7d = base7d + (Math.random() - 0.5) * 2;
      const close7d = base7d + (Math.random() - 0.5) * 2;
      const high7d = Math.max(open7d, close7d) + Math.random() * 2;
      const low7d = Math.min(open7d, close7d) - Math.random() * 2;
      
      // Create OHLC for 30d volatility
      const open30d = base30d + (Math.random() - 0.5) * 2;
      const close30d = base30d + (Math.random() - 0.5) * 2;
      const high30d = Math.max(open30d, close30d) + Math.random() * 2;
      const low30d = Math.min(open30d, close30d) - Math.random() * 2;
      
      data.push({
        date: date.toLocaleDateString(),
        timestamp: date.getTime(),
        vol7d_open: Math.max(5, parseFloat(open7d.toFixed(2))),
        vol7d_high: Math.max(5, parseFloat(high7d.toFixed(2))),
        vol7d_low: Math.max(5, parseFloat(low7d.toFixed(2))),
        vol7d_close: Math.max(5, parseFloat(close7d.toFixed(2))),
        vol30d_open: Math.max(5, parseFloat(open30d.toFixed(2))),
        vol30d_high: Math.max(5, parseFloat(high30d.toFixed(2))),
        vol30d_low: Math.max(5, parseFloat(low30d.toFixed(2))),
        vol30d_close: Math.max(5, parseFloat(close30d.toFixed(2)))
      });
    }
    
    return data;
  };

  const [historicalData] = useState(generateHistoricalData());

  // Simulate real-time volatility updates
  useEffect(() => {
    // Removed local simulation - using WebSocket data only
    return () => {};
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    try {
      // Create WebSocket connection
      wsRef.current = new WebSocket(`ws://localhost:8000/ws/BTC-USD?days=${selectedDays}`);

      // Connection opened
      wsRef.current.onopen = () => {
        console.log('Connected to VIX WebSocket');
      };

      // Listen for messages
      wsRef.current.onmessage = (event) => {
        try {
          const liveData = JSON.parse(event.data);
          setLivePrice(`$${parseFloat(liveData.Close).toFixed(2)}`);
          const stdevValue = ((liveData.StandardDeviation / liveData.Mean) * 100).toFixed(2);
          setStdev(`${stdevValue}%`);
          
          // Update volatility based on selected days
          const volatilityFromWs = parseFloat(stdevValue);
          if (selectedDays === 7) {
            setCurrentVol7d(volatilityFromWs);
          } else {
            setCurrentVol30d(volatilityFromWs);
          }
          
          console.log('Live Price:', liveData);
        } catch (parseError) {
          console.warn('Error parsing WebSocket message:', parseError);
        }
      };

      // Handle errors
      wsRef.current.onerror = (error) => {
        console.warn('WebSocket connection error - using mock data. Server not available at ws://localhost:8000/ws/BTC-USD');
      };

      // Handle connection closed
      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
      };
    } catch (error) {
      console.warn('WebSocket initialization error:', error);
    }

    // Clean up on component unmount
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [selectedDays]); // Reconnect when selectedDays changes

  const getCurrentVol = () => selectedTimeframe === '7d' ? currentVol7d : currentVol30d;

  // Calculate P&L for trades with leverage
  const calculatePnL = (trade : Trade) => {
    const currentVol = trade.timeframe === '7d' ? currentVol7d : currentVol30d;
    const volatilityDiff = trade.direction === 'long' 
      ? (currentVol - trade.strikeVol) 
      : (trade.strikeVol - currentVol);
    
    // P&L = lots * volatility difference * leverage
    return trade.lots * volatilityDiff * trade.leverage;
  };

  const handleBuyTrade = () => {
    const stdevValue = parseFloat(stdev.replace('%', ''));
    const tradeCost = stdevValue * numSlots;
    
    if (accountBalance < tradeCost) {
      alert('Insufficient balance for this trade');
      return;
    }

    const currentVol = selectedTimeframe === '7d' ? currentVol7d : currentVol30d;
    const newTrade = {
      id: Date.now(),
      direction: 'long' as const,
      lots: numSlots,
      leverage: 1,
      strikeVol: currentVol,
      timeframe: selectedTimeframe as '7d' | '30d',
      timestamp: new Date().toLocaleString(),
      entryTime: Date.now()
    };
    
    setTrades([...trades, newTrade]);
    setAccountBalance(accountBalance - tradeCost);
  };

  const handleSellTrade = () => {
    const stdevValue = parseFloat(stdev.replace('%', ''));
    const tradeCost = stdevValue * numSlots;
    
    if (accountBalance < tradeCost) {
      alert('Insufficient balance for this trade');
      return;
    }

    const currentVol = selectedTimeframe === '7d' ? currentVol7d : currentVol30d;
    const newTrade = {
      id: Date.now(),
      direction: 'short' as const,
      lots: numSlots,
      leverage: 1,
      strikeVol: currentVol,
      timeframe: selectedTimeframe as '7d' | '30d',
      timestamp: new Date().toLocaleString(),
      entryTime: Date.now()
    };
    
    setTrades([...trades, newTrade]);
    setAccountBalance(accountBalance - tradeCost);
  };

  const closeTrade = (tradeId: number) => {
    setTrades(trades.filter((trade: Trade) => trade.id !== tradeId));
  };

  const totalPnL = trades.reduce((sum, trade) => sum + calculatePnL(trade), 0);

  // Custom candlestick tooltip component for recharts
  const CandlestickTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      payload: {
        [key: string]: any;
      };
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const timeframe = selectedTimeframe;
      const openKey = 'vol' + timeframe + '_open';
      const highKey = 'vol' + timeframe + '_high';
      const lowKey = 'vol' + timeframe + '_low';
      const closeKey = 'vol' + timeframe + '_close';

      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
          <p className="font-semibold mb-2">{label} - {timeframe.toUpperCase()} Annualized</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Open:</span>
              <span className="text-white">{data[openKey]}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">High:</span>
              <span className="text-green-400">{data[highKey]}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Low:</span>
              <span className="text-red-400">{data[lowKey]}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Close:</span>
              <span className="text-white font-semibold">{data[closeKey]}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getNotionalValue = () => {
    const lots = tradeForm.lots || 0;
    return (lots * 20).toFixed(2);
  };

  const getEffectiveExposure = () => {
    const lots = tradeForm.lots || 0;
    return (lots * 20 * tradeForm.leverage).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            BTC Volatility Trading Platform
          </h1>
          <p className="text-gray-300">Trade Bitcoin volatility with real-time data and analytics</p>
          <div className="flex gap-2 mt-4">
            <Button
              buttonTitle='7D'
              onClick={() => setSelectedDays(7)}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedDays === 7 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            />
            <Button
              buttonTitle='30D'
              onClick={() => setSelectedDays(30)}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedDays === 30 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            />
          </div>
        </div>
        <div className="w-full flex gap-4 mb-8">
        <Card 
          cardClassNames="mb-8 w-2/5"
          cardTitle='Live Price'
          description={
            <div className="text-3xl font-bold">{livePrice}</div>
          }
        />
        <Card 
          cardClassNames="mb-8 w-2/5"
          cardTitle={`Standard Deviation (${selectedDays} Days)`}
          description={
            <div className="text-3xl font-bold">{stdev}</div>
          }
        />
        <div className='mb-8 w-1/5 flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <label className='text-xs font-medium text-gray-300 whitespace-nowrap'>Lot(s)</label>
            <select
              value={numSlots}
              onChange={(e) => setNumSlots(parseInt(e.target.value))}
              className='bg-gray-700 text-white px-3 py-1 rounded-lg text-xs font-medium border border-gray-600 hover:bg-gray-600 transition-colors flex-1'
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <Button
            className='bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 px-3 py-3 rounded-lg text-xs font-semibold transition-all duration-200 text-white w-full'
            buttonTitle="Buy"
            onClick={() => handleBuyTrade()} 
          />
          <Button
            className='bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 px-3 py-3 rounded-lg text-xs font-semibold transition-all duration-200 text-white w-full'
            buttonTitle="Sell"
            onClick={() => handleSellTrade()} 
          />
        </div>
        </div>

        <div className="w-full">
          <div className="w-full">
            <Card 
              cardTitle='Portfolio Summary'
              description={
                  <div className="backdrop-blur rounded-xl p-6 border border-gray-700">
                  <div className="space-y-4">
                    <List 
                      listItems={[
                        `Total Account Balance: $${accountBalance.toFixed(2)}`,
                        `Total P&L: ${totalPnL.toFixed(2)}%`,
                        `Open Positions: ${trades.length}`,
                        `Total Lots: ${trades.reduce((sum, trade) => sum + trade.lots, 0)}`,
                        `Total Exposure: ${trades.reduce((sum, trade) => sum + trade.lots * parseFloat(stdev), 0)}`
                      ]}
                    />
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default VolatilityTradingPlatform;