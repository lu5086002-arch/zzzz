import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Cpu, 
  Globe, 
  Lock, 
  FileText, 
  Activity, 
  Award, 
  Send, 
  Plus, 
  Check, 
  Copy, 
  Layers, 
  Settings, 
  TrendingUp, 
  RefreshCw, 
  ArrowRight, 
  BookOpen, 
  Download, 
  Key, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

interface DevApp {
  id: string;
  name: string;
  description: string;
  category: string;
  clientId: string;
  clientSecret: string;
  webhookUrl: string;
  scopes: string[];
  environment: string;
  status: string;
  published: boolean;
  createdAt: string;
  subscribedWebhooks?: string[];
}

interface DevLog {
  id: string;
  timestamp: string;
  type: string;
  endpoint: string;
  method: string;
  statusCode: number;
  details: string;
}

interface DeveloperCenterProps {
  onAddLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
}

export default function DeveloperCenter({ onAddLog }: DeveloperCenterProps) {
  const [devApps, setDevApps] = useState<DevApp[]>([]);
  const [logs, setLogs] = useState<DevLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tabs
  const [activeTab, setActiveTab ] = useState<'apps' | 'docs' | 'webhooks' | 'logs'>('apps');
  
  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [appName, setAppName] = useState('');
  const [appDesc, setAppDesc] = useState('');
  const [appCat, setAppCat] = useState('Agent');
  const [appWebhook, setAppWebhook] = useState('https://partner-server.com/ecos-hook');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['products:read', 'orders:read']);
  
  // Focus app state
  const [selectedApp, setSelectedApp] = useState<DevApp | null>(null);
  const [webhookUrlTest, setWebhookUrlTest] = useState('');
  const [webhookTestEvent, setWebhookTestEvent] = useState('order.paid');
  const [webhookSuccess, setWebhookSuccess] = useState(false);

  // Environment Toggler
  const [envMode, setEnvMode] = useState<'sandbox' | 'production'>('sandbox');

  // Copy helpers
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const triggerCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const loadDeveloperData = async () => {
    setLoading(true);
    try {
      const appsRes = await fetch('/api/developer/app/list');
      const appsData = await appsRes.json();
      if (appsData.success) {
        setDevApps(appsData.list || []);
      }

      const logsRes = await fetch('/api/developer/logs');
      const logsData = await logsRes.json();
      if (logsData.success) {
        setLogs(logsData.list || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeveloperData();
  }, []);

  const handleCreateAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim()) return;

    try {
      const res = await fetch('/api/developer/app/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: appName,
          description: appDesc,
          category: appCat,
          webhookUrl: appWebhook,
          scopes: selectedScopes
        })
      });
      const data = await res.json();
      if (data.success) {
        onAddLog('Developer Portal', 'App Created', `Custom developer keys compiled for App: ${appName}`, 'success');
        setAppName('');
        setAppDesc('');
        setShowCreateForm(false);
        loadDeveloperData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestWebhook = async (appId: string) => {
    try {
      const res = await fetch('/api/developer/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId,
          eventType: webhookTestEvent,
          webhookUrl: webhookUrlTest
        })
      });
      const data = await res.json();
      if (data.success) {
        setWebhookSuccess(true);
        onAddLog('Developer Portal', 'Webhook Tested', `Dispatched standard test payload for event '${webhookTestEvent}' to ${webhookUrlTest}`, 'tool');
        setTimeout(() => setWebhookSuccess(false), 3000);
        loadDeveloperData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishApp = async (app: DevApp) => {
    const priceText = prompt("请输入您拟定发布的商业订阅资费 (例如: $19/mo 或 Free):", "$19/mo");
    if (priceText === null) return; // cancelled
    
    try {
      const res = await fetch('/api/developer/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: app.id,
          author: "Custom ERP Developer",
          priceText,
          categoryName: app.category
        })
      });
      const data = await res.json();
      if (data.success) {
        onAddLog('Developer Portal', 'App Published', `Published app "${app.name}" to public market at rate: ${priceText}`, 'success');
        alert(`🎉 应用「${app.name}」已成功通过沙箱审核， hot-deploy（热编译）部署并公开上架到 ECOS 智能应用中心市场！`);
        loadDeveloperData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleScope = (scope: string) => {
    if (selectedScopes.includes(scope)) {
      setSelectedScopes(selectedScopes.filter(s => s !== scope));
    } else {
      setSelectedScopes([...selectedScopes, scope]);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Dev Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12">
          <Terminal className="w-96 h-96 text-cyan-400" />
        </div>
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-indigo-500/20 text-[#07C2E3] font-black uppercase px-2.5 py-1 rounded border border-indigo-500/30">
              ⚙️ 开发者开放平台
            </span>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
              v1.5-openAPI
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight font-display text-white">
            ECOS SaaS 开放平台 &amp; 开发者中心
          </h2>
          <p className="text-zinc-300 text-xs leading-relaxed max-w-2xl font-normal">
            创建符合 OAuth 2.0 及 JWT 签名标准的多租户集成。支持编写微服务代码、注册订阅 Webhook 事件模型，并可将您专属的 AI 插件一键打包发布供广大商家批量订阅。
          </p>

          <div className="flex flex-wrap justify-between items-center gap-3 pt-3">
            {/* Environment Toggle */}
            <div className="flex items-center bg-slate-850 p-1 rounded-xl border border-slate-700/60 text-xs select-none">
              <button
                onClick={() => setEnvMode('sandbox')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${envMode === 'sandbox' ? 'bg-[#07C2E3] text-black font-black' : 'text-slate-400'}`}
              >
                🧪 沙箱环境 (Sandbox)
              </button>
              <button
                onClick={() => setEnvMode('production')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${envMode === 'production' ? 'bg-amber-500 text-black font-black' : 'text-slate-400'}`}
              >
                🚀 生产环境 (Production)
              </button>
            </div>

            {/* Menu Tabs */}
            <div className="flex bg-slate-850 p-1.5 rounded-xl border border-slate-705 text-xs">
              <button
                onClick={() => setActiveTab('apps')}
                className={`px-3.5 py-1 rounded-lg transition-all cursor-pointer font-bold ${activeTab === 'apps' ? 'bg-[#07C2E3] text-slate-950 font-black' : 'text-zinc-400'}`}
              >
                应用与凭据
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                className={`px-3.5 py-1 rounded-lg transition-all cursor-pointer font-bold ${activeTab === 'docs' ? 'bg-[#07C2E3] text-slate-950 font-black' : 'text-zinc-400'}`}
              >
                接口手册
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-3.5 py-1 rounded-lg transition-all cursor-pointer font-bold ${activeTab === 'logs' ? 'bg-[#07C2E3] text-slate-950 font-black' : 'text-zinc-400'}`}
              >
                监控日志 ({logs.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-slate-300 border-t-indigo-600 animate-spin"></div>
          <span className="text-xs text-slate-500 font-mono">Accessing ECOS micro-kernel APIs...</span>
        </div>
      ) : activeTab === 'apps' ? (
        <div className="space-y-6">
          {/* List Dev Apps Header */}
          <div className="flex justify-between items-center bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">自研集成与开放接口</h3>
              <p className="text-xs text-slate-400 mt-0.5">多租户隔离的安全 REST API Client 证书，可挂载实时 Webhook 回调监听器。</p>
            </div>
            
            <button
              onClick={() => { setShowCreateForm(true); setSelectedApp(null); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> 新建自研应用
            </button>
          </div>

          {showCreateForm && (
            <form onSubmit={handleCreateAppSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h4 className="font-extrabold text-slate-800 text-sm">创建全新租户开放应用</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-500 font-bold">新应用名称</label>
                  <input
                    type="text"
                    placeholder="例如: Smart Supply Optimizer"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-500 font-bold">商业分类</label>
                  <select
                    value={appCat}
                    onChange={(e) => setAppCat(e.target.value)}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Agent">🤖 AI 员工智能智体 (Agent)</option>
                    <option value="Workflow">🔄 流程决策与自动化卡包 (Workflow)</option>
                    <option value="Plugin">🔌 数据打通插件 (Plugin)</option>
                    <option value="Knowledge Pack">📚 专业知识库包 (Knowledge Pack)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 font-bold">应用简单描述</label>
                <textarea
                  placeholder="简单描述本应用能发挥何种财务对账、物流运控、商品自动分类功效..."
                  value={appDesc}
                  onChange={(e) => setAppDesc(e.target.value)}
                  rows={2}
                  className="border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder:text-zinc-400"
                  required
                ></textarea>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 font-bold">Sandbox Webhook 接收地址</label>
                <input
                  type="url"
                  placeholder="https://your-server.com/ecos-hook"
                  value={appWebhook}
                  onChange={(e) => setAppWebhook(e.target.value)}
                  className="border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>

              {/* Scopes choice */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-bold block">申请 API 授权范围 (Permission Scopes)</label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                  {[
                    { scope: 'products:read', desc: '商品分类及款式读取' },
                    { scope: 'products:write', desc: '商品规格/库存实盘更改' },
                    { scope: 'orders:read', desc: '订单流财务数调阅' },
                    { scope: 'orders:write', desc: '整单货控及快递发货单打印' },
                    { scope: 'customers:read', desc: '客户细分及画像流查询' },
                    { scope: 'marketing:write', desc: '代金优惠券发布催付' },
                  ].map((s) => (
                    <div
                      key={s.scope}
                      onClick={() => toggleScope(s.scope)}
                      className={`border p-2.5 rounded-lg text-xs cursor-pointer select-none transition-all flex items-center justify-between ${selectedScopes.includes(s.scope) ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                    >
                      <div>
                        <span className="font-mono block text-[11px]">{s.scope}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{s.desc}</span>
                      </div>
                      {selectedScopes.includes(s.scope) && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs px-4 py-2 rounded-xl border border-slate-200 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2 rounded-xl cursor-pointer"
                >
                  保存并生成密钥
                </button>
              </div>
            </form>
          )}

          {/* Dev Apps Grid */}
          <div className="grid grid-cols-1 gap-4">
            {devApps.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-16 text-center">
                <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
                <h4 className="font-bold text-slate-700 text-sm">暂无自研开发应用</h4>
                <p className="text-xs text-slate-400 mt-1">点击右上角立即申请注册一个 REST Client 接口，并绑定独立 Webhook 地址开始测试。</p>
              </div>
            ) : (
              devApps.map((a) => (
                <div key={a.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xl text-[#07C2E3] shadow-inner font-mono font-extrabold">
                        {a.name.slice(0, 1)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{a.name}</h4>
                        <p className="text-[10px] text-zinc-400">UUID: {a.id} | Environment: {envMode.toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePublishApp(a)}
                        className={`font-black text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 border ${a.published ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent'}`}
                      >
                        {a.published ? '✓ 已上架商铺' : '🚀 编译并上架到市场'}
                      </button>
                      <button
                        onClick={() => setSelectedApp(selectedApp?.id === a.id ? null : a)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-755 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        {selectedApp?.id === a.id ? '收起配置' : 'Webhook/测试'}
                      </button>
                    </div>
                  </div>

                  {/* Client Secrets Panel */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 p-4 bg-slate-50 border border-slate-200/60 rounded-xl font-mono text-[11px] text-slate-700">
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-400 block font-sans font-bold uppercase">Client ID (API Username)</span>
                      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg py-1 px-2">
                        <span className="truncate max-w-[240px]">{a.clientId}</span>
                        <button 
                          type="button" 
                          onClick={() => triggerCopy(a.clientId, a.id + 'cid')} 
                          className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        >
                          {copiedField === (a.id + 'cid') ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-400 block font-sans font-bold uppercase">Client Secret (HMAC Password)</span>
                      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg py-1 px-2">
                        <span className="truncate max-w-[240px]">{a.clientSecret}</span>
                        <button 
                          type="button" 
                          onClick={() => triggerCopy(a.clientSecret, a.id + 'csec')} 
                          className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        >
                          {copiedField === (a.id + 'csec') ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Webhook Test Panel Expanded */}
                  {selectedApp?.id === a.id && (
                    <div className="border-t border-slate-100 pt-4 space-y-4 animate-slideDown">
                      <div className="bg-slate-950 text-[#07C2E3] rounded-xl p-4 font-mono text-[11px] space-y-2">
                        <div className="text-slate-400 font-sans font-bold">// WEBHOOK EVENT TESTER (HMAC SIGNATURE)</div>
                        <div className="flex flex-col md:flex-row gap-3 pt-2">
                          <div className="flex-1">
                            <span className="text-slate-500 block text-[9px] font-sans pb-1 font-bold">监听路由测试目标 URL</span>
                            <input
                              type="url"
                              value={webhookUrlTest || a.webhookUrl}
                              onChange={(e) => setWebhookUrlTest(e.target.value)}
                              placeholder="https://your-domain.com/webhooks"
                              className="w-full bg-[#161719] border border-slate-800 rounded p-1.5 text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px] font-sans pb-1 font-bold">仿真触发事件名</span>
                            <select
                              value={webhookTestEvent}
                              onChange={(e) => setWebhookTestEvent(e.target.value)}
                              className="w-full bg-[#161719] border border-slate-800 rounded p-1.5 text-white focus:outline-none"
                            >
                              <option value="order.paid">🛒 order.paid (客户已全额支付)</option>
                              <option value="product.created">📦 product.created (新变体SKU创建)</option>
                              <option value="customer.registered">👥 customer.registered (新零售会员注册)</option>
                              <option value="inventory.low">🔋 inventory.low (库存低水位预警)</option>
                            </select>
                          </div>
                        </div>

                        {webhookSuccess && (
                          <div className="bg-emerald-900/40 text-emerald-400 border border-emerald-800/60 p-2 rounded text-xs select-none">
                            ✓ 成功签名分发! Status 200 OK. Webhost 回调处理耗时 124ms.
                          </div>
                        )}

                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => handleTestWebhook(a.id)}
                            className="bg-[#07C2E3] hover:bg-cyan-500 text-black font-extrabold px-3 py-1.5 rounded text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Send className="w-3 h-3" /> 分发 Webhook 与测试载荷
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ) : activeTab === 'docs' ? (
        /* INTERACTIVE DEVELOPER DOCS */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" /> ECOS REST API 开放集成参考
            </h3>
            <p className="text-xs text-slate-400">本沙箱及生产链路遵从国际标准 REST 范式，所有修改请求均需附带 Client API 安全标头。</p>
          </div>

          <div className="space-y-4 select-none">
            {/* Sec 1: Auth headers */}
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <div className="bg-slate-50 p-3 flex justify-between items-center border-b border-slate-100">
                <span className="text-xs font-black text-slate-800 font-mono">标头认证规范 (Authentication Headers)</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">HMAC Signature</span>
              </div>
              <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-[11px] space-y-1">
                <div># API 请求标头携带 JWT 签名或 Client Secret 进行校验</div>
                <div>Authorization: Bearer &lt;YOUR_API_JWT_TOKEN&gt;</div>
                <div>X-ECOS-Client-ID: client_id_ecos_39f21b88</div>
                <div>X-ECOS-HMAC-SHA256: 4f8821bc39d88e0192a9f345db5a1e2bf75317ad998127</div>
              </div>
            </div>

            {/* Sec 2: Endpoints list */}
            <div className="space-y-3 pt-2">
              <span className="text-xs text-zinc-400 uppercase font-black tracking-wide block">标准 API 资源网关</span>
              
              <div className="space-y-2">
                {[
                  { method: 'GET', path: '/api/v1/products', desc: '检索商户商品规格、变体价格、WMS 备料信息' },
                  { method: 'POST', path: '/api/v1/products', desc: '向 ERP 写入/创建并上架新款商品资料' },
                  { method: 'GET', path: '/api/v1/orders', desc: '查询最近成交或正处于待发货阻滞状态的订单流' },
                  { method: 'POST', path: '/api/v1/orders/fulfill', desc: '对订单进行发货，向 Adyen 或 DHL 发起分拣配送指令' },
                ].map((ep) => (
                  <div key={ep.path} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-3 justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded font-mono ${ep.method === 'GET' ? 'bg-emerald-50 text-emerald-800' : 'bg-indigo-50 text-indigo-800'}`}>
                          {ep.method}
                        </span>
                        <code className="text-[11px] font-mono font-bold text-slate-800">{ep.path}</code>
                      </div>
                      <p className="text-xs text-slate-600 font-normal">{ep.desc}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">application/json</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sec 3: SDK downloads */}
            <div className="bg-indigo-50/50 border border-indigo-100/60 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <span className="font-bold text-slate-800 text-xs block">ECOS 多语言 SDK 下载</span>
                <p className="text-[11px] text-slate-500">一键下载开箱即用的多语言封装以加快向 AWS, ERP 端部署管道。</p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => alert('TS/JS SDK (.tgz) 已经生成，即将下载。')}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Node.js SDK
                </button>
                <button 
                  onClick={() => alert('Python SDK (.whl) 已经打包，即将下载。')}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-755 font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Python SDK
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MONITORING LOGS & TELEMETRY */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-500 animate-pulse" /> REST &amp; Webhook API 日志审计中心
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">实时接收并记录来自于三方网关 REST 触发或 Webhook 分发对账的底层日志流。</p>
            </div>
            
            <button
              onClick={loadDeveloperData}
              className="bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg p-2 transition-colors cursor-pointer"
              title="刷新审计日志"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-sans text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-widest text-[9px] border-b border-slate-100">
                  <th className="py-2.5 px-3">状态码</th>
                  <th className="py-2.5 px-2">类型</th>
                  <th className="py-2.5 px-2">请求方法</th>
                  <th className="py-2.5 px-2">API 路由/目标 URL</th>
                  <th className="py-2.5 px-2">操作明细</th>
                  <th className="py-2.5 px-3">请求时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded font-bold ${log.statusCode < 300 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {log.statusCode}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-sans text-[11px] font-bold text-slate-800">{log.type}</td>
                    <td className="py-3 px-2">
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                        {log.method}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-600 truncate max-w-[160px] " title={log.endpoint}>{log.endpoint}</td>
                    <td className="py-3 px-2 text-xs font-sans font-normal text-slate-500 max-w-[240px] truncate" title={log.details}>{log.details}</td>
                    <td className="py-3 px-3 text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
