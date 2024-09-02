"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";

// shadcn components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/services/api";
import { useQuery } from "react-query";
import { Loader2 } from "lucide-react";
import PublicView from "@/components/public-view";
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function signIn() {
    try {
      const { email, password } = form.getValues();
      const { data } = await api.post("/auth/signin", {
        email,
        password,
      });
      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard"); // redirect to the dashboard once the user signed in
      }
    } catch (error) {
      throw error;
    }
  }

  const { isError, error, isFetching, refetch, isSuccess } = useQuery(
    "singin",
    signIn,
    {
      enabled: false,
      retry: false,
    }
  );

  async function onSubmit() {
    refetch();
  }

  return (
    <PublicView>
      <div className="flex flex-col items-center justify-center h-screen">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 w-full max-w-[350px] shadow-xl p-6 rounded-lg"
          >
            <div className="text-center">
              <h1 className="text-3xl font-semibold">Sign In</h1>
              <p className="text-gray-500 mb-4">
                Welcome back, sign in to your account
              </p>
              {isError && (
                <p className="text-red-500">Invalid email or password</p>
              )}
            </div>
            <div className="">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full flex items-center gap-1"
              disabled={isFetching}
            >
              {isFetching && (
                <Loader2 className="animate-spin text-white w-5 h-5" />
              )}{" "}
              Continue to your account
            </Button>
          </form>
        </Form>
      </div>
    </PublicView>
  );
};

export default page;
