import {expect, test} from '@playwright/test';
import {LoginPage} from '../pages/LoginPage';
import {EbrochuresPage} from "../pages/EbrochuresPage";
import {InputData} from "../types/ebrochureTypes";
import {generateTestData} from "../tests-data/ebrochureData";

// Nhóm các kịch bản kiểm thử (test cases) liên quan đến tính năng "Tạo ấn phẩm khuyến mãi"
test.describe('Tạo ấn phẩm khuyến mãi', () => {
    let loginPage: LoginPage;
    let ebrochuresPage: EbrochuresPage;
    
    // Lấy danh sách dữ liệu đóng giả để test (test data). Mỗi phần tử là thông tin của 1 ấn phẩm.
    let testData:InputData[]  = generateTestData();

    // Định nghĩa một test case: Tạo tuần tự nhiều ấn phẩm thông qua vòng lặp dựa vào testData
    test('Tạo hàng loạt ấn phẩm theo tuần tự', async ({page}) => {
        // Khởi tạo các đối tượng Page Object Model (POM) để tương tác với các trang theo cấu trúc dự án
        loginPage = new LoginPage(page);
        ebrochuresPage = new EbrochuresPage(page);
        
        // --- BƯỚC 1: ĐĂNG NHẬP ---
        await loginPage.logIn();
        
        // Kiểm tra xem đã đăng nhập thành công và chuyển hướng đúng về trang route "/admin" chưa
        await expect(page).toHaveURL('/admin');
        
        // --- BƯỚC 2: ĐIỀU HƯỚNG ---
        // Về trang danh sách quản lý các Ấn phẩm
        await ebrochuresPage.goToBrochuresPage();
        
        // --- BƯỚC 3: TẠO HÀNG LOẠT ---
        // Duyệt qua từng bộ dữ liệu ấn phẩm một
        for (const data of testData) {
            // In log tên ấn phẩm đang chạy để dễ debug/kiểm tra tiến độ ở màn hình console
            console.log(`Đang xử lý: ${data.titleVn}`);
            
            // Click chuyển từ trang danh sách sang trang "Thêm mới ấn phẩm"
            await ebrochuresPage.goToCreateBrochuresPage();
            
            // Gọi hàm điền mọi thông tin vào form tạo bằng các hàm được viết sẵn trong POM (nhập tự động)
            await ebrochuresPage.fillFullBrochureForm(data);
            
            // Tìm component button có nhãn "Lưu" và click lưu lại dữ liệu
            await page.getByRole('button', { name: 'Lưu' }).click();
            
            // Thêm một chút delay: Đợi 500ms (0.5 giây) để hệ thống kịp xử lý lưu trước khi vòng lặp nhảy sang lần tạo tiếp theo
            await page.waitForTimeout(500);
        }
    });
});
