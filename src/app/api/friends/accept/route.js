import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { redis } from "@/lib/redis";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";

export async function POST(req) {
  try {
    const { id: idToAdd } = await req.json();
    console.log(idToAdd);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // verify both users are not already friends
    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriends) {
      return new Response("Already friends", { status: 400 }); // 400 = BAD REQUEST
    }

    // check again if the current user has this friend request or not
    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    if (!hasFriendRequest) {
      return new Response("No friend request", { status: 400 });
    }

    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:friends`),
      "new_friend",
      {}
    );

    // add user to friends list
    await redis.sadd(`user:${session.user.id}:friends`, idToAdd);
    await redis.sadd(`user:${idToAdd}:friends`, session.user.id);

    await redis.srem(
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    // await redis.srem(
    //   `user:${idToAdd}:outgoing_friend_requests`,
    //   session.user.id
    // );

    return new Response("OK");
  } catch (error) {
    console.error("Failed to accept friend request:", error);
    return new Response("Failed to accept friend request", { status: 500 });
  }
}
