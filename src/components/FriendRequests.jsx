"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
const { UserPlus, Check, X } = require("lucide-react");

const FriendRequests = ({ incomingFriendRequests, sessionId }) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState(incomingFriendRequests);

  const acceptFriend = async (senderId) => {
    await axios.post("/api/friends/accept", { id: senderId });

    // filtering out and removing the accepted one from state
    setFriendRequests((prev) => {
      return prev.filter((fr) => fr.senderId !== senderId);
    });

    router.refresh();
  };

  const denyFriend = async (senderId) => {
    await axios.post("/api/friends/deny", { id: senderId });

    // filtering out and removing the accepted one from state
    setFriendRequests((prev) => {
      return prev.filter((fr) => fr.senderId !== senderId);
    });

    router.refresh();
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500 ">Nothing to show here...</p>
      ) : (
        friendRequests.map((friendRequest) => (
          <div key={friendRequest.senderId} className="flex items-center gap-4">
            <UserPlus className="text-black" />
            <p className="font-medium text-lg">{friendRequest.senderEmail}</p>
            <button
              onClick={() => acceptFriend(friendRequest.senderId)}
              aria-label="accept friend"
              className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md "
            >
              <Check className="font-semibold text-white w-3/4 h-3/4" />
            </button>

            <button
              onClick={() => denyFriend(friendRequest.senderId)}
              aria-label="deny friend"
              className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md "
            >
              <X className="font-semibold text-white w-3/4 h-3/4" />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
