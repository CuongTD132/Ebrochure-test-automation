import * as fs from 'fs';
import * as path from 'path';

export const deleteAllImages = async (): Promise<void> => {
    // Lấy đường dẫn tuyệt đối đến thư mục 'tests-data' từ thư mục gốc dự án
    const testsDataDir = path.join(process.cwd(), 'tests-data');
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf'];

    const deleteFilesRecursively = (dir: string): void => {
        if (!fs.existsSync(dir)) return; // Kiểm tra thư mục có tồn tại không

        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                deleteFilesRecursively(filePath);
            } else {
                const fileExtension = path.extname(file).toLowerCase();
                if (imageExtensions.includes(fileExtension)) {
                    fs.unlinkSync(filePath);
                    console.log(`✓ Đã xóa: ${filePath}`);
                }
            }
        });
    };

    console.log(`Bắt đầu dọn dẹp tại: ${testsDataDir}`);
    deleteFilesRecursively(testsDataDir);
    console.log(`Hoàn thành!`);
};

// Chạy luôn không cần check điều kiện phức tạp
deleteAllImages().catch(err => {
    console.error('Lỗi:', err);
    process.exit(1);
});