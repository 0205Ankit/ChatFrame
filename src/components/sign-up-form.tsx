"use client";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./ui/form";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";

const signUpFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(10, { message: "Password must be at most 10 characters" }),
});

const defaultValues = {
  email: "",
  password: "",
};

const SignUpForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const { mutate } = api.signUp.signup.useMutation({
    onSuccess: async () => {
      await signIn("credentials", {
        email: form.getValues("email"),
        password: form.getValues("password"),
        callbackUrl: "/",
      });
    },
    onError: (error) => {
      toast({
        title: "Error while signing up!",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues,
  });

  const onSubmit = (values: z.infer<typeof signUpFormSchema>) => {
    setLoading(true);
    const { email, password } = values;
    mutate({
      email,
      password,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-5 flex w-full flex-col"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="mb-2 outline-none focus-visible:ring-0"
                  type="email"
                  placeholder="Email"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="outline-none focus-visible:ring-0"
                  type="password"
                  placeholder="Password"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <Button isLoading={loading} type="submit" className="mb-1 mt-2">
          Sign up
        </Button>
        <div className="flex items-center justify-between px-1 text-xs">
          <span>Already have an account?</span>
          <Link href="/login" className="text-primary underline">
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
