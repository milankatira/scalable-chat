import Redis from "ioredis";
import { Server } from "socket.io";

const pub = new Redis({
  host: "redis-123108de-scalable-chat-milan.a.aivencloud.com",
  port: 21674,
  username: "default",
  password: "AVNS_dBEe6poUDApQwF__7XB",
});
const sub = new Redis({
  host: "redis-123108de-scalable-chat-milan.a.aivencloud.com",
  port: 21674,
  username: "default",
  password: "AVNS_dBEe6poUDApQwF__7XB",
});
class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init socket service ..");
    this._io = new Server({
      cors: {
        origin: "*",
        allowedHeaders: ["*"],
      },
    });
    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    console.log("init listeners ...");
    io.on("connect", (socket) => {
      console.log(`new socket connected , ${socket.id}`);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("new message received", message);
        await pub.publish("MESSAGES", JSON.stringify(message));
      });
    });

    sub.on("message", (channel, message) => {
      if (channel == "MESSAGES") {
        this.io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
