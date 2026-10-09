import { useEffect, useState } from "react";
import { generateChordSheet } from "../../lib/main";

const initialFormData = {
  title: "",
  artist: "",
  bpm: 100,
  meter: "4/4",
  key: "C",
  outputKey: "C",
  comments: "",
  sourceCode: "",
};

export default function useSongSheetMaker() {
  const [formData, setFormData] = useState(initialFormData);
  const [htmlOutput, setHtmlOutput] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
      ...(name === "key" ? { outputKey: value } : {}),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Submitted Data:", formData);
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    try {
      setHtmlOutput(
        generateChordSheet(
          formData.sourceCode,
          formData.key,
          formData.outputKey,
        ),
      );

      document.title =
        formData.title && formData.artist
          ? `${formData.title} - ${formData.artist} | Song Coder`
          : "Song Coder";
    } catch (error) {
      console.info(error);
    }
  }, [formData]);

  return {
    formData,
    htmlOutput,
    handleChange,
    handleSubmit,
    handlePrint,
  };
}
