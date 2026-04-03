import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { isSessionExpired } from '../utils/session';
import { getAuthFile } from '../utils/env';

setup('login and save session', async ({ page }) => {
    const authFile = getAuthFile();

    if (!isSessionExpired()) {
        console.log(`Session còn hạn (${authFile}) → skip`);
        return;
    }

    console.log(`Session hết hạn (${authFile}) → login`);

    // Clear old storage state to avoid conflicts
    await page.context().clearCookies();

    const loginPage = new LoginPage(page);
    await loginPage.logIn();

    await page.waitForURL('/admin');

    await page.context().storageState({ path: authFile });

    console.log(`Đã lưu session: ${authFile}`);
});