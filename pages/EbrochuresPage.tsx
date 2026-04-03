import { expect, Locator, Page } from "@playwright/test";
import * as path from 'path';
import * as fs from 'fs';
// Quản lý các phần tử (elements) và hành động trên trang "Ấn phẩm khuyến mãi"
export class EbrochuresPage {
    readonly page: Page;

    // ---- CÁC NÚT ĐIỀU HƯỚNG TỔNG QUAN ----
    readonly promotionBtn: Locator; // Nút/Menu dẫn tới "Ấn phẩm khuyến mãi"
    readonly createBtn: Locator;    // Nút "Thêm mới ấn phẩm khuyến mãi"
    readonly phpDebugbar: Locator;  // Nút tắt thanh công cụ debug của server PHP (nếu có)

    // ---- CÁC TRƯỜNG NHẬP LIỆU TRONG FORM ----
    readonly titleVn: Locator;        // Ô nhập Tiêu đề (Tiếng Việt)
    readonly titleEn: Locator;        // Ô nhập Tiêu đề (Tiếng Anh)
    readonly descriptionVn: Locator;  // Ô nhập Mô tả (Tiếng Việt)
    readonly descriptionEn: Locator;  // Ô nhập Mô tả (Tiếng Anh)
    readonly startDate: Locator;      // Ô nhập Thời gian bắt đầu
    readonly endDate: Locator;        // Ô nhập Thời gian kết thúc

    // ---- CÁC PHẦN TỬ LIÊN QUAN ĐẾN UPLOAD FILE (ẢNH & PDF) ----
    readonly imgUploadTrigger: Locator;     // Nút kích hoạt mở popup chọn ảnh
    readonly imgUploadTriggerFE: Locator;   // Nút kích hoạt chọn ảnh cho Image FE
    readonly imgUploadTriggerAI: Locator;   // Nút kích hoạt chọn ảnh cho Image AI
    readonly pdfUploadTrigger: Locator;     // Nút kích hoạt mở popup chọn file PDF
    readonly modalUploadTab: Locator;       // Tab "Tải lên" trong thư viện Media
    readonly addSelectedFilesBtn: Locator;  // Nút "Thêm file đã chọn" / Xác nhận chọn
    readonly uploadedPreview: Locator;      // Vùng hiển thị file đã được chọn
    readonly modalCloseBtn: Locator;
    readonly viewButton: Locator; // Nút "Xem trang" để chuyển sang trang chi tiết sau khi tạo xong
    readonly emptyListMessage: Locator; // Locator cho dòng "Không tìm thấy"
    readonly addSlideBtn: Locator;      // Locator cho nút "Thêm mới trang"
    readonly createPointBtn: Locator;   // Nút "Tạo điểm"
    readonly autoCropBtn: Locator;      // Nút "Tự động cắt"
    readonly saveSlideBtn: Locator;     // Nút "Lưu trang"
    constructor(page: Page) {
        this.page = page;
        // Ánh xạ (Map) các elements trên giao diện với code
        this.phpDebugbar = page.locator('.phpdebugbar-close-btn');
        this.promotionBtn = page.getByRole('link', { name: 'Ấn phẩm khuyến mãi', exact: true });
        this.createBtn = page.getByRole('link', { name: 'Thêm mới ấn phẩm khuyến mãi' });
        this.imgUploadTrigger = page.locator('.input-group[data-type="image"]').first().locator('.input-group-text').first();
        this.imgUploadTriggerFE = page.locator('div[data-toggle="aizuploader"][data-type="image"]').filter({ has: page.locator('#imageFeId') }).locator('.input-group-text');
        this.imgUploadTriggerAI = page.locator('div[data-toggle="aizuploader"][data-type="image"]').filter({ has: page.locator('#imageId') }).locator('.input-group-text');
        this.pdfUploadTrigger = page.locator('.input-group[data-type="document"]').getByText('Chọn file').first();
        this.modalUploadTab = page.getByRole('link', { name: 'Tải lên' });
        this.addSelectedFilesBtn = page.locator('[data-toggle="aizUploaderAddSelected"]');
        this.uploadedPreview = page.locator('.file-preview-item');
        this.titleVn = page.getByRole('textbox', { name: 'Tiêu đề' });
        this.titleEn = page.getByRole('textbox', { name: 'Title EN' });
        this.descriptionVn = page.locator('textarea[name="description"]');
        this.descriptionEn = page.locator('textarea[name="description_en"]');
        this.startDate = page.locator('#start_date');
        this.endDate = page.locator('#end_date');
        this.viewButton = page.getByTitle('Xem trang');
        this.emptyListMessage = page.locator('tr.footable-empty');
        this.addSlideBtn = page.getByRole('link', { name: 'Thêm mới trang ấn phẩm khuyến mãi' });
        this.modalCloseBtn = page.locator('button.close[data-dismiss="modal"]');
        this.createPointBtn = page.locator('button').filter({ hasText: 'Tạo điểm' });
        this.autoCropBtn = page.locator('button').filter({ hasText: 'Tự động cắt' });
        this.saveSlideBtn = page.locator('button').filter({ hasText: 'Lưu trang' });
    }

