export function getAuthFile(): string {
    const baseURL = process.env.BASE_URL || '';

    if (baseURL.includes('dev')) {
        return 'auth-dev.json';
    }

    if (baseURL.includes('staging')) {
        return 'auth-staging.json';
    }

    return 'auth-prod.json';
}