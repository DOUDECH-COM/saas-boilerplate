"use client";
import { FC } from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/services/api";
import { useQuery } from "react-query";
import { Loader2 } from "lucide-react";
import PublicView from "@/components/public-view";
const formSchema = z
  .object({
    firstname: z.string().min(2).max(255),
    lastname: z.string().min(2).max(255),
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  async function signUp() {
    const { firstname, lastname, email, password } = form.getValues();
    try {
      const { data } = await api.post("/auth/signup", {
        firstname,
        lastname,
        email,
        password,
      });
      // if the user successfully registered we redirect them to the login page
      router.push("/signin");
    } catch (error) {
      throw error;
    }
  }

  const { isError, error, isFetching, refetch, isSuccess } = useQuery(
    "signup",
    signUp,
    { enabled: false, retry: false }
  );

  function onSubmit() {
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
              <h1 className="text-3xl font-semibold">Sign Up</h1>
              <p className="text-gray-500 mb-4">Create an account to start!</p>
              {isError && (
                <p className="text-red-500">
                  {(error as { status: number }).status === 409 &&
                    "User already exists"}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firstname</FormLabel>
                    <FormControl>
                      <Input placeholder="Firstname" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lastname</FormLabel>
                    <FormControl>
                      <Input placeholder="Lastname" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} type="email" />
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
                    <Input placeholder="Password" {...field} type="password" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm password"
                      {...field}
                      type="password"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full flex items-center gap-1"
              disabled={isFetching}
            >
              {isFetching && (
                <Loader2 className="animate-spin text-white w-5 h-5" />
              )}{" "}
              Sign Up
            </Button>
          </form>
        </Form>
      </div>
    </PublicView>
  );
};

export default page;
