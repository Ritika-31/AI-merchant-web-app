import React, { useState, useMemo } from 'react';
import { Transaction, VpaInfo } from '../types';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Info,
  Layers,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Receipt,
  Printer
} from 'lucide-react';

interface TransactionReportProps {
  transactions: Transaction[];
  vpas: VpaInfo[];
  onNavigateToSupportWithTxn: (txnId: string) => void;
}

export default function TransactionReport({ 
  transactions, 
  vpas, 
  onNavigateToSupportWithTxn 
}: TransactionReportProps) {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVpaId, setSelectedVpaId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  
  // Selected Detail Modal
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter & Search Logic
  const filteredTxns = useMemo(() => {
    return transactions.filter(txn => {
      // search match
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        txn.id.toLowerCase().includes(searchLower) ||
        txn.customerName.toLowerCase().includes(searchLower) ||
        txn.customerPhone.includes(searchLower) ||
        txn.rrn.includes(searchLower);

      // VPA match
      const matchesVpa = selectedVpaId === 'all' || txn.vpaId === selectedVpaId;

      // Status match
      const matchesStatus = selectedStatus === 'all' || txn.status === selectedStatus;

      // Mode match
      const matchesMode = selectedMode === 'all' || txn.paymentMode === selectedMode;

      return matchesSearch && matchesVpa && matchesStatus && matchesMode;
    });
  }, [transactions, searchTerm, selectedVpaId, selectedStatus, selectedMode]);

  // Paginated records
  const paginatedTxns = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTxns.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTxns, currentPage]);

  const totalPages = Math.ceil(filteredTxns.length / itemsPerPage);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedVpaId('all');
    setSelectedStatus('all');
    setSelectedMode('all');
    setCurrentPage(1);
  };

  // Real client-side CSV Export!
  const handleExportCSV = () => {
    if (filteredTxns.length === 0) return;

    const headers = ['Transaction ID', 'RRN', 'VPA ID', 'Customer Name', 'Phone', 'Amount', 'Date/Time', 'Status', 'Payment Mode'];
    const rows = filteredTxns.map(txn => {
      const vpaText = vpas.find(v => v.id === txn.vpaId)?.vpa || txn.vpaId;
      return [
        txn.id,
        txn.rrn,
        vpaText,
        txn.customerName,
        txn.customerPhone,
        txn.amount,
        txn.timestamp,
        txn.status,
        txn.paymentMode
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const formattedDate = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `Merchant_Ledger_${formattedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Ledger & Settlement Reports</h2>
          <p className="text-xs text-slate-500 mt-0.5">Filter, extract, and reconcile store ledger logs offline</p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredTxns.length === 0}
          className="bg-indigo-650 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Ledger (CSV)</span>
        </button>
      </div>

      {/* Filter Matrix Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Query Filter */}
          <div className="flex flex-col">
            <label htmlFor="txn-search" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Search Ledger</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                id="txn-search"
                type="text"
                placeholder="Txn ID, Name, Phone, RRN..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors text-slate-800 font-medium"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* VPA Selector */}
          <div className="flex flex-col">
            <label htmlFor="ledger-vpa-select" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Filter Counter</label>
            <select
              id="ledger-vpa-select"
              className="py-2 px-3 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:outline-none focus:border-indigo-500 transition-colors text-slate-700 font-semibold cursor-pointer"
              value={selectedVpaId}
              onChange={(e) => {
                setSelectedVpaId(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Counter Terminals</option>
              {vpas.filter(v => v.id !== 'vpa-all').map(v => (
                <option key={v.id} value={v.id}>{v.label} ({v.vpa})</option>
              ))}
            </select>
          </div>

          {/* Gateway Status Filter */}
          <div className="flex flex-col">
            <label htmlFor="ledger-status" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Access Status</label>
            <select
              id="ledger-status"
              className="py-2 px-3 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:outline-none focus:border-indigo-500 transition-colors text-slate-700 font-semibold cursor-pointer"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Transactions</option>
              <option value="SUCCESS">Success Only</option>
              <option value="PENDING">Pending Only</option>
              <option value="FAILED">Failed Only</option>
            </select>
          </div>

          {/* Payment Mode */}
          <div className="flex flex-col">
            <label htmlFor="ledger-mode" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">UPI Provider</label>
            <select
              id="ledger-mode"
              className="py-2 px-3 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:outline-none focus:border-indigo-500 transition-colors text-slate-700 font-semibold cursor-pointer"
              value={selectedMode}
              onChange={(e) => {
                setSelectedMode(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Any Mode</option>
              <option value="G_PAY">Google Pay (GPay)</option>
              <option value="PHONE_PE">PhonePe</option>
              <option value="PAYTM">Paytm UPI</option>
              <option value="UPI_APP">Generic UPI App</option>
            </select>
          </div>

        </div>

        {/* Status bar description & Reset */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-3">
          <span>
            Showing <strong className="text-slate-800 font-mono">{filteredTxns.length}</strong> matches out of <strong className="text-slate-800 font-mono">{transactions.length}</strong> records
          </span>
          {(searchTerm || selectedVpaId !== 'all' || selectedStatus !== 'all' || selectedMode !== 'all') && (
            <button
              onClick={resetFilters}
              className="text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer select-none"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Ledger Table Section */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs overflow-hidden">
        {filteredTxns.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
            <Info className="w-10 h-10 text-slate-200 stroke-1 mb-2" />
            <h5 className="font-bold text-slate-700 text-sm">No match found</h5>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">No transaction matches your select filter criteria. Try adjusting search terms or status toggles.</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="py-3.5 px-6">Transaction ID</th>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">Payee/Customer</th>
                    <th className="py-3.5 px-4">VPA Counter</th>
                    <th className="py-3.5 px-4">Mode</th>
                    <th className="py-3.5 px-4 text-center">RRN Reference</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Amount</th>
                    <th className="py-3.5 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {paginatedTxns.map((txn) => {
                    const formattedDate = new Date(txn.timestamp).toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' });
                    const formattedTime = new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    
                    return (
                      <tr key={txn.id} className="hover:bg-slate-50/45 transition-colors">
                        <td className="py-3.5 px-6 font-mono font-bold text-slate-900 group-hover:text-indigo-600">
                          {txn.id}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                          <span className="font-semibold">{formattedDate}</span>
                          <span className="block text-[10px] text-slate-400">{formattedTime}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800 block">{txn.customerName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{txn.customerPhone}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[11px] font-medium text-slate-600 truncate block max-w-[130px]">
                            {vpas.find(v => v.id === txn.vpaId)?.label || txn.vpaId}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono block">
                            {vpas.find(v => v.id === txn.vpaId)?.vpa || ''}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-500">
                            {txn.paymentMode}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-400">
                          {txn.rrn}
                        </td>
                        <td className="py-3.5 px-4">
                          {txn.status === 'SUCCESS' && (
                            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Success
                            </span>
                          )}
                          {txn.status === 'PENDING' && (
                            <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Pending
                            </span>
                          )}
                          {txn.status === 'FAILED' && (
                            <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="font-extrabold text-slate-900 font-mono text-[13px]">
                            ₹{txn.amount.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-center">
                          <button
                            onClick={() => setSelectedTxn(txn)}
                            className="text-slate-400 hover:text-indigo-650 p-1 bg-slate-50 hover:bg-indigo-50 rounded border border-slate-200 flex items-center justify-center mx-auto transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Page <strong className="text-slate-800">{currentPage}</strong> of <strong className="text-slate-800">{totalPages}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pop up Receipt Drawer / modal details panel */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full overflow-hidden shadow-xl relative animate-fade-in max-h-[90vh] flex flex-col">
            
            {/* Invoice Top Strip */}
            <div className="bg-slate-900 text-white p-6 flex flex-col items-center justify-center relative">
              <button 
                onClick={() => setSelectedTxn(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-semibold bg-slate-800 px-2.5 py-1 rounded cursor-pointer transition-colors"
               >
                Close
              </button>
              
              <div className="p-2.5 bg-white/10 rounded-full border border-white/10 text-indigo-300 mb-2">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">UPI Payment Receipt</h3>
              <p className="text-[9px] text-slate-500 font-mono mt-1">Ref ID: {selectedTxn.rrn}</p>
            </div>

            {/* Receipt Body */}
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div className="text-center pb-4 border-b border-dashed border-slate-200">
                <span className="text-3xl font-bold text-slate-900 font-mono">₹{selectedTxn.amount.toLocaleString('en-IN')}</span>
                <span className="block mt-2 font-bold text-[10px] uppercase tracking-wider text-slate-550 flex items-center justify-center gap-1.5">
                  {selectedTxn.status === 'SUCCESS' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                  {selectedTxn.status === 'PENDING' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  {selectedTxn.status === 'FAILED' && <XCircle className="w-4 h-4 text-rose-500" />}
                  Transaction {selectedTxn.status}
                </span>
              </div>

              {/* Data Items */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Transaction ID</span>
                  <span className="font-mono font-bold text-slate-900">{selectedTxn.id}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Counter VPA</span>
                  <span className="font-mono text-slate-800">
                    {vpas.find(v => v.id === selectedTxn.vpaId)?.vpa || selectedTxn.vpaId}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Initiated At</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(selectedTxn.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Customer Name</span>
                  <span className="font-semibold text-slate-805">{selectedTxn.customerName}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Customer Phone</span>
                  <span className="font-mono text-slate-800">{selectedTxn.customerPhone}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium font-sans">UPI Provider</span>
                  <span className="font-bold text-slate-800">{selectedTxn.paymentMode}</span>
                </div>

                {selectedTxn.remarks && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Remarks</span>
                    <span className="italic text-slate-600">{selectedTxn.remarks}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex flex-col space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-indigo-900">Settlement Status</span>
                    <span className="font-bold text-indigo-600">Auto-queue morning T+1</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Funds are routed directly into your verified business bank account ending in 9381.</p>
                </div>
              </div>
            </div>

            {/* Footer buttons inside Modal */}
            <div className="bg-slate-50 p-4 border-t border-slate-200/60 flex items-center gap-3">
              <button
                onClick={() => {
                  onNavigateToSupportWithTxn(selectedTxn.id);
                  setSelectedTxn(null);
                }}
                className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold py-2.5 rounded-lg text-center transition-all cursor-pointer"
              >
                Raise Dispute Ticket
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
