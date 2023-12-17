import { Server } from "socket.io";

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
  }

  public initListeners() {
    const io = this.io;
    console.log("init listeners ...");
    io.on("connect", (socket) => {
      console.log(`new socket connected , ${socket.id}`);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("new message received", message);
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
