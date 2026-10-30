import { useState } from "react";

export default function GoogleSheetsModal({
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

      if ("localStorage" in window) {
        window.localStorage.setItem("app_script_url", url);
      }
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
    <div className="flex justify-center items-center fixed inset-0 bg-black/20 text-black">
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
