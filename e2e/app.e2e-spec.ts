import { JtfjPage } from './app.po';

describe('jtfj App', function() {
  let page: JtfjPage;

  beforeEach(() => {
    page = new JtfjPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
