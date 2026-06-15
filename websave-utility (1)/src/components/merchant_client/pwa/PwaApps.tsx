import React, { useState } from 'react';
import { ArrowLeft, Box, Check, Plus, Trash2, Cpu } from 'lucide-react';

interface PwaAppsProps {
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  showNotice: (title: string, message: string, type: 'success' | 'info' | 'warning') => void;
  onBack: () => void;
}

export default function PwaApps({ addLog, showNotice, onBack }: PwaAppsProps) {
  const [installed, setInstalled] = useState<string[]>(['adyen_fraud', 'dhl_printer']);
  const [activeTab, setActiveTab] = useState<'installed' | 'market'>('market');

  const products = [
    { id: 'adyen_fraud', name: 'Adyen 风控探针 (Fraud Sentry)', desc: '利用双重贝叶斯网络瞬间识别克隆卡拒付', price: '免费' },
    { id: 'stripe_gateway', name: 'Stripe 多币种跨境结算器', desc: '支持西欧各地对公信用卡自动结伙', price: '免费' },
    { id: 'base_usdc', name: 'Base Web3 USDC 极速收单网关', desc: '支持免通道费、零摩擦极瞬清分回流', price: '免费' },
    { id: 'dhl_printer', name: 'DHL 运单自动打印云接线端', desc: '打通 WMS 后一键将实盘物流面单打印出库', price: '免费' }
  ];

  const handleInstall = (id: string, name: string) => {
    setInstalled([...installed, id]);
    addLog('SaaS App Core', '安装应用插件扩展', `成功安装并初始化 merchant_plugin: "${id}" 动态配置`, 'success');
    showNotice(
      '应用安装成功',
      `✓ 扩展「${name}」已成功配置、授权并热挂载到您的多租户企业后台！`,
      'success'
    );
  };

  const handleUninstall = (id: string, name: string) => {
    setInstalled(installed.filter(x => x !== id));
    addLog('SaaS App Core', '卸载应用插件扩展', `停用并解绑 merchant_plugin: "${id}" 相关安全沙架`, 'warning');
    showNotice(
      '应用卸载成功',
      `✓ 扩展「${name}」已停止挂载并安全解绑权限。`,
      'warning'
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
          <h2 className="text-sm font-bold text-slate-800">扩展应用生态市场</h2>
          <p className="text-[10px] text-slate-400">授权并集成第三方专业清结算与物流辅助系统</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-white px-4 py-1.5 border-b border-slate-100 shrink-0 select-none">
        <button
          onClick={() => setActiveTab('market')}
          className={`flex-1 text-center py-1.5 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activeTab === 'market' ? 'border-[#07C2E3] text-[#07C2E3]' : 'border-transparent text-slate-400'
          }`}
        >
          全部扩展应用
        </button>
        <button
          onClick={() => setActiveTab('installed')}
          className={`flex-1 text-center py-1.5 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activeTab === 'installed' ? 'border-[#07C2E3] text-[#07C2E3]' : 'border-transparent text-slate-400'
          }`}
        >
          已安装应用 ({installed.length})
        </button>
      </div>

      {/* Main Grid Scroll list */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {products
          .filter(p => (activeTab === 'installed' ? installed.includes(p.id) : true))
          .map((app) => {
            const isAppInstalled = installed.includes(app.id);
            return (
              <div key={app.id} className="bg-white border border-slate-100 p-3.5 rounded-xl text-left space-y-2.5 shadow-xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#07C2E3]/10 text-[#07C2E3] border border-[#07C2E3]/15 flex items-center justify-center font-mono font-bold">
                      <Box className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-none">{app.name}</h4>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5 block">
                        订阅: {app.price}
                      </span>
                    </div>
                  </div>

                  {isAppInstalled ? (
                    <span className="bg-emerald-50 text-emerald-500 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5 shrink-0">
                      <Check className="w-2.5 h-2.5" /> 已激活
                    </span>
                  ) : null}
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">{app.desc}</p>

                <div className="flex justify-end pt-1.5 border-t border-slate-50">
                  {isAppInstalled ? (
                    <button
                      onClick={() => handleUninstall(app.id, app.name)}
                      className="px-2.5 py-1 text-rose-500 hover:bg-rose-50 text-[10px] font-black uppercase rounded-md transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>卸载注销</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleInstall(app.id, app.name)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black uppercase rounded-md transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-[#07C2E3]" />
                      <span>授权一键安装</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
