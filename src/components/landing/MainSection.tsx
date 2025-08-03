"use client";
import React from "react";
import FirstCarousel from "./FirstCarousel";
import SendMail from "./SendMail";
import Footer from "./Footer";
// import Faqs from "./Faqs";
import Pricing from "./Pricing";
// import Features from "./Features";
import TopHome from "./TopHome";
import Image from "next/image";

const MidMain = () => {
  const appStoreImage = "/download-on-the-app-store.png";
  const playStoreImage = "/google-play-badge.png";

  const carouselImages = [
    {
      src: "/backSticky.png",
    },
    {
      src: "/backSticky.png",
    },
    {
      src: "/backSticky.png",
    },
    {
      src: "/backSticky.png",
    },
  ];

  return (
    <div className="flex flex-col bg-transparent">
      <div
        className="-z-10 h-screen w-screen"
        style={{
          backgroundImage: "url('/backSticky.png')",
          backgroundSize: "100% 100%",
          width: "100%",
          height: "100vh",
          position: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <section
        id="home"
        data-section="home"
        className="relative z-10 flex w-full items-center justify-center bg-white lg:min-h-[80vh] lg:py-28"
      >
        <TopHome />
      </section>

      <section id="services" className="w-screen bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-row justify-between gap-8">
            <div className="z-10 hidden md:block md:w-[30%]">
              <img
                src="/cover2.jpeg"
                alt="front cover"
                className="h-[30rem] w-[50rem]"
              />
            </div>
            <div className="flex w-full flex-col gap-4 text-gray-800 md:w-[70%]">
              <p className="text-[1.8rem] font-extrabold text-black">
                Lorem ipsum dolor sit
              </p>
              <div className="flex flex-row items-center gap-2">
                <p className="text-[1.4rem] font-semibold text-[#FF7632]">
                  Lorem ipsum
                </p>

                <svg
                  width="26"
                  height="88"
                  viewBox="0 0 76 88"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M74.297 47.3203C76.5837 45.4844 76.5837 42.5156 74.297 40.6992L43.1581 15.6797C40.8713 13.8438 37.1736 13.8438 34.9111 15.6797C32.6487 17.5156 32.6244 20.4844 34.9111 22.3008L56.0759 39.293L-3.79352 39.3125C-7.02904 39.3125 -9.63206 41.4023 -9.63206 44C-9.63206 46.5977 -7.02904 48.6875 -3.79352 48.6875H56.0759L34.9111 65.6797C32.6244 67.5156 32.6244 70.4844 34.9111 72.3008C37.1979 74.1172 40.8957 74.1367 43.1581 72.3008L74.297 47.3203ZM-7.68587 9.625C-4.45035 9.625 -1.84734 7.53516 -1.84734 4.9375C-1.84734 2.33984 -4.45035 0.25 -7.68587 0.25H-27.1477C-38.9707 0.25 -48.5557 7.94531 -48.5557 17.4375V70.5625C-48.5557 80.0547 -38.9707 87.75 -27.1477 87.75H-7.68587C-4.45035 87.75 -1.84734 85.6602 -1.84734 83.0625C-1.84734 80.4648 -4.45035 78.375 -7.68587 78.375H-27.1477C-32.524 78.375 -36.8786 74.8789 -36.8786 70.5625V17.4375C-36.8786 13.1211 -32.524 9.625 -27.1477 9.625H-7.68587Z"
                    fill="#FF7632"
                  />
                </svg>
              </div>

              <p className="text-[1rem] text-gray-800">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex h-[5rem] w-screen bg-black/50 md:h-[20rem]"></section>
      <section className="flex bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-row justify-between gap-8">
            <div className="flex w-full flex-col gap-4 text-gray-800 md:w-[60%]">
              <p className="text-[1.8rem] font-extrabold text-[#000000]">
                Get Started In Minutes: Download The App, Order Your Food
              </p>

              <p className="text-[1rem] text-gray-800">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt
              </p>
              <div className="flex flex-row space-x-8 py-6">
                <div className="flex flex-col">
                  <svg
                    width="70"
                    height="70"
                    viewBox="0 0 179 179"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 89.5C-1.75138e-07 101.253 2.31499 112.892 6.81278 123.75C11.3106 134.609 17.9031 144.475 26.2139 152.786C34.5248 161.097 44.3912 167.689 55.2498 172.187C66.1085 176.685 77.7467 179 89.5 179C101.253 179 112.892 176.685 123.75 172.187C134.609 167.689 144.475 161.097 152.786 152.786C161.097 144.475 167.689 134.609 172.187 123.75C176.685 112.892 179 101.253 179 89.5C179 77.7467 176.685 66.1085 172.187 55.2498C167.689 44.3912 161.097 34.5248 152.786 26.2139C144.475 17.9031 134.609 11.3106 123.75 6.81278C112.892 2.31499 101.253 0 89.5 0C77.7467 0 66.1085 2.31499 55.2498 6.81278C44.3912 11.3106 34.5248 17.9031 26.2139 26.2139C17.9031 34.5248 11.3106 44.3912 6.81278 55.2498C2.31499 66.1085 -1.75138e-07 77.7467 0 89.5Z"
                      fill="#FFE8CD"
                    />
                    <path
                      d="M120.527 139.62H58.4735C53.7001 139.62 50.1201 136.04 50.1201 131.266V40.5731C50.1201 35.7997 53.7001 32.2197 58.4735 32.2197H120.527C125.3 32.2197 128.88 35.7997 128.88 40.5731V131.266C128.88 136.04 125.3 139.62 120.527 139.62Z"
                      fill="#FF9D1C"
                    />
                    <path
                      d="M112.174 107.4H66.827C63.247 107.4 60.8604 105.013 60.8604 101.433V48.9266C60.8604 45.3466 63.247 42.96 66.827 42.96H113.367C116.947 42.96 119.334 45.3466 119.334 48.9266V101.433C118.14 105.013 115.754 107.4 112.174 107.4Z"
                      fill="#FFCA83"
                    />
                  </svg>
                  <div className="flex flex-col gap-2 py-4">
                    <p className="font-bold text-black">1. Download</p>
                    <p className="text-[0.9rem] text-black">
                      Lorem ipsum dolor sit olor s
                    </p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <svg
                    width="70"
                    height="70"
                    viewBox="0 0 179 179"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 89.5C-1.75138e-07 101.253 2.31499 112.892 6.81278 123.75C11.3106 134.609 17.9031 144.475 26.2139 152.786C34.5248 161.097 44.3912 167.689 55.2498 172.187C66.1085 176.685 77.7467 179 89.5 179C101.253 179 112.892 176.685 123.75 172.187C134.609 167.689 144.475 161.097 152.786 152.786C161.097 144.475 167.689 134.609 172.187 123.75C176.685 112.892 179 101.253 179 89.5C179 77.7467 176.685 66.1085 172.187 55.2498C167.689 44.3912 161.097 34.5248 152.786 26.2139C144.475 17.9031 134.609 11.3106 123.75 6.81278C112.892 2.31499 101.253 0 89.5 0C77.7467 0 66.1085 2.31499 55.2498 6.81278C44.3912 11.3106 34.5248 17.9031 26.2139 26.2139C17.9031 34.5248 11.3106 44.3912 6.81278 55.2498C2.31499 66.1085 -1.75138e-07 77.7467 0 89.5Z"
                      fill="#FFE8CD"
                    />
                    <g clipPath="url(#clip0_109_226)">
                      <path
                        d="M118.875 119.75C118.046 119.75 117.251 120.106 116.665 120.739C116.079 121.371 115.75 122.23 115.75 123.125V133.25H53.25V52.25H65.75V55.625C65.75 56.5201 66.0792 57.3786 66.6653 58.0115C67.2513 58.6444 68.0462 59 68.875 59H100.125C100.954 59 101.749 58.6444 102.335 58.0115C102.921 57.3786 103.25 56.5201 103.25 55.625V52.25H115.75V55.625C115.75 56.5201 116.079 57.3786 116.665 58.0115C117.251 58.6444 118.046 59 118.875 59C119.704 59 120.499 58.6444 121.085 58.0115C121.671 57.3786 122 56.5201 122 55.625V48.875C122 47.9799 121.671 47.1214 121.085 46.4885C120.499 45.8556 119.704 45.5 118.875 45.5H103.25V42.125C103.25 39.4397 102.262 36.8644 100.504 34.9655C98.746 33.0667 96.3614 32 93.875 32H75.125C72.6386 32 70.254 33.0667 68.4959 34.9655C66.7377 36.8644 65.75 39.4397 65.75 42.125V45.5H50.125C49.2962 45.5 48.5013 45.8556 47.9153 46.4885C47.3292 47.1214 47 47.9799 47 48.875V136.625C47 137.52 47.3292 138.379 47.9153 139.011C48.5013 139.644 49.2962 140 50.125 140H118.875C119.704 140 120.499 139.644 121.085 139.011C121.671 138.379 122 137.52 122 136.625V123.125C122 122.23 121.671 121.371 121.085 120.739C120.499 120.106 119.704 119.75 118.875 119.75ZM72 42.125C72 41.2299 72.3292 40.3714 72.9153 39.7385C73.5013 39.1056 74.2962 38.75 75.125 38.75H93.875C94.7038 38.75 95.4987 39.1056 96.0847 39.7385C96.6708 40.3714 97 41.2299 97 42.125V52.25H72V42.125ZM146.088 73.4855L133.588 59.9855C133.297 59.6712 132.952 59.4218 132.573 59.2517C132.193 59.0816 131.786 58.994 131.375 58.994C130.964 58.994 130.557 59.0816 130.177 59.2517C129.798 59.4218 129.453 59.6712 129.162 59.9855L91.6625 100.485C91.3725 100.799 91.1426 101.172 90.9861 101.582C90.8295 101.992 90.7493 102.431 90.75 102.875V116.375C90.75 117.27 91.0792 118.129 91.6653 118.761C92.2513 119.394 93.0462 119.75 93.875 119.75H106.375C106.786 119.751 107.192 119.664 107.572 119.495C107.952 119.326 108.297 119.078 108.588 118.765L146.088 78.2645C146.379 77.951 146.609 77.5786 146.767 77.1685C146.924 76.7585 147.006 76.3189 147.006 75.875C147.006 75.4311 146.924 74.9915 146.767 74.5815C146.609 74.1714 146.379 73.799 146.088 73.4855ZM97 113V104.272L131.375 67.1473L139.456 75.875L105.081 113H97ZM84.5 116.375C84.5 117.27 84.1708 118.129 83.5847 118.761C82.9987 119.394 82.2038 119.75 81.375 119.75H68.875C68.0462 119.75 67.2513 119.394 66.6653 118.761C66.0792 118.129 65.75 117.27 65.75 116.375C65.75 115.48 66.0792 114.621 66.6653 113.989C67.2513 113.356 68.0462 113 68.875 113H81.375C82.2038 113 82.9987 113.356 83.5847 113.989C84.1708 114.621 84.5 115.48 84.5 116.375ZM84.5 96.125C84.5 97.0201 84.1708 97.8786 83.5847 98.5115C82.9987 99.1444 82.2038 99.5 81.375 99.5H68.875C68.0462 99.5 67.2513 99.1444 66.6653 98.5115C66.0792 97.8786 65.75 97.0201 65.75 96.125C65.75 95.2299 66.0792 94.3714 66.6653 93.7385C67.2513 93.1056 68.0462 92.75 68.875 92.75H81.375C82.2038 92.75 82.9987 93.1056 83.5847 93.7385C84.1708 94.3714 84.5 95.2299 84.5 96.125ZM100.125 79.25H68.875C68.0462 79.25 67.2513 78.8944 66.6653 78.2615C66.0792 77.6286 65.75 76.7701 65.75 75.875C65.75 74.9799 66.0792 74.1214 66.6653 73.4885C67.2513 72.8556 68.0462 72.5 68.875 72.5H100.125C100.954 72.5 101.749 72.8556 102.335 73.4885C102.921 74.1214 103.25 74.9799 103.25 75.875C103.25 76.7701 102.921 77.6286 102.335 78.2615C101.749 78.8944 100.954 79.25 100.125 79.25Z"
                        fill="#FF9131"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_109_226">
                        <rect
                          width="100"
                          height="108"
                          fill="white"
                          transform="translate(47 32)"
                        />
                      </clipPath>
                    </defs>
                  </svg>

                  <div className="flex flex-col gap-2 py-4">
                    <p className="font-bold text-black">2. Register</p>
                    <p className="text-[0.9rem] text-black">
                      Lorem ipsum dolor sit olor s
                    </p>
                  </div>
                </div>

                <div className="flex flex-col">
                  <svg
                    width="70"
                    height="70"
                    viewBox="0 0 179 179"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 89.5C-1.75138e-07 101.253 2.31499 112.892 6.81278 123.75C11.3106 134.609 17.9031 144.475 26.2139 152.786C34.5248 161.097 44.3912 167.689 55.2498 172.187C66.1085 176.685 77.7467 179 89.5 179C101.253 179 112.892 176.685 123.75 172.187C134.609 167.689 144.475 161.097 152.786 152.786C161.097 144.475 167.689 134.609 172.187 123.75C176.685 112.892 179 101.253 179 89.5C179 77.7467 176.685 66.1085 172.187 55.2498C167.689 44.3912 161.097 34.5248 152.786 26.2139C144.475 17.9031 134.609 11.3106 123.75 6.81278C112.892 2.31499 101.253 0 89.5 0C77.7467 0 66.1085 2.31499 55.2498 6.81278C44.3912 11.3106 34.5248 17.9031 26.2139 26.2139C17.9031 34.5248 11.3106 44.3912 6.81278 55.2498C2.31499 66.1085 -1.75138e-07 77.7467 0 89.5Z"
                      fill="#FFE8CD"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M55.5179 71.0336L70.3703 65.3722C67.3038 69.8311 64.6694 74.6198 62.5093 79.6632L55.5179 71.0336ZM45.198 71.9632L58.9582 88.9472L56.9651 94.3287C56.3461 96 56.7089 97.9089 57.8875 99.1819L59.1942 100.593C52.098 109.235 48.1784 118.273 44.3809 130.577C43.8818 132.194 44.2715 133.977 45.3875 135.182C46.5035 136.387 48.1541 136.808 49.6514 136.269C61.0436 132.168 69.4125 127.935 77.4141 120.271L78.7208 121.682C79.8994 122.955 81.667 123.346 83.2146 122.678L88.1975 120.525L103.923 135.387C104.963 136.369 106.387 136.731 107.723 136.353C109.06 135.974 110.136 134.905 110.596 133.498L123.038 95.4249C131.241 84.9426 135.834 71.5866 135.834 57.6635V42C135.834 39.5147 133.968 37.5 131.667 37.5H117.164C104.272 37.5 91.9054 42.4601 82.1996 51.319L46.947 64.7565C45.6439 65.2533 44.6536 66.4154 44.3033 67.8591C43.9529 69.3028 44.2881 70.8401 45.198 71.9632ZM55.3557 124.416C57.9703 117.596 60.9046 112.168 65.0986 106.97L71.5097 113.894C66.6968 118.424 61.6706 121.592 55.3557 124.416ZM82.6704 113.22L80.4467 110.818L67.9467 97.3181L65.7228 94.9164L68.6807 86.9298C71.3948 79.602 75.2061 72.8055 79.9621 66.813L82.3646 63.7858C91.0721 52.8144 103.784 46.5 117.164 46.5H127.5V57.6635C127.5 72.1138 121.654 85.8426 111.495 95.2467L108.692 97.8414C103.143 102.978 96.8504 107.094 90.0654 110.025L82.6704 113.22ZM104.784 124.241L96.7938 116.691C101.464 114.358 105.898 111.512 110.026 108.2L104.784 124.241ZM102.5 69C102.5 66.5147 104.366 64.5 106.667 64.5C108.968 64.5 110.834 66.5147 110.834 69C110.834 71.4853 108.968 73.5 106.667 73.5C104.366 73.5 102.5 71.4853 102.5 69ZM106.667 55.5C99.7633 55.5 94.1671 61.5442 94.1671 69C94.1671 76.4558 99.7633 82.5 106.667 82.5C113.571 82.5 119.167 76.4558 119.167 69C119.167 61.5442 113.571 55.5 106.667 55.5Z"
                      fill="#FF9131"
                    />
                  </svg>

                  <div className="flex flex-col gap-2 py-4">
                    <p className="font-bold text-black">3. Start</p>
                    <p className="text-[0.9rem] text-black">
                      Lorem ipsum dolor sit olor s
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="z-10 hidden md:block md:w-[40%]">
              <img
                src="/getStarted.png"
                alt="front cover"
                className="h-[30rem] w-[50rem]"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="partner" className="bg-white py-18">
        <div className="mx-auto max-w-screen bg-[#F5F5F5] py-8">
          <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
            <div className="flex flex-col items-center justify-center space-y-8">
              <p className="text-[1.2rem] font-bold text-black">
                Trusted by Leading Companies
              </p>
            </div>
            <div className="">
              <FirstCarousel
                images={carouselImages}
                autoSlide={true}
                slideInterval={2000}
              />
            </div>
          </div>
        </div>
      </section>

      {/* <section id="services" className="py-20 w-screen bg-[#F1F0FF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
    
       
          <div className="space-y-4">
         <Features/>
          </div>
        </div>
      </section> */}
      <section id="pricing" className="bg-white py-18">
        <div className="w-screen bg-white">
          <Pricing />
        </div>
      </section>

      <section id="contact-us" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex w-full justify-center py-4">
            <span className="text-center text-[1.4rem] font-extrabold text-[#FF9131]">
              Contact Us
            </span>
          </div>
          <p className="text-[0.9rem] font-semibold text-gray-800">
            Our support team is available Monday to Friday, 9 AM to 6 PM (GMT);
            We're here to help you manage your properties with ease!
          </p>

          <div className="flex flex-col items-center gap-8 space-x-6 py-8 md:flex-row md:items-stretch md:justify-between">
            <div className="flex flex-col justify-evenly gap-6 py-8 text-gray-800 md:max-w-[35%] md:gap-1 md:py-0">
              <div className="flex w-full flex-row items-center space-x-6">
                <div className="flex rounded-full bg-[#F1F0FF] p-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 53 68"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M29.7711 66.3C36.8516 57.7734 53 37.1078 53 25.5C53 11.4219 41.1302 0 26.5 0C11.8698 0 0 11.4219 0 25.5C0 37.1078 16.1484 57.7734 23.2289 66.3C24.9266 68.332 28.0734 68.332 29.7711 66.3ZM26.5 17C28.8427 17 31.0895 17.8955 32.7461 19.4896C34.4027 21.0837 35.3333 23.2457 35.3333 25.5C35.3333 27.7543 34.4027 29.9163 32.7461 31.5104C31.0895 33.1045 28.8427 34 26.5 34C24.1573 34 21.9105 33.1045 20.2539 31.5104C18.5973 29.9163 17.6667 27.7543 17.6667 25.5C17.6667 23.2457 18.5973 21.0837 20.2539 19.4896C21.9105 17.8955 24.1573 17 26.5 17Z"
                      fill="#FF9131"
                    />
                  </svg>
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="font-bold text-gray-800">Around Megenagna</p>

                  <p className="text-[0.8rem] text-[#FF9131]">
                    2R92+G3,Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>

              <div className="flex flex-row items-center space-x-6">
                <div className="flex rounded-full bg-[#F1F0FF] p-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 67 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.59375 0.9375L0.875 3.5V44.5L3.59375 47.0625H63.4062L66.125 44.5V3.5L63.4062 0.9375H3.59375ZM6.3125 9.29296V41.9375H60.6875V9.2921L33.4996 32.5881L6.3125 9.29296ZM56.3734 6.0625H10.6257L33.4996 25.6619L56.3734 6.0625Z"
                      fill="#FF9131"
                    />
                  </svg>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="font-bold text-gray-800">
                    info@phoenixopia.com
                  </p>
                  <p className="text-[0.8rem] text-[#FF9131]">Say Hi</p>
                </div>
              </div>

              <div className="flex flex-row items-center space-x-6">
                <div className="flex rounded-full bg-[#F1F0FF] p-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 53 51"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.2036 4.61303L22.2859 8.24719C24.165 11.5268 23.4107 15.8291 20.451 18.7119C20.451 18.7119 16.8615 22.2087 23.37 28.5484C29.8765 34.8859 33.4688 31.3916 33.4688 31.3916C36.4285 28.5087 40.8454 27.7741 44.2126 29.6044L47.9435 31.6325C53.0281 34.3963 53.6284 41.3413 49.1595 45.6944C46.4741 48.31 43.1843 50.3453 39.5476 50.4794C33.4258 50.7056 23.0292 49.1966 12.6002 39.0384C2.17131 28.8803 0.621938 18.7538 0.854029 12.7909C0.991891 9.24875 3.08141 6.04447 5.76682 3.42884C10.2359 -0.924124 17.3661 -0.339249 20.2036 4.61303Z"
                      fill="#FF9131"
                    />
                  </svg>
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="flex flex-row">
                    <p className="font-bold text-gray-800">+251968999955</p> ,{" "}
                    <p className="font-bold text-gray-800">+251968999900</p>
                  </div>

                  <p className="text-[0.8rem] text-[#FF9131]">Call Now</p>
                </div>
              </div>
            </div>
            <div className="flex md:w-[65%]">
              <SendMail />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="w-screen bg-black/50">
          <div className="mx-auto flex max-w-6xl gap-8 px-8 py-2 sm:px-6 md:py-8">
            <div className="cursor-pointer">
              <img
                src={appStoreImage}
                alt="Preview"
                className="w-[10rem] md:w-[8rem]"
              />
            </div>

            <div className="cursor-pointer">
              <img
                src={playStoreImage}
                alt="Preview"
                className="w-[10rem] md:w-[8rem]"
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="w-screen bg-[#37354EFA]">
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default MidMain;
