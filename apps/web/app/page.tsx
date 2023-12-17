"use client";

import { useState } from "react";
import { useSocket } from "../context/socketProvider";

const Page = () => {
  const { sendMessage, messages } = useSocket();
  const [message, setmessage] = useState("");
  console.log(messages, "messages");
  return (
    <div>
      <h1>hello</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setmessage(e.target.value)}
      />
      <button onClick={() => sendMessage(message)}>send</button>
      {messages &&
        messages?.length > 0 &&
        messages.map((i: string) => <p key={i}>{i}</p>)}
    </div>
  );
};

export default Page;
