import * as Sentry from '@sentry/browser';
import {Replay} from '@sentry/replay';
import "@sentry/tracing";


chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  // console.log('on message', msg, sender);
  if (msg.action === 'inject' && msg.dsn) {
    console.log('Injecting Sentry Replay')
    window.sessionStorage.removeItem('sentryReplaySession')
    try {
      const replays = new Replay({
        blockAllMedia: false,
        maskAllText: false,
        useCompression: true,
      });
      // @ts-ignore
      // window.replays = replays;
      // @ts-ignore
      // console.log(window.replays);
      Sentry.init({
        debug: true,
        dsn: msg.dsn,
        environment: 'demo',
        release: "foo",
        tracesSampleRate: 1.0,
        // @ts-ignore testing
        replaysSessionSampleRate: 1.0,
        integrations: [
          replays,
          // new BrowserTracing({
          // tracingOrigins: ["localhost:3000", "localhost", "bv.ngrok.io", /^\//],
          // }),
        ],
      });
      sendResponse({msg: 'Sentry injected'});
    } catch(err) {
      console.error(err);
      }
  }
  return true;

});
