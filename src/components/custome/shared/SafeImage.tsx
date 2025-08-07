"use client";

import Image from "next/image";
import { useState } from "react";

const fallbackUrl = "https://cdn-icons-png.flaticon.com/128/11352/11352866.png"; // static image in /public

export default function SafeRestaurantImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [imgSrc, setImgSrc] = useState(src || fallbackUrl);
  console.log("Image src", imgSrc);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={40}
      height={40}
      className="h-10 w-10 rounded-full"
      onError={() => setImgSrc(fallbackUrl)}
    />
  );
}
