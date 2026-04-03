export const CONFIG = {
    campaign: {
        code: "MAIL 2608",
        start: "2026-04-09T00:00",
        end: "2026-04-22T23:59",
    },
} as const;

export const CAMPAIGN_DEFINITIONS = [
    {
        key: "MAIL",
        vn: "TUNG DEAL SIÊU TIẾT KIỆM",
        en: "MEGA SAVINGS DEALS",
        folder: "mail",
        enabled: true,
    },
    {
        key: "GIA_SI",
        vn: "GIÁ SỈ",
        en: "WHOLESALES",
        folder: "giasi",
        enabled: true,
    },
    {
        key: "MNLN",
        vn: "MUA NHIỀU LỢI NHIỀU",
        en: "BUY MORE SAVE MORE",
        folder: "mnln",
        enabled: true,
    },
    {
        key: "THR",
        vn: "THƯƠNG HIỆU RIÊNG",
        en: "PRIVATE LABEL",
        folder: "thr",
        enabled: true,
    },
    {
        key: "MNLN",
        vn: "DEAL TỐT CHỐT LÀ LỜI",
        en: "GOOD DEALS EQUAL BIG GAINS",
        folder: "mnln",
        enabled: false, //tắt ở đây
    },
] as const;
