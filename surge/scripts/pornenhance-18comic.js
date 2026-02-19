// PornEnhance - 18comic Ad Blocker
// Injects CSS to hide ad elements on 18comic.org / 18comic.vip
// Extracted from PornEnhance userscript

const css = `
div.top-nav>div>ul>div.center>li.top-menu-m:has(>a[target=_blank]),
div.top-nav>div>ul>div.pull-left>li.top-menu-link:has(>a[target=_blank]),
#wrapper>div.hidden-lg:has(>div[class$=_sticky2]),
div.panel-body>div>div.center.scramble-page.thewayhome>a[href="https://jmcomicgo.me"],
#wrapper>div>div>div>div>div:has(>div.photo_center_div>div.e8c78e-4_b>div.group-notice),
div.panel-body>div>div>div.e8c78e-4_b:has(>div.group-notice),
#wrapper>div.container>div.row:has(>div>div.e8c78e-4_b>div.group-notice),
#wrapper>div.container>div.row>div:has(>div.e8c78e-4_b>div.group-notice),
#wrapper>div.footer-container,
#wrapper>div>div>div>div>div[style="font-size: 10px;text-align: center;margin: 5px;"],
body>div.modal-backdrop.fade.in,
#billboard-modal,
#wrapper>div.float-right-daily,
#wrapper>div.float-right-image,
ul.nav.navbar-nav.navbar-left>li:has(>a[href="https://s.zlinkp.com/d.php?z=5278412"]) {
  display: none !important;
}
`;

const contentType = $response.headers["Content-Type"] || $response.headers["content-type"] || "";
if (!contentType.includes("text/html")) {
  $done({});
} else {
  const html = $response.body;
  const modifiedHtml = html.replace(/<\/head>/i, `<style>${css}</style></head>`);
  $done({ body: modifiedHtml });
}
