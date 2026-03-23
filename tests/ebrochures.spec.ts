import { expect, test } from '@playwright/test';
import {LoginPage} from "../pages/LoginPage";
import {EbrochuresPage} from "../pages/EbrochuresPage";
import {InputData} from "../types/ebrochureTypes";
import {generateTestData} from "../tests-data/ebrochureData";

let testData: InputData[] = generateTestData();
test.describe('Quy trình quản lý ấn phẩm', () => {
    let loginPage: LoginPage;
    let ebrochuresPage: EbrochuresPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        ebrochuresPage = new EbrochuresPage(page);
        await loginPage.logIn();
        await ebrochuresPage.goToBrochuresPage()
    });

    test('Bước 1: Tạo hàng loạt ấn phẩm theo tuần tự', async ({ page }) => {
        for (const data of testData) {
            console.log(`Đang tạo: ${data.titleVn}`);
            await ebrochuresPage.goToCreateBrochuresPage();
            await ebrochuresPage.fillFullBrochureForm(data);
            await page.getByRole('button', { name: 'Lưu' }).click();
            await page.waitForTimeout(500);
        }
    });


});
test.describe('Bước 2: Xử lý chi tiết (Đa luồng)', () => {
    // Cấu hình riêng cho block này chạy song song
    test.describe.configure({ mode: 'parallel' });

    testData.forEach((data) => {
        test(`Kiểm tra chi tiết slide: ${data.titleVn}`, async ({ page }) => {
            const ebrochuresPageParallel = new EbrochuresPage(page);
            // Lưu ý: Mỗi test song song cần khởi tạo lại POM hoặc thực hiện lại login
            // (Playwright sẽ tự động chạy beforeEach cho từng worker)
            await ebrochuresPageParallel.goToSlideDetails(data.titleVn);

            // Thêm assertion để đảm bảo test có giá trị
            await expect(page).not.toHaveURL(/.*create/);
        });
    });
});