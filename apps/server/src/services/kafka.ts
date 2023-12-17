import fs from "fs";
import { Kafka, Producer } from "kafkajs";
import path from "path";
import prismaClient from "./prisma";
const kafka = new Kafka({
  brokers: ["kafka-bbf2f6-scalable-chat-milan.a.aivencloud.com:21687"],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
  },
  sasl: {
    username: "avnadmin",
    password: "AVNS_ZbDYbdvJqs1YXLI0CjC",
    mechanism: "plain",
  },
});

let producer: null | Producer = null;
export async function createProducer() {
  if (producer) return producer;
  const _producer = kafka.producer();
  await _producer.connect();
  return (producer = _producer);
}

export async function producerMessage(message: string) {
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: message }],
    topic: "MESSAGES",
  });
  return true;
}

export async function startMessageConsume() {
  const consumer = await kafka.consumer({
    groupId: "default",
  });
  consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      console.log(
        `Received message: ${message.value?.toString()}`
      );
      try {
        if (!message?.value) return;
        await prismaClient.message.create({
          data: {
            text: message.value?.toString(),
          },
        });
      } catch (error) {
        console.log("some thing went wrong");
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 60 * 1000);
      }
    },
  });
}

export default kafka;
