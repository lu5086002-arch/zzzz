import React, { useState } from 'react';
import { Users, Mail, Phone, Calendar, ArrowLeft, Star, Send } from 'lucide-react';
import { OrderItem } from '../../../types';

interface PwaCustomersProps {
  orders: OrderItem[];
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  showNotice: (title: string, message: string, type: 'success' | 'info' | 'warning') => void;
  onBack: () => void;
}

export default function PwaCustomers({ orders, addLog, showNotice, onBack }: PwaCustomersProps) {
  const [activeSegment, setActiveSegment] = useState<'all' | 'vip' | 'inactive'>('all');

  // Derive active customer directory from orders or fallback presets
  const derivedCustomers = [
    { name: 'Claire Laurent', email: 'claire@laurent-design.fr', spend: 2490, ordersCount: 5, category: 'vip' },
    { name: 'Albert Wagner', email: 'albert.wagner@tech-corp.de', spend: 1840, ordersCount: 3, category: 'vip' },
    { name: 'Nita Patel', email: 'nita.patel@mumbai-group.in', spend: 950, ordersCount: 2, category: 'all' },
    { name: 'John Cooper', email: 'jcooper@us-logistics.com', spend: 120, ordersCount: 1, category: 'inactive' },
    { name: 'Sofia Moretti', email: 'sofia@moretti-milano.it', spend: 1530, ordersCount: 4, category: 'vip' },
    { name: 'David Smith', email: 'david@smith-consulting.uk', spend: 80, ordersCount: 1, category: 'inactive' }
  ];

  const filtered = derivedCustomers.filter(c => {
    if (activeSegment === 'vip') return c.category === 'vip';
    if (activeSegment === 'inactive') return c.category === 'inactive';
    return true;
  });

  const handlePushMarketing = () => {
    addLog('AI 营销助理 Marcus', '触发客群定向营销召回', '正在向该群组推送 MODA_VIP_10 专属折扣与召回邮件', 'tool');
    showNotice(
      '智能营销已投递',
      `✓ 已经成功唤醒该受众！已向该分组中的用户定向推送定制化的 AI 召回文案与优惠折扣！`,
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
          <h2 className="text-sm font-bold text-slate-800">客户关系管理</h2>
          <p className="text-[10px] text-slate-400">管理您的全球客户与高净值分组</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 p-4 shrink-0">
        <div className="bg-white border border-slate-100 p-3 rounded-xl text-left">
          <p className="text-[10px] text-slate-400 font-medium">累计活跃客户</p>
          <p className="text-lg font-black text-slate-800 mt-1">238人</p>
        </div>
        <div className="bg-white border border-slate-100 p-3 rounded-xl text-left">
          <p className="text-[10px] text-slate-400 font-medium">近45天复购率</p>
          <p className="text-lg font-black text-[#07C2E3] mt-1">38.5%</p>
        </div>
      </div>

      {/* Segment Selectors */}
      <div className="px-4 flex gap-2 shrink-0">
        {(['all', 'vip', 'inactive'] as const).map(seg => {
          const labels = { all: '全部客群', vip: '高净值 VIP', inactive: '静默老客' };
          return (
            <button
              key={seg}
              onClick={() => setActiveSegment(seg)}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                activeSegment === seg
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
              }`}
            >
              {labels[seg]}
            </button>
          );
        })}
      </div>

      {/* Customers List */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filtered.map((cli, idx) => (
          <div key={idx} className="bg-white border border-slate-100/85 p-3 rounded-xl flex items-center justify-between text-left shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">{cli.name}</span>
                {cli.category === 'vip' ? (
                  <span className="bg-[#07C2E3]/10 text-[#07C2E3] text-[8px] font-extrabold px-1 rounded border border-[#07C2E3]/15 flex items-center gap-0.5">
                    <Star className="w-2 h-2 fill-[#07C2E3]" /> VIP
                  </span>
                ) : (
                  <span className="bg-slate-100 text-slate-400 text-[8px] font-extrabold px-1 rounded">普通会员</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <Mail className="w-3 h-3 shrink-0" />
                <span>{cli.email}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-slate-800">${cli.spend}</p>
              <p className="text-[9px] text-slate-400">{cli.ordersCount}个订单</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Bar */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <button
          onClick={handlePushMarketing}
          className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#07C2E3]/10"
        >
          <Send className="w-3.5 h-3.5" />
          <span>针对该群组启动一键召回邮件</span>
        </button>
      </div>
    </div>
  );
}
