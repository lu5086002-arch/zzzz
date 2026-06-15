import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Star, 
  ShieldAlert, 
  ChevronRight, 
  Settings2, 
  Download, 
  ArrowUpCircle, 
  Cpu, 
  Terminal, 
  ExternalLink 
} from 'lucide-react';

interface AppItem {
  id: string;
  name: string;
  developer: string;
  icon: string;
  price: string;
  rating: number;
  category: string;
  description: string;
  installed: boolean;
  version?: string;
  reviewsList?: { id: string; username: string; rating: number; comment: string; createdAt: string; }[];
}

interface AppMarketProps {
  onAddLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
}

export default function AppMarket({ onAddLog }: AppMarketProps) {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab ] = useState<'explore' | 'installed' | 'reviews_log'>('explore');
  
  // Modal states
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<AppItem | null>(null);
  const [showLicenseModal, setShowLicenseModal] = useState<AppItem | null>(null);
  const [licenseInfo, setLicenseInfo] = useState<any>(null);

  // Review Form States
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');
  const [reviewName, setReviewName] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filter Categories
  const categories = ['All', 'Agent', 'Workflow', 'Plugin', 'Knowledge Pack'];

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/apps');
      const data = await res.json();
      if (data.success) {
        setApps(data.list || []);
      }
    } catch (err) {
      console.error("Failed to load marketplace apps:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleInstallApp = async (appId: string) => {
    try {
      onAddLog('App Market', 'Initiating Installation Auth', `Requesting grant access for App: ${appId}`, 'info');
      const res = await fetch('/api/apps/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId })
      });
      const data = await res.json();
      if (data.success) {
        onAddLog('App Market', 'App Installed', `Installed: ${data.app.name}`, 'success');
        fetchApps();
        setShowAuthModal(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUninstallApp = async (appId: string) => {
    if (!confirm('Are you sure you want to uninstall this application? This will revoke all API keys.')) return;
    try {
      const res = await fetch('/api/apps/uninstall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId })
      });
      const data = await res.json();
      if (data.success) {
        onAddLog('App Market', 'App Uninstalled', `Uninstalled: ${data.app.name}`, 'warning');
        fetchApps();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpgradeApp = async (appId: string) => {
    try {
      const res = await fetch('/api/apps/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId })
      });
      const data = await res.json();
      if (data.success) {
        onAddLog('App Market', 'App Upgraded', `Upgraded ${data.app.name} to standard professional track`, 'success');
        fetchApps();
        alert('应用成功升级为最新企业版 v2.0.0-PRO！');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkLicense = async (appItem: AppItem) => {
    try {
      const res = await fetch(`/api/apps/license?id=${appItem.id}`);
      const data = await res.json();
      if (data.success) {
        setLicenseInfo(data.license);
        setShowLicenseModal(appItem);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      const res = await fetch('/api/apps/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedApp.id,
          rating: reviewRating,
          reviewText: reviewText,
          username: reviewName || "SaaS Merchant Client"
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setReviewText('');
        }, 3000);
        // Update selected modal data in real-time
        setSelectedApp(data.app);
        fetchApps();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter apps matching parameters
  const filteredApps = apps.filter(app => {
    const matchesCategory = activeCategory === 'All' || app.category === activeCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.developer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const installedApps = apps.filter(app => app.installed);

  return (
    <div className="space-y-6 text-left">
      {/* Search Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12">
          <Store className="w-96 h-96 text-cyan-400" />
        </div>
        <div className="relative z-10 max-w-4xl space-y-4">
          <span className="text-xs bg-cyan-500/20 text-[#07C2E3] font-black uppercase px-2.5 py-1 rounded border border-cyan-500/30">
            🧩 统一应用中枢
          </span>
          <h2 className="text-2xl font-black tracking-tight font-display text-white">
            企业级 ECOS 智能化应用市场
          </h2>
          <p className="text-zinc-300 text-xs leading-relaxed max-w-2xl">
            即时热插拔部署社区全托管 AI 员工、可视化工作流卡包及第三方 Webhook 数据打通插件，一键赋能 SaaS ERP 业务流自动化。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="搜索全市场 AI 代理、折扣触发卡、跨境税算插件..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161719] border border-slate-700/60 rounded-xl py-2 pl-9 pr-4 text-slate-200 text-xs focus:ring-1 focus:ring-[#07C2E3] focus:outline-none placeholder:text-zinc-500"
              />
            </div>
            <div className="flex bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/40">
              <button
                onClick={() => { setActiveTab('explore'); setActiveCategory('All'); }}
                className={`px-3 py-1 text-xs rounded-lg transition-all cursor-pointer font-bold ${activeTab === 'explore' ? 'bg-[#07C2E3] text-slate-950 font-black' : 'text-zinc-400'}`}
              >
                全部应用
              </button>
              <button
                onClick={() => setActiveTab('installed')}
                className={`px-3 py-1 text-xs rounded-lg transition-all cursor-pointer font-bold ${activeTab === 'installed' ? 'bg-[#07C2E3] text-slate-950 font-black' : 'text-zinc-400'}`}
              >
                已安装应用 ({installedApps.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-slate-300 border-t-indigo-600 animate-spin"></div>
          <span className="text-xs text-slate-500 font-mono">Loading marketplace list...</span>
        </div>
      ) : activeTab === 'explore' ? (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Side categories */}
          <div className="w-full md:w-48 shrink-0 space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-extrabold px-2 select-none">应用分类</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer flex items-center justify-between ${activeCategory === cat ? 'bg-slate-100 text-slate-900 border-l-4 border-indigo-600 pl-2' : 'text-zinc-500 hover:bg-slate-50'}`}
              >
                <span>{cat === 'All' ? '全部应用' : cat}</span>
                <ChevronRight className="w-3 h-3 opacity-60" />
              </button>
            ))}
          </div>

          {/* Grid of Apps */}
          <div className="flex-1">
            {filteredApps.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 text-sm">暂无匹配分类的应用</h4>
                <p className="text-xs text-slate-400 mt-1">请尝试更换检索关键字。或者在开发者中心自我创建。</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filteredApps.map((item) => {
                  const iconEmoji = item.icon === 'Sparkles' ? '✨' : (item.icon === 'Shuffle' ? '🔄' : (item.icon === 'Scale' ? '⚖️' : (item.icon === 'BookOpen' ? '📚' : '🔌')));
                  return (
                    <div key={item.id} className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl shadow-inner shrink-0">
                              {iconEmoji}
                            </div>
                            <div>
                              <h4 
                                onClick={() => setSelectedApp(item)} 
                                className="font-bold text-slate-800 text-sm hover:text-indigo-600 transition-colors cursor-pointer select-none leading-snug"
                              >
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-zinc-400">by {item.developer}</span>
                                <span className="w-1 h-1 bg-zinc-350 rounded-full"></span>
                                <span className="text-[10px] text-[#FFA800] flex items-center gap-0.5 font-bold">
                                  ★ {item.rating || 4.8}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold px-2.5 py-0.5 rounded-full uppercase scale-90">
                            {item.category}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 uppercase font-black tracking-wide">ECOS 标准资费</span>
                          <span className="text-sm font-black text-slate-900 font-mono">{item.price}</span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedApp(item)}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-extrabold px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs transition-colors cursor-pointer"
                          >
                            详情/评价
                          </button>
                          
                          {item.installed ? (
                            <div className="flex gap-1">
                              <span className="bg-emerald-50 text-emerald-800 font-bold border border-emerald-100 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> 已安装
                              </span>
                              <button
                                onClick={() => checkLicense(item)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                title="查看授权License"
                              >
                                <Settings2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowAuthModal(item)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                            >
                              立即安装
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* INSTALLED APPS PANEL */
        <div className="space-y-4">
          {installedApps.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-16 text-center max-w-xl mx-auto">
              <Store className="w-16 h-16 text-zinc-400 mx-auto mb-3 opacity-60" />
              <h4 className="font-bold text-slate-700 text-sm">当前暂无任何已安装应用</h4>
              <p className="text-xs text-slate-400 mt-1">前往探索引领市场，热部署 AI 员工、税务结算工作流或三方插件来加速店铺运转。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {installedApps.map((item) => {
                const iconEmoji = item.icon === 'Sparkles' ? '✨' : (item.icon === 'Shuffle' ? '🔄' : (item.icon === 'Scale' ? '⚖️' : (item.icon === 'BookOpen' ? '📚' : '🔌')));
                return (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-xl shadow-inner shrink-0">
                            {iconEmoji}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm leading-snug">{item.name}</h4>
                            <p className="text-[10px] text-zinc-400">Developer: {item.developer} | Active Track</p>
                          </div>
                        </div>
                        <span className="text-[9px] bg-emerald-50 border border-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold uppercase">
                          {item.version || 'v1.0.0-PRO'}
                        </span>
                      </div>
                      
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500">API 授权范围</span>
                          <span className="text-slate-800 font-mono font-bold">读取商品 | 写入订单</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500">付费状态</span>
                          <span className="text-slate-800 font-bold">{item.price} ({item.price === 'Free' ? '永久' : '按月'})</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => checkLicense(item)}
                        className="bg-white text-slate-600 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Settings2 className="w-3.5 h-3.5" /> 证书与授权
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpgradeApp(item.id)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 font-extrabold px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1 border border-indigo-100"
                        >
                          <ArrowUpCircle className="w-3.5 h-3.5" /> 升级应用
                        </button>
                        <button
                          onClick={() => handleUninstallApp(item.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-extrabold px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1 border border-red-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> 卸载销毁
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* APP DETAILS & REVIEW MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="p-6 border-b border-zinc-150 flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <span className="text-3xl">
                  {selectedApp.icon === 'Sparkles' ? '✨' : (selectedApp.icon === 'Shuffle' ? '🔄' : (selectedApp.icon === 'Scale' ? '⚖️' : (selectedApp.icon === 'BookOpen' ? '📚' : '🔌')))}
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base leading-tight">{selectedApp.name}</h3>
                  <p className="text-zinc-400 text-xs mt-0.5">by {selectedApp.developer} | Category: {selectedApp.category}</p>
                </div>
              </div>
              <button 
                onClick={() => { setSelectedApp(null); setSubmitSuccess(false); }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Info Detail Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">应用详情描述</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {selectedApp.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-center">
                    <span className="text-[9px] text-zinc-400 block">标准单价</span>
                    <span className="text-xs font-black text-slate-800">{selectedApp.price}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-center">
                    <span className="text-[9px] text-zinc-400 block">评分推荐度</span>
                    <span className="text-xs font-black text-[#FFA800]">★ {selectedApp.rating || 4.8} / 5.0</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-center col-span-2 md:col-span-1">
                    <span className="text-[9px] text-zinc-400 block">状态轨道</span>
                    <span className={`text-[10px] font-bold ${selectedApp.installed ? 'text-emerald-600' : 'text-amber-500'}`}>
                      {selectedApp.installed ? '🟢 Active Installed' : '🟡 Uninstalled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add Ratings / Customer Reviews Section */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider flex items-center justify-between">
                  <span>用户评价 &amp; 问卷 ({selectedApp.reviewsList?.length || 1})</span>
                  <span className="text-slate-500 text-[10px] lowercase font-normal">本系统采用多租户去隔离审计</span>
                </h4>

                {/* Submit New Review Form */}
                <form onSubmit={submitReview} className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">撰写您的系统真实使用体验</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-500 font-bold">您的姓名/租户名称</label>
                      <input
                        type="text"
                        placeholder="例如: 柏林智慧电器百货"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-500 font-bold">体验星级评分</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(parseInt(e.target.value))}
                        className="bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="5">★★★★★ 五星好评</option>
                        <option value="4">★★★★☆ 四星还行</option>
                        <option value="3">★★★☆☆ 三星一般</option>
                        <option value="2">★★☆☆☆ 二星较差</option>
                        <option value="1">★☆☆☆☆ 一星很烂</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-bold">评论内容</label>
                    <textarea
                      placeholder="写下对该智能化 AI 员工、折扣自动化卡包的意见，系统将汇成大数据看板反馈给开发者..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={2}
                      className="bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder:text-zinc-400"
                      required
                    ></textarea>
                  </div>

                  {submitSuccess && (
                     <div className="text-xs bg-emerald-50 text-emerald-800 p-2 rounded-lg border border-emerald-100 font-bold">
                       ✓ 评价成功发布！评分已更新。
                     </div>
                  )}

                  <div className="flex justify-end p-0.5">
                    <button
                      type="submit"
                      className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs px-4 py-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      发表评价
                    </button>
                  </div>
                </form>

                {/* List of Reviews */}
                <div className="space-y-3">
                  {(selectedApp.reviewsList || [
                    { id: 'rev_preset', username: '米兰先锋潮流配货 (Admin)', rating: 5, comment: '一键热部署成功运转！AI 员工抓词和写文案速度极强，订单流拦截欺诈精准，Adyen 手续费得到了明显的滑阻优化。超赞！', createdAt: new Date(Date.now() - 86400000).toISOString() }
                  ]).map((rev: any) => (
                    <div key={rev.id} className="border-b border-slate-100 pb-3 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700">{rev.username}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-[11px] text-[#FFA800] font-bold">
                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                      </div>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUTHORIZE & CONSENT MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-extrabold text-slate-800 text-sm">SaaS 安全与 API 授权验证</h3>
              <button onClick={() => setShowAuthModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-slate-105 flex items-center justify-center text-2xl mx-auto">
                  🔒
                </div>
                <h4 className="font-bold text-slate-800 text-xs">授权 「{showAuthModal.name}」 接入您的多租户店铺？</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed px-4">
                  该应用需要向 ECOS API 网关索取以下底层权限以提供自动化计算服务：
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 space-y-3">
                <div className="flex items-start gap-2 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">同步读取商品与变体数据</span>
                    <span className="text-[10px] text-slate-500">允许该应用读取您的 SKU 档案以生成文案、监测断货。</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">实时监听并读取订单状态</span>
                    <span className="text-[10px] text-slate-500">允许应用通过 Webhook 接收付款完成、退款申请通知。</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">优惠码写入与营销决策自动化</span>
                    <span className="text-[10px] text-slate-500">允许自动调用营销 API 以发布活动满减、进行催付决策。</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setShowAuthModal(null)}
                  className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-2 rounded-xl text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  拒绝授权
                </button>
                <button
                  onClick={() => handleInstallApp(showAuthModal.id)}
                  className="flex-1 bg-indigo-600 text-white font-extrabold py-2 rounded-xl text-xs hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  同意授权并安装
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LICENSE DETAILS MODAL */}
      {showLicenseModal && licenseInfo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-extrabold text-slate-800 text-sm">应用授权 License 与 API 证书</h3>
              <button onClick={() => setShowLicenseModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-slate-950 text-[#07C2E3] rounded-xl p-4 font-mono text-xs space-y-1.5 relative overflow-hidden">
                <div className="absolute right-2 top-2 text-[8px] bg-slate-800 px-2 py-0.5 text-slate-400 rounded-md font-bold uppercase uppercase tracking-wider">ECOS API KEY</div>
                <div>// LICENSE ENTITY</div>
                <div className="text-white">STATUS: {licenseInfo.status.toUpperCase()}</div>
                <div>LICENSE_KEY: {licenseInfo.key}</div>
                <div>PLAN_TIER: {licenseInfo.tier}</div>
                <div>EXPIRY_DATE: {licenseInfo.expiry}</div>
                <div>BILLING_MODEL: {licenseInfo.pricingModel}</div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                本 License 授权是由 SaaS ERP 微内核在应用热拔插安装时物理签名的，包含符合 OAuth2 标准的 JWT JWT 签名认证密钥，用以执行后台 WebSocket 数据隔离。
              </p>

              <button
                onClick={() => setShowLicenseModal(null)}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-extrabold py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                关闭证书页面
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
