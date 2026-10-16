import { useState } from "react";
import useGoogleSheetsApi from "../hooks/useGoogleSheetsApi";
import Select from "react-select";

function GoogleSheetsModal({
  apiUrlRef,
  setEntries,
  getEntries,
  setIsConnected,
  setIsConnectModalShown,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConnect(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const { url } = Object.fromEntries(formData.entries());

    if (
      !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec\/?$/.test(url)
    ) {
      setError("Enter a valid Google Apps Script Web App URL.");
      return;
    }

    apiUrlRef.current = url;
    setLoading(true);
    setError("");

    try {
      const data = await getEntries();

      setEntries(data);
      setIsConnected(true);
      setIsConnectModalShown(false);
    } catch (err) {
      apiUrlRef.current = null;
      setEntries([]);
      setError(
        `Unable to connect: ${err.message}. Check the URL, deployment access, and CORS settings.`,
      );
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center fixed inset-0 bg-black/20">
      <div className="relative bg-white p-2 w-1/2 text-center rounded-sm">
        <h2 className="font-bold text-lg mb-10">Connect to Google Sheets</h2>
        <form onSubmit={handleConnect}>
          <label htmlFor="apiUrl">Apps Script Web App URL</label>
          <br />

          <input
            name="url"
            type="url"
            placeholder="https://script.google.com/macros/s/.../exec"
            required
            className="w-3/4 bg-gray-100 p-2"
          />
          <br />

          <div className="mt-10 flex gap-2 justify-center">
            <button
              className=" bg-black text-white my-2 cursor-pointer px-4"
              type="submit"
              disabled={loading}
            >
              {loading ? "Connecting..." : "Connect"}
            </button>

            <button
              className="border border-black my-2 cursor-pointer px-4"
              onClick={() => {
                setIsConnectModalShown(false);
              }}
              type="button"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
        {error}
      </div>
    </div>
  );
}

export default function GoogleSheetsConnector({ formData, setFormData }) {
  const [entries, setEntries] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnectModalShown, setIsConnectModalShown] = useState(false);
  const { apiUrlRef, getEntries, insertEntry } = useGoogleSheetsApi();

  function disconnect() {
    apiUrlRef.current = null;
    setEntries([]);
    setError("");
    setIsConnected(false);
  }

  return (
    <div>
      {isConnected ? (
        <div className="flex justify-between">
          <div className="flex gap-2">
            <button
              className="border border-black my-2 cursor-pointer px-4"
              type="button"
            >
              Load
            </button>
            <button
              className="border border-black my-2 cursor-pointer px-4"
              type="button"
              onClick={() => {
                insertEntry(formData);
              }}
            >
              Save
            </button>
          </div>
          <div>
            <button
              className="border border-black my-2 cursor-pointer px-4"
              type="button"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="text-sm">
          <button
            type="button"
            onClick={() => {
              setIsConnectModalShown(true);
            }}
            className="my-2 cursor-pointer underline"
          >
            Connect to Google Sheets
          </button>{" "}
          to load and save your song sheets.
        </div>
      )}

      {isConnectModalShown && (
        <GoogleSheetsModal
          {...{
            apiUrlRef,
            setEntries,
            getEntries,
            setIsConnected,
            setIsConnectModalShown,
          }}
        />
      )}
    </div>
  );
}
