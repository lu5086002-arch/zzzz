import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send,
  Search, 
  ShoppingCart, 
  ShoppingBag, 
  User, 
  Users, 
  Megaphone, 
  DollarSign, 
  ArrowRight, 
  X, 
  Plus, 
  Camera, 
  Image as ImageIcon,
  Share2, 
  Copy, 
  ChevronRight, 
  Printer, 
  Truck, 
  Package, 
  Check, 
  AlertCircle, 
  BarChart3, 
  CheckCircle, 
  Sliders, 
  HelpCircle,
  Bell,
  Menu,
  FileText,
  Home,
  Clipboard,
  Clipboard as ClipboardList,
  RotateCcw,
  Clock,
  MoreHorizontal,
  Paperclip,
  UserCheck,
  Trophy,
  Zap,
  Settings,
  Store,
  CreditCard,
  Percent,
  MapPin,
  Globe,
  Lock,
  Languages,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IndustryType, ProductItem, OrderItem } from '../../types';

// Custom modular PWA subviews
import PwaCustomers from './pwa/PwaCustomers';
import PwaMarketing from './pwa/PwaMarketing';
import PwaFinance from './pwa/PwaFinance';
import PwaLogistics from './pwa/PwaLogistics';
import PwaAgents from './pwa/PwaAgents';
import PwaApps from './pwa/PwaApps';
import PwaDeveloper from './pwa/PwaDeveloper';
import PwaSettings from './pwa/PwaSettings';

interface MobilePwaLayoutProps {
  selectedIndustry: IndustryType;
  companyName: string;
  products: ProductItem[];
  orders: OrderItem[];
  currentUser: any;
  onAddProduct: (title: string, sku: string, stock: number, price: number) => void;
  onAddNewProduct: (name: string, sku: string, price: number, stock: number) => void;
  onUpdateProducts: (updated: ProductItem[]) => void;
  onUpdateOrders: (updated: OrderItem[]) => void;
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  onSwitchTab?: (tab: string) => void;
}

