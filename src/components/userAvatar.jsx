"use client";

import { AvatarComponent } from "avatar-initials";

function getInitials(name) {
  try {
    if (typeof name !== "string") {
      throw new Error("Invalid input. Please provide a string.");
    }

    console.log(name);
    const words = name.split(" ");
    let initials = "";

    if (words.length > 1) {
      initials = words[0][0] + words[1][0];
    } else {
      initials = name.slice(0, 2);
    }

    return initials.toUpperCase();
  } catch (error) {
    console.error("An error occurred:", error.message);
    // You can choose to return a default value or re-throw the error
    // throw error; // Uncomment this line to re-throw the error
    return "AA"; // Returning an empty string as a default value
  }
}

const UserAvatar = ({ name }) => {
  const initials = getInitials(name);
  return (
    <AvatarComponent
      classes="rounded-full"
      useGravatar={false}
      size={44}
      // primarySource={currentUser.Avatar}
      color="#000000"
      background="#f1f1f1"
      fontSize={16}
      fontWeight={400}
      offsetY={24}
      initials={`${initials[0]}${initials[1]}`}
    />
  );
};

export default UserAvatar;