    // Hàm chuyển hướng đến trang danh sách Ấn phẩm
    async goToBrochuresPage() {
        // Tắt thanh debug nếu nó vô tình che khuất nút (chỉ có ở môi trường dev)
        if (await this.phpDebugbar.isVisible().catch(() => false)) {
            await this.phpDebugbar.click();
        }

        // Nhấn nút "Ấn phẩm khuyến mãi" trên Navbar/Menu
        await this.promotionBtn.click();
        // Đợi chuyển URL thành công
        await this.page.waitForURL('/admin/ebrochures');
    }

    // Hàm chuyển hướng từ trang danh sách sang trang Thêm mới
    async goToCreateBrochuresPage() {
        // Nhấn nút thêm mới ấn phẩm
        await this.createBtn.click();
        // Đợi chuyển URL thành công
        await this.page.waitForURL('/admin/ebrochures/create');
    }

    async getAllExistingTitles(): Promise<string[]> {
        await this.goToBrochuresPage();

        await this.page.locator('table tbody tr').first().waitFor();

        const titles = await this.page.locator('td div.mb-1').allTextContents();

        return titles.map(t => t.trim());
    }

    private async openUploadModal(trigger: Locator) {
        // Click mở modal
        await trigger.click();

        // Đợi nút confirm xuất hiện (modal render xong)
        await expect(this.addSelectedFilesBtn).toBeVisible();

        // Chờ animation UI (nếu hệ thống bị delay)
        await this.page.waitForTimeout(1500);

        // Đợi list load xong (có file hoặc empty)
        const fileItem = this.page.locator('.card-file').first();
        const emptyMessage = this.page.locator('text=No files found');

        await Promise.race([
            fileItem.waitFor({ state: 'visible', timeout: 10000 }),
            emptyMessage.waitFor({ state: 'visible', timeout: 10000 })
        ]);
    }

