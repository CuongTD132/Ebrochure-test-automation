import { Campaign, InputData } from "../types/ebrochureTypes";
import {CAMPAIGN_DEFINITIONS, CONFIG} from "./testDataConfig";
import * as fs from 'fs';
import * as path from 'path';


// Danh sách cố định chứa thông tin chi tiết các Khu vực hỗ trợ (Regions)
// Bao gồm tên, chuỗi giá trị dropdown, và tên thư mục nơi lưu trữ file đi kèm của vùng đó
const REGIONS = [
    { vn: "MIỀN BẮC", en: "CLUSTER BAC", dropdown: "Cluster_Bắc", folder: "bac" },
    { vn: "MIỀN NAM", en: "CLUSTER NAM", dropdown: "Cluster_Nam", folder: "nam" },
    { vn: "MIỀN TRUNG", en: "CLUSTER 3", dropdown: "Cluster 3", folder: "trung" },
    { vn: "SupercenterĐN", en: "SupercenterĐN", dropdown: "DNSC", folder: "dnsc" },
];
const BASE_CAMPAIGN = CONFIG.campaign;
// Hàm "đẻ" Campaign
const createCampaign = (vn: string, en: string, folderName: string): Campaign => ({
    ...BASE_CAMPAIGN,
    typeVn: vn,
    typeEn: en,
    folder: folderName
});

const currentCampaigns: Campaign[] = CAMPAIGN_DEFINITIONS
    .filter(c => c.enabled)
    .map(c =>
        createCampaign(
            c.vn,
            c.en,
            c.folder
        )
    );

// Helper function to check if a folder contains image or PDF files
const hasImageOrPdfFiles = (folderPath: string): boolean => {
    try {
        const files = fs.readdirSync(folderPath);
        return files.some(file => /\.(jpg|jpeg|png|pdf)$/i.test(file));
    } catch (error) {
        console.log(`[Data Gen] Lỗi khi đọc thư mục: ${folderPath} - ${error}`);
        return false;
    }
};

// Helper function to get the PDF file name without extension
const getPdfFileName = (folderPath: string): string | null => {
    try {
        const files = fs.readdirSync(folderPath);
        const pdfFile = files.find(file => /\.pdf$/i.test(file));
        if (pdfFile) {
            return path.parse(pdfFile).name; // Tên không có đuôi
        }
        return null;
    } catch (error) {
        console.log(`[Data Gen] Lỗi khi đọc thư mục: ${folderPath} - ${error}`);
        return null;
    }
};

// Hàm có nhiệm vụ duyệt và nhân bản dữ liệu, tạo ra mảng chứa mọi InputData cần thiết (Dùng để nạp thẳng vào bộ test).
export const generateTestData = (): InputData[] => {
    // Với mỗi campaign...
    return currentCampaigns.flatMap(cp => {
        // ...duyệt qua toàn bộ danh sách quy hoạch các khu vực (Regions)
        return REGIONS
            .map(reg => {
                // Kiểm tra thư mục có chứa file hình hoặc pdf không
                const folderPath = path.join(__dirname, cp.folder, reg.folder);
                if (!hasImageOrPdfFiles(folderPath)) {
                    console.log(`[Data Gen] Bỏ qua khu vực: ${reg.vn} (Thư mục ${cp.folder}/${reg.folder} không chứa file hình/pdf)`);
                    return null;
                }

                // Lấy tên file PDF làm tên file upload
                const fileName = getPdfFileName(folderPath);
                if (!fileName) {
                    console.log(`Không tìm thấy hình ${fileName}`);
                    return null;
                }

                // Nếu có đủ thông tin, trả về cấu trúc đã được gộp/chuẩn hoá, sẵn sàng để auto-fill vào form
                return {
                    titleVn: `${cp.code} - ${cp.typeVn} - ${reg.vn}`,       // Ex: MAIL 2607 - DEAL TỐT... - MIỀN BẮC
                    titleEn: `${cp.code} - ${cp.typeEn} - ${reg.en}`,       // Ex: MAIL 2607 - BEST PRICE... - CLUSTER BAC
                    startDate: cp.start,
                    endDate: cp.end,
                    regionDropdown: reg.dropdown,                           // Text sử dụng để chọn trong danh sách Dropdown
                    fileName: fileName,                                     // Tên file PDF làm tên upload
                    regionFolder: cp.folder ? `${cp.folder}/${reg.folder}` : reg.folder, // Nối thư mục chiến dịch và vùng miền
                };
            })
            // Lọc bỏ đi hết những item rỗng (bị return null do thiếu file ở trên)
            // Ép kiểu mảng này về một mảng chứa dữ liệu thuần nhất hợp lệ cho Typescript
            .filter((item): item is NonNullable<typeof item> => item !== null);
    });
};