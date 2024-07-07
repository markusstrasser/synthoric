import React from "react";

// Example icons for different inference types
const icons = {
  knowledge: "📘",
  skill: "🛠️",
  misconception: "❌",
  other: "🔍",
};

const InferenceCard = ({ inference, listStyle = false }) => {
  return (
    <div
      className={`flex items-center p-2 bg-white shadow-md rounded-lg ${listStyle ? "space-x-4" : "flex-col space-y-2"}`}
    >
      <span className="text-lg">{icons[inference.type]}</span>
      <div className="flex-grow">
        <h2 className="text-sm font-bold text-gray-800 truncate">
          {inference.description}
        </h2>
        <div className="flex text-xs text-gray-600">
          <p className="mr-2">
            Type: <span className="font-semibold">{inference.type}</span>
          </p>
          <p className="mr-2">
            Mastery:{" "}
            <span className="font-semibold">
              {(inference.assumedMasteryLevel * 100).toFixed(0)}%
            </span>
          </p>
          <p>
            Confidence:{" "}
            <span className="font-semibold">
              {(inference.systemConfidence * 100).toFixed(0)}%
            </span>
          </p>
        </div>
      </div>
      <div className="text-xs">
        <h3 className="font-semibold">Sources:</h3>
        {inference.sources.map((source, index) => (
          <p key={index} className="truncate">
            {source.whyRelevant} ({(source.weight * 100).toFixed(0)}%)
          </p>
        ))}
      </div>
    </div>
  );
};

export default InferenceCard;