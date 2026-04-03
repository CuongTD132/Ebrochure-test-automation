import * as fs from 'fs';
import { getAuthFile } from './env';

export function isSessionExpired(): boolean {
    const authFile = getAuthFile();

    if (!fs.existsSync(authFile)) return true;

    const state = JSON.parse(fs.readFileSync(authFile, 'utf-8'));

    const authCookie = state.cookies.find((c: any) =>
        c.name.includes('session')
    );

    if (!authCookie || !authCookie.expires) return true;

    const expires = authCookie.expires * 1000;
    const buffer = 5 * 60 * 1000;

    return Date.now() > (expires - buffer);
}