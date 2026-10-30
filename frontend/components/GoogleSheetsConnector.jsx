import { useContext, useState, useEffect } from "react";
import Select from "react-select";
import useGoogleSheetsApi from "../hooks/useGoogleSheetsApi";
import { AppContext } from "./App";
import GoogleSheetsModal from "./GoogleSheetsModal";

export default function GoogleSheetsConnector() {
  const { formData, setFormData, clearFormData, handlePrint } =
    useContext(AppContext);
  const [currentId, setCurrentId] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [entries, setEntries] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isFetchingEntries, setIsFetchingEntries] = useState(false);
  const [isConnectModalShown, setIsConnectModalShown] = useState(false);
  const { apiUrlRef, getEntries, insertEntry, updateEntry } =
    useGoogleSheetsApi();

  useEffect(() => {
    if (!("localStorage" in window)) return;

    const getInitialEntries = async () => {
      apiUrlRef.current = window.localStorage.getItem("app_script_url");
      setIsFetchingEntries(true);
      try {
        const data = await getEntries();
        setEntries(data);
        setIsConnected(true);
      } catch (e) {
      } finally {
        setIsFetchingEntries(false);
      }
    };

    getInitialEntries();
  }, []);

  const handleDisconnect = () => {
    apiUrlRef.current = null;
    setCurrentId("");
    setSelectedOption(null);
    setEntries([]);
    setIsConnected(false);
    if ("localStorage" in window) {
      window.localStorage.removeItem("app_script_url");
    }
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
      borderRadius: "3px",
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
      <div className="flex justify-between gap-3">
        {isFetchingEntries ? (
          <div>🎶 Fetching songs...</div>
        ) : (
          <>
            {isConnected && (
              <>
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
                  <button className="btn" type="button" onClick={handleRefresh}>
                    Refresh
                  </button>
                  <button className="btn" type="button" onClick={handleLoad}>
                    Load
                  </button>
                  <button className="btn" type="button" onClick={handleSave}>
                    Save
                  </button>
                  <button className="btn" type="button" onClick={handleNew}>
                    New
                  </button>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="btn"
              title="Print"
            >
              🖨️ Print
            </button>

            {isConnected ? (
              <button
                className="btn btn--danger"
                type="button"
                onClick={handleDisconnect}
              >
                ❌ Disconnect
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsConnectModalShown(true);
                }}
                className="btn"
                title="Connect to Google Sheets"
              >
                🛜 Connect
              </button>
            )}
          </>
        )}
      </div>

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
