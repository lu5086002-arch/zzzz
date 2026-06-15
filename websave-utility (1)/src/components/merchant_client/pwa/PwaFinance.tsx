import React from 'react';
import { ArrowLeft, DollarSign, Wallet, ArrowDownRight, ArrowUpRight, TrendingUp, CheckCircle, FileText } from 'lucide-react';
import { OrderItem } from '../../../types';

interface PwaFinanceProps {
  orders: OrderItem[];
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  showNotice: (title: string, message: string, type: 'success' | 'info' | 'warning') => void;
  onBack: () => void;
}

export default function PwaFinance({ orders, addLog, showNotice, onBack }: PwaFinanceProps) {
  // Compute metrics from orders
  const computedTotalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalReceived = computedTotalSales > 0 ? computedTotalSales : 12480;
  const processedPayout = Math.max(9240, Math.floor(totalReceived * 0.72));
  const pendingPayout = totalReceived - processedPayout;

  const handleExportCSV = () => {
    addLog('AI 财务审计 Audit', '导出财务报账对账单', '正在后台打包并生成对账核销清单 CSV', 'tool');
    showNotice(
      '账期报表生成成功',
      '✓ 本月欧盟财务对账单导出包已成功推送到云端存储。随时可在财务大盘中核算！',
      'success'
    );
  };

  const handleTriggerPayout = () => {
    addLog('Adyen Stripe clearing', '申请即时安全结转', `提现金额 $${pendingPayout} 起扣并推送到绑定的对公 IBAN 账户`, 'success');
    showNotice(
      '结算提现申请成功',
      `✓ 清结算指令下发成功！已成功受理 $${pendingPayout} 即时资金提现，预计 2 小时内自动汇入商户对公账户。`,
      'success'
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-full">
      {/* Sub Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-3 shrink-0">
        <button onClick={onBack} className="p-1 rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-left">
          <h2 className="text-sm font-bold text-slate-800">财务结算控制台</h2>
          <p className="text-[10px] text-slate-400">核算各币种收单、VAT 增值税与资金回流</p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto text-left">
        {/* Multi Currency Balance Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white border border-slate-100 p-2.5 rounded-xl text-left shadow-sm">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">EUR Balance</span>
            <p className="text-xs font-black text-slate-800 font-mono mt-1">€24,195.00</p>
          </div>
          <div className="bg-white border border-slate-100 p-2.5 rounded-xl text-left shadow-sm">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">USD Balance</span>
            <p className="text-xs font-black text-slate-800 font-mono mt-1">${totalReceived.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-slate-100 p-2.5 rounded-xl text-left shadow-sm bg-gradient-to-tr from-slate-900 to-slate-800 text-white border-none">
            <span className="text-[9px] font-black text-[#07C2E3] uppercase tracking-wider">USDC Balance</span>
            <p className="text-xs font-black text-white font-mono mt-1">6,500.00</p>
          </div>
        </div>

        {/* Payout Details Card */}
        <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-[#07C2E3]" />
              <span>本期商户清算账单</span>
            </h4>
            <span className="text-[8px] bg-[#07C2E3]/10 text-[#07C2E3] px-1.5 py-0.5 rounded font-extrabold border border-[#07C2E3]/20">
              结算完成 75%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 divide-x divide-slate-100 text-left">
            <div>
              <p className="text-[10px] text-slate-400 font-bold">已结算回流 (Paid Out)</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-md font-black text-emerald-500 font-mono">${processedPayout.toLocaleString()}</span>
                <span className="text-[8px] text-slate-400 font-bold">USD</span>
              </div>
            </div>
            <div className="pl-4">
              <p className="text-[10px] text-slate-400 font-bold">待结汇户头 (In Transit)</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-md font-black text-[#07C2E3] font-mono">${pendingPayout.toLocaleString()}</span>
                <span className="text-[8px] text-slate-400 font-bold">USD</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleExportCSV}
              className="flex-1 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-[10px] font-black uppercase text-slate-600 transition-all flex items-center justify-center gap-1 cursor-pointer bg-white"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>对账单 PDF</span>
            </button>
            <button
              onClick={handleTriggerPayout}
              className="flex-1 py-2 bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>即时安全汇出</span>
            </button>
          </div>
        </div>

        {/* Beautiful high quality SVG visualization trend */}
        <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>清收净利润趋势</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-bold font-mono">周维度 +24.5%</span>
          </div>

          <div className="w-full h-24 overflow-hidden relative">
            <svg viewBox="0 0 300 100" className="w-full h-full text-[#07C2E3]">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#07C2E3" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#07C2E3" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="80" x2="300" y2="80" stroke="#f1f5f9" strokeWidth="1" />

              {/* Chart Line */}
              <path
                d="M 10 90 Q 50 60 90 75 T 170 30 T 250 15 T 290 8"
                fill="none"
                stroke="#07C2E3"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 10 90 Q 50 60 90 75 T 170 30 T 250 15 T 290 8 L 290 100 L 10 100 Z"
                fill="url(#chartGradient)"
              />
              {/* Highlight Nodes */}
              <circle cx="290" cy="8" r="3.5" fill="#07C2E3" stroke="white" strokeWidth="1" />
              <circle cx="170" cy="30" r="3" fill="#07C2E3" />
            </svg>
          </div>
          <div className="flex justify-between text-[8px] text-slate-400 font-bold font-mono px-1">
            <span>MON</span>
            <span>WED</span>
            <span>FRI</span>
            <span>SUN (LIVE)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
