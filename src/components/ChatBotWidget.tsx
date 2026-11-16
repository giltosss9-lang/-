import { FormEvent, useEffect, useRef, useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface ChatBotWidgetProps {
  onOpenBooking: () => void;
}

const QUICK_PROMPTS = [
  'Какую стрижку посоветуете?',
  'Чем отличается королевское бритьё?',
  'Кто из мастеров работает с бородой?',
];

export function ChatBotWidget({ onOpenBooking }: ChatBotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Здравствуйте. Я консьерж клуба HERITAGE. Подскажу по выбору стрижки, уходу за бородой, стоимости услуг и помогу подобрать мастера.',
    },
  ]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok || !data.reply) {
        throw new Error(data.error || 'Не удалось получить ответ от ассистента.');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          text: data.reply as string,
        },
      ]);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Ошибка соединения с сервером ассистента.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      {isOpen ? (
        <div
          role="dialog"
          aria-label="Чат-консультант HERITAGE"
          className="w-[calc(100vw-2rem)] sm:w-[390px] h-[520px] max-h-[80vh] bg-[#170A10] border border-[#3B1D29] shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="px-5 py-4 bg-[#1E0E15] border-b border-[#3B1D29] flex items-center justify-between gap-4 shrink-0">
            <div>
              <div className="font-display text-xl font-medium text-[#FDF4F7]">
                Консьерж HERITAGE
              </div>
              <div className="text-[11px] text-[#C7A3B2]">
                Подбор стрижки, ухода и расписание
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Свернуть чат"
              className="w-10 h-10 flex items-center justify-center text-[#C7A3B2] hover:text-[#FDF4F7] border border-[#3B1D29] hover:border-[#F04E86] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 text-[13px] leading-[1.55] whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#C81E5A] text-[#FFF8FA] font-medium'
                      : 'bg-[#221018] text-[#FDF4F7] border border-[#3B1D29]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start">
                <div className="px-4 py-2.5 text-xs text-[#C7A3B2] bg-[#221018] border border-[#3B1D29]">
                  Консультант печатает...
                </div>
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="px-3.5 py-2.5 text-xs text-[#FDF4F7] bg-[#3B1020] border border-[#C81E5A]"
              >
                Ошибка: {errorMsg}
              </div>
            )}

            {messages.length <= 2 && !isLoading && (
              <div className="pt-2 space-y-2">
                <div className="text-[11px] text-[#C7A3B2]">Частые вопросы:</div>
                <div className="flex flex-col gap-1.5">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(prompt)}
                      className="text-left px-3 py-2 text-xs text-[#F3DEE6] bg-[#1E0E15] border border-[#3B1D29] hover:border-[#F04E86] hover:text-[#F04E86] transition-colors cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-4 py-2 border-t border-[#311722] bg-[#1A0C12] flex items-center justify-between">
            <span className="text-[11px] text-[#C7A3B2]">Готовы к визиту?</span>
            <button
              type="button"
              onClick={onOpenBooking}
              className="text-xs font-medium text-[#F04E86] hover:text-[#FF73A3] transition-colors cursor-pointer"
            >
              Открыть запись
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-3 bg-[#1E0E15] border-t border-[#3B1D29] flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Задайте вопрос мастеру..."
              aria-label="Сообщение консультанту"
              className="flex-1 h-10 px-3 text-sm text-[#FDF4F7] placeholder:text-[#8E6878] bg-[#14090E] border border-[#4A2433] focus:border-[#F04E86] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Отправить сообщение"
              className="w-10 h-10 flex items-center justify-center bg-[#C81E5A] hover:bg-[#DF2B6B] disabled:opacity-40 text-[#FFF8FA] transition-colors shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="h-12 px-5 inline-flex items-center gap-2.5 text-sm font-semibold text-[#FFF8FA] bg-[#C81E5A] hover:bg-[#DF2B6B] shadow-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDF4F7]"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Чат-консьерж</span>
        </button>
      )}
    </div>
  );
}
