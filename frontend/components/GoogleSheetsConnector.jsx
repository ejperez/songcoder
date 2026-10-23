import { useState } from "react";
import Select from "react-select";
import useGoogleSheetsApi from "../hooks/useGoogleSheetsApi";

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
  const [selectedOption, setSelectedOption] = useState(null);
  const [entries, setEntries] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnectModalShown, setIsConnectModalShown] = useState(false);
  const { apiUrlRef, getEntries, insertEntry, updateEntry } =
    useGoogleSheetsApi();

  const handleDisconnect = () => {
    apiUrlRef.current = null;
    setCurrentId("");
    setSelectedOption(null);
    setEntries([]);
    setIsConnected(false);
  };

  const handleLoad = () => {
    const selectedId = selectedOption?.value ?? "";

    setCurrentId(selectedId);

    const selectedSong = entries.find((entry) => entry.id === selectedId);

    if (!selectedSong) return;

    setFormData(selectedSong.data);
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
    setSelectedOption(null);
  };

  const handleRefresh = async () => {
    const data = await getEntries();

    setEntries(data);
  };

  const options = entries.map((entry) => ({
    value: entry.id,
    label: `${entry.data.title} - ${entry.data.artist}`,
  }));

  const selectStyles = {
    control: (baseStyles) => ({
      ...baseStyles,
      borderRadius: 0,
      borderColor: "black",
      boxShadow: "none",
      height: 26,
      minHeight: 26,
      "&:hover": {
        borderColor: "black",
      },
    }),
    valueContainer: (baseStyles) => ({
      ...baseStyles,
      padding: "0 8px",
    }),
    singleValue: (baseStyles) => ({
      ...baseStyles,
      margin: 0,
    }),
    placeholder: (baseStyles) => ({
      ...baseStyles,
      color: "black",
    }),
    indicatorsContainer: (baseStyles) => ({
      ...baseStyles,
      height: 24,
    }),
    dropdownIndicator: (baseStyles) => ({
      ...baseStyles,
      padding: "0 6px",
      color: "black",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isSelected
        ? "#2684FF"
        : state.isFocused
          ? "#f6f3f4"
          : "white",
      color: state.isSelected ? "white" : "#333",
      cursor: "pointer",
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
  };

  return (
    <div>
      {isConnected ? (
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="flex items-center">
              <Select
                aria-label="Select a song"
                className="min-w-60"
                options={options}
                placeholder="<New song>"
                value={selectedOption}
                onChange={setSelectedOption}
                styles={selectStyles}
              />
            </div>
            <button
              className="border border-black my-2 cursor-pointer px-4"
              type="button"
              onClick={handleRefresh}
            >
              Refresh
            </button>
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
