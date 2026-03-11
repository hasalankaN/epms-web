import React from "react";

import { useSession } from "@/components/providers/SessionProvider";

// import Image from "next/image";

const ProfileView = () => {
  const session = useSession();

  return (
    <div className="w-[500px] max-w-full p-5 rounded-[15px] flex flex-col gap-2.5 border-t-8 border-primary">
      <h3 className="text-[#212121] font-medium">Admin Profile</h3>
      {/* <div className="relative">
        <Image
          src="/images/profile-image.png"
          alt="Profile picture"
          width={100}
          height={100}
          className="size-[84px] rounded-full"
        />
        <i className="camera-icon-new size-[30px] absolute bottom-0 right-0" />
      </div> */}

      <div className="flex flex-col gap-2.5 w-full">
        <div className="flex flex-col gap-[5px]">
          <h4 className="text-[#212121] font-semibold text-[15px]/[18px]">
            Name
          </h4>
          <p className="text-[#616161] text-sm font-normal">
            {session?.user.name}
          </p>
        </div>
        <div className="border-t border-[#E0E0E0]" />
      </div>

      <div className="flex flex-col gap-2.5 w-full">
        <div className="flex flex-col gap-[5px]">
          <h4 className="text-[#212121] font-semibold text-[15px]/[18px]">
            Email
          </h4>
          <p className="text-[#616161] text-sm font-normal">
            {session?.user.email}
          </p>
        </div>
        <div className="border-t border-[#E0E0E0]" />
      </div>
    </div>
  );
};

export default ProfileView;
