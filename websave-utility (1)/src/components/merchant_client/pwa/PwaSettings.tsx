import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  ToggleLeft,
  ToggleRight,
  Store,
  CreditCard,
  ShoppingCart,
  Truck,
  Percent,
  MapPin,
  Users,
  Globe,
  FileText,
  Lock,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  ChevronRight,
  Languages,
  Moon,
  Sun
} from 'lucide-react';

interface PwaSettingsProps {
  companyName: string;
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  showNotice: (title: string, message: string, type: 'success' | 'info' | 'warning') => void;
  onBack: () => void;
  activeSubTab?: 'general' | 'payments' | 'checkout' | 'shipping' | 'taxes' | 'locations' | 'users' | 'domains' | 'policies' | 'privacy' | 'languages' | 'theme' | null;
  setActiveSubTab?: (tab: 'general' | 'payments' | 'checkout' | 'shipping' | 'taxes' | 'locations' | 'users' | 'domains' | 'policies' | 'privacy' | 'languages' | 'theme' | null) => void;
}

export default function PwaSettings({ companyName, addLog, showNotice, onBack, activeSubTab: controlledActiveSubTab, setActiveSubTab: controlledSetActiveSubTab }: PwaSettingsProps) {
  // Navigation: null means settings menu index, string means specific sub-setting screen
  const [internalActiveSubTab, setInternalActiveSubTab] = useState<
    'general' | 'payments' | 'checkout' | 'shipping' | 'taxes' | 'locations' | 'users' | 'domains' | 'policies' | 'privacy' | 'languages' | 'theme' | null
  >(null);

  const activeSubTab = controlledActiveSubTab !== undefined ? controlledActiveSubTab : internalActiveSubTab;
  const setActiveSubTab = controlledSetActiveSubTab !== undefined ? controlledSetActiveSubTab : setInternalActiveSubTab;

  // States
  // 1. General
  const [storeName, setStoreName] = useState(companyName);
  const [contactEmail, setContactEmail] = useState('contact@modastudio.fr');
  const [phoneNumber, setPhoneNumber] = useState('+33 1 42 76 54 32');
  const [storeAddress, setStoreAddress] = useState('42 Rue de l\'Université, Paris, France');
  const [legalName, setLegalName] = useState('MODA STUDIO SAS');
  const [currency, setCurrency] = useState('USD');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [country, setCountry] = useState('France');

  // 2. Payments
  const [activeProviders, setActiveProviders] = useState<string[]>(['shopify_payments', 'stripe']);
  const [cardTypes, setCardTypes] = useState<string[]>(['visa', 'mastercard', 'apple_pay']);

  // 3. Checkout
  const [allowGuest, setAllowGuest] = useState(true);
  const [requireAccounts, setRequireAccounts] = useState(false);
  const [fulfillmentSms, setFulfillmentSms] = useState(true);
  const [checkoutBanner, setCheckoutBanner] = useState('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80');

  // 4. Shipping
  const [shippingZones, setShippingZones] = useState([
    { id: '1', name: '欧盟境内标准配送 (EU Domestic)', rate: 4.99 },
    { id: '2', name: '北美跨境极速直邮 (North America)', rate: 19.99 }
  ]);
  const [localPickup, setLocalPickup] = useState(true);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneRate, setNewZoneRate] = useState('');

  // 5. Taxes & Duties
  const [autoTax, setAutoTax] = useState(true);
  const [vatRate, setVatRate] = useState('20');
  const [customDuties, setCustomDuties] = useState(true);

  // 6. Locations
  const [locations, setLocations] = useState([
    { id: 'loc-01', name: '巴黎第一分拨总仓 (Paris Central)', address: 'CDG Zone C, Paris, FR', isPrimary: true },
    { id: 'loc-02', name: '法兰克福备用仓库 (Munich Sub-node)', address: 'Frankfurt-am-Main, Germany', isPrimary: false }
  ]);
  const [newLocName, setNewLocName] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');

  // 7. Users & Permissions
  const [staff, setStaff] = useState([
    { id: 'acc-01', name: 'Sofia Dupont', email: 'sofia@modastudio.fr', role: '视觉设计主管' },
    { id: 'acc-02', name: 'Oliver Wagner', email: 'oliver.w@tech-corp.de', role: '采购总监' },
    { id: 'acc-03', name: 'Claire Laurent', email: 'claire@laurent-design.fr', role: '店铺管理员' }
  ]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('普通员工');

  // 8. Domains
  const [domains, setDomains] = useState([
    { name: 'moda-studio.com', isPrimary: true, status: 'CONNECTED' },
    { name: 'shop.moda-studio.fr', isPrimary: false, status: 'CONNECTED' }
  ]);
  const [domainValue, setDomainValue] = useState('');
  const [pointerConnecting, setPointerConnecting] = useState(false);

  // 9. Policies
  const [policyRefund, setPolicyRefund] = useState('我们提供30天内无条件退换货政策。商品需保持原本包装及吊牌完好。');
  const [policyPrivacy, setPolicyPrivacy] = useState('您的个人敏感隐私数据完全受欧盟 GDPR 法案保护，我们绝不会私自动用分享。');
  const [policyTerms, setPolicyTerms] = useState('凡在使用多租户 AI 商业中枢采购与下单时，即默认同意本服务使用条款细则。');

  // 10. Privacy
  const [gdprEnabled, setGdprEnabled] = useState(true);
  const [cookieBannerText, setCookieBannerText] = useState('为了带给您最佳的使用体验以及完全符合欧盟合规条例，此站点会自动搜寻必要审计参数...');
  const [dataDeletionOpt, setDataDeletionOpt] = useState(true);

  // 11. Languages
  const [primaryLang, setPrimaryLang] = useState('zh_CN');
  const [supportedLangs, setSupportedLangs] = useState<string[]>(['zh_CN', 'en', 'fr']);
  const [autoTranslate, setAutoTranslate] = useState(true);

  // 12. Theme Mode (Dark/Light toggle)
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  // General sub-save mechanics
  const notifySave = (section: string) => {
    addLog('System Configuration', `商铺后台设置维护: ${section}`, '成功保存最新更新内容，数据库状态完美落库', 'success');
    showNotice(
      `${section} 配置已安全应用`,
      '✓ 系统已成功更新多租户数据库并写入各业务网络。',
      'success'
    );
  };

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim() || !newLocAddress.trim()) return;
    const item = {
      id: `loc-${Date.now()}`,
      name: newLocName,
      address: newLocAddress,
      isPrimary: false
    };
    setLocations([...locations, item]);
    setNewLocName('');
    setNewLocAddress('');
    addLog('WMS Node Controller', '注册新增仓配物理接点', `注册：${item.name} 地址：${item.address}`, 'success');
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) return;
    const item = {
      id: `acc-${Date.now()}`,
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole
    };
    setStaff([...staff, item]);
    setNewStaffName('');
    setNewStaffEmail('');
    addLog('IAM Core', '创建并授权新员工席位', `姓名：${item.name} 邮箱：${item.email} 授权：${item.role}`, 'success');
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainValue.trim()) return;
    setPointerConnecting(true);
    setTimeout(() => {
      setDomains([...domains, { name: domainValue.trim().toLowerCase(), isPrimary: false, status: 'CONNECTED' }]);
      setDomainValue('');
      setPointerConnecting(false);
      addLog('DNS Edge Gateway', '成功链接指向多租户自定义域名', `检测 CNAME 解析。验证「${domainValue}」成功定向`, 'success');
      showNotice('自定义域名绑定成功', `✓ 自定义域名 ${domainValue} 已在 Cloudflare 边缘安全组部署生效！`, 'success');
    }, 1500);
  };

  const handleAutofillEUTemplates = () => {
    setPolicyRefund('【官方退款模板】由于跨境清收及增值税VAT流程，MODA STUIDO 提供自签收起14天内的冷却退款机制。退款处理周期大约在3-5个工作日内自动由 Adyen 原路返还至支付源卡。');
    setPolicyPrivacy('【欧盟标准GDPR模板】根据极严欧盟（EU）2016/679《通用数据保护条例》，我们实施点对点 TLS 加密，并遵循“非必要不提取”的纯净运营法案模式。');
    setPolicyTerms('【商用自主使用条款】该多租户系统由 AI Commerce OS 自适应驱动及记录智能审计，所涉全部交易及备货发货条令由用户在自主授权下自主操作承接责任。');
    addLog('Compliance AI', '自动装填标准合规政策模板', '已向数据流灌属于欧盟 (EU) 合规框架要求的官方退退款条例、隐私条例与大区条款模板', 'tool');
    showNotice(
      '政策合规模板已覆盖',
      '✓ 自动为该店面生成并填充了符合欧盟消费者法、GDPR 数据保护要求的法律文案。',
      'success'
    );
  };

  // Main menu settings items
  const menuItems = [
    { id: 'general' as const, label: '常规 (General)', desc: '店铺基础名、联系联系电话及国家设置', icon: Store },
    { id: 'payments' as const, label: '支付 (Payments)', desc: '商户信用卡、Stripe 及 Adyen 结算配置', icon: CreditCard },
    { id: 'checkout' as const, label: '结账 (Checkout)', desc: '游客权限、结算定制项与面单横幅', icon: ShoppingCart },
    { id: 'shipping' as const, label: '配送 (Shipping & Delivery)', desc: '配置本地自提与多区复合费率规则', icon: Truck },
    { id: 'taxes' as const, label: '税费 (Taxes & Duties)', desc: '核准欧盟 VAT 自动代扣评估与海关税率', icon: Percent },
    { id: 'locations' as const, label: '地点 (Locations)', desc: '管理店面用于备货物流的各实盘地理仓库', icon: MapPin },
    { id: 'users' as const, label: '用户与权限 (Users & Roles)', desc: '新增雇员席位、限制角色访问控制权限', icon: Users },
    { id: 'domains' as const, label: '域名 (Domains)', desc: '绑定托管自有域名、重定向配置', icon: Globe },
    { id: 'policies' as const, label: '商店政策 (Policies)', desc: '快速生成退款条例、合规条款文书', icon: FileText },
    { id: 'privacy' as const, label: '客户隐私 (Privacy GDPR)', desc: '控制 Cookie 强弹窗、CCPA 收集偏好', icon: Lock },
    { id: 'languages' as const, label: '多语言 (Languages)', desc: '配置主营语种，激活 AI 智能本地化翻译机', icon: Languages },
    { id: 'theme' as const, label: '黑白双模式 (Theme Mode)', desc: '一键切换亮暗自适应：优雅午夜与智能白昼', icon: Moon }
  ];

  if (!activeSubTab) {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 min-h-full">
        {/* Main Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-3 shrink-0 select-none">
          <button onClick={onBack} className="p-1 rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-left">
            <h2 className="text-sm font-bold text-slate-800">系统运营与合规面板</h2>
            <p className="text-[10px] text-slate-400">进行多维多租户店底要素、支付网关及合规重控</p>
          </div>
        </div>

        {/* Index of Menu List */}
        <div className="flex-1 p-4 space-y-2.5 overflow-y-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id)}
                className="w-full bg-white border border-slate-100 p-3.5 rounded-xl flex items-center justify-between text-left hover:border-slate-200 transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 group-hover:bg-[#07C2E3]/10 group-hover:text-[#07C2E3] flex items-center justify-center transition-colors">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 leading-none">{item.label}</h3>
                    <p className="text-[10px] text-slate-400 mt-1">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-350 transform group-hover:translate-x-0.5 transition-transform" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-full">
      {/* Dynamic Subview Navigation bar */}
      <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-3 shrink-0 justify-between">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => setActiveSubTab(null)} 
            className="p-1 rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-left">
            <h2 className="text-sm font-bold text-slate-800">
              {menuItems.find(m => m.id === activeSubTab)?.label}
            </h2>
            <p className="text-[10px] text-slate-400">配置后台专属安全要素</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">

          {/* 1. GENERAL SETTINGS SHEET */}
          {activeSubTab === 'general' && (
            <div className="space-y-4 text-left">
              <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-3.5">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">店面主名称</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 outline-none text-xs text-slate-700 font-extrabold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">联系电子邮箱</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 outline-none text-xs text-slate-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">客服响应电话</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 outline-none text-xs text-slate-700 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">实体注册详细地址 (公司法登记)</label>
                  <input
                    type="text"
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 outline-none text-xs text-slate-700 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">国家及所属大陆板块设置</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 outline-none text-xs text-slate-700 font-bold cursor-pointer"
                  >
                    <option value="France">法国 (France - Europe)</option>
                    <option value="Germany">德国 (Germany - Europe)</option>
                    <option value="United States">美国 (United States)</option>
                    <option value="India">印度 (India)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">交易核销本币</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 outline-none text-xs text-slate-700 font-bold cursor-pointer"
                    >
                      <option value="EUR">欧元 (EUR - €)</option>
                      <option value="USD">美元 (USD - $)</option>
                      <option value="USDC">链上稳定币 (USDC)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">默认重量基准</label>
                    <select
                      value={weightUnit}
                      onChange={(e) => setWeightUnit(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 outline-none text-xs text-slate-700 font-bold cursor-pointer"
                    >
                      <option value="kg">公斤 (kg)</option>
                      <option value="lb">磅 (lb)</option>
                      <option value="g">克 (g)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => notifySave('常规信息 (General)')}
                className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#07C2E3]/15 animate-fade"
              >
                <Save className="w-4 h-4" />
                <span>保存基础架构变动</span>
              </button>
            </div>
          )}

          {/* 2. PAYMENTS SETTINGS SHEET */}
          {activeSubTab === 'payments' && (
            <div className="space-y-4 text-left">
              <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">激活支付清算提供商</h4>

                {[
                  { id: 'shopify_payments', name: 'Shopify Payments 联盟收单', service: '提供直接多币种结算' },
                  { id: 'stripe', name: 'Stripe 支付网关', service: '专攻西欧与北非多币种对公直连' },
                  { id: 'adyen', name: 'Adyen 欧洲本港大渠道', service: '集成 3D Sec 零延时卡面审计' }
                ].map((item) => {
                  const isActive = activeProviders.includes(item.id);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{item.name}</p>
                        <p className="text-[9px] text-slate-450 mt-0.5">{item.service}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (isActive) {
                            setActiveProviders(activeProviders.filter(x => x !== item.id));
                          } else {
                            setActiveProviders([...activeProviders, item.id]);
                          }
                        }}
                        className="text-[#07C2E3] cursor-pointer"
                      >
                        {isActive ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-200" />}
                      </button>
                    </div>
                  );
                })}

                <div className="pt-2 border-t border-slate-50 space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">允许交易结账使用的卡片卡段</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'visa', label: 'Visa Card' },
                      { id: 'mastercard', label: 'Mastercard' },
                      { id: 'apple_pay', label: 'Apple Pay' },
                      { id: 'google_pay', label: 'Google Pay' },
                      { id: 'carte_bancaire', label: 'Carte Bancaire (FR)' }
                    ].map((card) => {
                      const isSel = cardTypes.includes(card.id);
                      return (
                        <button
                          type="button"
                          key={card.id}
                          onClick={() => {
                            if (isSel) {
                              setCardTypes(cardTypes.filter(c => c !== card.id));
                            } else {
                              setCardTypes([...cardTypes, card.id]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all cursor-pointer ${
                            isSel 
                              ? 'bg-slate-800 text-white border-slate-850'
                              : 'bg-slate-50 text-slate-500 border-slate-100'
                          }`}
                        >
                          {card.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => notifySave('收单与清算 (Payments)')}
                className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#07C2E3]/15"
              >
                <Save className="w-4 h-4" />
                <span>保存收结网口资产配置</span>
              </button>
            </div>
          )}

          {/* 3. CHECKOUT CUSTOMIZATION */}
          {activeSubTab === 'checkout' && (
            <div className="space-y-4 text-left">
              <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">结账决策与通知模型</h4>

                {/* Switch Guest */}
                <div className="flex items-center justify-between">
                  <div className="max-w-[75%]">
                    <span className="text-xs font-bold text-slate-700 block">允许免账号游客直接结账付款</span>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">允许外部客户在免填密码前提下先行发起 Adyen 即时付款结算。</p>
                  </div>
                  <button type="button" onClick={() => setAllowGuest(!allowGuest)} className="text-[#07C2E3] cursor-pointer">
                    {allowGuest ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-200" />}
                  </button>
                </div>

                {/* Switch Account requirements */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="max-w-[75%]">
                    <span className="text-xs font-bold text-slate-700 block">强制注册为店面账户</span>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">只允许登入态或拥有 B2B 法定企业税号认证的高净值分组买家结账。</p>
                  </div>
                  <button type="button" onClick={() => setRequireAccounts(!requireAccounts)} className="text-[#07C2E3] cursor-pointer">
                    {requireAccounts ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-200" />}
                  </button>
                </div>

                {/* Switch SMS/Mail */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="max-w-[75%]">
                    <span className="text-xs font-bold text-slate-700 block">物流面单状态异常强制下发短信通知</span>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">系统与 DHL/Fedex 面包屑连接，出现积压时自动撰写并下发通知信息。</p>
                  </div>
                  <button type="button" onClick={() => setFulfillmentSms(!fulfillmentSms)} className="text-[#07C2E3] cursor-pointer">
                    {fulfillmentSms ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-200" />}
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">结账页面顶部形象 Banner (SVG / JPG Link)</label>
                  <input
                    type="text"
                    value={checkoutBanner}
                    onChange={(e) => setCheckoutBanner(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-105 outline-none text-xs text-slate-600 font-mono"
                  />
                  <div className="mt-2 w-full h-12 rounded-lg relative overflow-hidden bg-slate-200 border border-slate-100">
                    <img src={checkoutBanner} className="w-full h-full object-cover" alt="Checkout Banner preview" />
                    <div className="absolute inset-0 bg-slate-900/35 flex items-center justify-center">
                      <span className="text-[9px] text-white font-extrabold tracking-widest uppercase">实时结算段视觉预览</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => notifySave('结账业务组 (Checkout)')}
                className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#07C2E3]/15"
              >
                <Save className="w-4 h-4" />
                <span>确认修改结结账属性</span>
              </button>
            </div>
          )}

          {/* 4. SHIPPING SECTOR */}
          {activeSubTab === 'shipping' && (
            <div className="space-y-4 text-left animate-fade">
              <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">国内及国际物流运调区域</h4>
                </div>

                <div className="space-y-2">
                  {shippingZones.map((zone) => (
                    <div key={zone.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800 leading-none">{zone.name}</p>
                        <p className="text-[9px] text-slate-405 mt-1.5 font-mono">基准统派运费: ${zone.rate}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShippingZones(shippingZones.filter(z => z.id !== zone.id));
                        }}
                        className="text-rose-500 hover:text-rose-600 cursor-pointer p-1 rounded-lg hover:bg-slate-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Sub-form */}
                <div className="pt-2 border-t border-slate-50 space-y-3">
                  <h5 className="text-[10px] font-bold text-slate-500 tracking-wider">录入最新分拨航线：</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-800">
                    <input
                      type="text"
                      placeholder="例如亚太跨海平邮 (APAC)"
                      value={newZoneName}
                      onChange={(e) => setNewZoneName(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 outline-none"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="标准收费 ($)"
                      value={newZoneRate}
                      onChange={(e) => setNewZoneRate(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newZoneName.trim() || !newZoneRate.trim()) return;
                      setShippingZones([
                        ...shippingZones,
                        { id: Date.now().toString(), name: newZoneName.trim(), rate: parseFloat(newZoneRate) || 0 }
                      ]);
                      setNewZoneName('');
                      setNewZoneRate('');
                    }}
                    className="w-full py-1.5 bg-slate-800 text-white font-bold rounded-lg text-[9px] uppercase tracking-wider cursor-pointer"
                  >
                    录入并入 WMS 计算
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                  <div className="max-w-[75%]">
                    <span className="text-xs font-bold text-slate-700 block">开启区域实体店（Paris Boutique）自提</span>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">允许客户就近在巴黎第六区艺术街区中心直接核单提款出货。</p>
                  </div>
                  <button type="button" onClick={() => setLocalPickup(!localPickup)} className="text-[#07C2E3] cursor-pointer">
                    {localPickup ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-200" />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => notifySave('配送费率与网口 (Shipping)')}
                className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#07C2E3]/15"
              >
                <Save className="w-4 h-4" />
                <span>保存航线价格表</span>
              </button>
            </div>
          )}

          {/* 5. TAXES AND CUSTOM DUTIES */}
          {activeSubTab === 'taxes' && (
            <div className="space-y-4 text-left">
              <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">欧洲与跨境税控审计阀</h4>

                <div className="flex items-center justify-between">
                  <div className="max-w-[75%]">
                    <span className="text-xs font-bold text-slate-700 block">开启一站式 OSS EU VAT 自动评估</span>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">
                      根据买家注册的 IP 地理位置与海关注册号自动向最终结账单追计并扣收 19%-21% 不等的大区增值税。
                    </p>
                  </div>
                  <button type="button" onClick={() => setAutoTax(!autoTax)} className="text-[#07C2E3] cursor-pointer">
                    {autoTax ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-200" />}
                  </button>
                </div>

                {!autoTax && (
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">手动指定统缴 VAT 基准率 (%)</label>
                    <input
                      type="number"
                      value={vatRate}
                      onChange={(e) => setVatRate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 outline-none text-xs text-slate-705 font-mono"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="max-w-[75%]">
                    <span className="text-xs font-bold text-slate-700 block">自动进行国际关税（Customs Duties）预评估</span>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">
                      在买家进行北美或亚太跨境结算时，自动估算海关税，并可在付款阶段选择提前完税（DDP）。
                    </p>
                  </div>
                  <button type="button" onClick={() => setCustomDuties(!customDuties)} className="text-[#07C2E3] cursor-pointer">
                    {customDuties ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-200" />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => notifySave('海关税控 (Taxes & Duties)')}
                className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#07C2E3]/15"
              >
                <Save className="w-4 h-4" />
                <span>保存税率调调校配置</span>
              </button>
            </div>
          )}

          {/* 6. PHYSICAL LOCATIONS */}
          {activeSubTab === 'locations' && (
            <div className="space-y-4 text-left">
              <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">仓储分库与库存存放节点</h4>

                <div className="space-y-2">
                  {locations.map((loc) => (
                    <div key={loc.id} className="p-3 rounded-xl border border-slate-100 bg-slate-55 flex items-center justify-between shadow-xs">
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-extrabold text-slate-800 leading-none">{loc.name}</span>
                          {loc.isPrimary && (
                            <span className="bg-[#07C2E3]/10 text-[#07C2E3] text-[7px] font-extrabold border border-[#07C2E3]/20 px-1 rounded">主派发端</span>
                          )}
                        </div>
                        <p className="text-[9px] text-slate-400 font-semibold mt-1.5">{loc.address}</p>
                      </div>

                      {!loc.isPrimary && (
                        <button
                          type="button"
                          onClick={() => {
                            setLocations(locations.filter(x => x.id !== loc.id));
                            addLog('WMS Node Controller', '注销仓配节点', `注销：${loc.name}`, 'warning');
                          }}
                          className="text-rose-500 hover:text-rose-600 cursor-pointer p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Sub-form */}
                <form onSubmit={handleCreateLocation} className="pt-2 border-t border-slate-50 space-y-3">
                  <h5 className="text-[10px] font-bold text-slate-500 tracking-wider">注册新的实盘库房：</h5>
                  <div className="space-y-2 text-xs">
                    <input
                      type="text"
                      required
                      placeholder="库房节点名称 (如法兰克福西仓)"
                      value={newLocName}
                      onChange={(e) => setNewLocName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 outline-none text-slate-800 font-bold"
                    />
                    <input
                      type="text"
                      required
                      placeholder="物理收货详细地址"
                      value={newLocAddress}
                      onChange={(e) => setNewLocAddress(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 outline-none text-slate-800"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded-lg text-[9px] uppercase tracking-wider cursor-pointer"
                  >
                    录入此库房节点
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 7. USERS & PERMISSIONS */}
          {activeSubTab === 'users' && (
            <div className="space-y-4 text-left">
              <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none font-sans">员工账户及权限分配</h4>
                  <span className="text-[8px] bg-slate-800 text-white px-1.5 py-0.5 rounded font-black font-mono">成长套餐 (5个席位)</span>
                </div>

                <div className="space-y-2">
                  {staff.map((p) => (
                    <div key={p.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                      <div className="text-left space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 leading-none">{p.name}</span>
                          <span className="bg-slate-100 text-slate-500 text-[8px] font-black border border-slate-200 px-1 rounded">{p.role}</span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-semibold font-mono leading-none">{p.email}</p>
                      </div>

                      {p.role !== '店铺管理员' && (
                        <button
                          type="button"
                          onClick={() => {
                            setStaff(staff.filter(x => x.id !== p.id));
                            addLog('IAM Core', '回收员工席位权限', `安全回收席位「${p.name}」的所有多租户角色权限`, 'warning');
                          }}
                          className="text-rose-500 hover:text-rose-600 cursor-pointer p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Sub-form */}
                <form onSubmit={handleAddStaff} className="pt-2 border-t border-slate-50 space-y-3">
                  <h5 className="text-[10px] font-bold text-slate-500 tracking-wider">分配及新增员工席位：</h5>
                  <div className="space-y-2 text-xs">
                    <input
                      type="text"
                      required
                      placeholder="雇员全名 (如 Jean Lambert)"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-101 outline-none text-slate-800 font-bold"
                    />
                    <input
                      type="email"
                      required
                      placeholder="对公或私人登录邮箱"
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-101 outline-none text-slate-800 font-mono"
                    />
                    <select
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-101 outline-none text-slate-700 font-bold cursor-pointer"
                    >
                      <option value="视觉设计主管">视觉设计主管 (Sofia 组)</option>
                      <option value="供应链助理">供应链助理 (Oliver 组)</option>
                      <option value="普通财务核算人员">普通财务核算员 (Audit 组)</option>
                      <option value="普通员工">普通销售员工</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-850 hover:bg-slate-900 text-white font-bold py-2 rounded-lg text-[9px] uppercase tracking-wider cursor-pointer"
                  >
                    授权席位一键录入
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 8. DOMAINS MANAGING */}
          {activeSubTab === 'domains' && (
            <div className="space-y-4 text-left">
              <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">网店绑定及托管域名</h4>

                <div className="space-y-2">
                  {domains.map((dom, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-xs font-black text-slate-850 font-mono">{dom.name}</span>
                        {dom.isPrimary ? (
                          <span className="ml-1.5 bg-emerald-50 text-emerald-500 text-[7px] font-extrabold border border-emerald-100 px-1 rounded">主域名 (Primary)</span>
                        ) : null}
                      </div>
                      <span className="bg-emerald-50 text-emerald-500 font-mono font-black text-[8px] px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> 已指向
                      </span>
                    </div>
                  ))}
                </div>

                {/* Sub-form */}
                <form onSubmit={handleAddDomain} className="pt-2 border-t border-slate-50 space-y-3">
                  <h5 className="text-[10px] font-bold text-slate-500 tracking-wider">绑定全新自定义域名：</h5>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="例如 buy.modastudio.de"
                      value={domainValue}
                      onChange={(e) => setDomainValue(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-101 outline-none text-xs font-mono text-slate-800"
                    />
                    <button
                      type="submit"
                      disabled={pointerConnecting}
                      className="bg-slate-800 text-[#07C2E3] hover:bg-slate-900 border border-[#07C2E3]/35 font-bold px-4 py-1.5 rounded-lg text-[10px] uppercase transition-all shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {pointerConnecting ? 'DNS 指配中...' : '提交绑定'}
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-normal font-semibold font-sans">
                    * 绑定自定义域名前，您需要登录您的域名注册商后台 (e.g., Godaddy, Cloudflare) 添加一条指向我们的 <b>CNAME</b> 记录: <b>cname.ecos-commerce.eu</b>。
                  </p>
                </form>
              </div>
            </div>
          )}

          {/* 9. STORE POLICIES */}
          {activeSubTab === 'policies' && (
            <div className="space-y-4 text-left">
              <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">商店政策法典 (Policies)</h4>
                  <button
                    type="button"
                    onClick={handleAutofillEUTemplates}
                    className="text-[#07C2E3] hover:text-[#06B2D0] text-[9px] font-black uppercase flex items-center gap-0.5 whitespace-nowrap"
                  >
                    <Plus className="w-3 h-3" /> 载入欧盟合规标准模板
                  </button>
                </div>

                {/* Refund Policy */}
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 font-bold uppercase">退款与退货限制政策 (Refund Policy)</label>
                  <textarea
                    rows={3}
                    value={policyRefund}
                    onChange={(e) => setPolicyRefund(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-101 outline-none text-xs text-slate-700 font-medium leading-relaxed font-sans"
                  />
                </div>

                {/* Privacy Policy */}
                <div className="space-y-1 pt-2 border-t border-slate-50">
                  <label className="block text-[10px] text-slate-400 font-bold uppercase">隐私申明法案 (Privacy Policy)</label>
                  <textarea
                    rows={3}
                    value={policyPrivacy}
                    onChange={(e) => setPolicyPrivacy(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-101 outline-none text-xs text-slate-700 font-medium leading-relaxed font-sans"
                  />
                </div>

                {/* Terms of Service */}
                <div className="space-y-1 pt-2 border-t border-slate-50">
                  <label className="block text-[10px] text-slate-400 font-bold uppercase">服务使用细则条例 (Terms of Service)</label>
                  <textarea
                    rows={3}
                    value={policyTerms}
                    onChange={(e) => setPolicyTerms(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-101 outline-none text-xs text-slate-700 font-medium leading-relaxed font-sans"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => notifySave('商店政策法章 (Policies)')}
                className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#07C2E3]/15"
              >
                <Save className="w-4 h-4" />
                <span>一链更新上架政策</span>
              </button>
            </div>
          )}

          {/* 10. GDPR AND COOKIE PRIVACY SETTING */}
          {activeSubTab === 'privacy' && (
            <div className="space-y-4 text-left">
              <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">GDPR 强制防漏隐私屏蔽门</h4>

                <div className="flex items-center justify-between">
                  <div className="max-w-[75%]">
                    <span className="text-xs font-bold text-slate-700 block">默认开启 Cookie 强阻断横幅</span>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">
                      严格要求欧洲及境外来访者在结账期手动打钩同意才能抓取必要转化广告参数。
                    </p>
                  </div>
                  <button type="button" onClick={() => setGdprEnabled(!gdprEnabled)} className="text-[#07C2E3] cursor-pointer">
                    {gdprEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-200" />}
                  </button>
                </div>

                {gdprEnabled && (
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">自定义 Cookie 隐私弹窗宣告文案</label>
                    <textarea
                      rows={2}
                      value={cookieBannerText}
                      onChange={(e) => setCookieBannerText(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-101 outline-none text-xs text-slate-600 font-medium"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="max-w-[75%]">
                    <span className="text-xs font-bold text-slate-700 block">提供“拒绝售卖我的数据 (Opt-out)”页面</span>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">
                      完美适配加州消费者隐私保护法群 (CCPA)，为北美来访者自动开启敏感数据注销注销入口。
                    </p>
                  </div>
                  <button type="button" onClick={() => setDataDeletionOpt(!dataDeletionOpt)} className="text-[#07C2E3] cursor-pointer">
                    {dataDeletionOpt ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-200" />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => notifySave('客户隐私策略 (Privacy)')}
                className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#07C2E3]/15"
              >
                <Save className="w-4 h-4" />
                <span>保存隐私法律过滤要素</span>
              </button>
            </div>
          )}

          {/* 11. LANGUAGES SETTINGS SHEET */}
          {activeSubTab === 'languages' && (
            <div className="space-y-4 text-left animate-fade">
              <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">多语言及 AI 翻译市场配置</h4>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">默认商店主语言 (Default Language)</label>
                  <select
                    value={primaryLang}
                    onChange={(e) => {
                      setPrimaryLang(e.target.value);
                      if (!supportedLangs.includes(e.target.value)) {
                        setSupportedLangs([...supportedLangs, e.target.value]);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 outline-none text-xs text-slate-700 font-bold cursor-pointer"
                  >
                    <option value="zh_CN">简体中文 (Chinese - zh_CN)</option>
                    <option value="en">英语 (English - en)</option>
                    <option value="fr">法语 (Français - fr)</option>
                    <option value="de">德语 (Deutsch - de)</option>
                    <option value="es">西班牙语 (Español - es)</option>
                    <option value="it">意大利语 (Italiano - it)</option>
                  </select>
                  <p className="text-[9px] text-slate-400 mt-1">客户在未选择特定语种时，默认呈现该语言版本的界面与商品参数。</p>
                </div>

                <div className="pt-2 border-t border-slate-50 space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">激活分发的多国语言版本</h4>
                  <div className="space-y-2">
                    {[
                      { code: 'zh_CN', name: '简体中文 (Chinese)' },
                      { code: 'en', name: '英语 (English)' },
                      { code: 'fr', name: '法语 (Français)' },
                      { code: 'de', name: '德语 (Deutsch)' },
                      { code: 'es', name: '西班牙语 (Español)' },
                      { code: 'it', name: '意大利语 (Italiano)' }
                    ].map((lang) => {
                      const isSel = supportedLangs.includes(lang.code);
                      const isPrimary = lang.code === primaryLang;
                      return (
                        <div key={lang.code} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-xs font-bold text-slate-700">{lang.name}</span>
                          <div className="flex items-center gap-2">
                            {isPrimary && (
                              <span className="text-[8px] bg-[#07C2E3]/10 text-[#07C2E3] font-black px-1.5 py-0.5 rounded uppercase">主语言</span>
                            )}
                            <button
                              type="button"
                              disabled={isPrimary}
                              onClick={() => {
                                if (isSel) {
                                  setSupportedLangs(supportedLangs.filter(l => l !== lang.code));
                                } else {
                                  setSupportedLangs([...supportedLangs, lang.code]);
                                }
                              }}
                              className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase transition-all cursor-pointer ${
                                isSel 
                                  ? 'bg-[#07C2E3] text-white border border-[#07C2E3]' 
                                  : 'bg-zinc-200 text-zinc-500'
                              } disabled:opacity-50`}
                            >
                              {isSel ? '已启用' : '未激活'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="max-w-[75%]">
                    <span className="text-xs font-bold text-slate-700 block">AI 实时智能自动编译翻译 (Gemini Localizer)</span>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">
                      开启后，当您添加或编辑商品、新建博客时，多智能体翻译员工会自动调用大语言模型，无感、超高精细度地将内容渲染编译为上述各选语种，无需人工翻译。
                    </p>
                  </div>
                  <button type="button" onClick={() => setAutoTranslate(!autoTranslate)} className="text-[#07C2E3] cursor-pointer">
                    {autoTranslate ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-200" />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => notifySave('多语言及本地化 (Languages)')}
                className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#07C2E3]/15"
              >
                <Save className="w-4 h-4" />
                <span>保存多语种与 AI 翻译偏好</span>
              </button>
            </div>
          )}

          {/* 12. THEME AND APPEARANCE SETTINGS */}
          {activeSubTab === 'theme' && (
            <div className="space-y-4 text-left animate-fade">
              <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">系统主视觉及黑白双模式设置</h4>
                
                <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                  选择商铺底色模式。该系统完全支持 <b>Shopify Aesthetic 亮白模式</b> 以及 <b>Elegant Midnight 暗夜午夜模式</b> 的极速实时渲染。
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  {/* Light theme selector button */}
                  <button
                    type="button"
                    onClick={() => {
                      setThemeMode('light');
                      localStorage.setItem('ecos_pwa_theme_mode', 'light');
                      addLog('Theme Manager', 'Toggle Interface Scheme', '切换当前 UI 环境色为：智能白昼亮色 (Light Mode)', 'success');
                      showNotice('已切换为智能白昼亮色模式', '✓ 系统底盘主题配色已重置为精致的浅白商业 Aesthetic。', 'info');
                    }}
                    className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      themeMode === 'light'
                        ? 'bg-slate-50 text-slate-800 border-[#07C2E3] ring-1 ring-[#07C2E3]'
                        : 'bg-white text-slate-400 border-slate-150 hover:border-slate-300'
                    }`}
                  >
                    <Sun className={`w-6 h-6 ${themeMode === 'light' ? 'text-[#07C2E3] animate-spin-slow' : 'text-slate-400'}`} />
                    <div className="text-center">
                      <p className="text-xs font-black">智能白昼 (Light)</p>
                      <p className="text-[8px] text-slate-400 mt-0.5">精致通透 商业亮白</p>
                    </div>
                  </button>

                  {/* Dark theme selector button */}
                  <button
                    type="button"
                    onClick={() => {
                      setThemeMode('dark');
                      localStorage.setItem('ecos_pwa_theme_mode', 'dark');
                      addLog('Theme Manager', 'Toggle Interface Scheme', '切换当前 UI 环境色为：优雅午夜深黑 (Dark Mode)', 'warning');
                      showNotice('已切换为优雅午夜深黑模式', '✓ 系统底盘配色已切换为防炫目高对比度 Midnight 暗夜黑。', 'success');
                    }}
                    className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      themeMode === 'dark'
                        ? 'bg-slate-905 text-white border-[#07C2E3] ring-1 ring-[#07C2E3]'
                        : 'bg-white text-slate-400 border-slate-150 hover:border-slate-300'
                    }`}
                  >
                    <Moon className={`w-6 h-6 ${themeMode === 'dark' ? 'text-[#07C2E3] animate-pulse' : 'text-slate-400'}`} />
                    <div className="text-center">
                      <p className="text-xs font-black text-slate-850">优雅午夜 (Dark)</p>
                      <p className="text-[8px] text-slate-450 mt-0.5">防耀防炫 极客酷黑</p>
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="max-w-[75%]">
                    <span className="text-xs font-bold text-slate-700 block">自动跟随系统硬件设置 (System Auto Sync)</span>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">
                      完美集成 Web 标准，自动监听外部 iOS, macOS, Windows 及 Android 软硬件底层系统黑白夜间切换信号。
                    </p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-500 font-sans font-bold text-[8px] px-2 py-1 rounded border border-emerald-100 whitespace-nowrap shrink-0">
                    ✓ 已支持
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => notifySave('视觉与主题 (Theme Settings)')}
                className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#07C2E3]/15"
              >
                <Save className="w-4 h-4" />
                <span>保存样式偏好</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
