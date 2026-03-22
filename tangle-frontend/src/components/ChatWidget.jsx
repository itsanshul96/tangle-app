import React, { useEffect, useState } from "react";
import { onboardingFlow } from "../data/onboardingFlow";
import API from "../services/api";

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState("");
  const [leadData, setLeadData] = useState({});
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const initialMessages = onboardingFlow
      .slice(0, 2)
      .map((item) => ({ sender: "bot", text: item.message }));
    setMessages(initialMessages);
    setStepIndex(2);
  }, []);

  const currentStep = onboardingFlow[stepIndex];

  const appendMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const handleInputSubmit = async () => {
    if (!input.trim() || !currentStep) return;

    appendMessage("user", input);

    const updatedLead = {
      ...leadData,
      [currentStep.key]: input.trim()
    };
    setLeadData(updatedLead);
    setInput("");

    const nextIndex = stepIndex + 1;

    if (nextIndex < onboardingFlow.length) {
      setTimeout(() => {
        appendMessage("bot", onboardingFlow[nextIndex].message);
        setStepIndex(nextIndex);
      }, 400);
    } else {
      try {
        await API.post("/community/join", updatedLead);
        setTimeout(() => {
          appendMessage("bot", "You’re officially part of the Tangle community 💜");
          appendMessage(
            "bot",
            "We’re building a space where people connect through stories, not just profiles."
          );
          appendMessage(
            "bot",
            "As we open the community in phases, you’ll be among the first invited in."
          );
          setCompleted(true);
        }, 400);
      } catch (err) {
        setTimeout(() => {
          appendMessage("bot", "Something went wrong while saving your details. Please try again.");
        }, 400);
      }
    }
  };

  const handleOptionClick = async (option) => {
    if (!currentStep) return;

    appendMessage("user", option);

    const updatedLead = {
      ...leadData,
      [currentStep.key]: option
    };
    setLeadData(updatedLead);

    const nextIndex = stepIndex + 1;

    if (nextIndex < onboardingFlow.length) {
      setTimeout(() => {
        appendMessage("bot", onboardingFlow[nextIndex].message);
        setStepIndex(nextIndex);
      }, 400);
    } else {
      try {
        await API.post("/community/join", updatedLead);
        setTimeout(() => {
          appendMessage("bot", "You’re officially part of the Tangle community 💜");
          setCompleted(true);
        }, 400);
      } catch (err) {
        setTimeout(() => {
          appendMessage("bot", "Something went wrong while saving your details. Please try again.");
        }, 400);
      }
    }
  };

  return (
    <div className="w-full max-w-md h-[650px] rounded-[28px] bg-[#0f0b14] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-white/10 bg-[#16101d]">
        <h2 className="text-white text-lg font-semibold">Join Tangle Community</h2>
        <p className="text-white/60 text-sm">Your story deserves a match.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-[#120d18] to-[#1a1321]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-6 ${
              msg.sender === "bot"
                ? "bg-white/10 text-white rounded-tl-md"
                : "bg-[#e8547a]/25 text-white ml-auto rounded-tr-md"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {!completed && currentStep && (
        <div className="p-4 border-t border-white/10 bg-[#16101d]">
          {currentStep.type === "options" ? (
            <div className="grid grid-cols-2 gap-2">
              {currentStep.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className="rounded-xl px-3 py-2 bg-white/10 text-white hover:bg-[#e8547a] transition"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()}
                placeholder="Type here..."
                className="flex-1 rounded-xl px-4 py-3 bg-white/10 text-white placeholder:text-white/40 outline-none"
              />
              <button
                onClick={handleInputSubmit}
                className="rounded-xl px-4 py-3 bg-[#e8547a] text-white hover:bg-[#d94369] transition"
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;