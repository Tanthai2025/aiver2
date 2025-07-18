// HƯỚNG DẪN CẬP NHẬT KIẾN THỨC TỪ GOOGLE SHEET:
// 1. Mở Google Sheet chứa dữ liệu Hỏi & Đáp của bạn.
// 2. Đảm bảo sheet có 2 cột: Cột A cho câu hỏi, Cột B cho câu trả lời. Dòng đầu tiên nên là tiêu đề (ví dụ: "Hỏi", "Đáp").
// 3. Vào menu 'Tệp' > 'Chia sẻ' > 'Xuất bản lên web'.
// 4. Trong cửa sổ bật lên:
//    - Ở mục 'Liên kết', chọn trang tính bạn muốn sử dụng.
//    - Ở mục 'Trang web đã nhúng', chọn định dạng 'Giá trị được phân tách bằng dấu phẩy (.csv)'.
// 5. Nhấn nút 'Xuất bản' và sao chép URL được tạo ra.
// 6. Dán URL đó để thay thế giá trị của biến `GOOGLE_SHEET_CSV_URL` dưới đây.

export const GOOGLE_SHEET_CSV_URL: string = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRELf4W__ljNrnF9XC5nXmjYnO_RG6WvdEi24WPQVJkTlZxVS7JE3xv4QgvJGEnOp0LFFht1ynIKusB/pub?output=tsv';

// !!! CẢNH BÁO BẢO MẬT !!!
// Dán API Key của Google AI vào đây.
// Việc để lộ API Key ở phía client (trên trình duyệt) có thể không an toàn.
// Bất kỳ ai cũng có thể xem được key này bằng cách xem mã nguồn trang web.
// Hãy đảm bảo bạn đã cấu hình các biện pháp bảo vệ cho API Key trong Google AI Studio.
export const API_KEY: string = 'AIzaSyCW1QYEFZVIn8rYLMBeIWiF0uniX-31ArY';

// Mẫu chỉ dẫn hệ thống cho AI.
// {knowledge_base} sẽ được tự động thay thế bằng dữ liệu từ Google Sheet.
export const SYSTEM_INSTRUCTION_TEMPLATE = `
Bạn là ECO Bot, một trợ lý chatbot chăm sóc khách hàng thân thiện và chuyên nghiệp.
Nhiệm vụ của bạn là trả lời các câu hỏi của khách hàng một cách tự nhiên, lịch sự và chính xác dựa trên kiến thức được cung cấp.
Trả lời từng bước không trả lời một loạt nhiều dòng để quý khách cảm thấy khó đọc 
Ví dụ về quy trình bán hàng gồm 3 bước: trả lời tin nhắn cho quý khách từng bước như cung cấp mã đơn hàng, tiếp đến sai sót gì, và hỏi quý khách đã hài lòng với dịch vụ không?
Thay vì gợi ý về bộ phận chăm sóc khách hàng: Hãy trả lời gợi ý câu hỏi về: Thanh Nghĩa - Giám đốc chăm sóc khách hàng - Sđt/zalo: 0393.851.597 
Hãy luôn trả lời bằng tiếng Việt.

QUY TẮC BẮT BUỘC:
1.  Chỉ sử dụng thông tin được cung cấp trong phần "KIẾN THỨC NỀN" dưới đây để trả lời câu hỏi.
2.  Không được bịa đặt thông tin hoặc trả lời các câu hỏi không liên quan đến kiến thức đã cho.
3.  Nếu câu hỏi của khách hàng không có trong kiến thức nền, hãy trả lời một cách lịch sự rằng bạn không có thông tin và gợi ý họ liên hệ với bộ phận hỗ trợ (nếu thông tin liên hệ có trong kiến thức nền).
4.  Khi bắt đầu cuộc trò chuyện, hãy gửi một lời chào thân thiện và giới thiệu bản thân là "ECO Bot".

---
KIẾN THỨC NỀN:
{knowledge_base}
`;