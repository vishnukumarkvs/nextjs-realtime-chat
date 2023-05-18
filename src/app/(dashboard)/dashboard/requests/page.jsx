import { fetchRedis } from "@/helpers/redis";

const { default: FriendRequests } = require("@/components/FriendRequests");
const { authOptions } = require("@/lib/auth");
const { getServerSession } = require("next-auth");
const { notFound } = require("next/navigation");

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  // ids of people who sent requests to the current logged in  user
  const incomingSenderIds = await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  );
  // console.log(incomingSenderIds);
  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = await fetchRedis("get", `user:${senderId}`);
      const senderParsed = JSON.parse(sender);
      return {
        senderId,
        senderEmail: senderParsed.email,
      };
    })
  );
  // console.log("incomingfrs", incomingFriendRequests);
  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
};

export default Page;
