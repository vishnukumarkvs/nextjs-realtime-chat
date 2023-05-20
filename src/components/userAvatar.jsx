"use client";

import { AvatarComponent } from "avatar-initials";

function getInitials(name) {
  const words = name.split(" ");
  let initials = "";

  if (words.length > 1) {
    initials = words[0][0] + words[1][0];
  } else {
    initials = name.slice(0, 2);
  }

  return initials.toUpperCase();
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
