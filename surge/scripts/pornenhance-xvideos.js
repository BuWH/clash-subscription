// PornEnhance - Xvideos Ad Blocker
// Injects CSS to hide ad elements on xvideos.com
// Extracted from PornEnhance userscript

const css = `
#hlsplayer>div.videoad-base,
#ad-header-mobile-contener,
div.exo-ad-ins-div.exo-ad-playersiderectangle,
div.exo-ad-ins-container.ad-support-desktop,
#ad-footer,
div.thumb-ad.thumb-nat-ad.thumb-nat-exo-ad,
#page>div.remove-ads,
#footer {
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
