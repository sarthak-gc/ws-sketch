import { useState } from "react";

const Tutorial = ({ showTutorial }: { showTutorial: boolean }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    {
      title: "🚀 What Is Ws-Sketch?",
      content: (
        <p>
          Ws-Sketch is a browser-based drawing app inspired by Excalidraw. It
          allows you to create, collaborate, and save sketches seamlessly in the
          browser.
        </p>
      ),
    },
    {
      title: "🎨 1. Drawing Shapes",
      content: (
        <p>
          Pick from lines, rectangles, arrows, circles, and diamonds in the
          toolbar. Click and drag to create your shape.
        </p>
      ),
    },
    {
      title: "🎯 2. Selecting and Editing Shapes",
      content: (
        <p>
          Click on shapes to move or delete them. Press{" "}
          <kbd className="bg-gray-200 px-1 rounded">Escape</kbd> to deselect.
        </p>
      ),
    },
    {
      title: "🔄 3. Real-Time Collaboration",
      content: (
        <p>
          <span className="px-1 rounded text-yellow-400">(WIP)</span>
          Collaborate with others in real-time using WebSockets. Edits are
          instantly synced.
        </p>
      ),
    },
    {
      title: "💾 4. Local Saving",
      content: (
        <p>
          Your sketches are automatically saved in your browser's local storage.
        </p>
      ),
    },

    {
      title: "✅ Final Thoughts",
      content: (
        <p>
          This tool is ideal for brainstorming, planning, and sketching
          together. Give it a try and bring your ideas to life!
        </p>
      ),
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      skipTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    setCurrentStep(steps.length);
    localStorage.setItem("show_tutorial", String(!showTutorial));
  };

  return (
    <div
      className={`fixed inset-0 bg-transparent bg-opacity-50 z-50 justify-center items-center ${
        currentStep >= steps.length ? "hidden" : "flex"
      }`}
    >
      {showTutorial && steps[currentStep] && (
        <div className="bg-gray-100 p-6 rounded-lg max-w-md w-full space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {steps[currentStep].title}
          </h2>
          <div className="text-gray-700">{steps[currentStep].content}</div>

          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
              onClick={skipTutorial}
            >
              Skip
            </button>
            <div>
              <button
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mr-2 hover:bg-gray-300"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Previous
              </button>
              <button
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                onClick={nextStep}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutorial;
