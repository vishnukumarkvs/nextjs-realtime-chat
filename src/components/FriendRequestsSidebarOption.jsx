"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const { User } = require("lucide-react");

const FriendRequestsSidebarOption = ({
  sessionId,
  initialUnseenRequestCount,
}) => {
  const [unseenRequestsCount, setUnseenRequestsCount] = useState(
    initialUnseenRequestCount
  );

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );
    const friendRequestHandler = ({ senderId, senderEmail }) => {
      setUnseenRequestsCount((prev) => prev + 1);
    };
    pusherClient.bind("incoming_friend_requests", friendRequestHandler); // function name, handler

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, [sessionId]);
  return (
    <Link
      href="/dashboard/requests"
      className="text-gray-700 hover:text-indigo-600  group flex items-center gap-x-3 rounded-md  text-sm leading-6 font-semibold"
    >
      <div className="text-gray-400 border-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
        <User className="h-4 w-4" />
      </div>
      <p className="truncate">Friend Requests</p>
      {unseenRequestsCount > 0 ? (
        <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">
          {unseenRequestsCount}
        </div>
      ) : null}
    </Link>
  );
};

export default FriendRequestsSidebarOption;
