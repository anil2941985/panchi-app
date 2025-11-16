import { useState, useEffect } from "react";

export default function Home() {
  const [storedName, setStoredName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [savingName, setSavingName] = useState(false);

  // Load saved name once on client
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("panchiName");
    if (saved) {
      setStoredName(saved);
      setNameInput(saved);
    }
  }, []);

  const greeting = storedName ? `Hey, ${storedName}` : "Hey,";

  function handleSaveName(e) {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setSavingName(true);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("panchiName", trimmed);
      }
      setStoredName(trimmed);
    } finally {
      setSavingName(false);
    }
  }

  function goToSearchWithCodes(originCode, destinationCode) {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams({
      origin: originCode,
      destination: destinationCode,
    }).toString();
    window.location.href = `/search?${params}`;
  }

  function handleFreeTextSearch(e) {
    e.preventDefault();
    // Very simple mapping for MVP
    const text = destinationText.toLowerCase();
    let originCode = "DEL";
    let destCode = "GOI";

    if (text.includes("goa")) destCode = "GOI";
    else if (text.includes("manali")) destCode = "KUU"; // Kullu/Manali
    else if (text.includes("jaipur")) destCode = "JAI";
    else destCode = "GOI"; // default for demo

    const params = new URLSearchParams({
      origin: originCode,
      destination: destCode,
    }).toString();
    if (typeof window !== "undefined") {
      window.location.href = `/search?${params}`;
    }
  }

  return (
    <main
      style={{
        fontFamily: "Poppins, system-ui, sans-serif",
        minHeight: "100vh",
        padding: "24px",
        background:
          "linear-gradient(135deg, #1E90FF 0%, #FF6F61 50%, #32CD32 100%)
