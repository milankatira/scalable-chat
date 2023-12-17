"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => any;
}
const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("Cannot find socket context");

  return state;
};
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setsocket] = useState<Socket>();
  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg: string) => {
      console.log("send message", msg);
      if (socket) {
        socket.emit("event:message", { message: msg });
      }
    },
    [socket]
  );

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    setsocket(_socket);
    return () => {
      _socket.disconnect();
      setsocket(undefined);
    };
  }, []);
  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
