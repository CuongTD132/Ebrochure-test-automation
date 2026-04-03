import {expect, test} from '@playwright/test';
import {EbrochuresPage} from "../pages/EbrochuresPage";
import {InputData} from "../types/ebrochureTypes";
import {generateTestData} from "../tests-data/ebrochureData";
import * as fs from 'fs';
import * as path from 'path';
let testData: InputData[] = generateTestData();
let ebrochuresPage: EbrochuresPage;
test.describe('Quy trình quản lý ấn phẩm', () => {
    test.beforeEach(async ({page}) => {
        ebrochuresPage = new EbrochuresPage(page);
        await page.goto('/admin');
        await ebrochuresPage.goToBrochuresPage();
    });

    test('Bước 1: Tạo hàng loạt ấn phẩm theo tuần tự', async ({page}) => {
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

            await page.getByRole('button', {name: 'Lưu'}).click();

            await page.waitForURL('/admin/ebrochures');
            await page.locator('table tbody tr').first().waitFor();

            titleSet.add(data.titleVn);
        }
    });
});

test.describe.only('Bước 2: Xử lý chi tiết (Đa luồng)', () => {
    // Cấu hình riêng cho block này chạy song song
    test.describe.configure({mode: 'parallel'});

    testData.forEach((data) => {
        test(`Kiểm tra chi tiết slide: ${data.titleVn}`, async ({page}) => {
            const ebrochuresPage = new EbrochuresPage(page);
            await page.goto('/admin');
            await ebrochuresPage.goToBrochuresPage();
            await ebrochuresPage.goToSlideDetails(data.titleVn);
            const folderPath = path.resolve(`./tests-data/${data.regionFolder}`);
            const totalImages = fs.readdirSync(folderPath)
                .filter(f => f.endsWith('.jpg')).length;

            for (let i = 0; i < totalImages; i++) {
                const shouldCreate = await ebrochuresPage.goToCreateSlide(data.regionFolder);
                if (!shouldCreate) {
                    break;
                }
                await ebrochuresPage.createSlide(data.regionFolder);
            }
        });
    });
});