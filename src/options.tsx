import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Options = () => {
  const [dsn, setDsn] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    chrome.storage.sync.get(['dsn', 'enabled'],
      (items) => {
        setDsn(items.dsn);
        setEnabled(items.enabled);
      }
    );
  }, []);

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      {
        dsn,
        enabled,
      },
      () => {
        // Update status to let user know options were saved.
        setStatus("Options saved.");
        const id = setTimeout(() => {
          setStatus("");
        }, 1000);
        return () => clearTimeout(id);
      }
    );
  };

  return (
    <>
      <div>
        Sentry DSN: <input
          value={dsn}
          onChange={(event) => setDsn(event.target.value)}
        />
      </div>

      <div>
        Enabled: <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => setEnabled(!!event.target.checked)}
        />
      </div>

      <div>{status}</div>
      <button onClick={saveOptions}>Save</button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
);
