import { useRef } from "react";

export default function useGoogleSheetsApi() {
  const apiUrlRef = useRef(null);

  async function getEntries() {
    const response = await fetch(apiUrlRef.current, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch entries: ${response.status}`);
    }

    const result = await response.json();

    if (!Array.isArray(result)) {
      throw new Error(result.message || "Invalid API response.");
    }

    console.log(result);

    return result;
  }

  async function postData(data) {
    const response = await fetch(apiUrlRef.current, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const result = await response.json();

    if (result.status !== "success") {
      throw new Error(result.message || "Google Sheets request failed.");
    }

    return result;
  }

  async function insertEntry(data) {
    return postData({ data: JSON.stringify(data) });
  }

  async function updateEntry(id, data) {
    if (id === undefined || id === null || id === "") {
      throw new Error("An ID is required to update an entry.");
    }

    return postData({
      action: "update",
      id,
      data: JSON.stringify(data),
    });
  }

  return {
    getEntries,
    insertEntry,
    updateEntry,
    apiUrlRef,
  };
}
