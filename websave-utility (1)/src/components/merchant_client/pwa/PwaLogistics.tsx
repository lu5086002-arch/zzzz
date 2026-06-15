import React from 'react';
import { ArrowLeft, Package, AlertTriangle, Truck, ArrowRight, CornerDownLeft, RefreshCcw } from 'lucide-react';
import { ProductItem } from '../../../types';

interface PwaLogisticsProps {
  products: ProductItem[];
  onUpdateProducts: (updated: ProductItem[]) => void;
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  showNotice: (title: string, message: string, type: 'success' | 'info' | 'warning') => void;
  onBack: () => void;
}

export default function PwaLogistics({ products, onUpdateProducts, addLog, showNotice, onBack }: PwaLogisticsProps) {
  // Low stock products
  const lowStockItems = products.filter(p => p.stock <= p.minStockThreshold);

  const handleRestock = (sku: string, name: string) => {
    const updated = products.map(p => {
      if (p.sku === sku) {
        const nextStock = p.stock + 50;
        return {
          ...p,
          stock: nextStock,
          status: nextStock > p.minStockThreshold ? 'In Stock' as const : 'Low Stock' as const
        };
      }
      return p;
    });

    onUpdateProducts(updated);

    addLog('AI 采购经理 Oliver', '快速增补安全库存', `已紧急对接供应链，为 「${name}」 追加实盘库存 50 件`, 'success');
    showNotice(
      '库存补仓成功',
      `✓ 商品 SKU「${sku}」库存成功增补 50 件。智能大盘及WMS已同步更新！`,
      'success'
    );
  };

  const handleTriggerBulkRestock = () => {
    if (lowStockItems.length === 0) {
      showNotice('不需要一键补货', '✓ 当前店面没有触发安全阈值预警的低库存货品。', 'info');
      return;
    }

    const updated = products.map(p => {
      if (p.stock <= p.minStockThreshold) {
        const nextStock = p.stock + 80;
        return {
          ...p,
          stock: nextStock,
          status: 'In Stock' as const
        };
      }
      return p;
    });

    onUpdateProducts(updated);

    addLog('AI 采购经理 Oliver', '一键调配供应链全部补货', '自动识别店面所有断货与低迷货品，触发紧急拼柜拼箱并入货库款', 'success');
    showNotice(
      '智能全域补货成功',
      `✓ 成功为店面所有 ${lowStockItems.length} 个断货 SKU 各打补安全库存 80 件！`,
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
          <h2 className="text-sm font-bold text-slate-800">智能供应链分拨</h2>
          <p className="text-[10px] text-slate-400">追踪实盘库存水位、多仓流转与安全备料</p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto text-left">
        {/* Logistics Pipeline milestones */}
        <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#07C2E3]" />
              <span>智能快递航线跟踪 (DHL Express)</span>
            </h4>
            <span className="text-[8px] bg-[#07C2E3]/10 text-[#07C2E3] px-1.5 py-0.5 rounded font-extrabold border border-[#07C2E3]/20">
              海外仓直发
            </span>
          </div>

          {/* Stepper tracking */}
          <div className="space-y-3 pl-2.5">
            <div className="relative border-l-2 border-slate-100 pl-4 space-y-4 text-xs">
              <div className="relative">
                <div className="absolute -left-[21px] mt-0.5 w-2 h-2 rounded-full bg-[#07C2E3]" />
                <p className="font-bold text-slate-800">巴黎配送集收中心 CDG</p>
                <p className="text-[9px] text-slate-400 font-mono">2026-06-14 18:22 ● 已海关离港</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] mt-0.5 w-2 h-2 rounded-full bg-slate-300" />
                <p className="font-semibold text-slate-500">法兰克福配送总转中心 DE</p>
                <p className="text-[9px] text-slate-400 font-mono">转海航派送排仓中</p>
              </div>
            </div>
          </div>
        </div>

        {/* Low inventory list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              库存安全警报 ({lowStockItems.length})
            </h4>
            {lowStockItems.length > 0 && (
              <button
                type="button"
                onClick={handleTriggerBulkRestock}
                className="text-[#07C2E3] text-[10px] font-black tracking-wider uppercase flex items-center gap-1"
              >
                <RefreshCcw className="w-3 h-3" /> 一键智能补齐
              </button>
            )}
          </div>

          <div className="space-y-2">
            {lowStockItems.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center space-y-1">
                <p className="text-xs font-bold text-emerald-800">✓ 店铺安全状态完美</p>
                <p className="text-[10px] text-emerald-600 font-semibold">无任何商品库存低于预警水位。</p>
              </div>
            ) : (
              lowStockItems.map((prod) => (
                <div key={prod.id} className="bg-white border border-slate-100 p-3 rounded-xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800 leading-none">{prod.name}</p>
                      <p className="text-[9px] text-slate-400 font-mono mt-1">ID: {prod.sku} | 阈值: {prod.minStockThreshold}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-orange-500 font-mono">{prod.stock}件</span>
                    <button
                      onClick={() => handleRestock(prod.sku, prod.name)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-[#07C2E3] text-white hover:text-slate-900 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer"
                    >
                      补货 50
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
