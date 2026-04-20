import React from "react";
import ChatWidget from "../components/ChatWidget";

const CommunityJoin = () => {
  return (
    <div
      className="bg-gradient-to-br from-[#0a0710] via-[#120d18] to-[#1a0f28] flex items-center justify-center md:p-4"
      style={{ height: "100dvh" }}
    >
      <ChatWidget />
    </div>
  );
};

export default CommunityJoin;
