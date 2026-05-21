import React, { useState } from 'react';
import { MerchantProfile } from '../types';
import { 
  User, 
  Store, 
  CreditCard, 
  ShieldCheck, 
  Edit3, 
  Save, 
  Grid, 
  Key, 
  Eye, 
  EyeOff,
  Activity,
  CheckCircle2,
  Lock,
  Clock
} from 'lucide-react';

interface ProfileProps {
  profile: MerchantProfile;
  onUpdateProfile: (updated: MerchantProfile) => void;
}

export default function Profile({ profile, onUpdateProfile }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<MerchantProfile>({ ...profile });
  const [showMaskedAccount, setShowMaskedAccount] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const getMaskedAccount = (num: string) => {
    if (!num) return '';
    if (!showMaskedAccount) return num;
    return `•••• •••• •••• ${num.slice(-4)}`;
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Profile Header Module */}
      <div className="bg-slate-900 p-6 rounded-2xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800 shadow-sm relative overflow-hidden">
        {/* Ambient background blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 flex items-center justify-center font-bold text-2xl shadow-inner uppercase shrink-0">
            {profile.ownerName.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">{profile.businessName}</h2>
              <span className="py-0.5 px-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                {profile.tier}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
              <span>Merchant ID:</span>
              <strong className="font-mono text-white text-[11px] font-semibold">{profile.id}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10 w-full md:w-auto mt-2 md:mt-0">
          {!isEditing ? (
            <button
              id="edit-profile-btn"
              onClick={() => setIsEditing(true)}
              className="w-full md:w-auto bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-indigo-300" />
              <span>Customize Profile</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                id="cancel-edit-btn"
                onClick={() => {
                  setFormData({ ...profile });
                  setIsEditing(false);
                }}
                className="flex-1 md:flex-initial bg-slate-800 hover:bg-slate-755 border border-slate-700 text-slate-300 font-semibold py-2 px-3 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="save-profile-btn"
                onClick={handleSubmit}
                className="flex-1 md:flex-initial bg-indigo-650 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Registry</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div id="save-success-banner" className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>Profile particulars saved successfully. Authorized settings synchronized in standard clearing registers.</span>
        </div>
      )}

      {/* Bento Grid layout representing profile segments */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Block A: General Business particulars */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/60 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Store className="w-4.5 h-4.5 text-indigo-650" />
            <span className="font-bold text-slate-900 text-sm">Business particulars</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="p-businessName" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Business / Trading Name</label>
              <input
                id="p-businessName"
                type="text"
                name="businessName"
                className="w-full text-xs font-medium py-2 px-3 border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:bg-white focus:border-indigo-500 text-slate-800 disabled:opacity-75 disabled:bg-slate-50/20 transition-all font-sans"
                value={formData.businessName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label htmlFor="p-ownerName" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Authorized Signatory Name</label>
              <input
                id="p-ownerName"
                type="text"
                name="ownerName"
                className="w-full text-xs font-medium py-2 px-3 border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:bg-white focus:border-indigo-500 text-slate-800 disabled:opacity-75 disabled:bg-slate-50/20 transition-all font-sans"
                value={formData.ownerName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label htmlFor="p-email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Primary Contact Email</label>
              <input
                id="p-email"
                type="email"
                name="email"
                className="w-full text-xs font-medium py-2 px-3 border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:bg-white focus:border-indigo-500 text-slate-800 disabled:opacity-75 disabled:bg-slate-50/20 transition-all font-sans"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label htmlFor="p-phone" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Registered Mobile</label>
              <input
                id="p-phone"
                type="text"
                name="phone"
                className="w-full text-xs font-medium py-2 px-3 border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:bg-white focus:border-indigo-500 text-slate-800 disabled:opacity-75 disabled:bg-slate-50/20 transition-all font-sans"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label htmlFor="p-category" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Business Segment Category</label>
              <select
                id="p-category"
                name="category"
                className="w-full text-xs font-medium py-2 px-3 border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:bg-white focus:border-indigo-500 text-slate-800 disabled:opacity-75 disabled:bg-slate-50/20 transition-all font-sans cursor-pointer"
                value={formData.category}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="Retail / Groceries">Retail / Groceries</option>
                <option value="Hospitality / Cafe">Hospitality / Cafe</option>
                <option value="eCommerce / Digital">eCommerce / Digital</option>
                <option value="Apparel / Luxury">Apparel / Luxury</option>
              </select>
            </div>

            <div>
              <label htmlFor="p-gst" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Merchant GSTIN</label>
              <input
                id="p-gst"
                type="text"
                name="gstin"
                className="w-full text-xs font-medium py-2 px-3 border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:bg-white focus:border-indigo-500 text-slate-800 disabled:opacity-75 disabled:bg-slate-50/20 transition-all font-mono"
                value={formData.gstin}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Block B: Bank Settlement Particulars */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/60 shadow-xs p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 animate-fade-in">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4.5 h-4.5 text-indigo-650" />
                <span className="font-bold text-slate-900 text-sm">Settlement Node</span>
              </div>
              <button
                type="button"
                onClick={() => setShowMaskedAccount(!showMaskedAccount)}
                className="text-slate-450 hover:text-indigo-650 text-xs font-semibold cursor-pointer"
              >
                {showMaskedAccount ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Settlement Bank Name</span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">{profile.bankName}</span>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Linked Account Number</span>
                <span className="text-xs font-mono font-bold text-slate-800 block mt-0.5">{getMaskedAccount(profile.accountNumber)}</span>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">IFSC Routing Code</span>
                <span className="text-xs font-mono font-bold text-slate-800 block mt-0.5">{profile.ifscCode}</span>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Standard Settlement Cycle</span>
                <span className="p-1 px-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold inline-flex items-center gap-1 mt-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {profile.settlementCycle}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Bank parameters verified on 14-Aug-2025</span>
          </div>
        </div>

      </form>

      {/* Verification Stats & Badges card */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 scale-95 shrink-0 border border-indigo-100">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Compliance Verified</h4>
            <p className="text-xs text-slate-400 mt-0.5">Your merchant credentials clear active Reserve Bank guidelines for aggregate merchant acquisition.</p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 scale-95 shrink-0 border border-indigo-100">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Optimal Network Router</h4>
            <p className="text-xs text-slate-400 mt-0.5">Using multi-bank active gateways ensuring transaction status completion averages over 99.4%.</p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 scale-95 shrink-0 border border-indigo-100">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Digital Settlement Node</h4>
            <p className="text-xs text-slate-400 mt-0.5">Settlement payouts route instantly every morning at 06:00 IST including public treasury holidays.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
