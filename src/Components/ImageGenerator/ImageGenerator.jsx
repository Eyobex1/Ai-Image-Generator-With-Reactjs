import React, { useRef, useState } from "react";
import "./ImageGenerator.css";
import default_image from "../Assets/default_image.svg";

export const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState("/");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  console.log(process.env.REACT_APP_API_KEY);
  const imageGenerator = async () => {
    const prompt = inputRef.current.value.trim();
    if (!prompt) return;

    setLoading(true);
    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer API_KEY_HERE`, // Replace this temporarily for testing
          },
          body: JSON.stringify({
            prompt: prompt,
            n: 1,
            size: "512x512",
          }),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (data && data.data && data.data.length > 0 && data.data[0].url) {
        setImageUrl(data.data[0].url);
      } else {
        console.error("Image generation failed:", data);
        alert(data?.error?.message || "Image generation failed.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Network error or API key issue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        <span>Eyob</span> AI Image <span>Generator</span>
      </div>

      <div className="image-loading">
        <div className="image">
          <img
            src={imageUrl === "/" ? default_image : imageUrl}
            alt="Generated result"
          />
        </div>
        <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
        <div className={loading ? "loading-text" : "display-none"}>
          Loading....
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Ask Eyob for an image..."
          ref={inputRef}
        />
        <div className="generate-btn" onClick={imageGenerator}>
          Generate
        </div>
      </div>
    </div>
  );
};
