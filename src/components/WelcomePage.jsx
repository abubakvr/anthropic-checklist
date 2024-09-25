"use client";
import { sendGAEvent } from "@next/third-parties/google";
import React, { useState, useEffect } from "react";
import { Spinner } from "./Spinner";

function parseAndFormatData(inputString) {
  try {
    return JSON.parse(inputString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return [];
  }
}

const WelcomePage = ({ ipAddress }) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);

  const processSearch = async () => {
    sendGAEvent("event", "buttonClicked", { value: "Process Search" });
    setIsLoading(true);
    try {
      const response = await fetch("/api/checklist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();

      if (response.ok) {
        const result = data.data.content[0].text;
        const parsedData = parseAndFormatData(result);

        if (Array.isArray(parsedData)) {
          setMessage(parsedData);
          setVisibleItems(Array(parsedData.length).fill(false)); // Initialize visibility state
        } else {
          console.error("Parsed data is not an array:", parsedData);
          setMessage([]);
        }

        setIsLoading(false);
        sendGAEvent("event", "Requests", { value: "Success" });
      } else {
        console.error(data.error);
        setIsLoading(false);
        sendGAEvent("event", "Requests", { value: "Failure" });
      }
    } catch (error) {
      sendGAEvent("event", "Requests", { value: "Failure" });
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (message.length > 0) {
      message.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => {
            const newVisibleItems = [...prev];
            newVisibleItems[index] = true;
            return newVisibleItems;
          });
        }, index * 300); // Delay of 300ms between items
      });
    }
  }, [message]);

  return (
    <div className="flex flex-col w-screen h-screen items-center">
      <h1
        className={`text-4xl mb-10 transition-all duration-500 ${
          message.length > 0 ? "mt-12" : "mt-60"
        }`}
      >
        Welcome to Checklist, what do you plan on doing today?
      </h1>
      <div className="flex gap-x-3 w-2/4 items-center">
        <form
          data-testid="search-input"
          className="w-full search-box bg-opacity-10 flex flex-col justify-center items-center gap-x-4 h-12 rounded-md border border-[#5B5BBD] focus:border-blue lg:mt-1"
        >
          <div className="relative w-full ">
            <input
              name="q"
              type="search"
              className="w-full bg-transparent focus:outline-none text-[10px] md:text-lg text-white pl-2 md:pl-3 md:pr-2 flex items-center"
              placeholder="Type anything"
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </form>
        <button
          className="rounded-md bg-[#5B5BBD] h-12 w-32 px-6 flex items-center justify-center hover:opacity-80"
          onClick={processSearch}
        >
          {isLoading ? <Spinner /> : "Submit"}
        </button>
      </div>
      <div className="w-[1000px]">
        {message.length > 0 && (
          <>
            <h1 className="text-[#FFFFFF99] text-2xl mt-10 py-2 text-center transition-all">
              Here is a checklist created just for you.
            </h1>
            <div className="border-[#5B5BBD] grid grid-cols-3 flex-wrap gap-x-4 rounded-md p-5 text-xl  transition-all">
              {message.map((item, i) => (
                <div
                  key={i}
                  className={`border border-[#FFFFFF65] p-6 rounded-lg text-white flex items-start mb-4 opacity-0 transition-opacity duration-500 ${
                    visibleItems[i] ? "fade-in" : ""
                  }`}
                  style={{ animationDelay: `${i * 0.3}s` }} // Staggered delay
                >
                  <input
                    type="checkbox"
                    id={`checklist-item-${i}`}
                    className="mr-3 mt-2 flex items-center"
                  />
                  <label
                    htmlFor={`checklist-item-${i}`}
                    className="flex flex-col"
                  >
                    <h2 className="text-[#FFFFFF] text-xl">{item.title}</h2>
                    <p className="text-[#FFFFFF99] text-lg">{item.content}</p>
                  </label>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="text-white text-4xl text-center mt-8">
        IP Address: {ipAddress}
      </div>
    </div>
  );
};

export default WelcomePage;
