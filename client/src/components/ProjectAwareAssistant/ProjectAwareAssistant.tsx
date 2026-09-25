import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../../services/apiClient';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Code2,
  Trash2,
  Zap,
} from 'lucide-react';

interface ProjectAwareAssistantProps {
  projectId?: string;
  analysisId?: string;
  sourceCode?: string;
  language?: string;
  projectName?: string;
  activeLine?: number | null;
  onSendCustomPrompt?: (prompt: string) => void;
}

export const ProjectAwareAssistant: React.FC<ProjectAwareAssistantProps> = ({
  projectId,
  analysisId,
  sourceCode = '',
  language = 'cpp',
  projectName = 'Active Session',
  activeLine,
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showContextDrawer, setShowContextDrawer] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Load chat history for this project/analysis
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await apiClient.get('/chat', {
          params: { projectId, analysisId },
        });
        if (res.data.success && res.data.messages) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        // Continue silently
      }
    };
    if (projectId || analysisId) {
      fetchHistory();
    }
  }, [projectId, analysisId]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isThinking) return;

    setInput('');
    setLastFailedPrompt(null);
    setMessages((prev) => [...prev, { role: 'user', message: query, createdAt: new Date() }]);
    setIsThinking(true);

    try {
      const res = await apiClient.post('/chat', {
        projectId,
        analysisId,
        message: query,
        codeSnippet: sourceCode,
        language,
      });

      if (res.data.success && res.data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', message: res.data.reply, createdAt: new Date() },
        ]);
      }
    } catch (err: any) {
      setLastFailedPrompt(query);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          isError: true,
          message: 'AI service is temporarily unavailable. Please check your network or provider settings.',
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Clear conversation history?')) return;
    try {
      await apiClient.post('/chat/clear', { projectId, analysisId });
      setMessages([]);
    } catch (e) {
      // Ignore
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const quickActions = [
    { label: 'Explain Code', prompt: 'Explain this code thoroughly' },
    { label: activeLine ? `Explain Line ${activeLine}` : 'Explain Loop', prompt: activeLine ? `Explain line ${activeLine} in detail` : 'Explain the main execution loop' },
    { label: 'Why is it O(n)?', prompt: 'Why is the time complexity O(n)?' },
    { label: 'Optimize', prompt: 'How can this code be optimized for maximum performance?' },
    { label: 'Find Bugs', prompt: 'Are there any bugs, null risks, or edge-case flaws in this code?' },
    { label: 'Interview Mode', prompt: 'Explain this code for a technical interview discussion' },
    { label: 'Beginner Mode', prompt: 'Explain this code simply like I am a beginner' },
    { label: 'Generate Tests', prompt: 'Generate unit test cases covering edge and boundary cases' },
    { label: language === 'cpp' ? 'Convert to Python' : 'Convert to C++', prompt: language === 'cpp' ? 'Convert this code to Python' : 'Convert this code to C++' },
  ];

  return (
    <div className="rounded-3xl border border-border-pearl bg-white shadow-xl flex flex-col h-[650px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border-pearl bg-ivory flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-terracotta" />
          </div>

          <div>
            <h3 className="text-xs font-black text-charcoal flex items-center gap-2">
              <span>Project-Aware AI Assistant</span>
              <span className="flex items-center gap-1 text-[10px] text-lime-700 bg-lime-digital/20 px-2 py-0.5 rounded-full font-mono font-bold border border-lime-digital/30">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-600 animate-pulse"></span>
                Context Ready
              </span>
            </h3>
            <div className="text-[10px] text-secondary-text font-mono font-medium">
              {projectName} • <span className="uppercase text-terracotta font-bold">{language}</span> • {sourceCode.split('\n').length} lines
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowContextDrawer(!showContextDrawer)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-pearl text-charcoal text-[11px] font-bold border border-border-pearl flex items-center gap-1 shadow-sm transition-all cursor-pointer"
          >
            <span>{showContextDrawer ? 'Hide Context' : 'View AI Context'}</span>
            {showContextDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {messages.length > 0 && (
            <button
              onClick={handleClear}
              title="Clear chat"
              className="p-2 rounded-xl text-secondary-text hover:text-terracotta hover:bg-secondary-card transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Context Drawer */}
      {showContextDrawer && (
        <div className="p-4 bg-secondary-card/70 border-b border-border-pearl text-xs font-mono max-h-40 overflow-y-auto space-y-2 text-charcoal">
          <div className="text-[10px] text-terracotta uppercase font-bold flex items-center gap-1">
            <Code2 className="w-3 h-3" /> Active Code Buffer Injected in Context:
          </div>
          <pre className="text-[11px] text-secondary-text bg-white p-3 rounded-2xl overflow-x-auto border border-border-pearl">
            {sourceCode || '// No code loaded'}
          </pre>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-pearl/30">
        {messages.length === 0 ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center mx-auto text-terracotta">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-charcoal">Ask CodeVision AI about your code</h4>
              <p className="text-xs text-secondary-text max-w-sm mx-auto mt-1">
                Your code and analysis results are loaded into memory. Click any quick prompt or type below.
              </p>
            </div>

            {/* Empty State Prompt Chips */}
            <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto pt-2">
              {quickActions.slice(0, 6).map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(action.prompt)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-terracotta hover:text-white border border-border-pearl text-xs text-charcoal font-semibold transition-all shadow-sm cursor-pointer"
                >
                  "{action.label}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role !== 'user' && (
                <div className="w-7 h-7 rounded-xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center text-terracotta flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-2xl shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-terracotta text-white rounded-tr-sm font-medium'
                    : msg.isError
                    ? 'bg-red-50 border border-red-200 text-red-700 rounded-tl-sm'
                    : 'bg-white border border-border-pearl text-charcoal rounded-tl-sm shadow-sm'
                }`}
              >
                {renderMarkdownContent(msg.message, `msg-${idx}`, copiedCodeId, handleCopyCode)}

                {msg.isError && lastFailedPrompt && (
                  <button
                    onClick={() => handleSendMessage(lastFailedPrompt)}
                    className="mt-3 px-3 py-1.5 rounded-xl bg-terracotta hover:bg-orange-warm text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Retry Question</span>
                  </button>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-secondary-card border border-border-pearl flex items-center justify-center text-charcoal flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        )}

        {isThinking && (
          <div className="flex items-center gap-3 text-xs text-secondary-text">
            <div className="w-7 h-7 rounded-xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center text-terracotta">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 rounded-2xl bg-white border border-border-pearl flex items-center gap-2 shadow-sm">
              <span className="font-bold text-charcoal">CodeVision AI is thinking</span>
              <span className="flex items-center gap-1 text-terracotta font-bold animate-pulse">
                <span>●</span>
                <span>●</span>
                <span>●</span>
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips Toolbar */}
      <div className="px-4 py-2 bg-ivory border-t border-border-pearl flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {quickActions.map((qa, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qa.prompt)}
            disabled={isThinking}
            className="px-3 py-1 rounded-xl bg-white hover:bg-terracotta hover:text-white text-[11px] font-bold text-charcoal border border-border-pearl whitespace-nowrap transition-all disabled:opacity-40 flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <Zap className="w-3 h-3 text-terracotta" />
            <span>{qa.label}</span>
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-border-pearl flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your code, Big-O complexity, refactoring, or tests..."
          disabled={isThinking}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#D5CEBF] text-xs text-charcoal placeholder-secondary-text focus:outline-none focus:border-terracotta disabled:opacity-50 font-medium shadow-sm"
        />
        <button
          type="submit"
          disabled={isThinking || !input.trim()}
          className="p-2.5 rounded-xl bg-terracotta hover:bg-orange-warm text-white disabled:opacity-40 shadow-md shadow-terracotta/20 transition-all flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

// Rich Markdown and Code Block Renderer
function renderMarkdownContent(
  text: string,
  baseId: string,
  copiedId: string | null,
  onCopy: (code: string, id: string) => void
) {
  if (!text) return null;

  // Split by code blocks ```...```
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 font-sans">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const codeLang = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : '';
          const codeContent = codeLang ? lines.slice(1).join('\n') : lines.join('\n');
          const snippetId = `${baseId}-code-${index}`;

          return (
            <div key={index} className="my-3 rounded-2xl overflow-hidden border border-border-pearl bg-pearl">
              <div className="px-3 py-1.5 bg-secondary-card border-b border-border-pearl flex items-center justify-between text-[11px] text-secondary-text font-mono">
                <span className="uppercase text-terracotta font-bold">{codeLang || 'Code'}</span>
                <button
                  onClick={() => onCopy(codeContent, snippetId)}
                  className="flex items-center gap-1 text-charcoal hover:text-terracotta px-2 py-0.5 rounded-lg bg-white border border-border-pearl font-bold transition-colors cursor-pointer"
                >
                  {copiedId === snippetId ? (
                    <>
                      <Check className="w-3 h-3 text-lime-600" />
                      <span className="text-lime-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 text-xs font-mono text-charcoal overflow-x-auto whitespace-pre leading-relaxed">
                {codeContent}
              </pre>
            </div>
          );
        }

        // Regular markdown text formatting
        const paragraphs = part.split('\n\n').filter(Boolean);
        return paragraphs.map((p, pIdx) => {
          // Headings
          if (p.startsWith('### ')) {
            return (
              <h4 key={`${index}-${pIdx}`} className="text-sm font-black text-charcoal mt-3 mb-1 border-b border-border-pearl pb-1">
                {p.replace('### ', '')}
              </h4>
            );
          }
          if (p.startsWith('## ')) {
            return (
              <h3 key={`${index}-${pIdx}`} className="text-base font-black text-terracotta mt-3 mb-1">
                {p.replace('## ', '')}
              </h3>
            );
          }

          // Bullet lists
          if (p.includes('\n* ') || p.startsWith('* ') || p.includes('\n- ') || p.startsWith('- ')) {
            const listItems = p.split(/\n[\*\-]\s+/).filter(Boolean);
            return (
              <ul key={`${index}-${pIdx}`} className="list-disc list-inside space-y-1 my-1.5 text-secondary-text">
                {listItems.map((item, liIdx) => (
                  <li key={liIdx} className="leading-relaxed">
                    <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
                  </li>
                ))}
              </ul>
            );
          }

          // Regular paragraph
          return (
            <p
              key={`${index}-${pIdx}`}
              className="leading-relaxed text-charcoal"
              dangerouslySetInnerHTML={{ __html: formatInline(p) }}
            />
          );
        });
      })}
    </div>
  );
}

function formatInline(str: string): string {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-charcoal font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-secondary-text italic">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded-lg bg-secondary-card border border-border-pearl text-terracotta font-mono text-[11px] font-bold">$1</code>');
}
