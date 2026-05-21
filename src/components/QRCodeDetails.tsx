import React, { useState, useMemo, useEffect } from 'react';
import QRCode from 'qrcode';
import { VpaInfo } from '../types';
import { initialMerchantProfile } from '../mockData';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  TrendingUp, 
  HelpCircle, 
  ShieldAlert,
  Smartphone,
  Info,
  DollarSign,
  PenTool,
  Share2
} from 'lucide-react';

interface QRCodeDetailsProps {
  vpas: VpaInfo[];
}

export default function QRCodeDetails({ vpas }: QRCodeDetailsProps) {
  const [selectedVpaId, setSelectedVpaId] = useState<string>('vpa-1');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('Counter Scanner');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedBranding, setSelectedBranding] = useState<'STANDARD' | 'GPAY' | 'PHONE_PE'>('STANDARD');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [generationError, setGenerationError] = useState<string | null>(null);

  const selectedVpa = useMemo(() => {
    return vpas.find(v => v.id === selectedVpaId) || vpas[1];
  }, [vpas, selectedVpaId]);

  // Construct real-world standard UPI payment link scheme!
  const upiLink = useMemo(() => {
    const vpaStr = selectedVpa.vpa;
    // Standard UPI scheme: upi://pay?pa=merchant@bank&pn=MerchantName&cur=INR
    // We keep spaces readable or properly formatted depending on standard parser capabilities
    const nameStr = encodeURIComponent(initialMerchantProfile.businessName);
    const amtStr = customAmount ? `&am=${customAmount}` : '';
    const remStr = remarks ? `&tn=${encodeURIComponent(remarks)}` : '';
    
    return `upi://pay?pa=${vpaStr}&pn=${nameStr}${amtStr}${remStr}&cu=INR`;
  }, [selectedVpa, customAmount, remarks]);

  // Generate QR Code dynamically from the UPI payment deep-link
  useEffect(() => {
    let isMounted = true;
    
    // We render at high resolution (350px) with generous error correction (High Q/H level)
    // for optimal scannability under any glare, reflection or low camera resolutions.
    QRCode.toDataURL(upiLink, {
      width: 450,
      margin: 2,
      errorCorrectionLevel: 'Q',
      color: {
        dark: '#0f172a', // deep slate-900 (maximum contrast against pure white)
        light: '#ffffff'
      }
    })
    .then(url => {
      if (isMounted) {
        setQrCodeUrl(url);
        setGenerationError(null);
      }
    })
    .catch(err => {
      console.error('Local QR Code Generation Error', err);
      if (isMounted) {
        setGenerationError('Failed to generate high contrast QR code locally.');
      }
    });

    return () => {
      isMounted = false;
    };
  }, [upiLink]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(upiLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrintQR = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Module Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">QR Code Details & Standees</h2>
          <p className="text-xs text-slate-500 mt-0.5">Configure Dynamic UPI Scanners and dispatch printed checkout templates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Customize payment amount/remarks to update UPI deep-link dynamically! */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">UPI Scanner customizer</h4>
            
            {/* VPA Target Selection */}
            <div>
              <label htmlFor="qr-vpa-select" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Configure Target VPA Counter</label>
              <select
                id="qr-vpa-select"
                className="w-full text-xs font-semibold py-2 px-3 border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:border-indigo-500 text-slate-800 cursor-pointer"
                value={selectedVpaId}
                onChange={(e) => setSelectedVpaId(e.target.value)}
              >
                {vpas.filter(v => v.id !== 'vpa-all').map(v => (
                  <option key={v.id} value={v.id}>{v.label} — {v.vpa}</option>
                ))}
              </select>
            </div>

            {/* Amount (Optional for dynamic payloads!) */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="qr-amount" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dynamic Amount (Optional)</label>
                <span className="text-[10px] text-slate-400 font-medium">Leave empty for multi-pay standee</span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-mono text-xs font-bold">
                  ₹
                </span>
                <input
                  id="qr-amount"
                  type="number"
                  placeholder="e.g. 500"
                  className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-xs tracking-wide bg-slate-50/50 focus:outline-none focus:border-indigo-500 font-mono font-bold text-slate-800"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  min="1"
                />
              </div>
            </div>

            {/* Settlement/Purchase Remarks */}
            <div>
              <label htmlFor="qr-remarks" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Purchase billing identifier / Remarks</label>
              <input
                id="qr-remarks"
                type="text"
                placeholder="e.g. Counter 1 Grocery"
                className="w-full py-2 px-3 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:outline-none focus:border-indigo-500 text-slate-700 font-medium"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            {/* Visual template color scheme selection */}
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Display standee Layout Scheme</span>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedBranding('STANDARD')}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${selectedBranding === 'STANDARD' ? 'border-indigo-600 bg-indigo-50 text-indigo-800 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Standard Indigo
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBranding('GPAY')}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${selectedBranding === 'GPAY' ? 'border-blue-600 bg-blue-50/50 text-blue-800 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  GPay Blue
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBranding('PHONE_PE')}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${selectedBranding === 'PHONE_PE' ? 'border-violet-600 bg-violet-50/50 text-violet-800 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  PhonePe Purple
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3 mt-4">
            <div className="p-3 bg-indigo-50/40 border border-indigo-100/50 rounded-lg flex items-start gap-2.5 text-[11px] text-slate-600 leading-relaxed md:text-xs">
              <Info className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
              <span>
                <strong>Dynamic Checkout Payload:</strong> Senders scanning this QR code will automatically have their payment amount setup to <span className="font-bold text-slate-900">₹{customAmount || 'any amount'}</span> and transaction remarks preloaded to <span className="font-semibold text-slate-900">"{remarks || 'Counter Scanner'}"</span>. This avoids manual input errors at registers!
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 animate-scale" />
                    <span className="text-emerald-700">Deep Link Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copy UPI Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrintQR}
                className="bg-slate-900 hover:bg-black text-white font-semibold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Standee Layout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: High Fidelity Visual Render of UPI Scanner Standee */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          {/* Standee Mock Container */}
          <div className="w-full max-w-[325px] bg-slate-950 p-2.5 pt-4 rounded-[2.5rem] shadow-xl border border-slate-800/80 print:border-none print:shadow-none relative">
            
            {/* Standee Bezel Holder Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-2.5 bg-slate-900 rounded-b-md z-10" />
            
            {/* Theme responsive card face */}
            <div className="rounded-[2rem] p-5 text-center shadow-inner pt-6 relative overflow-hidden flex flex-col items-center select-none bg-white">
              
              {/* Theme top strip branding banner colors */}
              <div className={`absolute top-0 inset-x-0 h-2 
                ${selectedBranding === 'STANDARD' ? 'bg-indigo-600' : ''} 
                ${selectedBranding === 'GPAY' ? 'bg-blue-500' : ''} 
                ${selectedBranding === 'PHONE_PE' ? 'bg-violet-600' : ''}`} 
              />
              
              {/* Gold / Plus Badge */}
              <div className="mb-2 bg-slate-50 border border-slate-200/80 rounded px-2 py-0.5 text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                {initialMerchantProfile.tier}
              </div>

              {/* Store Title */}
              <h5 className="font-black text-slate-900 text-sm tracking-tight truncate max-w-[220px]">{initialMerchantProfile.businessName}</h5>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider font-mono mt-0.5 select-all hover:text-indigo-600">{selectedVpa.vpa}</p>
 
              {/* QR Code Graphic Frame */}
              <div className="my-4 p-4 bg-white border border-slate-200/50 rounded-2xl shadow-xs relative group">
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="Unified QR code for merchant scans" 
                    className="w-44 h-44 rounded-lg object-contain block relative z-10 mx-auto"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-44 h-44 rounded-lg flex items-center justify-center bg-slate-50 text-slate-400 text-xs">
                    Generating scannable QR...
                  </div>
                )}
                
                {/* Visual grid scanners style corner frames (high contrast indigo/slate matching scheme) */}
                <div className={`absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2
                  ${selectedBranding === 'STANDARD' ? 'border-indigo-600' : ''} 
                  ${selectedBranding === 'GPAY' ? 'border-blue-500' : ''} 
                  ${selectedBranding === 'PHONE_PE' ? 'border-violet-600' : ''}`} 
                />
                <div className={`absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2
                  ${selectedBranding === 'STANDARD' ? 'border-indigo-600' : ''} 
                  ${selectedBranding === 'GPAY' ? 'border-blue-500' : ''} 
                  ${selectedBranding === 'PHONE_PE' ? 'border-violet-600' : ''}`} 
                />
                <div className={`absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2
                  ${selectedBranding === 'STANDARD' ? 'border-indigo-600' : ''} 
                  ${selectedBranding === 'GPAY' ? 'border-blue-500' : ''} 
                  ${selectedBranding === 'PHONE_PE' ? 'border-violet-600' : ''}`} 
                />
                <div className={`absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2
                  ${selectedBranding === 'STANDARD' ? 'border-indigo-600' : ''} 
                  ${selectedBranding === 'GPAY' ? 'border-blue-500' : ''} 
                  ${selectedBranding === 'PHONE_PE' ? 'border-violet-600' : ''}`} 
                />
              </div>
 
              {/* Conditional Amount Badge */}
              {customAmount ? (
                <div className="p-1.5 px-4 bg-indigo-50 border border-indigo-150 rounded-xl animate-fade-in mb-2 mt-1">
                  <span className="text-[9px] text-indigo-600 font-bold tracking-widest uppercase block mb-0.5">REQUESTED AMOUNT</span>
                  <p className="text-base font-extrabold font-mono text-indigo-950 leading-none">₹{parseFloat(customAmount).toLocaleString('en-IN')}</p>
                </div>
              ) : (
                <div className="p-1 px-3 bg-slate-50 border border-slate-150 rounded-lg mb-2 mt-1">
                  <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">ANY PAYMENT AMOUNT ACCEPTED</span>
                </div>
              )}
 
              {/* UPI and standard BHIM visual details */}
              <div className="flex items-center gap-1.5 opacity-90 mt-2">
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Accepting BHIM UPI Payments</span>
              </div>
 
              <div className="grid grid-cols-4 gap-2 mt-4 w-full">
                <span className="text-[8px] font-bold text-slate-500 bg-slate-50/50 p-1.5 rounded border border-slate-200/50 text-center tracking-tighter">G-PAY</span>
                <span className="text-[8px] font-bold text-slate-500 bg-slate-50/50 p-1.5 rounded border border-slate-200/50 text-center tracking-tighter">PAYTM</span>
                <span className="text-[8px] font-bold text-slate-500 bg-slate-50/50 p-1.5 rounded border border-slate-200/50 text-center tracking-tighter">PHONEPE</span>
                <span className="text-[8px] font-bold text-slate-500 bg-slate-50/50 p-1.5 rounded border border-slate-200/50 text-center tracking-tighter">BHIM</span>
              </div>
 
              {/* Disclaimer */}
              <p className="text-[9px] text-slate-400 font-sans tracking-tight mt-4 max-w-[220px] leading-tight text-center">
                Instant settlements processed through NPCI direct route securely. For register discrepancies, appeal instantly via help desk.
              </p>
 
            </div>
          </div>
 
          {/* Quick Guided Instruction Banner to assist users facing scanning issues */}
          <div className="w-full max-w-[325px] mt-4 p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-2 text-xs">
            <h6 className="font-bold text-amber-900 flex items-center gap-1">
              <span className="text-sm">⚠️</span>
              <span>Scanning Guide (Important)</span>
            </h6>
            <ul className="list-disc pl-4 space-y-1 text-amber-850 text-[11px] leading-relaxed">
              <li>Use a **specific UPI banking app** on your phone (like Google Pay, PhonePe, Paytm, or BHIM) to point your camera and scan.</li>
              <li>Standard iOS/Android native camera apps **do not support instant sandbox UPI payment links** without a native provider app installed.</li>
              <li>Ensure the screen brightness is elevated for crisp scan contrast.</li>
            </ul>
          </div>

          <span className="text-[10px] font-bold text-slate-400 mt-3 hover:text-slate-600 cursor-help text-center block">
            Tip: Standee layout fits standard 4x6 registers acrylic stands
          </span>
        </div>
 
      </div>
 
    </div>
  );
}
