export interface Campaign {
    code: string;       // Mã chiến dịch (Ví dụ: MAIL 2607)
    typeVn: string;     // Phân loại / Tên chiến dịch hiển thị bằng Tiếng Việt
    typeEn: string;     // Phân loại / Tên chiến dịch hiển thị bằng Tiếng Anh
    start: string;      // Ngày bắt đầu (định dạng YYYY-MM-DDTHH:mm)
    end: string;        // Ngày kết thúc (định dạng YYYY-MM-DDTHH:mm)
    folder?: string;    // Tên thư mục chứa data riêng của chiến dịch (VD: mail, giasi,...)
}

// Interface định nghĩa cấu trúc dữ liệu cuối cùng (đã được nội suy/gộp)
// Đây là kiểu dữ liệu truyền trực tiếp vào Page Model (playwright) để điền thông tin tự động
export interface InputData {
    titleVn: string;        // Tiêu đề ấn phẩm (Tiếng Việt) đã ghép xong dạng chuỗi chuẩn
    titleEn: string;        // Tiêu đề ấn phẩm (Tiếng Anh) đã ghép xong dạng chuỗi chuẩn
    startDate: string;      // Thời gian mở bán/bắt đầu
    endDate: string;        // Thời gian kết thúc
    regionDropdown: string; // Tên Option sẽ được tìm và chọn trong danh sách Dropdown "Khu vực" ở form
    fileName: string;       // Tên chính xác của file ảnh/pdf được chỉ định dùng để upload
    regionFolder: string;   // Tên thư mục chứa file nói trên để ghép thành đường dẫn tuyệt đối lúc tải lên
}
