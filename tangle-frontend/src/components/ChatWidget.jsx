import React, { useEffect, useRef, useState } from "react";
import { onboardingFlow } from "../data/onboardingFlow";
import API from "../services/api";

const typingDelay = (text) =>
  Math.min(Math.max(text.length * 22, 800), 2000);

const TypingIndicator = () => (
  <div className="max-w-[85%] px-4 py-3.5 rounded-2xl rounded-tl-md bg-white/10 flex gap-1.5 items-center">
    {[0, 150, 300].map((delay) => (
      <span
        key={delay}
        className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
        style={{ animationDelay: `${delay}ms` }}
      />
    ))}
  </div>
);

const Message = ({ sender, text }) => (
  <div
    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-6 message-in ${
      sender === "bot"
        ? "bg-white/10 text-white rounded-tl-md"
        : "bg-[#e8547a]/25 text-white ml-auto rounded-tr-md"
    }`}
  >
    {text}
  </div>
);

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [input, setInput] = useState("");
  const [leadData, setLeadData] = useState({});
  const [completed, setCompleted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const scrollToBottom = () => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    window.visualViewport?.addEventListener("resize", scrollToBottom);
    return () => window.visualViewport?.removeEventListener("resize", scrollToBottom);
  }, []);

  useEffect(() => {
    const msg1 = onboardingFlow[0].message;
    const msg2 = onboardingFlow[1].message;
    const delay1 = typingDelay(msg1);
    const delay2 = typingDelay(msg2);

    setIsTyping(true);
    const t1 = setTimeout(() => {
      setIsTyping(false);
      setMessages([{ sender: "bot", text: msg1 }]);
      setIsTyping(true);
      const t2 = setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { sender: "bot", text: msg2 }]);
        setStepIndex(2);
      }, delay2);
      return () => clearTimeout(t2);
    }, delay1);

    return () => clearTimeout(t1);
  }, []);

  const sendBotMessage = (text, onDone) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: "bot", text }]);
      onDone?.();
    }, typingDelay(text));
  };

  const currentStep = stepIndex >= 0 ? onboardingFlow[stepIndex] : null;

  const advance = (value) => {
    const updatedLead = { ...leadData, [onboardingFlow[stepIndex].key]: value };
    setLeadData(updatedLead);
    setInput("");

    const nextIndex = stepIndex + 1;

    if (nextIndex < onboardingFlow.length) {
      sendBotMessage(onboardingFlow[nextIndex].message, () =>
        setStepIndex(nextIndex)
      );
    } else {
      setIsTyping(true);
      API.post("/community/join", updatedLead)
        .then(() => {
          setTimeout(() => {
            setIsTyping(false);
            setCompleted(true);
          }, 600);
        })
        .catch(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: "Something went wrong saving your details. Please try again.",
            },
          ]);
        });
    }
  };

  const handleInputSubmit = () => {
    if (!input.trim() || !currentStep || isTyping) return;
    setMessages((prev) => [...prev, { sender: "user", text: input.trim() }]);
    advance(input.trim());
  };

  const handleOptionClick = (option) => {
    if (!currentStep || isTyping) return;
    setMessages((prev) => [...prev, { sender: "user", text: option }]);
    advance(option);
  };

  return (
    <div className="w-full md:max-w-md h-full md:h-[680px] rounded-none md:rounded-[28px] bg-[#0f0b14] border-0 md:border border-white/10 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 bg-[#16101d] flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e8547a] to-[#9b59b6] flex items-center justify-center text-white text-sm font-bold shrink-0">
          T
        </div>
        <div>
          <h2 className="text-white text-sm font-semibold leading-tight">Tangle</h2>
          <p className="text-white/40 text-xs">Your story deserves a match</p>
        </div>
      </div>

      {/* Messages or completion screen */}
      {completed ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center bg-gradient-to-b from-[#120d18] to-[#1a1321] completion-in">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#e8547a]/20 to-[#9b59b6]/20 border border-[#e8547a]/20 flex items-center justify-center text-3xl mb-6">
            💜
          </div>
          <h2 className="text-white text-2xl font-serif font-semibold mb-3 leading-tight">
            You're in{leadData.name ? `, ${leadData.name}` : ""}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-[260px]">
            We're building a space where people connect through stories, not just profiles.
          </p>
          <div className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
            <p className="text-white/40 text-xs leading-relaxed">
              As we open Tangle in phases, you'll be among the first invited in.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3 bg-gradient-to-b from-[#120d18] to-[#1a1321]">
          {messages.map((msg, i) => (
            <Message key={i} sender={msg.sender} text={msg.text} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input area */}
      {!completed && currentStep && (
        <div className="p-4 border-t border-white/10 bg-[#16101d] shrink-0">
          {currentStep.type === "options" ? (
            <div className="grid grid-cols-2 gap-2">
              {currentStep.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  disabled={isTyping}
                  className="rounded-xl px-3 py-2.5 bg-white/10 text-white text-sm hover:bg-[#e8547a]/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
                disabled={isTyping}
                placeholder={isTyping ? "" : "Type here..."}
                className="flex-1 rounded-xl px-4 py-3 bg-white/10 text-white text-base md:text-sm placeholder:text-white/30 outline-none disabled:opacity-40 transition-opacity"
              />
              <button
                onClick={handleInputSubmit}
                disabled={isTyping || !input.trim()}
                className="rounded-xl px-4 py-3 bg-[#e8547a] text-white text-sm font-medium hover:bg-[#d94369] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
