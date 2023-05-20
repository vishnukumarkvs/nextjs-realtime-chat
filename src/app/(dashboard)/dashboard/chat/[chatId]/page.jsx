// dynamic route

import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { messageValidatorArray } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

async function getChatMessages(chatId) {
  try {
    // zrange = sorted set
    // 0 tyo -1 = first to last element
    const result = await fetchRedis(
      "zrange",
      `chat:${chatId}`,
      0,
      -1,
      "WITHSCORES"
    );
    const dbMessages = result.map((message) => JSON.parse(message));

    const reversedDbMessages = dbMessages.reverse();

    const messages = messageValidatorArray.parse(reversedDbMessages);

    return messages;
  } catch (error) {
    console.error(error);
    notFound();
  }
}

const Page = async ({ params }) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = params.chatId.split("--");

  if (userId1 !== user.id && userId2 !== user.id) notFound();

  const chatPartnerId = userId1 === user.id ? userId2 : userId1;
  const chatPartner = await redis.get(`user:${chatPartnerId}`);
  const initialMessages = await getChatMessages(params.chatId);

  return (
    <main className="pt-8">
      <p>{params.chatId}</p>
    </main>
  );
};

export default Page;
