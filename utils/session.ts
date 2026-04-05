import * as fs from 'fs';
import { getAuthFile } from './env';

export function isSessionExpired(): boolean {
    const authFile = getAuthFile();

    if (!fs.existsSync(authFile)) {
        console.log('Không tìm thấy auth file');
        return true;
    }

    const state = JSON.parse(fs.readFileSync(authFile, 'utf-8'));

    const authCookie = state.cookies.find((c: any) =>
        c.name.includes('session')
    );

    if (!authCookie || !authCookie.expires) {
        console.log('Không có cookie session hoặc expires');
        return true;
    }

    const expires = authCookie.expires * 1000;
    const buffer = 5 * 60 * 1000;
    const now = Date.now();

    const remaining = expires - now;

    // Format thời gian còn lại
    const seconds = Math.floor(remaining / 1000) % 60;
    const minutes = Math.floor(remaining / (1000 * 60)) % 60;
    const hours = Math.floor(remaining / (1000 * 60 * 60));

    console.log(`Session còn lại: ${hours}h ${minutes}m ${seconds}s`);

    return now > (expires - buffer);
}