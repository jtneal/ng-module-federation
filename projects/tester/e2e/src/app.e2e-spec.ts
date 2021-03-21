import { browser, logging } from 'protractor';

import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display home title', async () => {
    await page.navigateTo('home');
    expect(await page.getParagraphText()).toEqual('home works!');
  });

  it('should display about title', async () => {
    await page.navigateTo('about');
    expect(await page.getParagraphText()).toEqual('about works!');
  });

  it('should display contact title', async () => {
    await page.navigateTo('contact');
    expect(await page.getParagraphText()).toEqual('contact works!');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
