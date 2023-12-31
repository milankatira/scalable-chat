import http from "http";
import { startMessageConsume } from "./services/kafka";
import SocketService from "./services/socket";

async function init() {
  startMessageConsume();
  const socketService = new SocketService();
  const httpServer = http.createServer();
  const PORT = process.env.PORT || 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`SERVER started at PORT :${PORT}`);
  });

  socketService.initListeners();
}

init();
