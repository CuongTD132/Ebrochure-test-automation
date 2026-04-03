export const CONFIG = {
    campaign: {
        code: "MAIL 2608",
        start: "2026-04-09T00:00",
        end: "2026-04-22T23:59",
    },
    fileMaps: {
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
            // dnsc: "DEAL-TOT-CHOT-LA-LOI_SCDN_2607"
        },
        MAIL: {
            bac: "CLUSTER 1+2_BAC",
            nam: "CLUSTER 1+2_NAM",
            trung: "CLUSTER 3",
            dnsc: "DNSC"
        },
    }
} as const;