import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Copy, Check, Bot, User, RefreshCw, Loader2 } from 'lucide-react';
import { AIMessage } from '../../types/ai';
import { askDocumentAI } from '../../lib/ai-engine';
import { generateId } from '../../lib/utils';

interface AIChatPanelProps {
  documentText: string;
  documentName?: string;
  className?: string;
}

const DEFAULT_PROMPTS = [
  'Summarize this document.',
  'What are the important clauses?',
  'Extract all names and dates.',
  'Give me a simple explanation.',
  'Translate this into Gujarati.',
  'Create an email based on this document.',
];

export const AIChatPanel: React.FC<AIChatPanelProps> = ({
  documentText,
  documentName = 'your document',
  className = '',
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hello! I've loaded **${documentName}**. You can ask me anything about its contents, request a summary, extract structured data, or translate it into Gujarati, Hindi, Spanish, and more.`,
      timestamp: 'Just now',
      suggestions: DEFAULT_PROMPTS.slice(0, 4),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (queryToSend?: string) => {
    const query = queryToSend || inputQuery.trim();
    if (!query || isLoading) return;

    const userMessage: AIMessage = {
      id: `usr-${generateId()}`,
      role: 'user',
      content: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await askDocumentAI(documentText, query, messages);
      const assistantMessage: AIMessage = {
        id: `ast-${generateId()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: 'Just now',
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMsg: AIMessage = {
        id: `err-${generateId()}`,
        role: 'assistant',
        content: "We couldn't process this question. Please try asking again in different words.",
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`flex flex-col bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-2xs ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-[#E5E5E5]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FFC800] text-[#111111] flex items-center justify-center border border-[#E5E5E5]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111111] tracking-tight">Doclly AI Assistant</h3>
            <p className="text-[11px] text-[#6B7280]">Context-aware intelligent chat</p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: `reset-${generateId()}`,
                role: 'assistant',
                content: `Chat cleared. Ask anything regarding **${documentName}**.`,
                timestamp: 'Just now',
                suggestions: DEFAULT_PROMPTS.slice(0, 4),
              },
            ]);
          }}
          className="p-1.5 text-gray-400 hover:text-[#111111] hover:bg-gray-100 rounded-lg transition-colors text-xs flex items-center gap-1"
          title="Clear chat history"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto max-h-[480px] space-y-4 bg-[#F5F5F5]/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-[#FFC800]/20 text-[#111111] flex items-center justify-center shrink-0 mt-0.5 border border-[#FFC800]/40">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#111111] text-white rounded-tr-xs'
                    : 'bg-white border border-[#E5E5E5] text-[#111111] rounded-tl-xs shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>

                {msg.role === 'assistant' && (
                  <div className="mt-2.5 pt-2 border-t border-[#E5E5E5] flex items-center justify-between text-[10px] text-gray-400">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-[#111111] flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Prompt Suggestions */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestions.map((suggestion, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSendMessage(suggestion)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-[#FFC800]/20 text-[#111111] border border-[#E5E5E5] hover:border-[#FFC800] rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-[#EAEAEA] text-[#111111] flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#FFC800]/20 text-[#111111] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 bg-white border border-[#E5E5E5] rounded-2xl rounded-tl-xs flex items-center gap-2 text-xs text-[#6B7280]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#111111]" />
              <span>Analyzing document context...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3.5 bg-white border-t border-[#E5E5E5]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a question, summarize, or extract..."
            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#111111] focus:bg-white transition-all text-[#111111] placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-2.5 bg-[#FFC800] hover:bg-[#E6B400] disabled:opacity-40 text-[#111111] border border-[#E5E5E5] rounded-xl transition-colors shrink-0 shadow-2xs"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
