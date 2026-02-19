// PornEnhance - Pornhub Ad Blocker
// Injects CSS to hide ad elements on pornhub.com
// Extracted from PornEnhance userscript

const css = `
#hd-leftColVideoPage>div.topSectionGrid>div.sideColumn.original>div.sideAds,
#relatedVideosListing>li.js-nativeTjVideoGrid.js_promoItem:has(>div>iframe),
#hd-leftColVideoPage>div.topSectionGrid>div.videoWrapModelInfo.original>div>div.hd.clear.original,
#videoSearchResult>li.sniperModeEngaged.alpha:has(>div),
#videoSearchResult>li.emptyBlockSpace,
#singleFeedSection>li.emptyBlockSpace,
#singleFeedSection>li.sniperModeEngaged.alpha:has(>div),
#pb_iframe,
#relatedVideosCenter>li.js_promoItem:has(>div>iframe),
#hd-leftColVideoPage>div>div.hd.clear.original:has(>div>iframe),
#hd-rightColVideoPage>div.clearfix:has(>div>div>iframe),
body>div:has(>iframe),
div:has(>ins[style="width:950px;height:250px;display:block;margin:0 auto;"]),
div.footerContentWrapper,
#footer,
div.logoFooterWrapper.homePageFooter,
#js-abContainterMain,
body>div.networkBarWrapper {
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
