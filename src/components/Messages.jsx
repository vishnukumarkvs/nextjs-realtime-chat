"use client";

import { db } from "@/lib/firebase";
import { pusherClient } from "@/lib/pusher";
import { cn, toPusherKey } from "@/lib/utils";
import { format } from "date-fns";
import { onValue, ref } from "firebase/database";
import { useEffect, useRef, useState } from "react";

// Ref for scrolldown to latest message

const Messages = ({ initialMessages, sessionId, chatId }) => {
  // direct show to users rather than refresh
  const [messages, setMessages] = useState(initialMessages);
  const scrollDownRef = useRef(null);

  const formatTimestamp = (timestamp) => {
    return format(timestamp, "HH:mm");
  };

  // useEffect(() => {
  //   pusherClient.subscribe(toPusherKey(`chat:${chatId}`));
  //   const messageHandler = (message) => {
  //     setMessages((prev) => [message, ...prev]);
  //   };
  //   pusherClient.bind("incoming-message", messageHandler); // function name, handler

  //   return () => {
  //     pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
  //     pusherClient.unbind("incoming_messages", messageHandler);
  //   };
  // }, [chatId]);
  useEffect(() => {
    const chatRef = ref(db, `chat/${chatId}/messages`);
    onValue(chatRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        setMessages((prev) => [message, ...prev]);
      });
    });
  }, [chatId]);

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;

        return (
          <div
            className="chat-message"
            key={`${message.id}-${message.timestamp}`}
          >
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-indigo-600 text-white": isCurrentUser,
                    "bg-gray-200 text-gray-900": !isCurrentUser,
                  })}
                >
                  {message.text}{" "}
                  {/* <span className="ml-2 text-xs text-gray-400">
                    {formatTimestamp(message.timestamp)}
                  </span> */}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
