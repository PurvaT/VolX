"use client";
import React, { useState, useEffect } from 'react';
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
  const [currentVol7d, setCurrentVol7d] = useState(20);
  const [currentVol30d, setCurrentVol30d] = useState(18.5);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showTradeModal, setShowTradeModal] = useState(false);
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
    const interval = setInterval(() => {
      const change7d = (Math.random() - 0.5) * 1.5; // ±0.75% change
      const change30d = (Math.random() - 0.5) * 1.2; // ±0.6% change
      
      setCurrentVol7d(prev => Math.max(5, Math.min(40, prev + change7d)));
      setCurrentVol30d(prev => Math.max(5, Math.min(35, prev + change30d)));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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

  const handleTrade = () => {
    if (!tradeForm.lots || tradeForm.lots <= 0) return;

    const currentVol = tradeForm.timeframe === '7d' ? currentVol7d : currentVol30d;
    const newTrade = {
      id: Date.now(),
      direction: tradeForm.direction,
      lots: tradeForm.lots,
      leverage: tradeForm.leverage,
      strikeVol: currentVol,
      timeframe: tradeForm.timeframe,
      timestamp: new Date().toLocaleString(),
      entryTime: Date.now()
    };

    setTrades([...trades, newTrade]);
    setShowTradeModal(false);
    setTradeForm({ 
      direction: 'long', 
      lots: 0,
      leverage: 1,
      strikeVol: currentVol,
      timeframe: '7d',
      entryTime: Date.now(),
      timestamp: new Date().toLocaleString(),
      id: Date.now()  
    });
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
        </div>
        
        <div className="flex gap-4 mb-8">
          <div className="w-1/2">
            <Card cardTitle='Historical Volatility (Last 60 Days)' description={
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                <Button
                  buttonTitle='7D'
                  onClick={() => setSelectedTimeframe('7d')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeframe === '7d' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                />
                <Button
                  buttonTitle='30D'
                  onClick={() => setSelectedTimeframe('30d')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeframe === '30d' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                />
              </div>
            </div>
            
            {/* Chart with candlestick visualization */}
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={10}
                    interval="preserveStartEnd"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip content={<CandlestickTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey={'vol' + selectedTimeframe + '_close'}
                    stroke={selectedTimeframe === '7d' ? '#3B82F6' : '#10B981'}
                    strokeWidth={2}
                    dot={{ fill: selectedTimeframe === '7d' ? '#3B82F6' : '#10B981', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: selectedTimeframe === '7d' ? '#3B82F6' : '#10B981', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={'vol' + selectedTimeframe + '_high'}
                    stroke={selectedTimeframe === '7d' ? '#60A5FA' : '#34D399'}
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={'vol' + selectedTimeframe + '_low'}
                    stroke={selectedTimeframe === '7d' ? '#60A5FA' : '#34D399'}
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
              </div>
            } />
          </div>
          <div className="w-1/2">
            <Card 
              cardTitle='Portfolio Summary'
              description={
                  <div className="backdrop-blur rounded-xl p-6 border border-gray-700">
                  <div className="space-y-4">
                    <List 
                      listItems={[
                        `Total P&L: ${totalPnL.toFixed(2)}%`,
                        `Open Positions: ${trades.length}`,
                        `Total Lots: ${trades.reduce((sum, trade) => sum + trade.lots, 0)}`,
                        `Total Exposure: ${trades.reduce((sum, trade) => sum + trade.lots * trade.leverage * 20, 0)}`
                      ]}
                    />
                  </div>
                </div>
              }
            />
          </div>
        </div>
      <Card cardClassNames="mb-8" cardTitle='Current BTC Volatility' description={
        <div className='flex justify-between items-center'>
          <div className='flex gap-8 items-center'>          
            <div className="text-sm">
              <div className="text-gray-400">7-Day Annualized</div>
              <span className="text-2xl font-bold text-blue-400">{currentVol7d.toFixed(2)}%</span>
            </div>
            <div className="text-sm">
              <div className="text-gray-400">30-Day Annualized</div>
              <span className="text-2xl font-bold text-green-400">{currentVol30d.toFixed(2)}%</span>
            </div>
          </div>
          <Button 
            className='bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 text-white'
            buttonTitle="New Trade"
            buttonIcon={Plus}
            onClick={() => setShowTradeModal(true)} 
          />
        </div>
      }/>
        
      </div>
    </div>
  )
}
export default VolatilityTradingPlatform;