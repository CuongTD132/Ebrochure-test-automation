export const CONFIG = {
    campaign: {
        code: "MAIL 2609",
        start: "2026-04-23T00:00",
        end: "2026-05-06T23:59",
    },
} as const;

export const CAMPAIGN_DEFINITIONS = [
    {
        vn: "21 DEAL GIÁ SẬP SÀN MỪNG ĐẠI LỄ",
        en: "21 SHOCK DEALS CELEBRATING THE HOLIDAY",
        folder: "mail",
        enabled: true,
    },
    {
        vn: "GIÁ SỈ",
        en: "WHOLESALES",
        folder: "giasi",
        enabled: false,
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
        enabled: false, //tắt ở đây
    },
    {
        vn: "HÀNG THÁI",
        en: "THAI PRODUCTS",
        folder: "thr",
        enabled: false,
    },
] as const;

export const REGIONS = [
    { vn: "MIỀN BẮC", en: "CLUSTER BAC", dropdown: "Cluster_Bắc", folder: "bac" },
    { vn: "MIỀN NAM", en: "CLUSTER NAM", dropdown: "Cluster_Nam", folder: "nam" },
    { vn: "MIỀN TRUNG", en: "CLUSTER 3", dropdown: "Cluster 3", folder: "trung" },
    { vn: "SupercenterĐN", en: "SupercenterĐN", dropdown: "DNSC", folder: "dnsc" },
];