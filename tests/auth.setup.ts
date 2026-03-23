import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { isSessionExpired } from '../utils/session';

setup('login and save session', async ({ page }) => {

    if (!isSessionExpired()) {
        console.log('Session còn hạn → skip login');
        return;
    }

    console.log('Session hết hạn → tiến hành login');

    const loginPage = new LoginPage(page);
    await loginPage.logIn();

    await page.waitForURL('/admin');

    await page.context().storageState({ path: 'auth.json' });

    console.log('Đã refresh session');
});