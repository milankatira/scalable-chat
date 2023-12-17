"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => any;
  messages: string[];
}
const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("Cannot find socket context");

  return state;
};
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setsocket] = useState<Socket>();
  const [messages, setmessages] = useState<string[]>([]);
  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg: string) => {
      console.log("send message", msg);
      if (socket) {
        socket.emit("event:message", { message: msg });
      }
    },
    [socket]
  );

  const onMessageReceived = useCallback((msg: string) => {
    console.log("from server message received", msg);
    const message = JSON.parse(msg) as string;
    setmessages((prev) => [...prev, message]);
  }, []);
  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("message", onMessageReceived);
    setsocket(_socket);
    return () => {
      _socket.disconnect();
      _socket.off("message", onMessageReceived);
      setsocket(undefined);
    };
  }, []);
  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
