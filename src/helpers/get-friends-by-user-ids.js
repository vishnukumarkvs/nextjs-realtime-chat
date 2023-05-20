import { fetchRedis } from "./redis";

export const getFriendsByUserIds = async (userId) => {
  // retrieve all friends of this user
  const friendIds = await fetchRedis("smembers", `user:${userId}:friends`);

  // all at same time
  const friends = await Promise.all(
    friendIds.map(async (friendId) => {
      const friend = await fetchRedis("get", `user:${friendId}`);
      const parsedFriend = JSON.parse(friend);
      return parsedFriend;
    })
  );
  return friends;
};