    // Hàm dùng chung cho việc xử lý chọn/upload cả định dạng Image (.jpg/png) và PDF
    private async processUpload(fileName: string, regionFolder: string, extension: string, trigger: Locator) {
        // Tạo đường dẫn file (name + phần mở rộng)
        const fullFileName = `${fileName}.${extension}`;

        // Resolve đường dẫn nội bộ gốc trên máy chiếu đến file sẽ tải lên
        const filePath = path.resolve(`./tests-data/${regionFolder}/` + fullFileName);

        // --- Bước 1: Mở Modal (Cửa sổ thư viện popup) ---
        await this.openUploadModal(trigger);

        // Tìm xem file chuẩn bị chọn có sẵn trong thư viện trên server hay chưa
        const fileInLibrary = this.page.locator(
            `.card-file[title="${fullFileName}"]`
        ).first();

        // --- Bước 2: Tải lên hoặc Chọn file có sẵn ---
        if (await fileInLibrary.isVisible()) {
            console.log(`File ${fullFileName} đã tồn tại. Đang chọn`);
            // Nếu đã tồn tại, chỉ việc click chọn file đó
            await fileInLibrary.click();
        } else {
            console.log(`File ${fullFileName} chưa có. Tiến hành upload mới`);

            // Nếu chưa có, chuyển sang tab "Tải lên mới"
            await this.modalUploadTab.click();

            // Nhét đường dẫn file cục bộ vào input[type="file"] bị ẩn của hệ thống (Uppy)
            await this.page.locator('input.uppy-Dashboard-input').setInputFiles(filePath);

            // Đợi hệ thống tự động tải file lên server xong (phụ thuộc tốc độ mạng), ấn xác nhận
            await this.addSelectedFilesBtn.click();

            const found = await this.openModalAndFindFileWithRetry(trigger, fileInLibrary);

            if (!found) {
                throw new Error(`Không tìm thấy file ${fullFileName} sau nhiều lần retry`);
            }

            await fileInLibrary.click();
        }

        // --- Bước 3: Đóng modal và kiểm tra kết quả ---
        // Nhấn nút xác nhận hoàn tất chọn file (sau khi đã click vào file cần chọn)
        await this.addSelectedFilesBtn.click();

        // Đảm bảo Modal đã được đóng hoàn toàn
        await expect(this.modalUploadTab).not.toBeVisible();

        // Kiểm tra xem hình ảnh/file vừa được chọn đã được render ngoài form gốc hay chưa
        const uploadedPreview = this.page.locator(`.file-preview-item[title="${fullFileName}"]`);
        await expect(uploadedPreview).toBeVisible({ timeout: 10000 });

        console.log(`Đã xác nhận file ${fullFileName} hiển thị ngoài giao diện.`);
    }

    // Hàm bọc cho việc upload File Ảnh cụ thể (Truyền trigger là nút Ảnh và định dạng là jpg)
    async uploadImage(fileName: string, regionFolder: string) {
        await this.processUpload(fileName, regionFolder, 'jpg', this.imgUploadTrigger);
    }

    // Hàm bọc cho việc upload File PDF cụ thể (Truyền trigger là nút PDF và định dạng là pdf)
    async uploadPdf(fileName: string, regionFolder: string) {
        await this.processUpload(fileName, regionFolder, 'pdf', this.pdfUploadTrigger);
    }

    // Hàm điền toàn bộ dữ liệu vào Form
    async fillFullBrochureForm(data: any) {
        // Điền tiêu đề và mô tả tiếng Việt
        await this.titleVn.fill(data.titleVn);
        await this.descriptionVn.fill(data.titleVn);

        // Điền tiêu đề và mô tả tiếng Anh
        await this.titleEn.fill(data.titleEn);
        await this.descriptionEn.fill(data.titleEn);

        // Nhập ngày bắt đầu và kết thúc (Sử dụng hàm custom fillDateTime xử lý input datetime-local)
        await this.fillDateTime(this.startDate, data.startDate);
        await this.fillDateTime(this.endDate, data.endDate);

        // Chọn Khu Vực bằng Dropdown đặc biệt (Sử dụng hàm custom Bootstrap)
        await this.selectBootstrapOption('region_id', data.regionDropdown);

        // Mở popup upload 2 loại file Ảnh và PDF
        // BƯỚC 1: Upload PDF trước - tên PDF sẽ được dùng làm tên hình
        console.log(`Đang upload file PDF với tên: ${data.fileName}`);
        await this.uploadPdf(data.fileName, data.regionFolder);
        
        // BƯỚC 2: Dùng chính tên file PDF làm tên hình (vì cùng tên, khác đuôi)
        console.log(`Sẽ upload hình với tên (lấy từ PDF): ${data.fileName}`);
        await this.uploadImage(data.fileName, data.regionFolder);
    }

