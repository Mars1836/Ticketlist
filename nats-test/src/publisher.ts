import nat from "node-nats-streaming";
import { TicketCreatedPublish } from "./class/TicketCreatedPublish";
const stan = nat.connect("ticketing", "testt");
console.clear();
stan.on("connect", () => {
  console.log("publish connect to NATs");
  const data = {
    title: "test data send",
    id: "123",
  };
  const tickCreatedPublish = new TicketCreatedPublish(stan);
  tickCreatedPublish.publish({
    title: "title1",
    price: 20,
    userId: "123123",
  });
});
stan.on("error", (error) => {
  console.log("get error");
  console.log(error);
});
const shutdown = () => {
  console.log("Đóng kết nối NATS Streaming...");
  stan.close();
  process.exit();
};

process.on("SIGINT", shutdown);

// Xử lý tín hiệu SIGTERM trên hệ điều hành hỗ trợ, nhưng lưu ý rằng Windows có thể không gửi tín hiệu này.
process.on("SIGTERM", shutdown);

// Xử lý tín hiệu process.exit trên Windows, hoặc gọi thủ công shutdown khi kết thúc.
process.on("exit", shutdown);
