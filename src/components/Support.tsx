import React, { useState, useMemo } from 'react';
import { SupportTicket, Transaction, TicketCategory, TicketStatus, TicketMessage } from '../types';
import { initialTickets } from '../mockData';
import { 
  PlusCircle, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  CornerDownRight, 
  Send, 
  User, 
  Headphones, 
  ArrowLeft,
  Calendar,
  Layers,
  Link2,
  AlertTriangle
} from 'lucide-react';

interface SupportProps {
  tickets: SupportTicket[];
  transactions: Transaction[];
  onRaiseTicket: (newTicket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages'>) => void;
  onAddTicketMessage: (ticketId: string, text: string, sender: 'MERCHANT' | 'SUPPORT') => void;
  initialSelectedTxnId?: string;
  clearSelectedTxnId?: () => void;
}

export default function Support({ 
  tickets, 
  transactions, 
  onRaiseTicket, 
  onAddTicketMessage,
  initialSelectedTxnId,
  clearSelectedTxnId
}: SupportProps) {
  const [activeTab, setActiveTab ] = useState<'VIEW_TKT' | 'RAISE_TKT'>(initialSelectedTxnId ? 'RAISE_TKT' : 'VIEW_TKT');
  
  // Create ticket form state:
  const [category, setCategory] = useState<TicketCategory>('SETTLEMENT');
  const [linkedTxnId, setLinkedTxnId] = useState<string>(initialSelectedTxnId || 'none');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [ticketSubmitSuccess, setTicketSubmitSuccess] = useState(false);

  // Active Chat ticket detail view
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const selectedTicket = useMemo(() => {
    return tickets.find(t => t.id === activeTicketId) || null;
  }, [tickets, activeTicketId]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      alert("Please fill in the Subject and Description.");
      return;
    }

    onRaiseTicket({
      category,
      subject,
      description,
      transactionId: linkedTxnId === 'none' ? undefined : linkedTxnId,
      status: 'OPEN'
    });

    // Reset Form
    setCategory('SETTLEMENT');
    setLinkedTxnId('none');
    setSubject('');
    setDescription('');
    if (clearSelectedTxnId) clearSelectedTxnId();

    setTicketSubmitSuccess(true);
    setTimeout(() => {
      setTicketSubmitSuccess(false);
      setActiveTab('VIEW_TKT');
    }, 2000);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeTicketId) return;

    const currentTicketId = activeTicketId;
    onAddTicketMessage(currentTicketId, replyMessage, 'MERCHANT');
    const userMsg = replyMessage;
    setReplyMessage('');
    setSendingMessage(true);

    // Simulate standard support automatic response after 1.5 seconds!
    setTimeout(() => {
      let automatedReply = "Hello! We have received your query response. A support specialist is actively inspecting this thread and will revert shortly.";
      
      if (userMsg.toLowerCase().includes('settle') || userMsg.toLowerCase().includes('pay')) {
        automatedReply = "We understand this is urgent Ritika. Our banking queue is being monitored right now, and settlements are in progress. Should you need urgent clearing, we'll coordinate.";
      } else if (userMsg.toLowerCase().includes('qr') || userMsg.toLowerCase().includes('standee')) {
        automatedReply = "Thank you for the update! We are verifying the dispatch tracking timeline for your scanner laminates. Expect delivery updates inside 24 hours.";
      }
      
      onAddTicketMessage(currentTicketId, automatedReply, 'SUPPORT');
      setSendingMessage(false);
    }, 1500);
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN':
        return <span className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-0.5 text-[10px] font-bold"><Clock className="w-3.5 h-3.5" /> Open</span>;
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center gap-1.5 text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-0.5 text-[10px] font-bold"><Clock className="w-3.5 h-3.5 animate-spin" /> Investigating</span>;
      case 'RESOLVED':
        return <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 text-[10px] font-bold"><CheckCircle className="w-3.5 h-3.5" /> Resolved</span>;
      case 'CLOSED':
        return <span className="inline-flex items-center gap-1.5 text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-0.5 text-[10px] font-bold">Closed</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Intro strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Merchant Help Desk</h2>
          <p className="text-xs text-slate-500 mt-0.5">Report transaction discrepancies, delivery issues, or order physical QR scanners</p>
        </div>
      </div>

