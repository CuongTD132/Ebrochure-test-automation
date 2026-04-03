import { Campaign, InputData } from "../types/ebrochureTypes";
import {CAMPAIGN_DEFINITIONS, CONFIG} from "./testDataConfig";


// Danh sách cố định chứa thông tin chi tiết các Khu vực hỗ trợ (Regions)
// Bao gồm tên, chuỗi giá trị dropdown, và tên thư mục nơi lưu trữ file đi kèm của vùng đó
const REGIONS = [
    { vn: "MIỀN BẮC", en: "CLUSTER BAC", dropdown: "Cluster_Bắc", folder: "bac" },
    { vn: "MIỀN NAM", en: "CLUSTER NAM", dropdown: "Cluster_Nam", folder: "nam" },
    { vn: "MIỀN TRUNG", en: "CLUSTER 3", dropdown: "Cluster 3", folder: "trung" },
    { vn: "SupercenterĐN", en: "SupercenterĐN", dropdown: "DNSC", folder: "dnsc" },
];
type FileKey = keyof typeof CONFIG.fileMaps;
const BASE_CAMPAIGN = CONFIG.campaign;
// Hàm "đẻ" Campaign
const createCampaign = (vn: string, en: string, folderName: string, fileKey: FileKey): Campaign => ({
    ...BASE_CAMPAIGN,
    typeVn: vn,
    typeEn: en,
    file: CONFIG.fileMaps[fileKey],
    folder: folderName
});

const currentCampaigns: Campaign[] = CAMPAIGN_DEFINITIONS
    .filter(c => c.enabled)
    .map(c =>
        createCampaign(
            c.vn,
            c.en,
            c.folder,
            c.key as FileKey
        )
    );

// Hàm có nhiệm vụ duyệt và nhân bản dữ liệu, tạo ra mảng chứa mọi InputData cần thiết (Dùng để nạp thẳng vào bộ test).
export const generateTestData = (): InputData[] => {
    // Với mỗi campaign...
    return currentCampaigns.flatMap(cp => {
        // ...duyệt qua toàn bộ danh sách quy hoạch các khu vực (Regions)
        return REGIONS
            .map(reg => {
                // Lấy ra tên file ứng với khu vực đang tham chiếu
                const fileName = cp.file[reg.folder];

                // Nếu không có tên file trong cấu hình thì bỏ qua tạo dữ liệu cho vùng này (return null)
                if (!fileName) {
                    console.log(`[Data Gen] Bỏ qua khu vực: ${reg.vn} (Thiếu file cấu hình)`);
                    return null;
                }

                // Nếu có đủ thông tin, trả về cấu trúc đã được gộp/chuẩn hoá, sẵn sàng để auto-fill vào form
                return {
                    titleVn: `${cp.code} - ${cp.typeVn} - ${reg.vn}`,       // Ex: MAIL 2607 - DEAL TỐT... - MIỀN BẮC
                    titleEn: `${cp.code} - ${cp.typeEn} - ${reg.en}`,       // Ex: MAIL 2607 - BEST PRICE... - CLUSTER BAC
                    startDate: cp.start,
                    endDate: cp.end,
                    regionDropdown: reg.dropdown,                           // Text sử dụng để chọn trong danh sách Dropdown
                    fileName: fileName,                                     // Tên ảnh upload
                    regionFolder: cp.folder ? `${cp.folder}/${reg.folder}` : reg.folder, // Nối thư mục chiến dịch và vùng miền
                };
            })
            // Lọc bỏ đi hết những item rỗng (bị return null do thiếu file ở trên)
            // Ép kiểu mảng này về một mảng chứa dữ liệu thuần nhất hợp lệ cho Typescript
            .filter((item): item is NonNullable<typeof item> => item !== null);
    });
};