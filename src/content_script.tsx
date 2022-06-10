import * as Sentry from '@sentry/browser';
// @ts-expect-error
import {SentryReplay} from '@sentry/replay';
import "@sentry/tracing";


chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log(msg)
  if (msg.action === 'inject' && msg.dsn) {
    console.log('inject')
    Sentry.init({
      debug: true,
      dsn: msg.dsn,
      environment: 'demo',
      tracesSampleRate: 1.0,
      integrations: [
        new SentryReplay({stickySession: true, rrwebConfig: {inlineImages: true, collectFonts: true}}),
        // new BrowserTracing({
          // tracingOrigins: ["localhost:3000", "localhost", "bv.ngrok.io", /^\//],
        // }),
      ],
    });
    sendResponse('Sentry injected');
  }
});

chrome.runtime.connect();
console.log('content script');
