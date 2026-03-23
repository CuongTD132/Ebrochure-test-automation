import { expect, test } from '@playwright/test';
import {LoginPage} from "../pages/LoginPage";
import {EbrochuresPage} from "../pages/EbrochuresPage";
import {InputData} from "../types/ebrochureTypes";
import {generateTestData} from "../tests-data/ebrochureData";

let testData: InputData[] = generateTestData();
let loginPage: LoginPage;
let ebrochuresPage: EbrochuresPage;
test.describe('Quy trình quản lý ấn phẩm', () => {
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        ebrochuresPage = new EbrochuresPage(page);
        await loginPage.logIn();
        await ebrochuresPage.goToBrochuresPage()
    });

    test('Bước 1: Tạo hàng loạt ấn phẩm theo tuần tự', async ({ page }) => {
        const existingTitles = await ebrochuresPage.getAllExistingTitles();
        const titleSet = new Set(existingTitles);

        for (const data of testData) {
            console.log(`Đang xử lý: ${data.titleVn}`);

            if (titleSet.has(data.titleVn)) {
                console.log(`Đã tồn tại: ${data.titleVn} → bỏ qua`);
                continue;
            }

            console.log(`Chưa có → tạo mới: ${data.titleVn}`);

            await ebrochuresPage.goToCreateBrochuresPage();
            await ebrochuresPage.fillFullBrochureForm(data);

            await page.getByRole('button', { name: 'Lưu' }).click();

            await page.waitForURL('/admin/ebrochures');
            await page.locator('table tbody tr').first().waitFor();

            titleSet.add(data.titleVn);
        }
    });


});
test.describe('Bước 2: Xử lý chi tiết (Đa luồng)', () => {
    // Cấu hình riêng cho block này chạy song song
    test.describe.configure({ mode: 'parallel' });
    test.beforeEach(async ({ page }) => {
        let isLoggingIn = false;
        page.on('response', async (response) => {
            if (
                response.url().includes('/login') &&
                !isLoggingIn
            ) {
                isLoggingIn = true;
                console.log('Session hết hạn → login lại');
                const loginPage = new LoginPage(page);
                await loginPage.logIn();
                await page.waitForURL('/admin');
                isLoggingIn = false;
            }
        });
    });
    testData.forEach((data) => {
        test(`Kiểm tra chi tiết slide: ${data.titleVn}`, async ({ page }) => {
            const ebrochuresPageParallel = new EbrochuresPage(page);
            await ebrochuresPageParallel.goToSlideDetails(data.titleVn);
            // Thêm assertion để đảm bảo test có giá trị
            await expect(page).not.toHaveURL(/.*create/);
        });
    });
});