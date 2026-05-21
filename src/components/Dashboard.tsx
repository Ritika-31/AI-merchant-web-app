import React, { useState, useMemo } from 'react';
import { Transaction, VpaInfo } from '../types';
import { initialVPAs } from '../mockData';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Search,
  Check,
  AlertCircle
} from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  vpas: VpaInfo[];
  onNavigateToReport: () => void;
  onNavigateToSupportWithTxn: (txnId: string) => void;
}

export default function Dashboard({ 
  transactions, 
  vpas, 
  onNavigateToReport, 
  onNavigateToSupportWithTxn 
}: DashboardProps) {
  const [selectedVpaId, setSelectedVpaId] = useState<string>('vpa-all');
  const [selectedDay, setSelectedDay] = useState<'today' | 'yesterday'>('today');

  // Filter transactions based on VPA and Day
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      // 1. VPA Filter
      if (selectedVpaId !== 'vpa-all' && txn.vpaId !== selectedVpaId) {
        return false;
      }

      // 2. Day Filter
      if (selectedDay === 'today') {
        return txn.id.includes('TODAY');
      } else {
        return txn.id.includes('YEST');
      }
    });
  }, [transactions, selectedVpaId, selectedDay]);

  // Aggregate stats
  const stats = useMemo(() => {
    const successTxns = filteredTransactions.filter(t => t.status === 'SUCCESS');
    const totalAmount = successTxns.reduce((sum, t) => sum + t.amount, 0);
    const totalCount = filteredTransactions.length;
    const successCount = successTxns.length;
    
    const pendingCount = filteredTransactions.filter(t => t.status === 'PENDING').length;
    const failedCount = filteredTransactions.filter(t => t.status === 'FAILED').length;
    const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 100;
    const averageValue = successCount > 0 ? Math.round(totalAmount / successCount) : 0;

    return {
      totalAmount,
      totalCount,
      successCount,
      pendingCount,
      failedCount,
      successRate,
      averageValue
    };
  }, [filteredTransactions]);

  // Hourly Buckets for SVG chart mapping
  const chartData = useMemo(() => {
    // 4 major buckets: 8:00-11:00 AM, 11:00-2:00 PM, 2:00-5:00 PM, 5:00-10:00 PM
    const buckets = [
      { label: 'Morning (8AM-11AM)', amount: 0, count: 0 },
      { label: 'Mid-Day (11AM-2PM)', amount: 0, count: 0 },
      { label: 'Afternoon (2PM-5PM)', amount: 0, count: 0 },
      { label: 'Evening (5PM-10PM)', amount: 0, count: 0 }
    ];

    filteredTransactions.forEach(txn => {
      if (txn.status !== 'SUCCESS') return;
      const date = new Date(txn.timestamp);
      const hour = date.getHours();

      if (hour >= 8 && hour < 11) {
        buckets[0].amount += txn.amount;
        buckets[0].count += 1;
      } else if (hour >= 11 && hour < 14) {
        buckets[1].amount += txn.amount;
        buckets[1].count += 1;
      } else if (hour >= 14 && hour < 17) {
        buckets[2].amount += txn.amount;
        buckets[2].count += 1;
      } else if (hour >= 17 && hour <= 22) {
        buckets[3].amount += txn.amount;
        buckets[3].count += 1;
      }
    });

    const maxAmt = Math.max(...buckets.map(b => b.amount), 500); // Prevent divide-by-zero
    return buckets.map(b => ({
      ...b,
      heightPercentage: Math.max((b.amount / maxAmt) * 100, 8) // Minimum visual height
    }));
  }, [filteredTransactions]);

  const activeVpaLabel = useMemo(() => {
    const vpa = vpas.find(v => v.id === selectedVpaId);
    return vpa ? vpa.vpa : 'All VPAs';
  }, [vpas, selectedVpaId]);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Header Banner with Selectors */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Register Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Realtime metrics for <span className="font-semibold text-indigo-600">{activeVpaLabel}</span> ({selectedDay === 'today' ? 'Today' : 'Yesterday'})
          </p>
        </div>

        {/* Filter Controls stacked in nice cluster */}
        <div className="flex flex-wrap items-center gap-3.5 w-full md:w-auto">
          {/* VPA Selector Dropdown */}
          <div className="flex flex-col min-w-[200px] flex-1 md:flex-initial">
            <label htmlFor="vpa-select" className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select VPA Counter</label>
            <select
              id="vpa-select"
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
              value={selectedVpaId}
              onChange={(e) => setSelectedVpaId(e.target.value)}
            >
              {vpas.map(v => (
                <option key={v.id} value={v.id}>
                  {v.label} ({v.vpa})
                </option>
              ))}
            </select>
          </div>

          {/* Day Selector Dropdown */}
          <div className="flex flex-col min-w-[140px] flex-1 md:flex-initial">
            <label htmlFor="day-select" className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Time Horizon</label>
            <select
              id="day-select"
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as 'today' | 'yesterday')}
            >
              <option value="today">Today (Live)</option>
              <option value="yesterday">Yesterday (Settled)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Amount */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full blur-xl -translate-y-4 translate-x-4 group-hover:bg-indigo-100/50 transition-colors" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Settlement Vol</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2 font-mono">₹{stats.totalAmount.toLocaleString('en-IN')}</h3>
            </div>
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-650 border border-indigo-100/80">
              <span className="text-xs font-bold">₹</span>
            </span>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px]">
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              +14.2%
            </span>
            <span className="text-slate-400">vs avg baseline</span>
          </div>
        </div>

        {/* Total Number of Transactions */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-xl -translate-y-4 translate-x-4 group-hover:bg-slate-100 transition-colors" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Transactions</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2 font-mono">{stats.totalCount} txns</h3>
            </div>
            <span className="p-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-200/50">
              <Check className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-500 justify-between">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              {stats.successCount} Success
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              {stats.pendingCount} Pend
            </span>
            <span className="flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
              {stats.failedCount} Fail
            </span>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-full blur-xl -translate-y-4 translate-x-4 transition-colors" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">UPI Success Rate</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2 font-mono">{stats.successRate}%</h3>
            </div>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/50">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px]">
            <span className={`font-semibold ${stats.successRate > 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
              Status: {stats.successRate > 90 ? 'Optimal' : 'Checking'}
            </span>
            <span className="text-slate-400">across gateways</span>
          </div>
        </div>

        {/* Average Ticket Value */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/50 rounded-full blur-xl -translate-y-4 translate-x-4 transition-colors" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Average Ticket Value</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2 font-mono">₹{stats.averageValue.toLocaleString('en-IN')}</h3>
            </div>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100/50">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Dynamic average basket index</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pure SVG Bar Chart */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Hourly Sales Distribution</h4>
              <p className="text-[11px] text-slate-400">Successful collected volume parsed in segments</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-indigo-650" />
              <span className="text-[11px] text-slate-500">Collected Amount (₹)</span>
            </div>
          </div>

          <div className="h-60 flex items-end justify-between gap-4 pt-4 border-b border-slate-100">
            {chartData.map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative">
                {/* Visual Tooltip */}
                <div className="absolute -top-6 bg-slate-900 text-white rounded px-2 py-0.5 text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 flex flex-col items-center">
                  <span>₹{bar.amount} ({bar.count} txns)</span>
                  <span className="w-1 h-1 bg-slate-900 rotate-45" />
                </div>

                {/* The Bar */}
                <div 
                  className="w-full bg-slate-100 group-hover:bg-indigo-600 rounded-t transition-all duration-350"
                  style={{ height: `${bar.heightPercentage}%` }}
                />
                
                {/* Amount text overlay (always visible if fit) */}
                <span className="text-[10px] font-bold text-indigo-800 absolute z-5 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{bar.amount}
                </span>
              </div>
            ))}
          </div>

          {/* X axis labels */}
          <div className="flex justify-between mt-3 px-1">
            {chartData.map((bar, idx) => (
              <span key={idx} className="flex-1 text-center text-[10px] font-semibold text-slate-500 truncate px-1">
                {bar.label}
              </span>
            ))}
          </div>
        </div>

        {/* Counter VPA health panel */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">VPA Performance Matrix</h4>
            <p className="text-[11px] text-slate-400 mb-4">Breakdown by scanner nodes</p>
            
            <div className="space-y-3">
              {vpas.filter(v => v.id !== 'vpa-all').map((vpa, idx) => {
                // Calculate details for this VPA strictly
                const vpaTxns = transactions.filter(t => t.vpaId === vpa.id && (selectedDay === 'today' ? t.id.includes('TODAY') : t.id.includes('YEST')));
                const successVpa = vpaTxns.filter(t => t.status === 'SUCCESS');
                const vpaSum = successVpa.reduce((s, t) => s + t.amount, 0);
                const pct = stats.totalAmount > 0 ? Math.round((vpaSum / stats.totalAmount) * 100) : 0;

                return (
                  <div key={vpa.id} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100/70 transition-colors border border-slate-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800 truncate max-w-[140px]">{vpa.label}</span>
                      <span className="font-bold text-slate-900 font-mono">₹{vpaSum.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                      <span>{vpaTxns.length} txns</span>
                      <span>{pct}% share</span>
                    </div>
                    <div className="w-full bg-slate-200/80 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-indigo-50/50 rounded-lg p-3 text-xs border border-indigo-100/60 mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="font-medium text-indigo-950">Direct instant settlement active</span>
            </div>
            <span className="text-[10px] text-indigo-700 font-bold">100% SLA</span>
          </div>
        </div>
      </div>

      {/* Recent Transact Activity List */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Recent Active Transactions</h4>
            <p className="text-[11px] text-slate-400">Realtime logs corresponding to current filter</p>
          </div>
          <button 
            onClick={onNavigateToReport}
            className="text-xs font-semibold text-indigo-650 hover:text-indigo-800 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Merchant ledger</span>
            <span>&rarr;</span>
          </button>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center">
            <AlertCircle className="w-8 h-8 text-slate-300 stroke-1 mb-2" />
            <span className="text-sm">No transactions found for the selection</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-slate-50/50 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="py-3 px-5">TXN ID / TIME</th>
                  <th className="py-3 px-4">PAYEE NAME</th>
                  <th className="py-3 px-4">UPI VPA</th>
                  <th className="py-3 px-4">MODE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">AMOUNT</th>
                  <th className="py-3 px-5 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTransactions.slice(0, 5).map((txn) => {
                  const txnTime = new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <tr key={txn.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-800 font-mono">{txn.id}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {txnTime}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {txn.customerName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        {vpas.find(v => v.id === txn.vpaId)?.vpa || txn.vpaId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-slate-50 rounded text-slate-600 border border-slate-250/30 font-semibold text-[10px]">
                          {txn.paymentMode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {txn.status === 'SUCCESS' && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Success
                          </span>
                        )}
                        {txn.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Pending
                          </span>
                        )}
                        {txn.status === 'FAILED' && (
                          <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-mono text-[13px]">
                        ₹{txn.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <button
                          onClick={() => onNavigateToSupportWithTxn(txn.id)}
                          className="bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 hover:border-indigo-100 py-1 px-2.5 rounded text-[10px] font-semibold transition-all cursor-pointer"
                        >
                          Dispute ID
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
