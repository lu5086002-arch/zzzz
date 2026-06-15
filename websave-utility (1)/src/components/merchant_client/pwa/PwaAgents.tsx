import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Brain, Cpu, ShieldCheck } from 'lucide-react';

interface PwaAgentsProps {
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  showNotice: (title: string, message: string, type: 'success' | 'info' | 'warning') => void;
  onBack: () => void;
}

export default function PwaAgents({ addLog, showNotice, onBack }: PwaAgentsProps) {
  const [agentModels, setAgentModels] = useState<Record<string, string>>({
    'Sofia (设计)': 'Gemini 2.5 Flash',
    'Oliver (供应链)': 'Gemini 2.5 Flash',
    'Audit (财务)': 'Gemini 2.5 Pro',
    'Victor (营销)': 'Gemini 3.5 Flash'
  });

  const handleModelChange = (agent: string, model: string) => {
    setAgentModels(prev => ({ ...prev, [agent]: model }));
    addLog('AI Swarm Orchestration', '切换智能体底层模型规格', `成功将 智体：${agent} 底层推理切换至: ${model}`, 'success');
    showNotice(
      '智能架构重构就绪',
      `✓ 智体「${agent}」已物理重载到 ${model} 模型，并开始接力全渠道自愈计算！`,
      'success'
    );
  };

  const agentDetails = [
    { name: 'Sofia (设计)', subtitle: '创意智脑 / 商品设计素材渲染', status: '在线中', color: 'emerald' },
    { name: 'Oliver (供应链)', subtitle: '货备智核 / 低库存采购对接', status: '在线中', color: 'emerald' },
    { name: 'Audit (财务)', subtitle: '会计智算 / 跨境VAT与Stripe清算', status: '精算中', color: '#07C2E3' },
    { name: 'Victor (营销)', subtitle: '自愈智客 / 废契挽回、直邮、拉新', status: '推广中', color: 'indigo' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-full">
      {/* Sub Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-3 shrink-0">
        <button onClick={onBack} className="p-1 rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-left">
          <h2 className="text-sm font-bold text-slate-800">AI 人工智能员工集群</h2>
          <p className="text-[10px] text-slate-400">配置您定制化雇佣的多租户 Autonomous Agents</p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto text-left">
        {/* Swarm Global Config */}
        <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 relative overflow-hidden">
          <div className="absolute right-2 bottom-2 opacity-10">
            <Sparkles className="w-20 h-20 text-[#07C2E3]" />
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#07C2E3] animate-pulse" />
            <h4 className="text-xs font-black text-[#07C2E3] uppercase tracking-wider">智能协作集群节点 1.25x</h4>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
            当前正通过双向网关实时追踪您的所有订单支付与实盘库存变化，发现异常自动就位拦截，并将推演决策实时存入底层。
          </p>
        </div>

        {/* Swarm List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">配置智能体后台模型驱动</h4>

          <div className="space-y-3">
            {agentDetails.map((agent, idx) => (
              <div key={idx} className="bg-white border border-slate-100 p-3 rounded-xl space-y-2 shadow-xs">
                <div className="flex items-start justify-between">
                  <div className="text-left">
                    <p className="text-xs font-black text-slate-800 leading-none">{agent.name}</p>
                    <p className="text-[9px] text-slate-400 font-semibold mt-1">{agent.subtitle}</p>
                  </div>
                  <span className="text-[8px] bg-emerald-50 text-emerald-500 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{agent.status}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <span className="text-[9px] text-slate-400 font-bold">LLM主力模型：</span>
                  <select
                    value={agentModels[agent.name]}
                    onChange={(e) => handleModelChange(agent.name, e.target.value)}
                    className="bg-slate-50 border border-slate-100 text-slate-700 text-[10px] rounded-lg p-1 outline-none font-bold font-mono text-right cursor-pointer"
                  >
                    <option value="Gemini 2.5 Flash">Gemini 2.5 Flash</option>
                    <option value="Gemini 3.5 Flash">Gemini 3.5 Flash</option>
                    <option value="Gemini 3.5 Pro">Gemini 3.5 Pro</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
