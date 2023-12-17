"use client";

import { useState } from "react";
import { useSocket } from "../context/socketProvider";

const Page = () => {
  const { sendMessage } = useSocket();
  const [message, setmessage] = useState("");
  return (
    <div>
      <h1>hello</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setmessage(e.target.value)}
      />
      <button onClick={() => sendMessage(message)}>send</button>
    </div>
  );
};

export default Page;
