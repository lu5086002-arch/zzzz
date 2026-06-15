import React, { useState } from 'react';
import { Megaphone, Plus, Tag, Calendar, ArrowLeft, Percent, Send, Check } from 'lucide-react';
import { ProductItem } from '../../../types';

interface PwaMarketingProps {
  products: ProductItem[];
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  showNotice: (title: string, message: string, type: 'success' | 'info' | 'warning') => void;
  onBack: () => void;
}

export default function PwaMarketing({ products, addLog, showNotice, onBack }: PwaMarketingProps) {
  const [activeCoupons, setActiveCoupons] = useState<any[]>([
    { code: 'MODA_VIP_10', percent: 10, minPurchase: 100, active: true },
    { code: 'ECOS_SUMMER', percent: 15, minPurchase: 150, active: true }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('20');
  const [minPurchase, setMinPurchase] = useState('80');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const code = couponCode.toUpperCase().trim();
    const percent = parseInt(discountPercent) || 20;
    const minAmount = parseInt(minPurchase) || 50;

    const newCoupon = {
      code,
      percent,
      minPurchase: minAmount,
      active: true
    };

    setActiveCoupons([newCoupon, ...activeCoupons]);
    setCouponCode('');
    setShowAddForm(false);

    addLog('System', '注册新优惠券', `成功注册新促销券「${code}」，设定折扣比例 -${percent}%，使用门槛 $${minAmount}`, 'success');
    showNotice('促销券注册成功', `✓ 券码 ${code} 已经成功录入多商户收银及在线网店系统！`, 'success');
  };

  const startAutomatedCampaign = () => {
    addLog('AI 推广总监 Victor', '自适应流式大促上线', '已向 Facebook Ads, Google Ads 下发针对性投放折扣素材包', 'tool');
    showNotice(
      'AI 推广链调度完毕',
      '✓ 已为您一键激活 Google/Meta 广告自愈与推送，最新营销覆盖预计今日带来 14% 的订单回流！',
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
          <h2 className="text-sm font-bold text-slate-800">营销与折扣管理</h2>
          <p className="text-[10px] text-slate-400">一键发布优惠促销及自动化获客策略</p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto text-left">
        {/* Actions Cards */}
        <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-2">
          <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase">自适应 AI 回流获客</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
            点击将对 Adyen 上的废弃购物车、近期未结账的询盘意向老客自动撰写个性化文案并群发电子邮件。
          </p>
          <button
            onClick={startAutomatedCampaign}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded-lg text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Megaphone className="w-3.5 h-3.5 text-[#07C2E3]" />
            <span>立即触发全渠道大促召回</span>
          </button>
        </div>

        {/* Coupon Code List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">店铺当前可用优惠码</h4>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-[#07C2E3] text-[10px] font-black tracking-wider uppercase flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> 新建折扣
            </button>
          </div>

          {/* Form Modal in-line */}
          {showAddForm && (
            <form onSubmit={handleCreateCoupon} className="bg-slate-850 p-4 rounded-xl border-2 border-[#07C2E3] text-slate-100 space-y-3 animate-slideIn">
              <h5 className="text-[11px] font-black text-[#07C2E3] tracking-widest uppercase">录入最新促销券</h5>
              <div className="space-y-2 text-slate-800 text-xs font-semibold">
                <div>
                  <label className="block text-[9px] text-slate-300 font-bold mb-1">券码代码 (大写)</label>
                  <input
                    type="text"
                    required
                    placeholder="例如 SUMMER_SALE_20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-white text-slate-800 border border-slate-200 outline-none uppercase font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] text-slate-300 font-bold mb-1">折扣比例 (%)</label>
                    <input
                      type="number"
                      required
                      min="5"
                      max="90"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      className="w-full px-3 py-1.5 rounded bg-white text-slate-800 border border-slate-200 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-300 font-bold mb-1">最低消费门槛 ($)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={minPurchase}
                      onChange={(e) => setMinPurchase(e.target.value)}
                      className="w-full px-3 py-1.5 rounded bg-white text-slate-800 border border-slate-200 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 text-[10px] uppercase font-bold text-slate-300 hover:text-white"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 font-black px-4 py-1 text-[10px] uppercase rounded"
                >
                  保存录入
                </button>
              </div>
            </form>
          )}

          {/* List display */}
          <div className="space-y-2">
            {activeCoupons.map((coup, idx) => (
              <div key={idx} className="bg-white border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center font-mono font-bold text-xs">
                    %
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-slate-800">{coup.code}</span>
                      <span className="bg-emerald-50 text-emerald-500 text-[8px] font-extrabold px-1 rounded border border-emerald-100 flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> 生效中
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">最低消费: ${coup.minPurchase}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-[#07C2E3]">-{coup.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
