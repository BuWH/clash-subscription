// PornEnhance - Jable.tv Ad Blocker
// Injects CSS to hide ad elements on jable.tv
// Extracted from PornEnhance userscript

const css = `
div.plyr__ads,
div:has(>div>img[src="//cdn.tapioni.com/ab-banner.png"]),
div.asg-interstitial:has(>div>iframe),
section>div.row>div:has(>div>div.detail>h6>a[href^="https://go."]),
#site-content>div.container>section:has(>div>div>iframe),
#site-content>div.container>section:has(>div>div>img[src*=".afcdn.net"]),
div.row>div:has(div[id^=exo-native-widget-]),
section.video-info>div.text-center>ins,
section.video-info>div.text-center>div:has(>div>iframe),
div.text-center>a[href^="http://s."],
div.row>div:has(>div[id^=exoNativeWidget]),
div.row>div:has(h6>a[href^="https://r."]),
#site-content>div.container>section:has(>iframe),
section.video-info>div.text-center>iframe,
#site-content>div>div>div.col.right-sidebar>div.text-center>iframe,
body>div[class^=root--],
div[id^=asg-],
#site-content>div.container>section:has(>a[target=_blank]>img),
body>div.h5.text-center:has(>span):has(>a[target=_blank]),
body>nav>div.container>div.row>div:has(a[href^="https://r."]),
#site-header>div>div>div>nav>div>ul>li:has(a[href^="https://r."]),
body>nav>div.container>div.row>div:has(a[href^="https://go."]),
#site-header>div>div>div>nav>div>ul>li:has(a[href^="https://go."]),
body>nav>div.container>div.row>div:has(a[href^="https://enter."]),
#site-header>div>div>div>nav>div>ul>li:has(a[href^="https://enter."]) {
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
