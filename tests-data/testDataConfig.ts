export const CONFIG = {
    campaign: {
        code: "MAIL 2608",
        start: "2026-04-09T00:00",
        end: "2026-04-22T23:59",
    },
} as const;

export const CAMPAIGN_DEFINITIONS = [
    {
        vn: "TUNG DEAL SIÊU TIẾT KIỆM",
        en: "MEGA SAVINGS DEALS",
        folder: "mail",
        enabled: false,
    },
    {
        vn: "GIÁ SỈ",
        en: "WHOLESALES",
        folder: "giasi",
        enabled: true,
    },
    {
        vn: "MUA NHIỀU LỢI NHIỀU",
        en: "BUY MORE SAVE MORE",
        folder: "mnln",
        enabled: false,
    },
    {
        vn: "THƯƠNG HIỆU RIÊNG",
        en: "PRIVATE LABEL",
        folder: "thr",
        enabled: false,
    },
    {
        vn: "HƠN CẢ GIÁ RẺ",
        en: "BETTER THAN CHEAP",
        folder: "mnln",
        enabled: true, //tắt ở đây
    },
    {
        vn: "HÀNG THÁI",
        en: "THAI PRODUCTS",
        folder: "thr",
        enabled: true,
    },
] as const;
