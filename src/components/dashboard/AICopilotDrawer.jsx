import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Database, 
  Terminal, 
  CheckCircle2, 
  Zap, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

export default function AICopilotDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: "Hello Admin! I'm AppDynamics AI Copilot. I've detected a Critical Incident on the **Checkout Service**. Would you like me to generate a SQL index migration or analyze recent trace latency?",
      timestamp: '17:22'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "Why is Checkout Service degraded?",
    "Show SQL migration fix",
    "List affected microservices",
    "Auto-scale Order Service pods"
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let responseText = "Analyzing system telemetry across cluster...";
      if (query.toLowerCase().includes("sql") || query.toLowerCase().includes("migration") || query.toLowerCase().includes("fix")) {
        responseText = `Here is the recommended PostgreSQL migration to resolve the table scan on \`orders\`:\n\`\`\`sql\nCREATE INDEX CONCURRENTLY idx_orders_user_id \nON orders (user_id);\n\`\`\`\nApplying this index concurrently will eliminate query lockup without locking writes.`;
      } else if (query.toLowerCase().includes("why") || query.toLowerCase().includes("degraded") || query.toLowerCase().includes("checkout")) {
        responseText = "The Checkout Service degradation is caused by unindexed `SELECT * FROM orders WHERE user_id = $1` queries in `OrderService.java`. The table contains 18.4M records, resulting in 4.2-second sequential file scans.";
      } else if (query.toLowerCase().includes("scale")) {
        responseText = "Initiating automated Kubernetes pod scaling for `order-service` deployment from 6 to 14 replicas. Target HPA CPU target set to 60%.";
      } else {
        responseText = `AppDynamics AI evaluated telemetry for "${query}". All microservice traces point to database query latency on cluster \`pg-primary-us-east-1\`. Confidence score: 92%.`;
      }

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const copyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-lg bg-[#070E27] border-l border-purple-500/30 h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20 border border-purple-400/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">AppDynamics AI Copilot</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  GPT-4o Observability
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Autonomous Incident Diagnostic Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          
          {/* Quick Prompt Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Suggested AI Queries
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-purple-900/30 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-300 hover:text-purple-200 transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
              }`}>
                <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                {msg.text.includes("```sql") && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-purple-500/30 font-mono text-xs text-purple-300 relative group">
                    <button
                      onClick={() => copyCode("CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders (user_id);")}
                      className="absolute top-2 right-2 p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <code>CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders (user_id);</code>
                  </div>
                )}

                <div className="text-[10px] opacity-60 text-right">{msg.timestamp}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-purple-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AppDynamics AI is computing root cause...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask AppDynamics AI about latency, logs, or remediation..."
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-purple-500/60 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-500 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-purple-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
