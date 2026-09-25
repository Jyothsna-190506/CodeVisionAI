import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { Project } from '../../types';
import { MessageSquare, Send, Sparkles, FolderKanban, Trash2, Code2 } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await apiClient.get('/projects');
        if (res.data.success) {
          setProjects(res.data.projects || []);
        }
      } catch (err) {
        console.error('Failed to load projects', err);
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const res = await apiClient.get('/chat', {
          params: { projectId: selectedProjectId || undefined },
        });
        if (res.data.success) {
          setMessages(res.data.messages || []);
        }
      } catch (err) {
        console.error('Failed to load chat history', err);
      }
    };
    loadChatHistory();
  }, [selectedProjectId]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', message: query, createdAt: new Date() }]);
    setLoading(true);

    try {
      const res = await apiClient.post('/chat', {
        projectId: selectedProjectId || undefined,
        message: query,
      });

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', message: res.data.reply, createdAt: new Date() },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', message: 'Error: ' + err.message, createdAt: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Clear chat conversation history?')) return;
    try {
      await apiClient.post('/chat/clear', { projectId: selectedProjectId || undefined });
      setMessages([]);
    } catch (err) {
      console.error('Clear chat failed', err);
    }
  };

  const sampleQuestions = [
    'How do I reduce the time complexity of this algorithm?',
    'Explain the recursion stack frame unwinding for this logic.',
    'What edge cases could cause an index error or null dereference?',
    'Write unit tests covering boundary values for this function.',
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <span>AI Code Assistant</span>
          </h1>
          <p className="text-xs text-slate-400">Context-aware conversational code reasoning & debugging</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Project context selector */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">General (No Project Context)</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                Context: {p.name} ({p.language})
              </option>
            ))}
          </select>

          {messages.length > 0 && (
            <button
              onClick={handleClear}
              title="Clear history"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
        {messages.length === 0 ? (
          <div className="text-center py-12 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-200">How can I assist your coding today?</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Ask questions about algorithms, memory allocations, big-O complexity, refactoring, or test cases.
              </p>
            </div>

            {/* Suggested Prompt Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl mx-auto text-left">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl text-xs max-w-3xl leading-relaxed shadow-lg ${
                msg.role === 'user'
                  ? 'ml-auto bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 text-white'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200'
              }`}
            >
              <div className="text-[10px] text-slate-400 font-mono mb-1 uppercase font-semibold">
                {msg.role === 'user' ? 'You' : 'CodeVision Assistant'}
              </div>
              <p className="whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))
        )}

        {loading && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-center gap-2 max-w-sm">
            <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Reasoning over AST & context...</span>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a technical coding question or request refactoring..."
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white disabled:opacity-40 shadow-lg shadow-indigo-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