    // Hàm xử lý việc chọn phần tử trong Dropdown tích hợp thư viện Bootstrap-Select
    async selectBootstrapOption(id: string, optionText: string) {
        // 1. Click mở dropdown
        const trigger = this.page.locator(`button[data-id="${id}"]`);
        await trigger.click();

        // 2. Chờ hộp thoại danh sách hiển thị (Bootstrap sẽ thêm class .show vào menu khi click)
        const menu = this.page.locator('.dropdown-menu.inner.show');
        await expect(menu).toBeVisible();

        // 3. Tìm option có text mong muốn (dùng hasText giúp tìm linh hoạt, ổn định hơn getByRole)
        const option = menu.locator('.dropdown-item', {
            hasText: optionText
        });

        // 4. Kiểm tra sự tồn tại của option, cuộn tìm tới khu vực đó và nhấp đúp
        await expect(option).toBeVisible();
        await option.scrollIntoViewIfNeeded();
        await option.click();
    }

    // Hàm xử lý điền Dữ liệu Ngày/Giờ nâng cao
    async fillDateTime(locator: Locator, dateString: string) {
        await locator.waitFor({ state: 'visible' });

        // Định dạng lại đầu vào string chuẩn xác theo input[type="datetime-local"] => "YYYY-MM-DDTHH:mm"
        const formattedDate = dateString.replace(' ', 'T').substring(0, 16);

        // Do việc fill thông thường lên ô datetime-local khó bắt event change
        // Đây là bước can thiệp trực tiếp bằng JS tại trình duyệt (evaluate) để gán giá trị và kích hoạt trigger events
        await locator.evaluate((el: HTMLInputElement, val) => {
            el.value = val; // Đổi value trực tiếp
            el.dispatchEvent(new Event('input', { bubbles: true })); // Ép gọi event input giả
            el.dispatchEvent(new Event('change', { bubbles: true })); // Ép gọi event change giả cho framework web (React/Vue/v.v)
            el.blur(); // Mất focus (Đẩy ra ngoài) để hoàn tất vòng sinh logic
        }, formattedDate);
    }

    // Hàm chọn một hình cụ thể từ thư viện
    private async selectSingleImage(fullFileName: string, trigger: Locator) {
        console.log(`Đang chọn: ${fullFileName}`);

        // Mở modal
        await trigger.click();
        await expect(this.addSelectedFilesBtn).toBeVisible();
        await this.page.waitForTimeout(1500);

        // Đợi list load
        const fileItem = this.page.locator('.card-file').first();
        await fileItem.waitFor({ state: 'visible', timeout: 10000 });

        // Tìm và click vào file
        const fileInLibrary = this.page.locator(`.card-file[title="${fullFileName}"]`).first();
        await expect(fileInLibrary).toBeVisible();
        await fileInLibrary.click();

        // Xác nhận chọn
        await this.addSelectedFilesBtn.click();

        // Đóng modal
        await expect(this.modalUploadTab).not.toBeVisible();

        // Kiểm tra xem hình đã render ngoài form
        const uploadedPreview = this.page.locator(`.file-preview-item[title="${fullFileName}"]`);
        await expect(uploadedPreview).toBeVisible({ timeout: 10000 });

        console.log(`Đã chọn và xác nhận ${fullFileName}.`);
    }

    async goToSlideDetails(brochureTitle: string) {
        // 1. Xác định hàng (row) chứa tiêu đề
        const row = this.page.locator('tr').filter({ hasText: brochureTitle });

        // Đợi hàng đó xuất hiện
        await row.waitFor({ state: 'visible', timeout: 10000 });

        // 2. Click vào nút "Xem trang" CHỈ NẰM TRONG hàng này
        // Chúng ta sử dụng row.getByTitle thay vì this.page.getByTitle
        await row.getByTitle('Xem trang').click();
        await expect(this.page).toHaveURL(/.*slides/);

    }

