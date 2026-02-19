// PornEnhance - 91porn Ad Blocker
// Injects CSS to hide ad elements on 91porn.com
// Extracted from PornEnhance userscript

const css = `
#row>iframe,
#videodetails>div:has(>a>img.ad_img),
#videodetails>iframe,
body>div:has(>div[align=center]>div.cont6),
#footer-container {
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
