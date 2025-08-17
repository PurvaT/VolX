"use client";
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Plus } from 'lucide-react';
import type { TooltipProps } from 'recharts';

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
  // const CandlestickTooltip: React.FC<TooltipProps<number, string>> = ({ active}) => {
  //   if (active && payload && payload.length) {
  //     // Use selectedTimeframe from closure
  //     const timeframe = selectedTimeframe;
  //     const openKey = 'vol' + timeframe + '_open';
  //     const highKey = 'vol' + timeframe + '_high';
  //     const lowKey = 'vol' + timeframe + '_low';
  //     const closeKey = 'vol' + timeframe + '_close';

  //     const data = payload[0].payload;
  //     return (
  //       <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
  //         <p className="font-semibold mb-2">{label} - {timeframe.toUpperCase()} Annualized</p>
  //         <div className="space-y-1 text-sm">
  //           <div className="flex justify-between gap-4">
  //             <span className="text-gray-400">Open:</span>
  //             <span className="text-white">{data[openKey]}%</span>
  //           </div>
  //           <div className="flex justify-between gap-4">
  //             <span className="text-gray-400">High:</span>
  //             <span className="text-green-400">{data[highKey]}%</span>
  //           </div>
  //           <div className="flex justify-between gap-4">
  //             <span className="text-gray-400">Low:</span>
  //             <span className="text-red-400">{data[lowKey]}%</span>
  //           </div>
  //           <div className="flex justify-between gap-4">
  //             <span className="text-gray-400">Close:</span>
  //             <span className="text-white font-semibold">{data[closeKey]}%</span>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

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

        {/* Current Volatility Display */}
        <div className="bg-gray-900/50 backdrop-blur rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Current BTC Volatility</h2>
            <button
              onClick={() => setShowTradeModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Trade
            </button>
          </div>
          
          <div className="flex items-center gap-8">
            <div>
              <div className="text-sm text-gray-400 mb-1">7-Day Annualized</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-400">{currentVol7d.toFixed(2)}%</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">30-Day Annualized</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-400">{currentVol30d.toFixed(2)}%</span>
              </div>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-400 ml-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Historical Volatility Chart */}
          <div className="bg-gray-900/50 backdrop-blur rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Historical Volatility (Last 60 Days)</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTimeframe('7d')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeframe === '7d' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  7D
                </button>
                <button
                  onClick={() => setSelectedTimeframe('30d')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeframe === '30d' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  30D
                </button>
              </div>
            </div>
            
            {/* Chart with candlestick visualization */}
            <div className="h-64">
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
                  {/* <Tooltip content={<CandlestickTooltip />} /> */}
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

          {/* P&L Summary */}
          <div className="bg-gray-900/50 backdrop-blur rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Portfolio Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300">Total P&L</span>
                <span className={`text-xl font-bold flex items-center gap-1 ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalPnL >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  ${totalPnL.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300">Open Positions</span>
                <span className="text-xl font-bold text-blue-400">{trades.length}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300">Total Lots</span>
                <span className="text-xl font-bold text-purple-400">
                  {trades.reduce((sum, trade) => sum + trade.lots, 0).toFixed(1)} lots
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300">Total Exposure</span>
                <span className="text-xl font-bold text-orange-400">
                  ${(trades.reduce((sum, trade) => sum + trade.lots, 0) * 20).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Open Trades */}
        {trades.length > 0 && (
          <div className="mt-8 bg-gray-900/50 backdrop-blur rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Open Positions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 px-4">Direction</th>
                    <th className="text-left py-3 px-4">Lots</th>
                    <th className="text-left py-3 px-4">Leverage</th>
                    <th className="text-left py-3 px-4">Notional</th>
                    <th className="text-left py-3 px-4">Timeframe</th>
                    <th className="text-left py-3 px-4">Strike Vol</th>
                    <th className="text-left py-3 px-4">Current Vol</th>
                    <th className="text-left py-3 px-4">P&L</th>
                    <th className="text-left py-3 px-4">Entry Time</th>
                    <th className="text-left py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade) => {
                    const pnl = calculatePnL(trade);
                    const currentVol = trade.timeframe === '7d' ? currentVol7d : currentVol30d;
                    return (
                      <tr key={trade.id} className="border-b border-gray-700/50">
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            trade.direction === 'long' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {trade.direction.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">{trade.lots} lots</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            trade.leverage === 1 
                              ? 'bg-gray-500/20 text-gray-400' 
                              : trade.leverage === 2
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {trade.leverage}x
                          </span>
                        </td>
                        <td className="py-3 px-4">${(trade.lots * 20).toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            trade.timeframe === '7d' 
                              ? 'bg-blue-500/20 text-blue-400' 
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {trade.timeframe.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">{trade.strikeVol.toFixed(2)}%</td>
                        <td className="py-3 px-4">{currentVol.toFixed(2)}%</td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${pnl.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-400">{trade.timestamp}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => closeTrade(trade.id)}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded text-sm transition-colors"
                          >
                            Close
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Trade Modal */}
        {showTradeModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Place New Trade</h3>
              <div>
                <div className="space-y-4">
                  <div>
                    <div className="block text-sm font-medium text-gray-300 mb-2">Timeframe</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTradeForm({...tradeForm, timeframe: '7d'})}
                        className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                          tradeForm.timeframe === '7d'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        7D Annualized
                      </button>
                      <button
                        onClick={() => setTradeForm({...tradeForm, timeframe: '30d'})}
                        className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                          tradeForm.timeframe === '30d'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        30D Annualized
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="block text-sm font-medium text-gray-300 mb-2">Leverage</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTradeForm({...tradeForm, leverage: 1})}
                        className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                          tradeForm.leverage === 1
                            ? 'bg-gray-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        1x
                      </button>
                      <button
                        onClick={() => setTradeForm({...tradeForm, leverage: 2})}
                        className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                          tradeForm.leverage === 2
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        2x
                      </button>
                      <button
                        onClick={() => setTradeForm({...tradeForm, leverage: 5})}
                        className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                          tradeForm.leverage === 5
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        5x
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Risk Multiplier: {tradeForm.leverage}x volatility movement
                    </div>
                  </div>

                  <div>
                    <div className="block text-sm font-medium text-gray-300 mb-2">Direction</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTradeForm({...tradeForm, direction: 'long'})}
                        className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                          tradeForm.direction === 'long'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        Long (Vol Up)
                      </button>
                      <button
                        onClick={() => setTradeForm({...tradeForm, direction: 'short'})}
                        className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                          tradeForm.direction === 'short'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        Short (Vol Down)
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="block text-sm font-medium text-gray-300 mb-2">Lots (1 lot = $20)</div>
                    <input
                      type="number"
                      value={tradeForm.lots}
                      onChange={(e) => setTradeForm({...tradeForm, lots: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter number of lots"
                      min="0.1"
                      step="0.1"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      Notional Value: ${getNotionalValue()} | Effective Exposure: ${getEffectiveExposure()}
                    </div>
                  </div>
                  
                  <div>
                    <div className="block text-sm font-medium text-gray-300 mb-2">Strike Volatility</div>
                    <div className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400">
                      {tradeForm.timeframe === '7d' ? currentVol7d.toFixed(2) : currentVol30d.toFixed(2)}% ({tradeForm.timeframe} Current)
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowTradeModal(false)}
                    className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTrade}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-semibold transition-all duration-200"
                  >
                    Place Trade
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolatilityTradingPlatform;