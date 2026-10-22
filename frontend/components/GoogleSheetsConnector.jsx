import { useState, useRef } from "react";
import useGoogleSheetsApi from "../hooks/useGoogleSheetsApi";
import { Options } from "./Editor";

function GoogleSheetsModal({
  apiUrlRef,
  setEntries,
  getEntries,
  setIsConnected,
  setIsConnectModalShown,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async (event) => {
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
  };

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

export default function GoogleSheetsConnector({
  formData,
  setFormData,
  clearFormData,
}) {
  const [currentId, setCurrentId] = useState("");
  const [entries, setEntries] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnectModalShown, setIsConnectModalShown] = useState(false);
  const { apiUrlRef, getEntries, insertEntry, updateEntry } =
    useGoogleSheetsApi();
  const songSelectRef = useRef(null);

  const handleDisconnect = () => {
    apiUrlRef.current = null;
    setCurrentId("");
    setEntries([]);
    setIsConnected(false);
  };

  const handleLoad = () => {
    const selectedId = songSelectRef.current.value;

    setCurrentId(selectedId);

    const selectedSong = entries.filter(
      (entry) => entry.id === songSelectRef.current.value,
    );

    if (!selectedSong.length) return;

    setFormData(selectedSong[0].data);
  };

  const handleSave = async () => {
    if (currentId === "") {
      const { id } = await insertEntry(formData);
      setCurrentId(id);
    } else {
      updateEntry(currentId, formData);
    }
  };

  const handleNew = () => {
    setCurrentId("");
    clearFormData();
    songSelectRef.current.value = "";
  };

  const options = entries.map((entry) => ({
    value: entry.id,
    label: entry.data.title,
  }));

  return (
    <div>
      {isConnected ? (
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="flex items-center">
              <select
                className="border px-2 min-w-60 h-[26px]"
                name="meter"
                ref={songSelectRef}
              >
                <Options
                  label="<New song>"
                  values={options}
                  disabledLabel={false}
                />
              </select>
            </div>
            <button
              className="border border-black my-2 cursor-pointer px-4"
              type="button"
              onClick={handleLoad}
            >
              Load
            </button>
            <button
              className="border border-black my-2 cursor-pointer px-4"
              type="button"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="border border-black my-2 cursor-pointer px-4"
              type="button"
              onClick={handleNew}
            >
              New
            </button>
          </div>
          <div>
            <button
              className="border border-black my-2 cursor-pointer px-4"
              type="button"
              onClick={handleDisconnect}
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
