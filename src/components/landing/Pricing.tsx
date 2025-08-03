"use client";

// import React, { useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import Image from "next/image";

const Pricing = () => {
  const router = useRouter();
  const plans = [
    {
      id: 1,
      name: "Standard",
      limit: 5,
      price: 700,
      image: "/standard.png",
      billing_cycle: "month",
    },
    {
      id: 2,
      name: "Premium",
      limit: 10,
      price: 1000,
      image: "/premium.png",
      billing_cycle: "month",
    },
    {
      id: 3,
      name: "Enterprise",
      limit: 20,
      image: "/enterprise.png",
      price: 1700,
      billing_cycle: "month",
    },
  ];

  const choosePlan = (data: any) => {
    localStorage.setItem("selectedPlan", JSON.stringify(data));
    router.push("/checkout");
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col justify-between px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex w-full justify-center">
          <span className="text-center text-3xl font-extrabold text-[#000000]">
            PRICING
          </span>
        </div>
        <span className="text-center text-xl font-semibold text-gray-800">
          Lorem ipsum dolor sit amet consectetur adipisicingelit
        </span>
      </div>

      <div className="grid items-start gap-10 px-8 md:grid-cols-3">
        {plans?.map((plan: any, index: any) => (
          <div
            key={index}
            className={`shadow-lg' flex h-full scale-105 transform flex-col justify-between rounded-lg border-2 border-[#c7c7c7] p-6`}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="flex py-2">
                <Image
                  src={plan?.image}
                  alt="Trusted by Leading Companies"
                  width={100}
                  height={25}
                />
              </div>
              <span className="text-xl font-bold text-gray-800">
                {plan.name}
              </span>
              <div className="my-4">
                <span className="text-3xl font-bold text-gray-800">
                  {plan.price} Br
                </span>
                <span className="text-gray-500">/{plan?.billing_cycle} </span>
              </div>

              <div className="mt-6 flex flex-col space-y-3">
                <div className="flex items-center space-x-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_109_76)">
                      <path
                        d="M24.5 4.59375C29.7795 4.59375 34.8427 6.69101 38.5758 10.4242C42.309 14.1573 44.4062 19.2205 44.4062 24.5C44.4062 29.7795 42.309 34.8427 38.5758 38.5758C34.8427 42.309 29.7795 44.4062 24.5 44.4062C19.2205 44.4062 14.1573 42.309 10.4242 38.5758C6.69101 34.8427 4.59375 29.7795 4.59375 24.5C4.59375 19.2205 6.69101 14.1573 10.4242 10.4242C14.1573 6.69101 19.2205 4.59375 24.5 4.59375ZM24.5 49C30.9978 49 37.2295 46.4188 41.8241 41.8241C46.4188 37.2295 49 30.9978 49 24.5C49 18.0022 46.4188 11.7705 41.8241 7.17588C37.2295 2.58124 30.9978 0 24.5 0C18.0022 0 11.7705 2.58124 7.17588 7.17588C2.58124 11.7705 0 18.0022 0 24.5C0 30.9978 2.58124 37.2295 7.17588 41.8241C11.7705 46.4188 18.0022 49 24.5 49ZM35.3145 20.002C36.2141 19.1023 36.2141 17.6477 35.3145 16.7576C34.4148 15.8676 32.9602 15.858 32.0701 16.7576L21.4471 27.3807L16.949 22.8826C16.0494 21.983 14.5947 21.983 13.7047 22.8826C12.8146 23.7822 12.8051 25.2369 13.7047 26.127L19.8297 32.252C20.7293 33.1516 22.184 33.1516 23.074 32.252L35.3145 20.002Z"
                        fill="#FF7632"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_109_76">
                        <rect width="49" height="49" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <p className="text-gray-700">Up to {plan.limit} restaurant</p>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_109_76)">
                      <path
                        d="M24.5 4.59375C29.7795 4.59375 34.8427 6.69101 38.5758 10.4242C42.309 14.1573 44.4062 19.2205 44.4062 24.5C44.4062 29.7795 42.309 34.8427 38.5758 38.5758C34.8427 42.309 29.7795 44.4062 24.5 44.4062C19.2205 44.4062 14.1573 42.309 10.4242 38.5758C6.69101 34.8427 4.59375 29.7795 4.59375 24.5C4.59375 19.2205 6.69101 14.1573 10.4242 10.4242C14.1573 6.69101 19.2205 4.59375 24.5 4.59375ZM24.5 49C30.9978 49 37.2295 46.4188 41.8241 41.8241C46.4188 37.2295 49 30.9978 49 24.5C49 18.0022 46.4188 11.7705 41.8241 7.17588C37.2295 2.58124 30.9978 0 24.5 0C18.0022 0 11.7705 2.58124 7.17588 7.17588C2.58124 11.7705 0 18.0022 0 24.5C0 30.9978 2.58124 37.2295 7.17588 41.8241C11.7705 46.4188 18.0022 49 24.5 49ZM35.3145 20.002C36.2141 19.1023 36.2141 17.6477 35.3145 16.7576C34.4148 15.8676 32.9602 15.858 32.0701 16.7576L21.4471 27.3807L16.949 22.8826C16.0494 21.983 14.5947 21.983 13.7047 22.8826C12.8146 23.7822 12.8051 25.2369 13.7047 26.127L19.8297 32.252C20.7293 33.1516 22.184 33.1516 23.074 32.252L35.3145 20.002Z"
                        fill="#FF7632"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_109_76">
                        <rect width="49" height="49" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <p className="text-gray-700">Up to {plan.limit} restaurant</p>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_109_76)">
                      <path
                        d="M24.5 4.59375C29.7795 4.59375 34.8427 6.69101 38.5758 10.4242C42.309 14.1573 44.4062 19.2205 44.4062 24.5C44.4062 29.7795 42.309 34.8427 38.5758 38.5758C34.8427 42.309 29.7795 44.4062 24.5 44.4062C19.2205 44.4062 14.1573 42.309 10.4242 38.5758C6.69101 34.8427 4.59375 29.7795 4.59375 24.5C4.59375 19.2205 6.69101 14.1573 10.4242 10.4242C14.1573 6.69101 19.2205 4.59375 24.5 4.59375ZM24.5 49C30.9978 49 37.2295 46.4188 41.8241 41.8241C46.4188 37.2295 49 30.9978 49 24.5C49 18.0022 46.4188 11.7705 41.8241 7.17588C37.2295 2.58124 30.9978 0 24.5 0C18.0022 0 11.7705 2.58124 7.17588 7.17588C2.58124 11.7705 0 18.0022 0 24.5C0 30.9978 2.58124 37.2295 7.17588 41.8241C11.7705 46.4188 18.0022 49 24.5 49ZM35.3145 20.002C36.2141 19.1023 36.2141 17.6477 35.3145 16.7576C34.4148 15.8676 32.9602 15.858 32.0701 16.7576L21.4471 27.3807L16.949 22.8826C16.0494 21.983 14.5947 21.983 13.7047 22.8826C12.8146 23.7822 12.8051 25.2369 13.7047 26.127L19.8297 32.252C20.7293 33.1516 22.184 33.1516 23.074 32.252L35.3145 20.002Z"
                        fill="#FF7632"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_109_76">
                        <rect width="49" height="49" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <p className="text-gray-700">Up to {plan.limit} restaurant</p>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_109_76)">
                      <path
                        d="M24.5 4.59375C29.7795 4.59375 34.8427 6.69101 38.5758 10.4242C42.309 14.1573 44.4062 19.2205 44.4062 24.5C44.4062 29.7795 42.309 34.8427 38.5758 38.5758C34.8427 42.309 29.7795 44.4062 24.5 44.4062C19.2205 44.4062 14.1573 42.309 10.4242 38.5758C6.69101 34.8427 4.59375 29.7795 4.59375 24.5C4.59375 19.2205 6.69101 14.1573 10.4242 10.4242C14.1573 6.69101 19.2205 4.59375 24.5 4.59375ZM24.5 49C30.9978 49 37.2295 46.4188 41.8241 41.8241C46.4188 37.2295 49 30.9978 49 24.5C49 18.0022 46.4188 11.7705 41.8241 7.17588C37.2295 2.58124 30.9978 0 24.5 0C18.0022 0 11.7705 2.58124 7.17588 7.17588C2.58124 11.7705 0 18.0022 0 24.5C0 30.9978 2.58124 37.2295 7.17588 41.8241C11.7705 46.4188 18.0022 49 24.5 49ZM35.3145 20.002C36.2141 19.1023 36.2141 17.6477 35.3145 16.7576C34.4148 15.8676 32.9602 15.858 32.0701 16.7576L21.4471 27.3807L16.949 22.8826C16.0494 21.983 14.5947 21.983 13.7047 22.8826C12.8146 23.7822 12.8051 25.2369 13.7047 26.127L19.8297 32.252C20.7293 33.1516 22.184 33.1516 23.074 32.252L35.3145 20.002Z"
                        fill="#FF7632"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_109_76">
                        <rect width="49" height="49" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <p className="text-gray-700">Up to {plan.limit} restaurant</p>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_109_76)">
                      <path
                        d="M24.5 4.59375C29.7795 4.59375 34.8427 6.69101 38.5758 10.4242C42.309 14.1573 44.4062 19.2205 44.4062 24.5C44.4062 29.7795 42.309 34.8427 38.5758 38.5758C34.8427 42.309 29.7795 44.4062 24.5 44.4062C19.2205 44.4062 14.1573 42.309 10.4242 38.5758C6.69101 34.8427 4.59375 29.7795 4.59375 24.5C4.59375 19.2205 6.69101 14.1573 10.4242 10.4242C14.1573 6.69101 19.2205 4.59375 24.5 4.59375ZM24.5 49C30.9978 49 37.2295 46.4188 41.8241 41.8241C46.4188 37.2295 49 30.9978 49 24.5C49 18.0022 46.4188 11.7705 41.8241 7.17588C37.2295 2.58124 30.9978 0 24.5 0C18.0022 0 11.7705 2.58124 7.17588 7.17588C2.58124 11.7705 0 18.0022 0 24.5C0 30.9978 2.58124 37.2295 7.17588 41.8241C11.7705 46.4188 18.0022 49 24.5 49ZM35.3145 20.002C36.2141 19.1023 36.2141 17.6477 35.3145 16.7576C34.4148 15.8676 32.9602 15.858 32.0701 16.7576L21.4471 27.3807L16.949 22.8826C16.0494 21.983 14.5947 21.983 13.7047 22.8826C12.8146 23.7822 12.8051 25.2369 13.7047 26.127L19.8297 32.252C20.7293 33.1516 22.184 33.1516 23.074 32.252L35.3145 20.002Z"
                        fill="#FF7632"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_109_76">
                        <rect width="49" height="49" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <p className="text-gray-700">Up to {plan.limit} restaurant</p>
                </div>
              </div>
              <div
                onClick={() => choosePlan(plan)}
                className="my-4 flex w-full cursor-pointer items-center justify-center rounded-sm bg-[#FF7632]"
              >
                <span className="py-2">Get Started Now</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