    async goToCreateSlide(folderName: string) {
        // Chờ danh sách ổn định
        await this.page.locator('table tbody tr').first().waitFor({ state: 'visible', timeout: 10000 });

        // Kiểm tra xem có tin nhắn "Không tìm thấy" không
        const isEmpty = await this.emptyListMessage.isVisible();

        let currentSlidesCount = 0;
        if (!isEmpty) {
            // Đếm số trang hiện tại dựa trên số dòng trong bảng
            currentSlidesCount = await this.page.locator('table.footable tbody tr:not(.footable-empty)').count();
        }

        // Lấy số hình trong folder
        const folderPath = path.resolve(`./tests-data/${folderName}`);
        const totalImages = getSortedFiles(folderPath, '.jpg').length;

        console.log(`Số trang hiện tại: ${currentSlidesCount}, Tổng số hình trong folder: ${totalImages}`);

        if (currentSlidesCount >= totalImages) {
            console.log(`Đã thêm đủ ${totalImages} trang.`);
            return;
        }

        // Nếu chưa đủ, bấm nút "Thêm mới trang ấn phẩm khuyến mãi"
        await this.addSlideBtn.click();

        // Đợi chuyển URL thành công
        await this.page.waitForURL(/.*slides\/create/);
    }

    async createSlide(folderName: string, imageIndex: number) {
        const folderPath = path.resolve(`./tests-data/${folderName}`);
        const sortedImages = getSortedFiles(folderPath, '.jpg');
        const fileName = sortedImages[imageIndex];
        const nameWithoutExt = path.parse(fileName).name;
        const fullFileName = `${nameWithoutExt}.jpg`;

        console.log(`Đang chọn hình ${fullFileName} cho Image FE`);
        await this.selectSingleImage(fullFileName, this.imgUploadTriggerFE);

        console.log(`Đang chọn hình ${fullFileName} cho Image AI`);
        await this.selectSingleImage(fullFileName, this.imgUploadTriggerAI);

        // Sau khi chọn xong, bấm nút Tạo điểm
        await this.createPointBtn.click();

        // Tiếp theo bấm nút Tự động cắt
        await this.autoCropBtn.click();

        // Chờ response từ API auto-crop
        await this.waitForAutoCropResponse();

        // Cuối cùng bấm nút Lưu trang
        await this.saveSlideBtn.click();
    }

    private async openModalAndFindFileWithRetry(trigger: Locator, fileInLibrary: Locator, maxRetry: number = 5) {
        for (let attempt = 1; attempt <= maxRetry; attempt++) {
            console.log(`Thử mở modal lần ${attempt}`);

            // Mở modal
            await trigger.click();

            try {
                // Chờ list load
                await this.page.locator('.card-body .ext').first().waitFor({
                    state: 'visible',
                    timeout: 5000
                });

                // Chờ file xuất hiện
                await fileInLibrary.waitFor({
                    state: 'visible',
                    timeout: 3000
                });

                console.log(`Tìm thấy file ở lần ${attempt}`);
                return true; // SUCCESS
            } catch (err) {
                console.log(`Không thấy file ở lần ${attempt}`);

                // Nếu chưa phải lần cuối → đóng modal để retry
                if (attempt < maxRetry) {
                    await this.modalCloseBtn.click();

                    // đảm bảo modal đóng hẳn
                    await this.modalCloseBtn.waitFor({ state: 'hidden' });

                    await this.page.waitForTimeout(500); // tránh click quá nhanh
                } else {
                    console.log(`Đã retry ${maxRetry} lần nhưng không thấy file`);
                    return false;
                }
            }
        }
    }

    // Hàm chờ response từ API auto-crop
    private async waitForAutoCropResponse() {
        const response = await this.page.waitForResponse(resp => resp.url().includes('/auto-crop'));
        if (response.status() >= 400) {
            console.error(`Auto-crop API error: ${response.status()} ${response.statusText()}`);
        }
    }
}
function getSortedFiles(folderPath: string, extension: string): string[] {
    const files = fs.readdirSync(folderPath)
        .filter(file => file.endsWith(extension));

    return files.sort((a, b) => {
        const matchA = a.match(/^(\d+)/);
        const matchB = b.match(/^(\d+)/);

        const numA = matchA ? parseInt(matchA[1]) : null;
        const numB = matchB ? parseInt(matchB[1]) : null;

        // 1. Không có số → đứng trước
        if (numA === null && numB === null) {
            return a.localeCompare(b);
        }
        if (numA === null) return -1;
        if (numB === null) return 1;

        // 2. Có số → sort theo số
        return numA - numB;
    });
}