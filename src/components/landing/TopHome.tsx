import React from "react";

import Image from "next/image";
import coverTop from "../../../public/coverTop.png";

const TopHome = () => {
  const appStoreImage = "/download-on-the-app-store.png";
  const playStoreImage = "/google-play-badge.png";
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-3 items-center justify-center px-8">
      <div className="col-span-1 py-[4rem]">
        <div className="flex flex-col justify-center space-y-3 pt-26 text-[1rem] font-bold text-[#000000] md:text-[1.8rem] lg:text-[2.8rem]">
          <p>RESTAURANT</p>
          <p>MANAGMENT</p>
          <p className="text-[#FF7632]">SYSTEM</p>
        </div>

        <div className="">
          <div className="flex gap-2 pt-[2rem] lg:gap-8">
            <div className="cursor-pointer">
              <img
                src={appStoreImage}
                alt="Preview"
                className="h-[6rem] w-[12rem] sm:h-[8rem] sm:w-[6rem] md:h-[10rem] md:w-[10rem]"
              />
            </div>

            <div className="cursor-pointer">
              <img
                src={playStoreImage}
                alt="Preview"
                className="h-[6rem] w-[12rem] sm:h-[8rem] sm:w-[6rem] md:h-[10rem] md:w-[10rem]"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2 -ml-[0rem] xl:-mt-[3rem] xl:-ml-[6rem]">
        <Image src={coverTop} alt="logo" className="h-full w-full" />
      </div>
    </div>
  );
};

export default TopHome;