export default function MobilePwaLayout({
  selectedIndustry,
  companyName,
  products,
  orders,
  currentUser,
  onAddProduct,
  onAddNewProduct,
  onUpdateProducts,
  onUpdateOrders,
  addLog,
  onSwitchTab
}: MobilePwaLayoutProps) {
  // Mobile Frame shell states
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'orders' | 'account'>('home');
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [subView, setSubView] = useState<'customers' | 'marketing' | 'finance' | 'logistics' | 'agents' | 'apps' | 'developer' | 'settings' | null>(null);
  const [settingsSubTab, setSettingsSubTab] = useState<'general' | 'payments' | 'checkout' | 'shipping' | 'taxes' | 'locations' | 'users' | 'domains' | 'policies' | 'privacy' | 'languages' | 'theme' | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [conversations, setConversations] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Autonomous AI OS Kernel active. Feed target or dispatch command directly.' }
  ]);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, isAiResponding]);

  // Nice native micro-app notification state
  const [inAppNotice, setInAppNotice] = useState<{ title: string; message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showNotice = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setInAppNotice({ title, message, type });
    setTimeout(() => {
      setInAppNotice(current => current && current.message === message ? null : current);
    }, 3500);
  };
  const [notifications, setNotifications] = useState<string[]>([
    '发现 3 个库存不足商品',
    '今日销售额增长 18%'
  ]);

  // Command palette search Drawer
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [customCommandResult, setCustomCommandResult] = useState<string | null>(null);

  // Bottom drawer states
  const [publishingOpen, setPublishingOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharedProductLink, setSharedProductLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  // Sourced and active product state extensions
  const defaultImages: Record<string, string> = {
    'Luna Lounge Chair': 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800',
    'Nora Table Lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
    'Mira Sideboard': 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=600',
    'Haven Sofa': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    'Oda Dining Table': 'https://images.unsplash.com/photo-1530018607912-eff2df114f12?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600'
  };

  // Upload/Publish photo form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('499.00');
  const [newProdStock, setNewProdStock] = useState('100');
  const [newProdDesc, setNewProdDesc] = useState('Nordic Minimalist high quality product.');
  const [newProdImage, setNewProdImage] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [colorsSelected, setColorsSelected] = useState<string[]>(['#E5D9C4', '#556B2F', '#808080', '#1C1C1F']); // Beige, Green, Grey, Black
  
  // Public Client Customer View / image 3 state
  const [viewCustomerPageProduct, setViewCustomerPageProduct] = useState<ProductItem | null>(null);
  const [quantitySelected, setQuantitySelected] = useState(1);
  const [shopperColor, setShopperColor] = useState('#E5D9C4');
  const [orderCreatedSuccess, setOrderCreatedSuccess] = useState(false);

  // High-fidelity Order filtering states matching screenshot
  const [orderSegment, setOrderSegment] = useState<'all' | 'pending' | 'processing' | 'completed' | 'cancelled'>('all');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Command palette logic
  const handleCommandSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commandSearch.trim()) return;

    const term = commandSearch.toLowerCase().trim();
    setCustomCommandResult(null);

    addLog('AI Command Suite', 'Interpret Command Input', `解析指令 "${commandSearch}" 并执行映射`, 'tool');

    if (term.includes('员工') || term.includes('staff') || term.includes('user')) {
      // Redirection or pop-over
      setCustomCommandResult('👥 正在为您切换到 物理与智能员工管理工作台...');
      setTimeout(() => {
        setCommandPaletteOpen(false);
        setActiveTab('account');
        addLog('AI Command Suite', 'Redirect Executed', '自动定位至「店面团队配置」模块', 'success');
        setCommandSearch('');
        setCustomCommandResult(null);
      }, 1500);
    } else if (term.includes('券') || term.includes('优惠') || term.includes('coupon') || term.includes('promo')) {
      setCustomCommandResult('🎫 AI 营销助理 Marcus 正在创建 10% 老客特惠优惠码 [MODA_VIP_10]...');
      setTimeout(() => {
        addLog('AI Marketing Swarm', 'Discount Created', '已向数据库插入新的欧盟促销代码集 - 国外渠道自动对射', 'success');
        setCommandPaletteOpen(false);
        setCommandSearch('');
        setCustomCommandResult(null);
        showNotice('营销策略激活', '✓ 已成功生成高转化优惠券：MODA_VIP_10 (10% 折扣已推送给意向老客！)', 'success');
      }, 2000);
    } else if (term.includes('利润') || term.includes('财务') || term.includes('finance') || term.includes('profit')) {
      setCustomCommandResult('📈 AI 财务总监 Audit 正在为您测算本月多币种清算汇兑净利润大盘...');
      setTimeout(() => {
        addLog('AI Finance Hub', 'Financial Report Generated', '净利润增加 24.5%, 退单理陪扣减完全落库', 'success');
        setCustomCommandResult('💵 【本月财务毛利大盘】 欧元合规汇款结转: €24,195.00, 预计年化折合 ROAS 达到 5.8x. 超出销售预期 14.2%！');
      }, 1800);
    } else if (term.includes('库存') || term.includes('补货') || term.includes('stock')) {
      setCustomCommandResult('📦 AI 采购主管 Oliver 正在检查当前 WMS 低库存警报...');
      setTimeout(() => {
        addLog('AI WMS Inspector', 'Inventory Audited', '已成功过滤 3 个低库存 SKU 并注入一键采购供应链单据', 'success');
        setCommandPaletteOpen(false);
        setActiveTab('products');
        setCommandSearch('');
        setCustomCommandResult(null);
      }, 1500);
    } else {
      setCustomCommandResult('🤖 正在调度 Gemini OS 主机进行战略推演并映射后台功能：创建营销方案、查订单、分析销售...');
    }
  };

  // Main UI interactions
  const handleTriggerCommand = (cmdText: string) => {
    setChatInput(cmdText);
    handleSendChat(cmdText);
  };

  const handleSendChat = (text: string) => {
    const query = text || chatInput;
    if (!query.trim()) return;

    const userMessage = { role: 'user' as const, content: query };
    setConversations(prev => [...prev, userMessage]);
    setChatInput('');
    setIsAiResponding(true);

    addLog('User Command', 'AI Main Thread Input', query, 'info');

    // Simulate Gemini analysis
    setTimeout(() => {
      let reply = '正在利用多智能体大脑分析销售转化与营销方案，当前业务数据库正常...';
      const q = query.toLowerCase();
      if (q.includes('分析') || q.includes('销售')) {
        reply = '📊 **销售增长与漏斗分析**：本周多门店营业额实现 **$18,491.00**，净提升 **18.2%**。主推商品 *Luna Lounge Chair* 在法国、德国转化率高，但西班牙受运费调配影响购买力回落。建议配合 WMS 启动欧洲中转仓计划提升履约。';
      } else if (q.includes('库存') || q.includes('预警')) {
        reply = '⚠️ **WMS 库存态势研判**：当前有 3 款高权重商品库存偏低（低于 10 件安全红线）。*Luna Lounge Chair* 目前仅剩 6 件，预计将在 5 天内售罄。Oliver 精算建议一键采购 50 件补仓，利润空间极高。';
      } else if (q.includes('营销') || q.includes('方案')) {
        reply = '📣 **营销智选活动推送**：检测到老客客群中，购买家具百货频次较高的 129 位高净值 VIP 处于沉默期。定制方案：向其推送 10% 独家折扣优惠券，配合 *NORDIC* 夏末极简家居海报，预计恢复老客留存率达 **12%**。';
      } else if (q.includes('查订单') || q.includes('订单')) {
        reply = '📦 **订单中心时效诊断**：今日累计发生交易订单 **32** 件，总体 AI 欺诈审查均评为 2 分（超低风险）。有 28 件待配货物流，建议集中打印快递面单并一键交割给 DHL 国际干线。';
      } else {
        reply = `🦾 **AI 操作完成**：收到您的指令「${query}」。我已经协同采购 Oliver 和市场 Victor，实时对您的店铺数据库执行了关联检索，并完成了智能自愈配置。所有操作已安全落库！`;
      }
      setConversations(prev => [...prev, { role: 'assistant', content: reply }]);
      setIsAiResponding(false);
      addLog('AI Workspace Assistant', 'Thread Output Streamed', '已反馈最佳战略决策动作方案', 'success');
    }, 1500);
  };

  // Drag-and-drop or Select Mock Upload image
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadProgress(10);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 30;
        });
      }, 200);

      const reader = new FileReader();
      reader.onload = () => {
        setNewProdImage(reader.result as string);
        addLog('WMS Catalog Manager', 'Product Custom Image Cached', `Cached user custom image base64 (${file.name})`, 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Publish dynamic product with full relational tracking
  const handlePublishProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const priceNum = parseFloat(newProdPrice) || 299.00;
    const stockNum = parseInt(newProdStock) || 50;

    // Call the parent state adder
    const finalSku = `SKU-PUB-${Date.now().toString().slice(-4)}`;
    
    // Inject custom properties directly so we retain full visual display of uploaded items
    const newId = `product-${Date.now()}`;
    const newProduct: ProductItem = {
      id: newId,
      name: newProdName,
      sku: finalSku,
      stock: stockNum,
      minStockThreshold: 10,
      price: priceNum,
      sales: 0,
      status: stockNum > 10 ? 'In Stock' : 'Low Stock',
      category: 'Furniture',
      brand: 'Nordic Modern'
    };

    // Embed base64 image locally or default back elegantly
    const updatedProducts = [
      { 
        ...newProduct, 
        imageUrl: newProdImage || defaultImages[newProdName] || defaultImages['default'], 
        colors: colorsSelected,
        description: newProdDesc 
      } as any,
      ...products
    ];

    onUpdateProducts(updatedProducts);
    addLog('WMS Admin Tool_Product', 'Catalog SKU Synced', `已上传实拍图并发布商品 [${newProdName}], 售价 $${priceNum}, 数量 ${stockNum}`, 'success');

    // Setup direct shareable mock link representing picture 3 detail view
    const mockUrl = `${window.location.origin}/product/${newId}`;
    setSharedProductLink(mockUrl);
    setPublishingOpen(false);
    setShowShareModal(true);

    // Reset Form
    setNewProdName('');
    setNewProdImage('');
    setUploadProgress(0);
  };

  // Interactive Purchase simulation inside Nordic customers screen
  const handleShopperBuyNow = () => {
    if (!viewCustomerPageProduct) return;

    // Create a real new order in parent order list!
    const newOrderId = `#ORD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const totalAmount = viewCustomerPageProduct.price * quantitySelected;
    
    const newOrder: OrderItem = {
      id: newOrderId,
      customerName: 'Claire Laurent (来自朋友分享买单)',
      contact: 'claire.laurent@gmail.com',
      total: totalAmount,
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      riskScore: Math.floor(Math.random() * 8) + 1, // High quality clean AI safety
      shippingAddress: 'Rue de la Pompe 112, 75116 Paris, France',
      paymentMethod: 'USDC Base Port Gateway',
      items: [
        {
          productId: viewCustomerPageProduct.id,
          sku: viewCustomerPageProduct.sku,
          name: viewCustomerPageProduct.name,
          price: viewCustomerPageProduct.price,
          quantity: quantitySelected
        }
      ]
    };

    // Update parent list
    onUpdateOrders([newOrder, ...orders]);
    
    // Deduct stock
    const updatedProducts = products.map(p => {
      if (p.id === viewCustomerPageProduct.id) {
        const nextStock = Math.max(0, p.stock - quantitySelected);
        return {
          ...p,
          stock: nextStock,
          status: (nextStock > 10 ? 'In Stock' : (nextStock > 0 ? 'Low Stock' : 'Out of Stock')) as 'In Stock' | 'Low Stock' | 'Out of Stock'
        };
      }
      return p;
    });
    onUpdateProducts(updatedProducts);

    setOrderCreatedSuccess(true);
    addLog('Customer Checkout Service', 'Direct Order Created', `老客户收到分享购买了 [${viewCustomerPageProduct.name}] x${quantitySelected}, 生成订单 ${newOrderId}, 金额 $${totalAmount}`, 'success');
  };

  // Helper formatting for risk scores
  const getRiskMarkup = (score: number) => {
    if (score < 10) return { label: `${score} (安全)`, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (score < 40) return { label: `${score} (中低可疑)`, color: 'text-blue-600 bg-blue-50 border-blue-200' };
    return { label: `${score} (高危欺诈核查)`, color: 'text-rose-600 bg-rose-50 border-rose-200 animate-pulse' };
  };

  // Seed sample products if list is empty, ensuring there are high value gorgeous furnitures
  useEffect(() => {
    if (products.length === 0) {
      const presets: ProductItem[] = [
        { id: '1', name: 'Luna Lounge Chair', sku: 'SKU-LUNA-CH', stock: 6, minStockThreshold: 10, price: 499.00, sales: 84, status: 'Low Stock' },
        { id: '2', name: 'Nora Table Lamp', sku: 'SKU-NORA-LP', stock: 24, minStockThreshold: 10, price: 129.00, sales: 112, status: 'In Stock' },
        { id: '3', name: 'Mira Sideboard', sku: 'SKU-MIRA-SB', stock: 12, minStockThreshold: 10, price: 749.00, sales: 41, status: 'In Stock' },
        { id: '4', name: 'Haven Sofa', sku: 'SKU-HAVN-SF', stock: 4, minStockThreshold: 5, price: 1299.00, sales: 19, status: 'Low Stock' }
      ];
      // Attach images
      const initialProducts = presets.map(p => ({
        ...p,
        imageUrl: defaultImages[p.name] || defaultImages['default'],
        description: 'Selected premium designer Nordic furniture piece.'
      })) as any;
      onUpdateProducts(initialProducts);
    }

    if (orders.length === 0) {
      const presets: OrderItem[] = [
        { id: '#ORD-2024-00125', customerName: 'John Cooper', contact: 'john@cooper.net', total: 499.00, status: 'Pending', createdAt: '2024-05-20 14:32', riskScore: 3, items: [{ name: 'Luna Lounge Chair', price: 499.00, quantity: 1, sku: 'SKU-LUNA-CH' }] },
        { id: '#ORD-2024-00124', customerName: 'Nita Patel', contact: 'nita@patel.org', total: 129.00, status: 'Shipped', createdAt: '2024-05-20 13:15', riskScore: 12, items: [{ name: 'Nora Table Lamp', price: 129.00, quantity: 1, sku: 'SKU-NORA-LP' }] },
        { id: '#ORD-2024-00123', customerName: 'Albert Wagner', contact: 'albert@wagner.de', total: 749.00, status: 'Completed', createdAt: '2024-05-19 19:45', riskScore: 4, items: [{ name: 'Mira Sideboard', price: 749.00, quantity: 1, sku: 'SKU-MIRA-SB' }] }
      ];
      onUpdateOrders(presets);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-0 md:p-6 bg-slate-55 min-h-screen w-full">
      {/* Premium borderless mobile workspace viewport mimicking real high-end PWA application */}
      <div className="w-full md:max-w-[412px] h-screen md:h-[840px] bg-slate-50 md:bg-white rounded-none md:rounded-[40px] shadow-none md:shadow-[0_24px_60px_rgba(15,23,42,0.12)] border-0 md:border md:border-slate-100/90 flex flex-col overflow-hidden relative font-sans text-slate-800 transition-all">
        
        {/* Global Inside Client Notification Overlay banner from home */}
        {notifications.length > 0 && activeTab === 'home' && (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white font-medium py-2.5 px-4 text-[11px] flex items-center justify-between select-none relative z-40 transition-all border-b border-indigo-900/50 shrink-0 shadow-lg">
            <span className="flex items-center gap-2 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]"></span>
              </span>
              <span>{notifications[0]}</span>
            </span>
            <button 
              onClick={() => {
                setNotifications(prev => prev.slice(1));
                if (notifications[0].includes('库存')) {
                  setActiveTab('products');
                } else if (notifications[0].includes('销售')) {
                  setActiveTab('orders');
                }
              }}
              className="font-bold underline text-[#8B5CF6] hover:text-[#7C3AED] cursor-pointer text-xs transition-colors"
            >
              立即处理 &rarr;
            </button>
          </div>
        )}

        {/* Dynamic header depending on the bottom navigation tab chosen */}
        {!subView && activeTab !== 'orders' && (
          <header className="bg-white/80 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-slate-100/80 shrink-0 relative z-10 select-none">
            <div className="flex items-center gap-2.5 text-left">
              <button 
                onClick={() => {
                  setIsSideMenuOpen(true);
                  addLog('Navigation', 'Toggle Drawer', 'Hamburger menu options loaded', 'info');
                }}
                className="p-1 px-1.5 rounded-lg hover:bg-slate-50 border border-slate-100 text-slate-500 cursor-pointer transition-colors"
                id="hamburger-menu-pwa"
              >
                <Menu className="w-4 h-4 text-slate-700" />
              </button>
              <h1 className="text-xs font-black text-slate-900 font-display uppercase tracking-widest flex items-center gap-1.5">
                {activeTab === 'home' && (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6] animate-pulse" />
                    <span>AI WORKSPACE</span>
                  </>
                )}
                {activeTab === 'products' && 'PRODUCT SUITE'}
                {activeTab === 'account' && 'BUSINESS ACCOUNT'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Command search trigger button */}
            </div>
          </header>
        )}

        {/* Dynamic scroll content depending on selected tab */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            {subView === 'customers' && (
              <motion.div key="subview-customers" className="flex-1 flex flex-col overflow-hidden">
                <PwaCustomers orders={orders} addLog={addLog} showNotice={showNotice} onBack={() => setSubView(null)} />
              </motion.div>
            )}
            {subView === 'marketing' && (
              <motion.div key="subview-marketing" className="flex-1 flex flex-col overflow-hidden">
                <PwaMarketing products={products} addLog={addLog} showNotice={showNotice} onBack={() => setSubView(null)} />
              </motion.div>
            )}
            {subView === 'finance' && (
              <motion.div key="subview-finance" className="flex-1 flex flex-col overflow-hidden">
                <PwaFinance orders={orders} addLog={addLog} showNotice={showNotice} onBack={() => setSubView(null)} />
              </motion.div>
            )}
            {subView === 'logistics' && (
              <motion.div key="subview-logistics" className="flex-1 flex flex-col overflow-hidden">
                <PwaLogistics products={products} onUpdateProducts={onUpdateProducts} addLog={addLog} showNotice={showNotice} onBack={() => setSubView(null)} />
              </motion.div>
            )}
            {subView === 'agents' && (
              <motion.div key="subview-agents" className="flex-1 flex flex-col overflow-hidden">
                <PwaAgents addLog={addLog} showNotice={showNotice} onBack={() => setSubView(null)} />
              </motion.div>
            )}
            {subView === 'apps' && (
              <motion.div key="subview-apps" className="flex-1 flex flex-col overflow-hidden">
                <PwaApps addLog={addLog} showNotice={showNotice} onBack={() => setSubView(null)} />
              </motion.div>
            )}
            {subView === 'developer' && (
              <motion.div key="subview-developer" className="flex-1 flex flex-col overflow-hidden">
                <PwaDeveloper products={products} orders={orders} onUpdateOrders={onUpdateOrders} addLog={addLog} showNotice={showNotice} onBack={() => setSubView(null)} />
              </motion.div>
            )}
            {subView === 'settings' && (
              <motion.div key="subview-settings" className="flex-1 flex flex-col overflow-hidden">
                <PwaSettings 
                  companyName={companyName} 
                  addLog={addLog} 
                  showNotice={showNotice} 
                  onBack={() => {
                    setSettingsSubTab(null);
                    setSubView(null);
                  }} 
                  activeSubTab={settingsSubTab}
                  setActiveSubTab={setSettingsSubTab}
                />
              </motion.div>
            )}

            {!subView && activeTab === 'home' && (
              <motion.div
                key="home-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 px-5 py-4 space-y-5 overflow-y-auto text-left flex flex-col pb-20"
              >
                {/* Greeting Hero Block */}
                <div className="flex justify-between items-center select-none">
                  <div className="space-y-0.5 text-left">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 font-display leading-tight">
                      Good morning, ECOS 👋
                    </h2>
                    <p className="text-[10px] text-slate-400 font-medium font-sans">Your AI assistant for store growth</p>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] bg-white border border-slate-100 px-2.5 py-1 rounded-full font-bold shadow-[0_1px_4px_rgba(0,0,0,0.02)] text-slate-700 h-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>AI Assistant</span>
                    <span className="text-slate-200">|</span>
                    <span className="text-[8px] text-slate-400 font-mono font-medium">Online</span>
                  </div>
                </div>

                {/* Glowing AI Star Spherical Core Section - Compact styling */}
                <div className="py-1.5 flex flex-col items-center justify-center relative select-none w-full min-h-[135px] shrink-0">
                  {/* Subtle background glow effect using our new beautiful purple-violet palette */}
                  <div className="absolute w-40 h-40 rounded-full bg-indigo-500/5 filter blur-3xl animate-pulse" />
                  
                  {/* 2 Interactive branching floating bubbles branching left and right */}
                  {/* Branch Left */}
                  <button 
                    onClick={() => {
                      setChatInput('Analyze my sales performance');
                      addLog('AI OS Core', 'Quick Bubble Selected', 'Auto filled chat input with sales perform query', 'info');
                    }}
                    className="absolute left-[5px] top-[15px] bg-white hover:bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.02)] hover:shadow-md transition-all active:scale-95 text-left max-w-[125px] cursor-pointer z-10"
                  >
                    <p className="text-[8.5px] font-extrabold text-slate-700 leading-tight">📈 Analyze sales</p>
                  </button>

                  {/* Branch Right */}
                  <button 
                    onClick={() => {
                      setChatInput('What are my top selling products?');
                      addLog('AI OS Core', 'Quick Bubble Selected', 'Auto filled chat input with top selling products query', 'info');
                    }}
                    className="absolute right-[5px] top-[15px] bg-white hover:bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.02)] hover:shadow-md transition-all active:scale-95 text-left max-w-[125px] cursor-pointer z-10"
                  >
                    <p className="text-[8.5px] font-extrabold text-slate-700 leading-tight">💎 Top Products</p>
                  </button>

                  {/* Center Globe (Symmetrical glass design) */}
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-slate-100/65 via-white to-slate-205/55 p-2 flex items-center justify-center shadow-[0_12px_30px_rgba(139,92,246,0.11)] border border-slate-100/40 z-0">
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/10 to-indigo-500/5 flex items-center justify-center border border-indigo-200/50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-purple-400/25 to-indigo-600/15 opacity-60 animate-spin" style={{ animationDuration: '12s' }} />
                      <Sparkles className="w-8 h-8 text-[#8B5CF6] drop-shadow-[0_0_12px_rgba(139,92,246,0.6)] animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* ECOS Autonomic Command Console Workspace (Unified Integrated Design!) */}
                <div className="bg-white border border-slate-150/80 rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.03)] flex flex-col h-[460px] shrink-0 overflow-hidden text-left relative focus-within:ring-2 focus-within:ring-[#8B5CF6]/15 transition-all">
                  {/* Console Header Bar */}
                  <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-100 shrink-0 select-none">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9.5px] font-mono font-black text-slate-600 uppercase tracking-wider">AURA COGNITIVE MULTIMODAL CONSOLE</span>
                    </div>
                    <span className="text-[8px] bg-indigo-50 text-indigo-500 font-extrabold font-mono px-1.5 py-0.5 rounded uppercase">Store Brain v2.05</span>
                  </div>

                  {/* Message Stream */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
                    {conversations.map((msg, mIdx) => {
                      const isUser = msg.role === 'user';
                      return (
                        <div 
                           key={mIdx} 
                           className={`flex flex-col text-[11px] leading-relaxed max-w-[88%] ${isUser ? 'ml-auto text-right items-end' : 'mr-auto text-left items-start'}`}
                        >
                          {/* Label above message block */}
                          <div className="flex items-center gap-1 mb-1 font-mono text-[8px] font-bold tracking-wider text-slate-400 select-none uppercase">
                            {isUser ? (
                              <>
                                <span>MERCHANT REQUEST</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-[#8B5CF6] rounded-full bg-[#8B5CF6] inline-block animate-pulse" />
                                <span>AURA INTELLECT</span>
                              </>
                            )}
                          </div>
                          
                          {/* Inner Bubble */}
                          <div 
                            className={`p-3 rounded-2xl border ${
                              isUser 
                                ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-sm' 
                                : 'bg-slate-50 border-slate-100 text-slate-800 shadow-sm'
                            }`}
                          >
                            <p className="whitespace-pre-wrap font-sans break-words text-left">{msg.content}</p>
                          </div>
                        </div>
                      );
                    })}

                    {isAiResponding && (
                      <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-2xl flex items-center gap-2 text-[9px] text-slate-400 leading-none font-mono max-w-[70%] shadow-xs animate-pulse">
                        <div className="flex space-x-1 shrink-0">
                          <span className="w-1 h-1 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 h-1 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 h-1 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span>AURA is compiling intelligence matrix...</span>
                      </div>
                    )}
                    <div ref={chatMessagesEndRef} />
                  </div>

                  {/* Integrated Chat Input Prompt Section directly inside the same card */}
                  <div className="bg-slate-50/50 p-3 border-t border-slate-100 space-y-3 shrink-0">
                    <textarea 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask me anything about your store..."
                      className="w-full bg-transparent min-h-[45px] max-h-[100px] text-xs font-semibold text-slate-800 placeholder-slate-450 focus:outline-none resize-none leading-relaxed text-left border-0 p-0"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendChat('');
                        }
                      }}
                    />
                    
                    <div className="flex items-center justify-between pt-1 select-none">
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => {
                            addLog('Media API', 'Pin Triggered', 'Simulate files upload stream', 'info');
                            showNotice('Media Library', '✓ Premium Image Upload triggered successfully!', 'success');
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
                          title="上传图片"
                        >
                          <Paperclip className="w-4 h-4 text-slate-400" />
                        </button>
                        <button 
                          onClick={() => {
                            addLog('AI OS Core', 'Quick Action Sparkles', 'Triggered stock audit command', 'info');
                            setChatInput('一键检测并加满断货及低库存 SKU');
                          }}
                          className="text-[9px] bg-purple-50/50 hover:bg-purple-100/60 border border-purple-100/60 text-[#8B5CF6] hover:text-[#7C3AED] px-2.5 py-1 rounded-full transition-all cursor-pointer font-bold leading-none flex items-center gap-1"
                        >
                          <Sparkles className="w-2.5 h-2.5" /> Quick Stock Fill
                        </button>
                      </div>

                      <button 
                        onClick={() => handleSendChat('')}
                        disabled={isAiResponding || !chatInput.trim()}
                        className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-indigo-650 hover:from-[#7C3AED] hover:to-indigo-750 text-white flex items-center justify-center active:scale-95 disabled:from-slate-100 disabled:to-slate-105 disabled:text-slate-300 shadow-md transition-all shrink-0 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Simplified Unified KPI Cards Row (Exactly 4 premium cards - "打字多功能框下面4个卡面就这样简单") */}
                <div className="space-y-2 select-none">
                  <div className="flex justify-between items-center px-1">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">ECOS Real-Time Telemetry</h3>
                    <span className="text-[9px] text-[#8B5CF6] font-mono font-bold">4 Nodes Active</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      {
                        label: 'Total Sales / 销售总额',
                        value: '$24,530',
                        change: '+12.5%',
                        color: 'from-violet-500/10 to-indigo-500/5',
                        textColor: 'text-indigo-600',
                        border: 'border-indigo-100/60',
                        points: '0,11 6,8 12,12 18,5 24,9 30,3 36,7 42,2',
                        stroke: '#8B5CF6',
                        cmd: '分析销售绩效并提供下周预测'
                      },
                      {
                        label: 'Orders / 指令处理',
                        value: '1,248',
                        change: '+8.2%',
                        color: 'from-blue-500/10 to-indigo-500/5',
                        textColor: 'text-blue-600',
                        border: 'border-blue-100/60',
                        points: '0,11 6,9 12,13 18,10 24,6 30,9 36,4 42,3',
                        stroke: '#3B82F6',
                        cmd: '查阅最新待处理订单和履约状态'
                      },
                      {
                        label: 'Stock Audit / 智能补配',
                        value: '2 Low Stock',
                        change: 'Click to Fill',
                        color: 'from-emerald-500/10 to-indigo-500/5',
                        textColor: 'text-emerald-600',
                        border: 'border-emerald-100/60',
                        points: '0,12 6,10 12,7 18,9 24,5 30,8 36,3 42,2',
                        stroke: '#10B981',
                        cmd: '一键检测并加满断货及低库存 SKU'
                      },
                      {
                        label: 'Conversion / 转化提升',
                        value: '3.65%',
                        change: '+5.7%',
                        color: 'from-amber-600/10 to-indigo-500/5',
                        textColor: 'text-amber-600',
                        border: 'border-amber-100/60',
                        points: '0,13 6,11 12,12 18,8 24,9 30,5 36,7 42,4',
                        stroke: '#F59E0B',
                        cmd: '如何针对店内高毛利产品提升结账转换率？'
                      }
                    ].map((stat, sIdx) => {
                      return (
                        <button 
                          key={sIdx}
                          onClick={() => {
                            setChatInput(stat.cmd);
                            handleTriggerCommand(stat.cmd);
                            addLog('ECOS Telemetry', 'Card Triggered', `Quick command routed: [${stat.cmd}]`, 'info');
                          }}
                          className={`bg-white border ${stat.border} rounded-2xl p-3 shadow-[0_4px_12px_rgba(15,23,42,0.01)] text-left flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all active:scale-95 duration-150 cursor-pointer text-left min-h-[96px] w-full relative overflow-hidden`}
                        >
                          <div className={`absolute -right-2 -bottom-2 w-16 h-16 rounded-full bg-gradient-to-tr ${stat.color} filter blur-lg opacity-80`} />
                          
                          <div className="relative z-10 w-full">
                            <span className="text-[8.5px] text-slate-400 font-bold block truncate tracking-tight">{stat.label}</span>
                            <span className="text-sm font-black text-slate-900 font-mono tracking-tighter block mt-1 leading-none">{stat.value}</span>
                          </div>

                          <div className="relative z-10 flex items-center justify-between mt-3 w-full">
                            <span className={`text-[8px] font-mono font-extrabold ${stat.textColor} bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded leading-none`}>
                              {stat.change}
                            </span>
                            
                            {/* SVG sparkline graph */}
                            <div className="w-10 h-3 font-mono opacity-80">
                              <svg className="w-full h-full" viewBox="0 0 42 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path 
                                  d={`M${stat.points}`} 
                                  fill="none" 
                                  stroke={stat.stroke} 
                                  strokeWidth="1.5" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                />
                                <circle cx="42" cy="2" r="1" fill={stat.stroke} />
                              </svg>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>



              </motion.div>
            )}

            {/* SUB-SCREEN 2: PRODUCTS TAB (INLINE COMPACT VIEW WITH CARD & IMAGE 3 TRIGGER) */}
            {!subView && activeTab === 'products' && (
              <motion.div 
                key="products-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-5 space-y-4 flex-1 text-left flex flex-col"
              >
                {/* Search / filter tag controls */}
                <div className="flex gap-2 shrink-0 select-none">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="搜索商品..."
                      className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>

                  <button 
                    onClick={() => setPublishingOpen(true)}
                    className="bg-indigo-600 text-white hover:bg-indigo-700 text-xs px-3 rounded-lg flex items-center gap-1 font-bold cursor-pointer transition-all active:scale-95 whitespace-nowrap leading-none py-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> 发布
                  </button>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 select-none shrink-0 scrollbar-none">
                  {['全部商品', '库存预警', '热销商品'].map((tag, tIdx) => (
                    <span 
                      key={tIdx} 
                      className={`text-[10px] px-2.5 py-1 rounded-full border cursor-pointer font-bold transition-colors whitespace-nowrap leading-none ${
                        tIdx === 0 
                          ? 'bg-slate-900 border-slate-900 text-white' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Product Card List scrollarea */}
                <div className="flex-1 space-y-3.5 overflow-y-auto pr-1">
                  {products.map((item) => {
                    const localImage = defaultImages[item.name] || defaultImages['default'];
                    const isLowStock = item.stock <= item.minStockThreshold;

                    return (
                      <div 
                        key={item.id} 
                        className="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all space-y-4 text-left relative overflow-hidden"
                      >
                        {isLowStock && (
                          <div className="absolute top-4 right-4 bg-rose-50 text-rose-600 text-[9px] font-black px-2 py-0.5 rounded-full border border-rose-200 uppercase leading-none select-none tracking-wider font-mono">
                            Low Stock
                          </div>
                        )}

                        <div className="flex gap-4">
                          {/* Rich Product Image */}
                          <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                            <img 
                              src={(item as any).imageUrl || localImage} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = defaultImages['default'];
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <div className="space-y-0.5 text-left">
                              <span className="text-[9px] text-[#07C2E3] font-mono tracking-widest font-black uppercase">
                                {item.category || 'Furniture'}
                              </span>
                              <h4 className="text-sm font-black text-slate-900 font-display truncate leading-snug">
                                {item.name}
                              </h4>
                              <div className="text-[10px] text-slate-400 font-mono tracking-tight">
                                SKU: {item.sku}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-sm font-black text-slate-950 font-mono">
                                ${item.price}
                              </span>
                              <div className="text-[10px] font-mono text-slate-500">
                                库存: <span className={`font-bold ${isLowStock ? 'text-rose-500' : 'text-slate-800'}`}>{item.stock}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card bottom layout metadata & quick actions */}
                        <div className="pt-3 flex items-center justify-between border-t border-slate-100 select-none shrink-0 text-[10px]">
                          <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                            <span>已售: <strong className="text-slate-700">{item.sales}</strong> 件</span>
                            <span className="text-slate-200">|</span>
                            <span className="text-amber-500">★ 4.8</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {/* Open Direct Customer View / image 3 detail view */}
                            <button 
                              onClick={() => {
                                setViewCustomerPageProduct(item);
                                addLog('SaaS Core Engine', 'Open Direct Customer View', `预览客户端单页「${item.name}」`, 'info');
                              }}
                              className="px-3 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 font-extrabold text-[10px] rounded-lg border border-slate-200/60 leading-none transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                              title="预览商品单页详情"
                            >
                              <Share2 className="w-3 h-3 text-slate-400" /> 预览单页
                            </button>

                            <button 
                              onClick={() => {
                                const newProducts = products.map(p => p.sku === item.sku ? { ...p, stock: p.stock + 50, status: 'In Stock' as const } : p);
                                onUpdateProducts(newProducts);
                                addLog('AI WMS Suite', 'Execute Procurement', `Oliver 一键补货 ${item.name} +50 件`, 'success');
                                showNotice('供应链补货成功', `✓ 已成功补货 ${item.name} +50 件！`, 'success');
                              }}
                              className="bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] active:scale-95 leading-none transition-colors hover:bg-black"
                            >
                              一键补货
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </motion.div>
            )}

            {/* SUB-SCREEN 3: ORDERS TAB (SCREENSHOT 2 "订单管理" SEAMLESS FIT) */}
            {!subView && activeTab === 'orders' && (
              <motion.div 
                key="orders-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 text-left flex flex-col space-y-4"
              >
                {/* 1. Header with Menu & top Action Icons (Image 2 perfect match) */}
                <div className="px-5 pt-3 flex items-center justify-between select-none">
                  <button 
                    onClick={() => {
                      setIsSideMenuOpen(true);
                      addLog('SaaS Core Engine', 'Open Orders Roster', 'Loaded multi-tenant real-time clearing profiles', 'info');
                    }}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors"
                  >
                    <Menu className="w-6 h-6 stroke-[2]" />
                  </button>
                  
                  <div className="flex items-center gap-4 text-slate-700">
                    <button onClick={() => setCommandPaletteOpen(true)} className="hover:text-slate-950 cursor-pointer transition-all">
                      <Search className="w-5 h-5 text-slate-900 stroke-[2]" />
                    </button>
                    <button className="hover:text-slate-950 cursor-pointer transition-all">
                      <Sliders className="w-5 h-5 text-slate-900 stroke-[2]" />
                    </button>
                    <div className="relative cursor-pointer hover:scale-105 transition-all">
                      <Bell className="w-5 h-5 text-slate-900 stroke-[2]" />
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white leading-none">
                        3
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Visual Title Section */}
                <div className="px-5 select-none text-left border-b border-slate-100/80 pb-2">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight font-display">订单中心</h2>
                </div>

                {/* 3. Underline-based sliding segment tabs (全部订单, 待处理, 处理中, 已完成, 已取消) */}
                <div className="px-5 flex gap-5 select-none shrink-0 border-b border-slate-100 overflow-x-auto scrollbar-none">
                  {[
                    { id: 'all', label: '全部', count: orders.length + 300 },
                    { id: 'pending', label: '待处理', count: orders.filter(o => o.status === 'Pending').length + 20 },
                    { id: 'processing', label: '进行中', count: orders.filter(o => o.status === 'Shipped' || o.status === 'AI Confirmed').length + 35 },
                    { id: 'completed', label: '已完成', count: orders.filter(o => o.status === 'Completed').length + 180 },
                    { id: 'cancelled', label: '已取消', count: orders.filter(o => o.status === 'Cancelled' || o.status === 'Refund Requested' || o.status === 'Refunded').length + 30 }
                  ].map((seg) => {
                    const isActive = orderSegment === seg.id;
                    return (
                      <button
                        key={seg.id}
                        onClick={() => setOrderSegment(seg.id as any)}
                        className={`py-3 text-[13px] font-bold tracking-tight whitespace-nowrap relative cursor-pointer flex items-center gap-1.5 transition-colors focus:outline-none ${
                          isActive ? 'text-slate-900 font-extrabold' : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <span>{seg.label}</span>
                        <span className={`text-[10px] font-mono py-0.5 px-2 rounded-full ${
                          isActive ? 'bg-slate-100 text-slate-900 font-bold' : 'bg-slate-50 text-slate-400'
                        }`}>
                          {seg.count}
                        </span>
                        {isActive && (
                          <motion.div 
                            layoutId="active-tab-underline-pwa"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#07C2E3]" 
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 4. Dropdown filter line to customize UI flow cleanly */}
                <div className="px-5 flex gap-1.5 overflow-x-auto pb-0.5 select-none shrink-0 scrollbar-none text-[10px] items-center">
                  <button className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-105 whitespace-nowrap text-slate-600 font-bold flex items-center gap-1 cursor-pointer transition-colors">
                    支付状态 <span className="text-[8px] text-slate-400">&#9662;</span>
                  </button>
                  <button className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-105 whitespace-nowrap text-slate-600 font-bold flex items-center gap-1 cursor-pointer transition-colors">
                    配送状态 <span className="text-[8px] text-slate-400">&#9662;</span>
                  </button>
                  <button className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-105 whitespace-nowrap text-slate-600 font-bold flex items-center gap-1 cursor-pointer transition-colors">
                    日期范围 <span className="text-[8px] text-slate-400">&#9662;</span>
                  </button>
                </div>

                {/* 6. Orders list scroll area */}
                <div className="flex-1 px-5 space-y-3 overflow-y-auto pr-2 pb-16">
                  {(() => {
                    const filteredOrders = orders.filter(ord => {
                      if (orderSegment === 'all') return true;
                      if (orderSegment === 'pending') {
                        return ord.status === 'Pending' || ord.status === 'Refund Requested';
                      }
                      if (orderSegment === 'processing') {
                        return ord.status === 'Shipped' || ord.status === 'AI Confirmed';
                      }
                      if (orderSegment === 'completed') {
                        return ord.status === 'Completed';
                      }
                      if (orderSegment === 'cancelled') {
                        return ord.status === 'Cancelled' || ord.status === 'Refunded';
                      }
                      return true;
                    });

                    if (filteredOrders.length === 0) {
                      return (
                        <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-center select-none space-y-2">
                          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                            <Package className="w-6 h-6 text-slate-300" />
                          </div>
                          <p className="text-[11px] font-bold">没有符合当前筛选的订单数据</p>
                        </div>
                      );
                    }

                    return filteredOrders.map((ord) => {
                      const isPending = ord.status === 'Pending';
                      const listProduct = products.find(p => p.sku === ord.items?.[0]?.sku);
                      const isSelected = selectedOrderIds.includes(ord.id);
                      
                      const nameLower = (ord.items?.[0]?.name || '').toLowerCase();
                      const attributeLabel = nameLower.includes('lamp') ? '棕色' :
                                           nameLower.includes('sideboard') ? '胡桃木色' :
                                           nameLower.includes('sofa') ? '浅灰色' :
                                           nameLower.includes('dining') ? '原木色' : '米色';

                      const handleToggleSelect = () => {
                        setSelectedOrderIds(prev => 
                          isSelected ? prev.filter(id => id !== ord.id) : [...prev, ord.id]
                        );
                      };

                      return (
                        <div 
                          key={ord.id}
                          className="bg-white border border-slate-100 rounded-3xl p-4.5 shadow-[0_4px_20px_rgba(15,23,42,0.02)] space-y-4 text-left relative overflow-hidden transition-all hover:border-slate-205"
                        >
                          {/* Order Card Header */}
                          <div className="flex items-start justify-between select-none">
                            <div className="flex items-start gap-2.5">
                              {/* Custom Interactive Checkbox with glowing ring */}
                              <button 
                                onClick={handleToggleSelect}
                                className={`w-4 h-4 rounded-md border flex items-center justify-center mt-0.5 transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                                    : 'border-slate-250 hover:border-slate-350 bg-white'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3.5]" />}
                              </button>

                              <div className="space-y-0.5">
                                <span className="text-xs font-black text-slate-900 font-mono tracking-tight underline">#{ord.id}</span>
                                <p className="text-[9px] text-slate-400 font-mono font-bold">{ord.createdAt}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 font-mono">
                              <span className={`text-[9px] font-black tracking-wide px-2 py-0.5 rounded-full border leading-none uppercase ${
                                ord.status === 'Pending' ? 'bg-amber-50 text-amber-620 border-amber-150' : 
                                ord.status === 'Shipped' || ord.status === 'AI Confirmed' ? 'bg-indigo-50 text-indigo-620 border-indigo-150' :
                                'bg-emerald-50 text-emerald-620 border-emerald-150'
                              }`}>
                                {ord.status === 'Pending' && '待发货'}
                                {(ord.status === 'Shipped' || ord.status === 'AI Confirmed') && '已发货'}
                                {ord.status === 'Completed' && '已完成'}
                                {ord.status === 'Cancelled' && '已取消'}
                                {ord.status === 'Refund Requested' && '退款申请中'}
                                {ord.status === 'Refunded' && '已退款'}
                              </span>
                              <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50/60 border border-emerald-100/50 px-2 py-0.5 rounded-full font-bold leading-none">
                                已付
                              </span>
                            </div>
                          </div>

                          {/* Order Nested Product Specs Box */}
                          <div className="flex gap-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                            {/* Round-corner thumbnail with micro border */}
                            <div className="w-14 h-14 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                              <img 
                                src={listProduct?.imageUrl || defaultImages[ord.items?.[0]?.name || 'default'] || defaultImages['default']} 
                                alt="OrderItem" 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = defaultImages['default'];
                                }}
                              />
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                              <div>
                                <h5 className="text-xs font-black text-slate-900 truncate leading-snug">
                                  {ord.items?.[0]?.name || 'Luna Lounge Chair'}
                                </h5>
                                <span className="text-[9px] text-[#07C2E3] block mt-0.5 font-bold uppercase tracking-wider font-mono">
                                  {attributeLabel} • Standard Pack
                                </span>
                              </div>
                              <div className="flex justify-between items-baseline mt-1.5 font-mono text-[9px]">
                                <span className="text-slate-400 font-bold">
                                  ${ord.items?.[0]?.price || '499.00'} &times; {ord.items?.[0]?.quantity || 1}
                                </span>
                                <div className="text-right">
                                  <span className="text-xs font-black text-slate-950 block leading-none">
                                    ${ord.total}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Interactive Delivery Pipeline shown inline ONLY in dispatched orders */}
                          {(ord.status === 'Shipped' || ord.status === 'Completed' || ord.status === 'AI Confirmed') && (
                            <div className="px-3 py-2.5 bg-[#FAF9FA]/40 border border-slate-100 rounded-xl space-y-2 select-none">
                              <div className="flex justify-between items-center text-[8px] font-mono font-bold text-slate-400">
                                <span>DHL HIGH-END LOGISTICS EXPRESS</span>
                                <span className="text-slate-900 uppercase">IN TRANSIT</span>
                              </div>
                              <div className="flex items-center justify-between relative px-2">
                                <div className="absolute left-3 right-3 top-1.5 h-0.5 bg-slate-200 z-0" />
                                <div className="absolute left-3 w-1/2 top-1.5 h-0.5 bg-slate-900 z-0" />
                                
                                <div className="z-10 flex flex-col items-center">
                                  <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-white flex items-center justify-center text-white text-[7px] font-bold">✓</div>
                                  <span className="text-[7px] text-slate-900 mt-1 font-bold font-mono">FR Paris</span>
                                </div>
                                <div className="z-10 flex flex-col items-center">
                                  <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-white flex items-center justify-center text-white text-[7px] font-bold">✓</div>
                                  <span className="text-[7px] text-slate-900 mt-1 font-bold font-mono">CDG Hub</span>
                                </div>
                                <div className="z-10 flex flex-col items-center">
                                  <div className="w-3.5 h-3.5 rounded-full bg-[#07C2E3] border border-white flex items-center justify-center text-slate-950 text-[7px] animate-pulse">✈</div>
                                  <span className="text-[7px] text-slate-900 mt-1 font-bold font-mono">In Flight</span>
                                </div>
                                <div className="z-10 flex flex-col items-center opacity-40">
                                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200 border border-white flex items-center justify-center text-slate-400 text-[7px]">•</div>
                                  <span className="text-[7px] text-slate-400 mt-1 font-bold font-mono">Handover</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Order actions row */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between shrink-0 select-none text-[10px]">
                            <span className="text-slate-400 font-bold font-display">买家: <b className="text-slate-800 font-extrabold">{ord.customerName}</b></span>

                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={() => {
                                  addLog('Printer Node', 'Invoice printed', `已传送 DHL 单据规格至外设 - ${ord.id}`, 'tool');
                                  showNotice('DHL 打印指令签发', `已发送打印指令！DHL 快件单据 [${ord.id}] 输出中...`, 'info');
                                }}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer font-extrabold flex items-center gap-1 leading-none transition-all duration-150 active:scale-95"
                              >
                                <Printer className="w-3 h-3 text-slate-400" /> 打印
                              </button>

                              {isPending ? (
                                <button 
                                  onClick={() => {
                                    const updated = orders.map(o => o.id === ord.id ? { ...o, status: 'Shipped' as const } : o);
                                    onUpdateOrders(updated);
                                    addLog('WMS Shipping Suite', 'DHL Cargo Dispatched', `一键运发订单 ${ord.id} 至跨境干线配送`, 'success');
                                    showNotice('订单干线交割', `✓ 订单 #${ord.id} 已经成功发货并交割给 DHL 承运！`, 'success');
                                  }}
                                  className="bg-[#07C2E3] text-slate-950 font-black px-3 py-1.5 rounded-lg hover:bg-[#06B2D0] cursor-pointer transition-all duration-150 active:scale-95 flex items-center gap-1 leading-none text-[10.5px]"
                                >
                                  <Truck className="w-3.5 h-3.5" /> 发货
                                </button>
                              ) : (
                                <button 
                                  onClick={() => {
                                    showNotice('DHL 物流分拨追踪', `物流追踪号: DHL-REG-${ord.id}\n当前节点: 法国巴黎干线处理中心集散中\n预计送达时效: 2 天内送达。`, 'info');
                                  }}
                                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 font-extrabold rounded-lg tracking-tight transition-all active:scale-95 cursor-pointer flex items-center gap-1 leading-none text-[9.5px]"
                                >
                                  查看物流
                                </button>
                              )}

                              <button 
                                onClick={() => showNotice('订单完整账面详情', `订单编号: ${ord.id}\n买家: ${ord.customerName}\n支付状态: 在线代扣结算成功\n当前履约阶段: ${ord.status === 'Pending' ? '待发货' : ord.status === 'Shipped' ? '运输中' : ord.status === 'Completed' ? '已完成' : '退款中'}`, 'info')}
                                className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer transition-all duration-150 active:scale-95"
                              >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    });
                  })()}
                </div>

                {/* 7. Bulk Action Sticky Bar at the bottom (fully interactive and high fidelity) */}
                <div className="absolute bottom-11 left-0 right-0 bg-white/95 border-t border-slate-100/80 py-2.5 px-4 flex items-center justify-between select-none z-30 shadow-[-2px_-4px_16px_rgba(0,0,0,0.03)] text-[10px] backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        if (selectedOrderIds.length === orders.length) {
                          setSelectedOrderIds([]);
                        } else {
                          setSelectedOrderIds(orders.map(o => o.id));
                        }
                      }}
                      className="w-4 h-4 rounded border border-slate-300 bg-slate-50 flex items-center justify-center cursor-pointer"
                    >
                      {selectedOrderIds.length === orders.length && orders.length > 0 && <Check className="w-3 h-3 text-slate-800 font-black stroke-[3]" />}
                    </button>
                    <span className="text-slate-500 font-bold">
                      已选择 <strong className="text-[#07C2E3] font-mono text-[11px] font-black">{selectedOrderIds.length}</strong> 项
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => {
                        if (selectedOrderIds.length === 0) {
                          showNotice('操作未就绪', '请先选择需要发货履约的订单！', 'warning');
                          return;
                        }
                        const updated = orders.map(o => selectedOrderIds.includes(o.id) && o.status === 'Pending' ? { ...o, status: 'Shipped' as const } : o);
                        onUpdateOrders(updated);
                        setSelectedOrderIds([]);
                        addLog('WMS Command Center', 'Bulk Dispatched', `批量一键发货 ${selectedOrderIds.length} 个包裹`, 'success');
                        showNotice('批量发货完成', `✓ 批量发货成功！已交割签发 ${selectedOrderIds.length} 张 DHL 快捷运单！`, 'success');
                      }}
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 bg-white border border-slate-200 rounded-lg font-bold cursor-pointer transition-all active:scale-95"
                    >
                      批量发货
                    </button>
                    <button 
                      onClick={() => {
                        if (selectedOrderIds.length === 0) {
                          showNotice('操作未就绪', '请先选择要批量打印的订单！', 'warning');
                          return;
                        }
                        addLog('Printer Network', 'Bulk Invoice Print', `批量打印 DHL 面单数量: ${selectedOrderIds.length}`, 'tool');
                        showNotice('批量面单打印', `✓ 成功传送 ${selectedOrderIds.length} 张 DHL 包裹单，外设正在处理...`, 'success');
                      }}
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 bg-white border border-slate-200 rounded-lg font-bold cursor-pointer transition-all active:scale-95"
                    >
                      批量打印
                    </button>
                    <button 
                      onClick={() => {
                        if (selectedOrderIds.length === 0) {
                          showNotice('操作未就绪', '请先选择要导出的订单结算账目！', 'warning');
                          return;
                        }
                        showNotice('出纳 CSV 数据包', `✓ 批量导出成功！包含 ${selectedOrderIds.length} 笔多币种明细。`, 'success');
                      }}
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 bg-white border border-slate-200 rounded-lg font-bold cursor-pointer transition-all active:scale-95 invisible xs:visible"
                    >
                      导出订单
                    </button>
                    <button 
                      onClick={() => {
                        if (selectedOrderIds.length === 0) {
                          showNotice('操作未就绪', '请先选择需要作废取消的临时草稿单！', 'warning');
                          return;
                        }
                        const updated = orders.map(o => selectedOrderIds.includes(o.id) && o.status === 'Pending' ? { ...o, status: 'Cancelled' as const } : o);
                        onUpdateOrders(updated);
                        setSelectedOrderIds([]);
                        addLog('SaaS Core Engine', 'Bulk Cancellation', `批量作废订单 ${selectedOrderIds.length} 件`, 'warning');
                        showNotice('批量作废成功', `✓ 批量作废已执行！已终止处理 ${selectedOrderIds.length} 笔款项。`, 'warning');
                      }}
                      className="px-2.5 py-1.5 text-rose-600 bg-rose-50 border border-rose-200 rounded-lg font-bold cursor-pointer transition-all active:scale-95 hover:bg-rose-100"
                    >
                      批量取消
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

            {/* SUB-SCREEN 4: ONLINE STORE CUSTOMER VIEWPORT (一句话开店 / 客人端体验专区) */}
            {!subView && activeTab === 'account' && (
              <motion.div 
                key="online-store-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-4 space-y-4 flex-1 text-left flex flex-col overflow-y-auto bg-slate-50/50"
              >
                {/* Store Header Identity */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-4 border border-slate-800 shadow-md relative overflow-hidden shrink-0">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#07C2E3]/15 rounded-full filter blur-xl animate-pulse" />
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#07C2E3]/20 flex items-center justify-center border border-[#07C2E3]/40">
                        <Store className="w-4 h-4 text-[#07C2E3]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">{companyName || 'Hygge Space'}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[8px] font-mono text-slate-300 font-extrabold uppercase tracking-widest">● LIVE ONLINE STORE</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] bg-[#07C2E3]/20 text-[#07C2E3] font-bold py-1 px-2.5 rounded-full border border-[#07C2E3]/30 uppercase tracking-wider font-mono">
                      一句话开店
                    </span>
                  </div>
                </div>

                {/* Simulated Buyer Concept Badge (客人角度看商店说明) */}
                <div className="bg-amber-50/90 border border-amber-200/60 rounded-2xl p-3.5 shadow-xs space-y-1.5 select-none text-left">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-amber-800 font-display">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    <span>💡 客人视角体验专区 (Customer Sandbox)</span>
                  </div>
                  <p className="text-[10px] text-slate-650 leading-relaxed font-medium">
                    当前展示的是 <b>AURA 智能全自动托管生成</b> 的极致响应级在线网店（客人端）。您可以<b>直接点击下方货架商品下单</b>，系统将真实进行跨境汇率清算、触发仓库库存扣减，并将该买家订单无缝同步到<b>“订单 (Orders)”</b>一栏！
                  </p>
                </div>

                {/* Featured Promo Hero banner Card */}
                <div className="bg-white border border-slate-150 rounded-2xl p-3.5 shadow-xs relative overflow-hidden select-none">
                  <div className="absolute right-[-10px] bottom-[-10px] text-slate-100 font-black text-7xl font-sans opacity-25">OS</div>
                  <span className="text-[8px] bg-indigo-50 text-indigo-600 font-black tracking-widest px-2 py-0.5 rounded-md uppercase font-mono">NEW ARRIVAL</span>
                  <h5 className="text-xs font-black text-slate-900 mt-1 leading-tight tracking-tight">北欧极简美学馆首测版开启</h5>
                  <p className="text-[10px] text-slate-450 mt-1 pb-1">直属合规供应链极速配发，欧盟核心成员国直发，48小时清关交邮。</p>
                </div>

                {/* Horizontal Category Chips */}
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none select-none shrink-0 font-bold">
                  {['全部精品', '热销推荐', '极简生活', '保税闪送'].map((cat, cIdx) => (
                    <button 
                      key={cIdx} 
                      className={`text-[9.5px] px-3 py-1.5 rounded-xl whitespace-nowrap transition-all duration-150 ${cIdx === 0 ? 'bg-slate-900 border border-slate-900 text-white' : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Products Marketplace Grid */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between select-none">
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">极简精品货架 ({products.length})</h5>
                    <span className="text-[9px] text-[#07C2E3] font-mono font-bold">按热度排序 ↑</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pb-8">
                    {products.map((prod, pIdx) => {
                      const finalImg = prod.imageUrl || defaultImages[prod.name] || defaultImages['default'];
                      const isOutOfStock = prod.stock <= 0;
                      return (
                        <div 
                          key={prod.id || pIdx} 
                          className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#07C2E3]/20 flex flex-col justify-between text-left"
                        >
                          <div className="relative aspect-square w-full bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
                            <img 
                              src={finalImg} 
                              alt={prod.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            {isOutOfStock ? (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center font-bold text-[9px] text-white uppercase select-none">
                                Sold Out / 售罄
                              </div>
                            ) : (
                              <span className="absolute top-1.5 right-1.5 bg-black/50 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded leading-none select-none">
                                {prod.stock} left
                              </span>
                            )}
                          </div>

                          <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
                            <div>
                              <h6 className="text-[10.5px] font-extrabold text-slate-900 line-clamp-1 leading-tight font-sans text-left">{prod.name}</h6>
                              <div className="flex items-baseline gap-1 mt-1 font-mono">
                                <span className="text-[11px] font-black text-slate-950">${prod.price}</span>
                                <span className="text-[8.5px] text-slate-400 line-through">${(prod.price * 1.3).toFixed(1)}</span>
                              </div>
                            </div>

                            <button 
                              onClick={() => {
                                setViewCustomerPageProduct(prod);
                                setQuantitySelected(1);
                              }}
                              className={`w-full py-2 rounded-xl text-[9.5px] font-black leading-none text-center flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer ${
                                isOutOfStock 
                                  ? 'bg-slate-100 text-slate-400 border border-slate-150 cursor-not-allowed' 
                                  : 'bg-slate-900 border border-slate-900 text-white hover:bg-black shadow-xs'
                              }`}
                              disabled={isOutOfStock}
                            >
                              <ShoppingCart className="w-2.5 h-2.5" />
                              <span>购买 &amp; 体验</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>

          {/* DYNAMIC PUBLIC CUSTOMER VIEW / IMAGE 3 (NORDIC SHOPPING DETAILS PAGE) */}
          <AnimatePresence>
            {viewCustomerPageProduct && (
              <motion.div 
                key="customer-product-detail-view"
                initial={{ transform: 'translateX(100%)' }}
                animate={{ transform: 'translateX(0%)' }}
                exit={{ transform: 'translateX(100%)' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="absolute inset-0 bg-white flex flex-col z-[45] font-sans pb-11 overflow-hidden"
              >
                {/* Header detail from spec image 3 */}
                <div className="bg-[#FAF9FA] text-black h-12 border-b border-slate-200 flex items-center justify-between px-5 select-none shrink-0 relative">
                  <button 
                    onClick={() => {
                      setViewCustomerPageProduct(null);
                      setOrderCreatedSuccess(false);
                    }}
                    className="flex items-center gap-1.5 text-xs text-slate-800 hover:text-slate-900 font-extrabold cursor-pointer leading-none"
                  >
                    &larr; <span className="font-sans font-bold uppercase tracking-tight text-[11px]">NORDIC</span>
                  </button>

                  <div className="absolute left-1/2 -translate-x-1/2 text-xs font-black uppercase tracking-widest font-sans select-none pointer-events-none">
                    PRODUCT REVIEW
                  </div>

                  <div className="flex gap-3">
                    <button className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer">
                      <Search className="w-4 h-4" />
                    </button>
                    <div className="p-1 text-slate-800 hover:text-slate-900 cursor-pointer relative" onClick={() => setActiveTab('orders')}>
                      <ShoppingCart className="w-4 h-4" />
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-black text-white text-[8px] font-bold text-center rounded-full leading-normal">
                        1
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scrollable details view content */}
                <div className="flex-1 overflow-y-auto bg-white p-5 space-y-6 text-left">
                  
                  {/* Photo details with visual pagination mockup */}
                  <div className="relative w-full aspect-[4/3] rounded-3xl bg-slate-50 border border-slate-105 flex items-center justify-center overflow-hidden">
                    <img 
                      src={viewCustomerPageProduct.imageUrl || defaultImages[viewCustomerPageProduct.name] || defaultImages['default']} 
                      alt={viewCustomerPageProduct.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating Side carousel previews (Image 3) */}
                    <div className="absolute left-3 top-3 flex flex-col gap-1.5 select-none shrink-0 text-xs">
                      {[1, 2, 3, 4].map((prevNo) => (
                        <div key={prevNo} className="w-10 h-10 rounded bg-white shadow border border-slate-200/80 overflow-hidden opacity-85 active:opacity-100 cursor-pointer">
                          <img 
                            src={viewCustomerPageProduct.imageUrl || defaultImages[viewCustomerPageProduct.name] || defaultImages['default']} 
                            alt={`Preview ${prevNo}`} 
                            className="w-full h-full object-cover scale-[1.10]"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>

                    <span className="bg-black/50 text-white font-mono font-bold tracking-wider text-[8px] px-2 py-0.5 rounded-full absolute bottom-4 right-4 leading-none select-none">
                      1 / 5
                    </span>
                  </div>

                  {/* Main Product metadata */}
                  <div className="space-y-1">
                    <span className="text-[9px] text-[#07C2E3] font-mono tracking-widest font-black uppercase">NEW ARRIVAL</span>
                    <h2 className="text-xl font-black text-slate-950 font-display leading-tight">{viewCustomerPageProduct.name}</h2>
                    
                    <div className="flex items-baseline gap-2 font-mono">
                      <span className="text-lg font-black text-slate-900">${viewCustomerPageProduct.price}</span>
                      <span className="text-xs text-slate-400 line-through">${(viewCustomerPageProduct.price * 1.3).toFixed(2)}</span>
                    </div>

                    {/* Star review ratings */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1">
                      <div className="flex gap-0.5 text-amber-500">
                        {['★', '★', '★', '★', '★'].map((star, sIdx) => <span key={sIdx}>{star}</span>)}
                      </div>
                      <span className="text-[10px] font-bold text-slate-800">4.8 (128 reviews)</span>
                    </div>
                  </div>

                  {/* Body description */}
                  <div className="space-y-2 text-xs leading-relaxed text-slate-600 font-normal">
                    <p>
                      {viewCustomerPageProduct.description || 'A perfect blend of comfort and style. Tailored with a solid wood frame and premium upholstery, engineered explicitly for cozy and minimalist workspaces.'}
                    </p>
                  </div>

                  {/* Custom color picker circles (Image 3) */}
                  <div className="space-y-2 select-none">
                    <span className="block text-[10px] font-mono uppercase font-bold text-slate-400">Color: Natural Beige</span>
                    <div className="flex gap-2">
                      {['#E5D9C4', '#556B2F', '#808080', '#1C1C1F'].map((colorCode) => {
                        const isChosen = shopperColor === colorCode;
                        return (
                          <button
                            key={colorCode}
                            onClick={() => setShopperColor(colorCode)}
                            className={`w-8 h-8 rounded-full border-2 transition-all active:scale-90 cursor-pointer ${isChosen ? 'border-indigo-600 ring-2 ring-indigo-120 shadow-md' : 'border-slate-200'}`}
                            style={{ backgroundColor: colorCode }}
                            title={`Color selected ${colorCode}`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantity selector (Picture 3 style) */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-mono uppercase font-bold text-slate-400">Quantity</span>
                    <div className="w-28 flex items-center justify-between border-2 border-slate-200 rounded-lg p-1 text-xs select-none">
                      <button 
                        onClick={() => setQuantitySelected(prev => Math.max(1, prev - 1))}
                        className="w-7 h-7 text-center rounded hover:bg-slate-50 cursor-pointer font-bold shrink-0 leading-none text-base"
                      >
                        -
                      </button>
                      <span className="font-mono font-black">{quantitySelected}</span>
                      <button 
                        onClick={() => setQuantitySelected(prev => Math.min(20, prev + 1))}
                        className="w-7 h-7 text-center rounded hover:bg-slate-50 cursor-pointer font-bold shrink-0 leading-none text-base"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Dynamic CTA transaction buttons (Buy now slide overlay creator) */}
                  <div className="space-y-2 border-t pt-4">
                    {orderCreatedSuccess ? (
                      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5 text-center animate-fadeIn">
                        <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                        <h4 className="text-xs font-black text-slate-900 leading-snug tracking-wider uppercase">✓ ORDER PLACED SUCCESSFULLY</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-normal">
                          Thank you for your purchase! Your order has been registered and sent directly to the merchant. You can verify and print the invoice under the Orders tab.
                        </p>
                        <button 
                          onClick={() => {
                            setViewCustomerPageProduct(null);
                            setOrderCreatedSuccess(false);
                            setActiveTab('orders');
                          }}
                          className="w-full bg-slate-950 text-white text-[10px] font-bold py-2.5 rounded-xl hover:bg-black transition-colors leading-none tracking-tight cursor-pointer"
                        >
                          View in Orders Center
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button 
                          onClick={() => {
                            addLog('Shopping Bag', 'Item Added', `${viewCustomerPageProduct.name} 已打包`, 'tool');
                            showNotice('Added to Cart', `✓ ${viewCustomerPageProduct.name} has been successfully added to your cart!`, 'success');
                          }}
                          className="flex-1 bg-white hover:bg-slate-50 border-2 border-slate-900 text-slate-900 text-xs font-extrabold py-3 rounded-xl transition-all active:scale-95 text-center leading-none cursor-pointer"
                        >
                          Add to Cart
                        </button>
                        <button 
                          onClick={handleShopperBuyNow}
                          className="flex-1 bg-slate-950 hover:bg-black text-white text-xs font-extrabold py-3 rounded-xl transition-all active:scale-95 text-center leading-none cursor-pointer shadow-md"
                        >
                          Buy Now
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Policy descriptions (From Picture 3) */}
                  <div className="pt-4 grid grid-cols-3 gap-2.5 text-[9px] text-slate-500 border-t border-slate-105 italic">
                    <div className="flex flex-col items-center text-center space-y-1 select-none">
                      <Truck className="w-5 h-5 text-slate-400 shrink-0" />
                      <span><b>Free Shipping</b><br />On orders over $100</span>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-1 select-none">
                      <ChevronRight className="w-5 h-5 text-slate-400 rotate-90 shrink-0" />
                      <span><b>Easy Returns</b><br />30-day return policy</span>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-1 select-none">
                      <Check className="w-5 h-5 text-slate-400 shrink-0" />
                      <span><b>Secure Checkout</b><br />100% secure payment</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DYNAMIC COMPONENT 5: INTELLIGENT COMMAND PALETTE DRAWER SLIDE (DRAWER) */}
          <AnimatePresence>
            {commandPaletteOpen && (
              <motion.div 
                key="command-palette-bezel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex flex-col justify-end p-4 select-none"
              >
                {/* Close backdrop */}
                <div className="absolute inset-0 z-10" onClick={() => setCommandPaletteOpen(false)} />
                
                {/* Slide dialog casing */}
                <motion.div 
                  initial={{ y: 80 }}
                  animate={{ y: 0 }}
                  exit={{ y: 80 }}
                  className="bg-white rounded-[32px] p-5 w-full border border-slate-200 shadow-2xl relative z-20 space-y-4 max-h-[480px] overflow-y-auto"
                >
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800 font-mono">
                      <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                      <span>ECOS CORE COMMAND PALETTE</span>
                    </div>
                    <button 
                      onClick={() => setCommandPaletteOpen(false)}
                      className="p-1 hover:bg-slate-100 rounded-full cursor-pointer"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  {/* Form trigger box */}
                  <form onSubmit={handleCommandSubmit} className="relative">
                    <input 
                      type="text" 
                      value={commandSearch}
                      onChange={(e) => setCommandSearch(e.target.value)}
                      placeholder="输入指令: 员工, 优惠券, 查看利润..."
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none"
                      autoFocus
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    <button 
                      type="submit"
                      className="absolute right-2.5 top-2.5 p-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-95"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  {/* Command output display log */}
                  {customCommandResult ? (
                    <div className="p-3 bg-slate-900 text-emerald-400 border border-slate-800 rounded-xl text-left text-[11px] font-mono leading-relaxed shadow-inner">
                      <span className="text-[8px] text-zinc-500 select-none block mb-1">COMMAND OUTPUT:</span>
                      <p>{customCommandResult}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-left">
                      <span className="text-[9px] font-mono uppercase font-black text-slate-400">推荐快捷指令</span>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        {[
                          { lbl: '👥 全体员工管理', q: '员工' },
                          { lbl: '🎫 创建降配优惠券', q: '创建优惠券' },
                          { lbl: '📈 测算财务利润', q: '查看利润' },
                          { lbl: ' WMS 智能采购', q: '库存采购' }
                        ].map((rec, rIdx) => (
                          <button
                            key={rIdx}
                            type="button"
                            onClick={() => {
                              setCommandSearch(rec.q);
                              setTimeout(() => {
                                handleCommandSubmit();
                              }, 80);
                            }}
                            className="p-2 border border-slate-200/80 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-black font-semibold text-center transition-colors cursor-pointer capitalize leading-none"
                          >
                            {rec.lbl}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DYNAMIC COMPONENT 6: PUBLISHING MODAL DRAWER WITH PHOTO PREVIEW & UPLOADS */}
          <AnimatePresence>
            {publishingOpen && (
              <motion.div 
                key="publishing-drawer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex flex-col justify-end p-4 select-none"
              >
                <div className="absolute inset-0 z-10" onClick={() => setPublishingOpen(false)} />

                <motion.div 
                  initial={{ y: 80 }}
                  animate={{ y: 0 }}
                  exit={{ y: 80 }}
                  className="bg-white rounded-[32px] p-5 w-full border border-slate-200 shadow-2xl relative z-20 space-y-4 max-h-[640px] overflow-y-auto text-left flex flex-col"
                >
                  <div className="flex justify-between items-center pb-2 border-b shrink-0">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800">
                      <Camera className="w-4 h-4 text-indigo-500 animate-pulse" />
                      <span>发布商品 (上传拍图 3 详情单页)</span>
                    </div>
                    <button onClick={() => setPublishingOpen(false)} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  <form onSubmit={handlePublishProduct} className="space-y-4 flex-1">
                    
                    {/* PHOTO UPLOAD SELECTOR (SPEC KEYSTONE) */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono uppercase font-black text-slate-400">实拍货品图像 (Upload Product Photo)</label>
                      <div className="border-2 border-dashed border-slate-250 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden h-36 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-all">
                        
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer z-30" 
                        />

                        {newProdImage ? (
                          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center">
                            <img 
                              src={newProdImage} 
                              alt="Upload preview" 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute bottom-2 inset-x-2 bg-black/60 text-white font-mono text-[9px] p-1 rounded-md text-center backdrop-blur-sm z-30 select-none">
                              ✓ 图片加载渲染完成
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5 flex flex-col items-center text-slate-450 z-20">
                            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-full">
                              <Camera className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-700">点击拍照或上传货品快照</span>
                            <span className="text-[9px] text-slate-400">支持 Drag &amp; Drop / JPEG, PNG</span>
                          </div>
                        )}
                        
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-605 transition-all" style={{ width: `${uploadProgress}%` }} />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono uppercase font-black text-slate-400">商品名称 (Product Title)</label>
                      <input 
                        type="text" 
                        required
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="例如: Luna Lounge Chair"
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono uppercase font-black text-slate-400">标价 / Price ($)</label>
                        <input 
                          type="text" 
                          required
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value)}
                          placeholder="499.00"
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono uppercase font-black text-slate-400">初始库存 (Stock)</label>
                        <input 
                          type="number" 
                          required
                          value={newProdStock}
                          onChange={(e) => setNewProdStock(e.target.value)}
                          placeholder="100"
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono uppercase font-black text-slate-400">详情详情文案 (Long Description)</label>
                      <textarea 
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        placeholder="描述您的货品设计特性..."
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-1.5 text-xs text-slate-905 h-16 resize-none focus:outline-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-slate-950 hover:bg-black text-white text-xs font-extrabold py-3.5 rounded-xl transition-all active:scale-95 text-center leading-none cursor-pointer shadow-md shrink-0 block"
                    >
                      立即发布单页 &rarr;
                    </button>

                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DYNAMIC COMPONENT 7: SHARING AND COPY LINKS DIALOG OVERLAY */}
          <AnimatePresence>
            {showShareModal && (
              <motion.div 
                key="share-modal-bezel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-[55] flex items-center justify-center p-5 select-none"
              >
                <div className="bg-white rounded-[32px] p-6 max-w-sm w-full border border-slate-205 shadow-2xl relative space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-black text-slate-905 text-base tracking-tight font-display">✓ PUBLISHED TO NORDIC DUMP</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                      货品单图详情生成器运行完成！已成功构建高保真专属客单单页。发给您的买家/朋友即可直接预订下单！
                    </p>
                  </div>

                  {/* Share code box representation */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between font-mono text-[10px] text-slate-600">
                    <span className="truncate max-w-[210px] select-all">{sharedProductLink}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(sharedProductLink);
                        setLinkCopied(true);
                        setTimeout(() => setLinkCopied(false), 2000);
                        addLog('AI Command Suite', 'Share Link Copied', '已将实地货架客单链接存入系统剪切板', 'info');
                      }}
                      className="p-1.5 hover:bg-slate-200 rounded text-indigo-650 cursor-pointer shrink-0 transition-colors"
                      title="点击复制付款账目链接"
                    >
                      {linkCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Operational actions: Open shopper preview immediately inside frame */}
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        const justPublished = products[0];
                        setViewCustomerPageProduct(justPublished);
                        setShowShareModal(false);
                      }}
                      className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-slate-950 text-xs font-black py-3 rounded-xl shadow-md transition-all cursor-pointer leading-none block"
                    >
                      打开客单级购物分享单页 preview
                    </button>
                    <button 
                      onClick={() => {
                        setShowShareModal(false);
                        setActiveTab('products');
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      返回商品大盘继续浏览
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium In-app Toast / Notification system mimicking high-end native iOS/Android bubble */}
          <AnimatePresence>
            {inAppNotice && (
              <motion.div
                initial={{ opacity: 0, y: -40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute top-14 left-4 right-4 bg-slate-900 border border-slate-800 text-white p-3.5 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.18)] z-[60] flex items-start gap-2.5 font-sans"
              >
                <div className="flex-1 text-left min-w-0">
                  <h4 className="text-xs font-black tracking-tight text-[#07C2E3] uppercase mb-0.5">{inAppNotice.title}</h4>
                  <p className="text-[10px] text-slate-300 leading-normal font-normal whitespace-pre-wrap">{inAppNotice.message}</p>
                </div>
                <button 
                  onClick={() => setInAppNotice(null)}
                  className="text-slate-400 hover:text-white shrink-0 p-0.5 rounded-full hover:bg-slate-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Dynamic bottom navigation bar featuring micro interactive triggers (4 Tabs: Home, Products, Orders, Client Grid) */}
        <footer className="bg-white border-t border-slate-200 px-6 py-2.5 h-[72px] flex items-center justify-between z-40 shrink-0 select-none">
          {[
            { id: 'home', label: 'Home', icon: Home, chinese: '首页' },
            { id: 'products', label: 'Products', icon: ShoppingBag, chinese: '商品' },
            { id: 'orders', label: 'Orders', icon: ShoppingCart, chinese: '订单' },
            { id: 'account', label: '在线商店', icon: Globe, chinese: '在线商店' }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isTabActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  addLog('Navigation', 'PWA Bottom Navigation', `切换至移动端「${tab.chinese}」视图`, 'info');
                }}
                className="flex flex-col items-center justify-center space-y-1 relative cursor-pointer active:scale-95 transition-all text-center flex-1 h-full"
              >
                {/* Active dot background */}
                {isTabActive && (
                  <motion.div 
                    layoutId="pwa-active-tab-glow"
                    className="absolute -top-1 w-6 h-1 rounded-full bg-[#07C2E3] "
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <IconComponent className={`w-5 h-5 transition-transform duration-200 ${isTabActive ? 'text-[#07C2E3] scale-110' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className={`text-[10px] tracking-tight transition-colors ${isTabActive ? 'text-slate-950 font-black' : 'text-slate-400 font-semibold'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </footer>

        {/* Home gesture indicator bar for pure realistic PWA aesthetics */}
        <div className="bg-white h-4 w-full flex items-center justify-center shrink-0 border-t border-slate-50">
          <div className="w-32 h-1 bg-[#CBD5E1] rounded-full" />
        </div>

        {/* Sliding Menu Overlay & Drawer */}
        {isSideMenuOpen && (
          <div className="absolute inset-0 z-50 overflow-hidden">
            {/* Overlay */}
            <div 
              onClick={() => setIsSideMenuOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity cursor-pointer" 
            />
            
            {/* Drawer */}
            <div className="absolute top-0 left-0 bottom-0 w-[260px] bg-white shadow-2xl flex flex-col text-left font-sans animate-slideRight">
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-[#07C2E3]/15 flex items-center justify-center border border-[#07C2E3]/35">
                    <Sparkles className="w-3 h-3 text-[#07C2E3]" />
                  </div>
                  <span className="text-[11px] font-black tracking-widest text-slate-800 uppercase">OS 功能导航</span>
                </div>
                <button 
                  onClick={() => setIsSideMenuOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body (Navigation list) */}
              <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4 select-none">
                {/* Operations Section */}
                <div className="space-y-1">
                  <div className="px-3 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">业务运营中枢</div>
                  {[
                    { label: '客户分组管理', icon: Users, isSelected: subView === 'customers', action: () => { setSubView('customers'); setSettingsSubTab(null); } },
                    { label: '促销优惠中心', icon: Megaphone, isSelected: subView === 'marketing', action: () => { setSubView('marketing'); setSettingsSubTab(null); } },
                    { label: '财务结算大盘', icon: DollarSign, isSelected: subView === 'finance', action: () => { setSubView('finance'); setSettingsSubTab(null); } },
                    { label: '智能供应链WMS', icon: Truck, isSelected: subView === 'logistics', action: () => { setSubView('logistics'); setSettingsSubTab(null); } },
                    { label: 'AI智能员工集群', icon: Sparkles, isSelected: subView === 'agents', action: () => { setSubView('agents'); setSettingsSubTab(null); } },
                    { label: '应用生态市场', icon: Package, isSelected: subView === 'apps', action: () => { setSubView('apps'); setSettingsSubTab(null); } },
                    { label: '开发者沙箱控制', icon: Sliders, isSelected: subView === 'developer', action: () => { setSubView('developer'); setSettingsSubTab(null); } }
                  ].map((item, idx) => {
                    const Icon = item.icon || Home;
                    return (
                      <button
                        key={`op-${idx}`}
                        onClick={() => {
                          item.action();
                          setIsSideMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          item.isSelected 
                            ? 'bg-[#07C2E3]/15 text-[#07C2E3] font-bold text-xs' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold text-xs'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${item.isSelected ? 'text-[#07C2E3]' : 'text-slate-400'}`} />
                        <span className="leading-none">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Settings Section */}
                <div className="space-y-1">
                  <div className="px-3 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">系统自愈与安全配置</div>
                  {[
                    { label: '🏪 门面常规设置', icon: Store, tab: 'general' },
                    { label: '💳 支付网关清算', icon: CreditCard, tab: 'payments' },
                    { label: '🛒 结账流程定制', icon: ShoppingCart, tab: 'checkout' },
                    { label: '📦 配送自提履约', icon: Truck, tab: 'shipping' },
                    { label: '🧾 跨境税费合规', icon: Percent, tab: 'taxes' },
                    { label: '📍 库配物理地点', icon: MapPin, tab: 'locations' },
                    { label: '👥 雇员席位授权', icon: Users, tab: 'users' },
                    { label: '🌐 自定义域名绑定', icon: Globe, tab: 'domains' },
                    { label: '📋 商店合规政策', icon: FileText, tab: 'policies' },
                    { label: '🔒 数据隐私安全', icon: Lock, tab: 'privacy' },
                    { label: '🌐 商店多语言设置', icon: Languages, tab: 'languages' },
                    { label: '🌓 黑白视觉主题', icon: Moon, tab: 'theme' }
                  ].map((item, idx) => {
                    const Icon = item.icon || Settings;
                    const isSelected = subView === 'settings' && settingsSubTab === item.tab;
                    return (
                      <button
                        key={`set-${idx}`}
                        onClick={() => {
                          setSubView('settings');
                          setSettingsSubTab(item.tab as any);
                          setIsSideMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#07C2E3]/15 text-[#07C2E3] font-bold text-xs' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold text-xs'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#07C2E3]' : 'text-slate-400'}`} />
                        <span className="leading-none">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
