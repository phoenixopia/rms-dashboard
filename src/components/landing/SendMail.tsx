"use client";

import React from "react";
// import { useMutation } from "@tanstack/react-query";

import { useTranslations } from "next-intl";

const SendMail = () => {
  const t = useTranslations("full");

  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <section className="rounded-2xl border-2 bg-white p-12">
      <div className="py-3">
        <form ref={formRef} className="space space-y-2">
          <div className="flex flex-row space-x-6">
            <div className="mb-4">
              <label
                htmlFor="first_name"
                className="mb-2 block text-[0.8rem] font-semibold text-gray-800"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm"
                placeholder="Enter your First Name"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="last_name"
                className="mb-2 block text-[0.8rem] font-semibold text-gray-800"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm"
                placeholder="Enter your Last Name"
                required
              />
            </div>
          </div>

          <div className="flex flex-row space-x-6">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-2 block text-[0.8rem] font-semibold text-gray-800"
              >
                email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-2 block text-[0.8rem] font-semibold text-gray-800"
              >
                phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm"
                placeholder="Enter your Phone Number"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="message"
              className="mb-2 block text-[0.8rem] font-semibold text-gray-800"
            >
              Your message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm"
              placeholder="Leave a comment..."
              required
            ></textarea>
          </div>

          <div className="py-2">
            <button
              type="submit"
              className={`items-center justify-center rounded-sm bg-[#FF7632] px-12 py-2 text-[0.8rem] text-white`}
            >
              Send
            </button>
          </div>
        </form>
        {/* <div className="absolute  inset-0 2xl:top-1/10 2xl:bottom-1/10  bg-[url(/tech-back.jpg)] bg-no-repeat bg-cover -z-10 " aria-hidden="true"></div> */}
        {/* <div className="absolute  inset-0 2xl:top-1/10 2xl:bottom-1/10 bg-white/80 bg-no-repeat bg-cover " aria-hidden="true"></div> */}
      </div>
    </section>
  );
};

export default SendMail;
