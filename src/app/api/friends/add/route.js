import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { redis } from "@/lib/redis";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    // console.log("emailtoadd", emailToAdd);
    const idToAdd = await fetchRedis("get", `user:email:${emailToAdd}`);
    // console.log("idtoadd", idToAdd);
    if (!idToAdd) {
      return new Response("This person does not exist", { status: 404 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (idToAdd === session.user.id) {
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      });
    }

    // if user already added
    const isAlreadyAdded =
      (await fetchRedis(
        "sismember",
        `user:${idToAdd}:incoming_friend_requests`,
        session.user.id
      )) === 1;
    if (isAlreadyAdded) {
      return new Response("You already sent request", { status: 400 });
    }
    const isAlreadyFriends =
      (await fetchRedis(
        "sismember",
        `user:${session.user.id}:friends`,
        idToAdd
      )) === 1;
    if (isAlreadyFriends) {
      return new Response("You already added this person", { status: 400 });
    }

    // send friend request
    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      "incoming_friend_requests",
      {
        senderId: session.user.id,
        senderEmail: session.user.email,
      }
    );
    redis.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);
    return new Response("OK");
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return new Response("invalid request payload", { status: 422 });
    }
    return new Response("Invalid Request", { status: 400 });
  }
}
