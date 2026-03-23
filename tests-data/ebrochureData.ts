import {Campaign, InputData} from "../types/ebrochureTypes";

// Danh sách cố định chứa thông tin chi tiết các Khu vực hỗ trợ (Regions)
// Bao gồm tên, chuỗi giá trị dropdown, và tên thư mục nơi lưu trữ file đi kèm của vùng đó
const REGIONS = [
    { vn: "MIỀN BẮC", en: "CLUSTER BAC", dropdown: "Cluster_Bắc", folder: "bac" },
    { vn: "MIỀN NAM", en: "CLUSTER NAM", dropdown: "Cluster_Nam", folder: "nam" },
    { vn: "MIỀN TRUNG", en: "CLUSTER 3", dropdown: "Cluster 3", folder: "trung" },
    { vn: "SupercenterĐN", en: "SupercenterĐN", dropdown: "DNSC", folder: "dnsc" },
];
// Định nghĩa các bộ file riêng biệt cho từng loại
const FILE_MAPS = {
    THR: {
        bac: "THUONG-HIEU-RIENG_BAC",
        nam: "THUONG-HIEU-RIENG_NAM",
        trung: "THUONG-HIEU-RIENG_TRUNG",
        // dnsc: "THUONG-HIEU-RIENG_DNSC"
    },
    GIA_SI: {
        bac: "GIA-SI_BAC",
        nam: "GIA-SI_NAM",
        trung: "GIA-SI_TRUNG",
        // dnsc: "GIA-SI_DNSC"
    },
    MNLN: {
        bac: "MUA-CANG-NHIEU-GIA-CANG-RE_BAC",
        nam: "MUA-CANG-NHIEU-GIA-CANG-RE_NAM",
        trung: "MUA-CANG-NHIEU-GIA-CANG-RE_TRUNG",
        // dnsc: "MUA-CANG-NHIEU-GIA-CANG-RE_DNSC"
    },
    MAIL: {
        bac: "CLUSTER 1+2_BAC",
        nam: "NAM",
        trung: "CLUSTER 3", // Cập nhật theo ý bạn
        // dnsc: "CLUSTER DNSC"
    },
} as const;

const COMMON = {
    code: "MAIL 2607",
    start: "2026-03-26T00:00",
    end: "2026-04-08T23:59",
};

// Hàm "đẻ" Campaign
const createCampaign = (vn: string, en: string, folderName: string, fileKey: keyof typeof FILE_MAPS): Campaign => ({
    ...COMMON,
    typeVn: vn,
    typeEn: en,
    file: FILE_MAPS[fileKey],
    folder: folderName
});

export const currentCampaigns: Campaign[] = [
    createCampaign("DEAL TỐT ĐẾN TỪ THƯƠNG HIỆU RIÊNG", "BEST PRICE FROM PRIVATE LABLE", "mail", "MAIL"),
    createCampaign("GIÁ SỈ", "WHOLESALES", "giasi", "GIA_SI"),
    createCampaign("MUA NHIỀU LỢI NHIỀU", "BUY MORE SAVE MORE", "mnln", "MNLN"),
    createCampaign("THƯƠNG HIỆU RIÊNG", "PRIVATE LABLE", "thr", "THR"),
];

// Hàm có nhiệm vụ duyệt và nhân bản dữ liệu, tạo ra mảng chứa mọi InputData cần thiết (Dùng để nạp thẳng vào bộ test).
export const generateTestData = ():InputData[] => {
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