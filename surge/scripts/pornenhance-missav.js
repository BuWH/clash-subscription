// PornEnhance - MissAV Ad Blocker
// Injects CSS to hide ad elements on missav.com / missav.ws / missav.ai
// Extracted from PornEnhance userscript

const css = `
#html-ads,
#ts_ad_video_aes67,
div.pt-16.pb-4.px-4:has(div.hidden),
div[class|=root]:has(div[class|=rootContent]),
div.space-y-6.mb-6:has(div.hidden),
div[x-show^="currentTab === 'video_details'"] div ul,
div.-m-5.mb-2:has(iframe),
html iframe[id|=container],
html iframe[class|=container],
body div.fixed:has(>a[href^="https://bit.ly"][target=_blank]),
body>div[class|=pl]:has(link),
div.flex-1.order-first div.under_player {
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