      {/* Tabs Controller */}
      {!selectedTicket && (
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('VIEW_TKT')}
            className={`py-3 px-6 text-xs font-semibold border-b-2 cursor-pointer transition-all ${activeTab === 'VIEW_TKT' ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Store Tickets ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('RAISE_TKT')}
            className={`py-3 px-6 text-xs font-semibold border-b-2 cursor-pointer transition-all ${activeTab === 'RAISE_TKT' ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-slate-505 hover:text-slate-800'}`}
          >
            Raise Dispute Ticket
          </button>
        </div>
      )}

      {/* Case 1: Active Chat View (Ticket Thread Detail view) */}
      {selectedTicket ? (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs overflow-hidden flex flex-col min-h-[500px] animate-fade-in">
          
          {/* Support Ticket Info Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-4">
            <button
              onClick={() => setActiveTicketId(null)}
              className="p-1 px-3 text-xs font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1 hover:bg-slate-100 rounded transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Index</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold font-mono">{selectedTicket.id}</span>
              {getStatusBadge(selectedTicket.status)}
            </div>
          </div>

          {/* Ticket context details */}
          <div className="p-4 bg-indigo-50/10 border-b border-slate-100 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Dispute Category</span>
                <span className="font-bold text-slate-800 block mt-0.5">{selectedTicket.category.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Subject Thread</span>
                <span className="font-semibold text-slate-800 block mt-0.5 truncate max-w-[250px]">{selectedTicket.subject}</span>
              </div>
              {selectedTicket.transactionId && (
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Linked Transaction</span>
                  <span className="font-mono font-bold text-indigo-700 mt-0.5 inline-flex items-center gap-1">
                    <Link2 className="w-3.5 h-3.5" />
                    {selectedTicket.transactionId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4 max-h-[350px] bg-slate-50/20">
            {/* The initial ticket opening statement */}
            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
              <div className="p-2 bg-slate-100 text-slate-500 rounded-lg shrink-0">
                <User className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-800">Ritika Sathua (Merchant)</span>
                  <span className="text-[10px] text-slate-400">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">{selectedTicket.description}</p>
              </div>
            </div>

            {/* Conversation Messages */}
            {selectedTicket.messages.map((msg) => {
              const belongsToUs = msg.sender === 'MERCHANT';
              
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-[85%] ${belongsToUs ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${belongsToUs ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                    {belongsToUs ? <User className="w-4.5 h-4.5" /> : <Headphones className="w-4.5 h-4.5" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-xs space-y-1 ${belongsToUs ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-200/60 rounded-tl-none shadow-xs'}`}>
                    <div className="flex items-center gap-2 justify-between">
                      <span className="font-bold">{belongsToUs ? 'You' : 'Merchant Support'}</span>
                      <span className={`text-[10px] ${belongsToUs ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="leading-relaxed font-sans whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              );
            })}

            {sendingMessage && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="p-2 bg-slate-100 text-slate-500 rounded-lg shrink-0">
                  <Headphones className="w-4.5 h-4.5 animate-pulse" />
                </div>
                <div className="bg-white text-slate-505 p-3.5 rounded-2xl border border-slate-200/60 rounded-tl-none shadow-xs flex items-center gap-2 text-xs">
                  <svg className="animate-spin h-3.5 w-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Support Specialist is typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* New message input controller */}
          <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-slate-100 flex gap-3">
            <input
              id="chat-reply-input"
              type="text"
              placeholder="Type your explanation or query update..."
              className="flex-1 py-2 px-3 border border-slate-200 focus:outline-none focus:border-indigo-550 rounded-lg text-xs"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              disabled={sendingMessage || selectedTicket.status === 'CLOSED'}
            />
            <button
              id="chat-send-btn"
              type="submit"
              disabled={sendingMessage || !replyMessage.trim() || selectedTicket.status === 'CLOSED'}
              className="bg-indigo-650 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Reply</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      ) : (
        <>
          {/* Case 2: Raise Ticket Form Tab */}
          {activeTab === 'RAISE_TKT' && (
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs p-5 max-w-2xl mx-auto space-y-4 animate-fade-in">
              <div className="pb-3 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm">Dispute Registration Form</h4>
                <p className="text-xs text-slate-505 mt-1">Please provide accurate transaction specifics for accelerated SLA clearance.</p>
              </div>

              {ticketSubmitSuccess && (
                <div id="tkt-success" className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-505" />
                  <span>Your support ticket has been registered in the ledger queue. Redirecting...</span>
                </div>
              )}

              <form onSubmit={handleCreateTicket} className="space-y-4 text-xs font-sans">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category select */}
                  <div>
                    <label htmlFor="t-category" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Dispute Category</label>
                    <select
                      id="t-category"
                      className="w-full py-2 px-3 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:outline-none focus:border-indigo-500 text-slate-705 font-semibold cursor-pointer"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as TicketCategory)}
                    >
                      <option value="SETTLEMENT">Settlement Dispute / Delay</option>
                      <option value="TECHNICAL">Scanner Network Error</option>
                      <option value="REFUND_DISPUTE">Refund / Customer Double Charge</option>
                      <option value="QR_CODE">QR Code Standee Acrylic Damage</option>
                      <option value="OTHER">General Assistance</option>
                    </select>
                  </div>

                  {/* Association Transaction Select */}
                  <div>
                    <label htmlFor="t-txn" className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5">Link Specific Transaction ID</label>
                    <select
                      id="t-txn"
                      className="w-full py-2 px-3 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:outline-none focus:border-indigo-500 text-slate-705 font-semibold cursor-pointer"
                      value={linkedTxnId}
                      onChange={(e) => setLinkedTxnId(e.target.value)}
                    >
                      <option value="none">General Inquiry (No transaction)</option>
                      {transactions.map(txn => (
                        <option key={txn.id} value={txn.id}>
                          {txn.id} (₹{txn.amount} - {txn.customerName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject Line */}
                <div>
                  <label htmlFor="t-subject" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Dispute Subject Summary</label>
                  <input
                    id="t-subject"
                    type="text"
                    placeholder="e.g. Double charged customer at main express checkout"
                    className="w-full py-2.5 px-3 border border-slate-200 focus:outline-none focus:border-indigo-500 rounded-lg text-xs text-slate-800 font-medium bg-slate-50/50"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                {/* Long description */}
                <div>
                  <label htmlFor="t-desc" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Detailed description of Incident</label>
                  <textarea
                    id="t-desc"
                    rows={4}
                    placeholder="Please specify transaction conditions, double debit notices or error screenshots..."
                    className="w-full py-2 px-3 border border-slate-200 focus:outline-none focus:border-indigo-500 rounded-lg text-xs text-slate-700 bg-slate-50/50"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    id="cancel-tkt"
                    type="button"
                    onClick={() => {
                      if (clearSelectedTxnId) clearSelectedTxnId();
                      setActiveTab('VIEW_TKT');
                    }}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg cursor-pointer text-xs"
                  >
                    Cancel Action
                  </button>
                  <button
                    id="submit-tkt"
                    type="submit"
                    className="bg-indigo-650 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Dispute Ticket</span>
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* Case 3: View Active Tickets Index */}
          {activeTab === 'VIEW_TKT' && (
            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200/60 p-12 text-center text-slate-400 flex flex-col items-center justify-center">
                  <MessageSquare className="w-10 h-10 text-slate-200 stroke-1 mb-2" />
                  <h5 className="font-bold text-slate-700 text-sm">No Tickets Found</h5>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">No active grievances are registered for Aura Fresh supermarket. You can raise custom tickets anytime.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tickets.map(tkt => {
                    const relativeDate = new Date(tkt.createdAt).toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' });
                    
                    return (
                      <div 
                        key={tkt.id} 
                        onClick={() => setActiveTicketId(tkt.id)}
                        className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs hover:border-indigo-500 transition-all cursor-pointer hover:shadow-sm flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 border-b border-slate-50 pb-2.5 mb-3">
                            <span className="text-[10px] font-mono font-bold text-slate-400">{tkt.id}</span>
                            {getStatusBadge(tkt.status)}
                          </div>

                          <span className="text-[9px] font-bold text-indigo-950 bg-indigo-50 rounded px-1.5 py-0.5 uppercase tracking-wider">
                            {tkt.category}
                          </span>
                          
                          <h4 className="font-bold text-slate-900 text-sm mt-2 line-clamp-1 group-hover:text-indigo-650 transition-colors">
                            {tkt.subject}
                          </h4>
                          
                          <p className="text-xs text-slate-450 line-clamp-2 mt-1.5 leading-relaxed">
                            {tkt.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {relativeDate}
                          </span>
                          <span className="font-semibold text-indigo-600 flex items-center gap-1 group-hover:underline">
                            <span>Inspect thread</span>
                            <span>&rarr;</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}

    </div>
  );
}
