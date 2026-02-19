// PornEnhance - 91porna Ad Blocker
// Injects CSS to hide ad elements on 91porna.com
// Extracted from PornEnhance userscript

const css = `
body>div.modal-backdrop.fade.in,
body>main>div>div>div>ul>li:has(>a.checkNum[target=_blank]),
body>main>div>div.flex-1>div:has(>div>div.swiper),
#tip_modal,
body>main>div:has(>div.grid>div.dx-banner-item),
body>main>div.text-mini.mb-3:has(>ul.dx-recommend-icons),
#app-footer,
body>main>div:has(>ul.grid>li:nth-child(1)>a[rel="external nofollow"]>img[_type=data-src]),
body>main>div:has(>ul.flex>li:nth-child(1)>a[rel="external nofollow"]) {
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
