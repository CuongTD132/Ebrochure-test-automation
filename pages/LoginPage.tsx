import {Locator, Page} from "@playwright/test";

// Quản lý các phần tử (elements) và tương tác trên trang Đăng nhập
export class LoginPage {
    readonly page: Page; // Đại diện cho 1 trang/tab trình duyệt
    
    // Các phần tử trên màn hình Login
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Cấu hình liên kết các biến nội bộ vào các phần tử HTML dùng hệ thống Role & Label để tìm kiếm mượt, không lạm dụng ID/Class
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Mật khẩu' });
        this.loginButton = page.getByRole('button', { name: 'Đăng nhập' });
    }

    // Hàm thực thi các bước đăng nhập
    async logIn() {
        // Lấy thông tin tài khoản từ biến môi trường (trong file .env, giúp an toàn và tái sử dụng)
        const username = process.env.USERNAME;
        const password = process.env.PASSWORD;
        
        // Điều hướng trình duyệt đến domain đã được cầu hình nối với "/log    n"
        await this.page.goto('/login');
        
        // Cảnh báo + ngưng test nếu quên config biến môi trường
        if (!username || !password) {
            throw new Error('Username or password is not defined');
        }
        
        // Lệnh điền vào ô textbox (Tương đương việc user gõ bàn phím)
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        
        // Lệnh Click chọn bấm
        await this.loginButton.click();
        
        // Chờ hệ thống xác thực thành công và tự động chuyển về đường dẫn "/admin" thì mới thôi
        await this.page.waitForURL('/admin');
    }
}