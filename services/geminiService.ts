
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GOOGLE_SHEET_CSV_URL, SYSTEM_INSTRUCTION_TEMPLATE, API_KEY } from '../constants';

let ai: GoogleGenAI | null = null;

/**
 * Lazily initializes and returns the GoogleGenAI client.
 * Throws an error if the API key is not configured in constants.ts.
 * @returns The initialized GoogleGenAI client.
 */
const getAiClient = (): GoogleGenAI => {
    if (ai) {
        return ai;
    }

    // Check if the API key has been set in the constants.ts file.
    if (!API_KEY || API_KEY === 'API_KEYAPI_KEY') {
        const errorMessage = `LỖI: API Key chưa được cung cấp.

HƯỚNG DẪN CẤU HÌNH:
1.  Mở tệp 'constants.ts' trong dự án của bạn.
2.  Tìm dòng: export const API_KEY = 'YOUR_GOOGLE_AI_API_KEY_HERE';
3.  Thay thế 'YOUR_GOOGLE_AI_API_KEY_HERE' bằng API Key của Google AI của bạn.
4.  Lưu tệp và tải lại ứng dụng.

**Cảnh báo bảo mật:** Việc để lộ API key trên client có thể gây rủi ro. Hãy đảm bảo bạn đã giới hạn quyền sử dụng key này trong Google AI Studio.`;

        console.error("[AI Service Error] API Key is not configured in constants.ts.");

        // This error is caught by the UI to show a user-friendly, detailed guide.
        throw new Error(errorMessage);
    }
    
    ai = new GoogleGenAI({ apiKey: API_KEY });
    return ai;
};

/**
 * Parses a CSV text from Google Sheets into a Q&A formatted string.
 * Assumes a two-column CSV. It splits each line at the first comma.
 * @param csvText The raw CSV text.
 * @returns A formatted string for the knowledge base.
 */
const parseCsvToKnowledgeBase = (csvText: string): string => {
    const lines = csvText.trim().split(/\r?\n/);
    // Remove header line
    const dataLines = lines.slice(1);
    
    return dataLines
        .map(line => {
            // Splits the line into two parts at the first comma.
            // This is a simple parser assuming questions don't contain commas.
            const parts = line.split(/,(.+)/);
            if (parts.length < 2) return '';

            // Trim quotes "..." that Google Sheets adds around fields
            const question = parts[0].trim().replace(/^"|"$/g, '');
            const answer = parts[1].trim().replace(/^"|"$/g, '');

            if (question && answer) {
                return `Hỏi: ${question}\nĐáp: ${answer}`;
            }
            return '';
        })
        .filter(qa => qa)
        .join('\n\n');
};

/**
 * Fetches the knowledge base from the configured Google Sheet CSV URL.
 * @returns The formatted knowledge base string.
 */
const fetchKnowledgeBase = async (): Promise<string> => {
    if (!GOOGLE_SHEET_CSV_URL || GOOGLE_SHEET_CSV_URL.includes('URL_GOOGLE_SHEET_CSV_CUA_BAN_O_DAY')) {
        console.warn("Google Sheet URL is not configured.");
        throw new Error("Chưa cấu hình URL cho Google Sheet. Vui lòng cập nhật đường dẫn trong tệp constants.ts.");
    }

    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch Google Sheet CSV: ${response.statusText}`);
        }
        const csvText = await response.text();
        if (!csvText) {
             return "Không có dữ liệu trong file kiến thức.";
        }
        return parseCsvToKnowledgeBase(csvText);
    } catch (error) {
        console.error("Error fetching or parsing Google Sheet:", error);
        // Throw an error that can be caught and displayed by the UI.
        throw new Error("Không thể tải dữ liệu kiến thức từ Google Sheet. Vui lòng kiểm tra lại đường dẫn và chắc chắn rằng trang tính đã được 'Xuất bản lên web'.");
    }
};


/**
 * Creates and returns a new chat instance configured with a dynamic system prompt
 * based on the knowledge fetched from the Google Sheet.
 */
export const createChat = async (): Promise<Chat> => {
    const client = getAiClient(); // Get client, will throw if API_KEY is missing
    const knowledgeBase = await fetchKnowledgeBase();
    const systemInstruction = SYSTEM_INSTRUCTION_TEMPLATE.replace('{knowledge_base}', knowledgeBase);

    return client.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
};

/**
 * Sends a message to the AI using an existing chat session.
 * @param chat The chat instance.
 * @param message The user's message.
 * @returns The AI's text response.
 */
export const sendMessageInChat = async (chat: Chat, message: string): Promise<string> => {
    try {
        const response: GenerateContentResponse = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return "Xin lỗi, đã có lỗi xảy ra trong quá trình xử lý yêu cầu của bạn. Vui lòng thử lại sau.";
    }
};