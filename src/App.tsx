import React, { useState, useEffect } from 'react';
import { 
  Store, 
  LayoutDashboard, 
  FileText, 
  QrCode, 
  User, 
  LifeBuoy, 
  LogOut, 
  Menu, 
  X,
  CreditCard,
  UserCheck,
  Bell,
  Check
} from 'lucide-react';

// Models
import { Transaction, VpaInfo, SupportTicket, MerchantProfile, TicketMessage } from './types';

// Mock & seeders
import { 
  initialMerchantProfile, 
  initialVPAs, 
  generateMockTransactions, 
  initialTickets 
} from './mockData';

// Subcomponents
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TransactionReport from './components/TransactionReport';
import QRCodeDetails from './components/QRCodeDetails';
import Profile from './components/Profile';
import Support from './components/Support';

export default function App() {
  // Session Access
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('merchant_session_email') || null;
  });

  // App Navigation Active Module
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  
  // Mobile Navigation Drawer Overlay
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // States
  const [profile, setProfile] = useState<MerchantProfile>(() => {
    const cached = localStorage.getItem('merchant_profile');
    return cached ? JSON.parse(cached) : { ...initialMerchantProfile };
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    return generateMockTransactions();
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const cached = localStorage.getItem('merchant_tickets');
    return cached ? JSON.parse(cached) : [ ...initialTickets ];
  });

  // Dispute transaction linker state
  const [prefilledDisputeTxnId, setPrefilledDisputeTxnId] = useState<string | undefined>(undefined);

  // Sync profile cache
  useEffect(() => {
    localStorage.setItem('merchant_profile', JSON.stringify(profile));
  }, [profile]);

  // Sync tickets cache
  useEffect(() => {
    localStorage.setItem('merchant_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const handleLoginSuccess = (email: string) => {
    setCurrentUserEmail(email);
    localStorage.setItem('merchant_session_email', email);
    setActiveModule('dashboard');
  };

  const handleLogout = () => {
    setCurrentUserEmail(null);
    localStorage.removeItem('merchant_session_email');
  };

  const handleUpdateProfile = (updatedProfile: MerchantProfile) => {
    setProfile(updatedProfile);
  };

  const handleRaiseTicket = (newTktData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages'>) => {
    const newId = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowStr = new Date().toISOString();
    
    const newTicket: SupportTicket = {
      ...newTktData,
      id: newId,
      createdAt: nowStr,
      updatedAt: nowStr,
      messages: []
    };

    setTickets(prev => [newTicket, ...prev]);
  };

  const handleAddTicketMessage = (ticketId: string, text: string, sender: 'MERCHANT' | 'SUPPORT') => {
    setTickets(prev => prev.map(tkt => {
      if (tkt.id !== ticketId) return tkt;
      
      const newMsg: TicketMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sender,
        message: text,
        timestamp: new Date().toISOString()
      };

      const hasActiveEscalation = sender === 'MERCHANT' && tkt.status === 'RESOLVED';

      return {
        ...tkt,
        status: hasActiveEscalation ? 'OPEN' : tkt.status, // Reopen ticket if merchant speaks back on resolved issue
        updatedAt: new Date().toISOString(),
        messages: [...tkt.messages, newMsg]
      };
    }));
  };

  // Cross-module trigger: Dispute transaction redirects directly to Support -> Raise Ticket page
  const handleNavigateToSupportWithTxn = (txnId: string) => {
    setPrefilledDisputeTxnId(txnId);
    setActiveModule('support');
    setIsMobileMenuOpen(false);
  };

  if (!currentUserEmail) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative text-slate-800 font-sans">
      
      {/* 1. Mobile Top AppBar */}
      <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3.5 flex items-center justify-between z-35 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-650 border border-indigo-100/80">
            <Store className="w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-slate-900 tracking-tight leading-none">Merchant Pay</h1>
            <span className="text-[9px] text-slate-500 font-medium">{profile.businessName}</span>
          </div>
        </div>

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
        >
          {isMobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          <span>Menu</span>
        </button>
      </header>

      {/* 2. PC / Sidebar Drawer */}
      <aside className={`
        fixed md:sticky top-0 left-0 bg-white text-slate-800 w-64 h-full shrink-0 z-40 p-5 flex flex-col justify-between border-r border-slate-200/80 transition-transform duration-300 md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:h-screen
      `}>
        {/* Sidebar Info Banner */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Store className="w-5.5 h-5.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900">Merchant Pay</h2>
              <span className="text-[10px] text-indigo-600 uppercase tracking-widest font-bold block">Merchant Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Workspace Controls</h4>
            
            {/* Dashboard */}
            <button
              onClick={() => { setActiveModule('dashboard'); setIsMobileMenuOpen(false); }}
              className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center gap-3 transition-all cursor-pointer ${activeModule === 'dashboard' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/50 font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/80'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Register Dashboard</span>
            </button>

            {/* Reports */}
            <button
              onClick={() => { setActiveModule('ledger'); setIsMobileMenuOpen(false); }}
              className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center gap-3 transition-all cursor-pointer ${activeModule === 'ledger' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/50 font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/80'}`}
            >
              <FileText className="w-4 h-4" />
              <span>Ledger Logs</span>
            </button>

            {/* QR Codes */}
            <button
              onClick={() => { setActiveModule('qrcode'); setIsMobileMenuOpen(false); }}
              className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center gap-3 transition-all cursor-pointer ${activeModule === 'qrcode' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/50 font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/80'}`}
            >
              <QrCode className="w-4 h-4" />
              <span>QR Code details</span>
            </button>

            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-4 mb-2">My Registry</h4>

            {/* View Profile */}
            <button
              onClick={() => { setActiveModule('profile'); setIsMobileMenuOpen(false); }}
              className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center gap-3 transition-all cursor-pointer ${activeModule === 'profile' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/50 font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/80'}`}
            >
              <User className="w-4 h-4" />
              <span>View Profile</span>
            </button>

            {/* Support Tickets */}
            <button
              onClick={() => { setActiveModule('support'); setIsMobileMenuOpen(false); }}
              className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center gap-3 transition-all cursor-pointer ${activeModule === 'support' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/50 font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/80'}`}
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Help & Support</span>
            </button>
          </nav>
        </div>

        {/* User context & logouts */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <div className="flex items-center gap-3 select-none">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100/50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              {profile.ownerName.slice(0, 2).toUpperCase()}
            </div>
            <div className="truncate max-w-[155px]">
              <span className="font-bold text-xs text-slate-900 block truncate leading-none">{profile.ownerName}</span>
              <span className="text-[9px] text-slate-400 block truncate mt-1">{currentUserEmail}</span>
            </div>
          </div>

          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-650 border border-slate-200/80 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span>Switch Register Session</span>
          </button>
        </div>
      </aside>

      {/* Mobile background backdrop screen shield */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 z-35 md:hidden"
        />
      )}

      {/* 3. Main Workspace Container */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
        
        {/* Sticky Utility Breadcrumbs Bar */}
        <div className="hidden md:flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold flex items-center gap-2">
            <span className="text-slate-400">Merchant Registry</span>
            <span>&rarr;</span>
            <span className="text-indigo-600 font-bold capitalize">{activeModule.replace('_', ' ')} Module</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] font-semibold text-slate-700">Account Verified</span>
            </div>
            
            <div className="h-4 w-px bg-slate-200" />
            <span>UTC 2026-05-21</span>
          </div>
        </div>

        {/* Dynamic Widget Views Switches */}
        {activeModule === 'dashboard' && (
          <Dashboard 
            transactions={transactions} 
            vpas={initialVPAs}
            onNavigateToReport={() => setActiveModule('ledger')}
            onNavigateToSupportWithTxn={handleNavigateToSupportWithTxn}
          />
        )}

        {activeModule === 'ledger' && (
          <TransactionReport 
            transactions={transactions} 
            vpas={initialVPAs}
            onNavigateToSupportWithTxn={handleNavigateToSupportWithTxn}
          />
        )}

        {activeModule === 'qrcode' && (
          <QRCodeDetails vpas={initialVPAs} />
        )}

        {activeModule === 'profile' && (
          <Profile 
            profile={profile} 
            onUpdateProfile={handleUpdateProfile} 
          />
        )}

        {activeModule === 'support' && (
          <Support 
            tickets={tickets} 
            transactions={transactions}
            onRaiseTicket={handleRaiseTicket}
            onAddTicketMessage={handleAddTicketMessage}
            initialSelectedTxnId={prefilledDisputeTxnId}
            clearSelectedTxnId={() => setPrefilledDisputeTxnId(undefined)}
          />
        )}

      </main>

    </div>
  );
}
