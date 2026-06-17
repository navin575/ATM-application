import React, { useState } from 'react';
import { deposit, withdraw } from '../services/api';

export default function Dashboard({ user, onLogout }) {
  const [stage, setStage] = useState('dashboard'); // dashboard, withdraw-view, deposit-view
  const [balance, setBalance] = useState(user?.balance || 5000);
  const [amountInput, setAmountInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' }); // success, error

  const [transactions, setTransactions] = useState([
    { id: 1, type: 'System Credit', desc: 'Initial Account Provisioning', amount: 5000, date: 'System Settlement', positive: true }
  ]);

  const showStatus = (text, type) => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage({ text: '', type: '' }), 5000);
  };

  const processTransaction = async (type) => {
    const numValue = parseFloat(amountInput);
    if (!amountInput || isNaN(numValue) || numValue <= 0) {
      return showStatus("Invalid transaction amount specified.", "error");
    }
    
    setIsLoading(true);
    try {
      const data = type === 'withdraw' 
        ? await withdraw(user.accountNumber, amountInput)
        : await deposit(user.accountNumber, amountInput);
      
      setBalance(data.balance);
      setTransactions(prev => [
        {
          id: Date.now(),
          type: type === 'withdraw' ? 'Debit Withdrawal' : 'Account Deposit',
          desc: type === 'withdraw' ? 'ATM Cash Ledger Settlement' : 'Cloud Clearing Processing',
          amount: numValue,
          date: new Date().toLocaleTimeString(),
          positive: type === 'deposit'
        },
        ...prev
      ]);

      showStatus(data.message || "Transaction completed successfully.", "success");
      setStage('dashboard');
      setAmountInput('');
    } catch (err) {
      showStatus(err.message || "Transaction authorization failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 w-full flex items-center justify-center p-0 sm:p-4 md:p-8 font-sans">
      
      <div className="w-full max-w-6xl bg-slate-950 rounded-none sm:rounded-2xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col md:flex-row min-h-[650px]">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-72 bg-slate-950 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/80">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">A</div>
              <div>
                <span className="font-bold text-sm text-white block tracking-wide">Apex Premium</span>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider block uppercase">Secure Core</span>
              </div>
            </div>
            
            <nav className="space-y-1">
              <button onClick={() => { setStage('dashboard'); setStatusMessage({ text: '', type: '' }); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors ${stage === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'} cursor-pointer`}>
                Dashboard Overview
              </button>
              <button onClick={() => { setStage('withdraw-view'); setStatusMessage({ text: '', type: '' }); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors ${stage === 'withdraw-view' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'} cursor-pointer`}>
                Cash Withdrawal
              </button>
              <button onClick={() => { setStage('deposit-view'); setStatusMessage({ text: '', type: '' }); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors ${stage === 'deposit-view' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'} cursor-pointer`}>
                Account Deposit
              </button>
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-800/60">
            <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg text-slate-400 hover:bg-slate-900 hover:text-rose-400 transition-colors cursor-pointer">
              Sign Out Session
            </button>
          </div>
        </div>

        {/* Core Content Body */}
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-between space-y-8 bg-slate-950">
          
          {/* Status Message Ribbon */}
          {statusMessage.text && (
            <div className={`p-4 rounded-xl border text-xs font-medium ${
              statusMessage.type === 'error' ? 'bg-rose-950/40 border-rose-800 text-rose-200' : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
            }`}>
              {statusMessage.text}
            </div>
          )}

          {stage === 'dashboard' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Account Dashboard</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Welcome, {user?.name || "Premium Client"}</p>
                </div>
                <div className="text-[10px] bg-slate-900 text-slate-400 px-3 py-1 rounded-md border border-slate-800 font-mono">
                  NODE // SECURE_SYNCED
                </div>
              </div>
              
              {/* Premium Balance Card */}
              <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 relative">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Net Available Balance</span>
                <h4 className="text-3xl font-bold mt-1 font-mono tracking-tight">
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h4>
                <div className="mt-8 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row gap-2 justify-between text-xs text-slate-500 font-mono">
                  <span>ACCOUNT NUMBER: <span className="text-slate-300">{user?.accountNumber || "12345678"}</span></span>
                  <span className="uppercase">Visa Business Platinum</span>
                </div>
              </div>

              {/* Functional Quick Entry Ports */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-500 text-xs tracking-wider uppercase font-mono">Quick Desk Gateways</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => setStage('withdraw-view')} className="p-4 bg-slate-900/40 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-colors group cursor-pointer">
                    <span className="block font-semibold text-slate-200 text-sm">Execute Cash Withdrawal</span>
                    <span className="text-xs text-slate-500 block mt-1">Dispense immediate physical banknotes from liquid funds.</span>
                  </button>
                  <button onClick={() => setStage('deposit-view')} className="p-4 bg-slate-900/40 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-colors group cursor-pointer">
                    <span className="block font-semibold text-slate-200 text-sm">Execute Vault Deposit</span>
                    <span className="text-xs text-slate-500 block mt-1">Commit asset capital rows straight to data records.</span>
                  </button>
                </div>
              </div>

              {/* Transactions Log Sheet */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-500 text-xs tracking-wider uppercase font-mono">Recent Account Activity Records</h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/20">
                  <div className="max-h-40 overflow-y-auto divide-y divide-slate-800/60">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="p-3.5 flex justify-between items-center text-xs hover:bg-slate-900/30 transition-colors">
                        <div>
                          <span className="font-semibold text-slate-200 block">{tx.type}</span>
                          <span className="text-slate-500 text-[11px] block mt-0.5">{tx.desc}</span>
                        </div>
                        <div className="text-right font-mono">
                          <span className={`font-bold block ${tx.positive ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {tx.positive ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-[10px] text-slate-600 block mt-0.5">{tx.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Input Module */}
          {(stage === 'withdraw-view' || stage === 'deposit-view') && (
            <div className="max-w-md w-full mx-auto sm:mx-0 flex flex-col justify-center py-4">
              <div>
                <button onClick={() => { setStage('dashboard'); setStatusMessage({ text: '', type: '' }); }} className="text-xs text-slate-400 font-semibold hover:text-slate-200 transition-colors mb-2 cursor-pointer">
                  &larr; Return to Dashboard Hub
                </button>
                <h3 className="text-xl font-bold text-white tracking-tight uppercase">
                  {stage === 'withdraw-view' ? 'Withdraw Capital Funds' : 'Deposit Capital Vault'}
                </h3>
              </div>

              <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 mt-6 space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">Transaction Value ($)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 font-bold text-slate-500 font-mono">$</span>
                    <input 
                      type="number" 
                      value={amountInput} 
                      onChange={(e) => setAmountInput(e.target.value)} 
                      placeholder="0.00" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-9 pr-4 text-white font-semibold text-lg font-mono focus:outline-none focus:border-indigo-500" 
                    />
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-3 gap-2">
                    {['20', '50', '100'].map(preset => (
                      <button key={preset} onClick={() => setAmountInput(preset)} className="bg-slate-950 border border-slate-800 text-slate-400 text-xs font-semibold py-2 rounded-lg hover:bg-slate-900 hover:text-white transition-colors cursor-pointer font-mono">
                        +${preset}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => processTransaction(stage === 'withdraw-view' ? 'withdraw' : 'deposit')} 
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-xs uppercase tracking-wider font-mono shadow-lg transition-colors cursor-pointer disabled:opacity-40"
                >
                  {isLoading ? 'Processing Entry Request...' : 'Commit Core Ledger Block'}
                </button>
              </div>
            </div>
          )}
          
          <div className="text-[10px] text-slate-600 font-mono text-center md:text-right pt-4 border-t border-slate-800/40 tracking-wide">
            SECURE ACCESS POOL // ADDR: LOCALHOST:3000
          </div>
        </div>

      </div>
    </div>
  );
}