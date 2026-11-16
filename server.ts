import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `Ты — консьерж и старший стилист-консультант мужского барбершопа премиум-класса HERITAGE в Москве (Малый Козихинский пер., 12, Патриаршие пруды).
Отвечай вежливо, лаконично и по делу на русском языке, в сдержанном деловом стиле без лишних восклицаний и эмодзи.

Данные клуба:
- График: ежедневно с 10:00 до 22:00. Телефон: +7 (495) 000-12-40. Парковка во дворе по номеру авто.
- Мастера:
  1. Артём Соколов (Шеф-барбер, 12 лет опыта) — классика ножницами, удлинённые формы.
  2. Дмитрий Воронцов (Старший барбер, 8 лет опыта) — деловые стрижки, чистый фейд.
  3. Илья Громов (Мастер бритья и бороды, 14 лет опыта) — королевское бритьё опасной бритвой, архитектура бороды.
- Ключевые услуги и цены:
  - Архитектурная мужская стрижка (60 мин) — 4 200 ₽
  - Стрижка удлинённых волос (75 мин) — 4 800 ₽
  - Стрижка от шеф-барбера (75 мин) — 5 600 ₽
  - Спортивный фейд и окантовка (45 мин) — 3 400 ₽
  - Королевское бритьё опасной бритвой (60 мин) — 3 900 ₽
  - Моделирование бороды и усов (45 мин) — 3 100 ₽
  - Клубный ритуал «Heritage» (105 мин) — 7 200 ₽
  - Камуфляж седины (35 мин) — 2 900 ₽
  - Комплимент к визиту: двойной эспрессо, американо, односолодовый виски 12 лет, чай улун или вода.

Помогай гостям подобрать стрижку или форму бороды под тип лица и волос, сориентируй по ценам, мастерам и предложи оформить запись через кнопку «Записаться» на сайте.`;

interface IncomingMessage {
  role: 'user' | 'model';
  text: string;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/chat', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        res.status(503).json({
          error: 'Сервис ассистента временно не настроен: отсутствует ключ GEMINI_API_KEY.',
        });
        return;
      }

      const body = req.body as { messages?: IncomingMessage[] };
      const messages = Array.isArray(body?.messages) ? body.messages : [];

      if (messages.length === 0) {
        res.status(400).json({ error: 'Передайте хотя бы одно сообщение.' });
        return;
      }

      const formattedContents = messages
        .filter((m) => m && typeof m.text === 'string' && m.text.trim().length > 0)
        .slice(-16)
        .map((m) => ({
          role: m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.text.trim() }],
        }));

      if (formattedContents.length === 0) {
        res.status(400).json({ error: 'Сообщение не может быть пустым.' });
        return;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        res.status(502).json({
          error: 'Не удалось получить ответ от ассистента. Попробуйте переформулировать запрос.',
        });
        return;
      }

      res.json({ reply });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Внутренняя ошибка сервера.';
      console.error('Gemini chat error:', err);
      res.status(500).json({
        error: message.includes('API_KEY_INVALID') || message.includes('PERMISSION_DENIED')
          ? 'Ошибка доступа к Gemini API. Проверьте ключ в панели Settings > Secrets.'
          : 'Произошла ошибка при обращении к ассистенту. Попробуйте повторить запрос.',
      });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HERITAGE server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
