"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/auth";
import { loginSchema } from "@/schemas/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginApi } from "@/actions/route";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getAuthToken } from "@/auth/auth";

type FormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"email" | "phone_number">("email");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const onSubmit = (data: FormData) => {
    toast.dismiss();
    const payload = { ...data, signupMethod: activeTab };
    startTransition(async () => {
      const response = await loginApi(payload);
      if (response.success && response.data) {
        toast.success("Logged In Succesful");

        login({
          success: response.success,
          data: response.data,
          requiresPasswordChange: response.requiresPasswordChange,
          token: response.data.token,
        });
      } else {
        toast.error("Error", {
          description: response.message,
        });
      }
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "email" | "phone_number");
    reset();
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative flex w-full">
        {/* Left Side: Image Container */}
        <div className="hidden h-[700px] w-1/2 flex-shrink-0 lg:block">
          <Image
            src="/Images/on2.png"
            alt="Restaurant"
            width={700}
            height={700}
            className="h-full w-full object-cover object-center"
            priority
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
          <div className="w-full max-w-sm">
            <h1 className="mb-2 text-center text-3xl font-bold">Welcome</h1>
            <p className="mb-8 text-center">Sign in to your account.</p>
            <Tabs
              defaultValue="email"
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 border-none bg-[#FF7632]">
                <TabsTrigger value="email">
                  <span className="dark:text-white">Email</span>
                </TabsTrigger>
                <TabsTrigger value="phone">
                  {" "}
                  <span className="dark:text-white">Phone</span>
                </TabsTrigger>
              </TabsList>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TabsContent value="email">
                  <Card className="border-none bg-transparent shadow-lg">
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          placeholder="example@email.com"
                          type="email"
                          {...register("emailOrPhone")}
                        />
                        {errors.emailOrPhone && (
                          <p className="text-sm text-red-500">
                            {errors.emailOrPhone.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          {...register("password")}
                        />
                        {errors.password && (
                          <p className="text-sm text-red-500">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <button
                        type="submit"
                        className="flex w-full cursor-pointer items-center justify-center rounded-md bg-[#FF7632] py-2 text-white transition-all duration-300 hover:scale-105"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Login"
                        )}
                      </button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="phone">
                  <Card className="border-none bg-transparent shadow-lg">
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="0900XXXXXX"
                          type="tel" // Use type="tel" for better mobile UX
                          {...register("emailOrPhone")}
                        />
                        {errors.emailOrPhone && (
                          <p className="text-sm text-red-500">
                            {errors.emailOrPhone.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-phone">Password</Label>
                        <Input
                          id="password-phone"
                          type="password"
                          placeholder="Enter your password"
                          {...register("password")}
                        />
                        {errors.password && (
                          <p className="text-sm text-red-500">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <button
                        type="submit"
                        className="flex w-full cursor-pointer items-center justify-center rounded-md bg-[#FF7632] py-2 text-white transition-all duration-300 hover:scale-105"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Login"
                        )}
                      </button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </form>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
