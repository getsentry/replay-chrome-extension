import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";


const Popup = () => {
  const [count, setCount] = useState(0);
  const [dsn, setDsn] = useState<string>("");
  const [currentURL, setCurrentURL] = useState<string>();

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    chrome.storage.sync.get(
      {
        dsn: "",
      },
      (items) => {
        setDsn(items.dsn);
      }
    );
  }, []);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color: "#555555",
          },
          (msg) => {
            console.log("result message:", msg);
          }
        );
      }
    });
  };

  const handleInjectSentry = () => {
    console.log({dsn});
    if (!dsn) { return };

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            action: 'inject',
            dsn,
          },
          (msg) => {
            console.log("result message:", msg);
          }
        );
      }
    });


  }
  return (
    <>
      <ul style={{ minWidth: "700px" }}>
        <li>Current URL: {currentURL}</li>
        <li>Current Time: {new Date().toLocaleTimeString()}</li>
      </ul>
      <input placeholder="Sentry DSN" value={dsn} onChange={e => setDsn(e.target.value)} />
      <button
        onClick={handleInjectSentry}
        style={{ marginRight: "5px" }}
      >
        Inject Sentry
      </button>
      <button onClick={changeBackground}>change background</button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
