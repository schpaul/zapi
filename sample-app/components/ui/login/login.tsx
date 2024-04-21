"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useAppStore } from "@/stores/appStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  client: z.string().min(3).max(3),
  username: z.string().min(2).max(12),
  password: z.string().min(8).max(20),
});

export default function LoginForm() {
  const appData = useAppStore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: "001",
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      appData.login(values.client, values.username, values.password);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error during login",
        description: (error as Error).message,
      });
    }
  }

  useEffect(() => {
    if (appData.userPassBase64str) {
      router.push("/");
    }
  }, [appData.userPassBase64str]);

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
          Login
        </h1>
      </div>
      <div className="min-w-96">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <Input placeholder="Client" {...field} />
                  </FormControl>
                  <FormDescription>Client of your SAP system.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <FormControl>
                    <Input placeholder="User" {...field} />
                  </FormControl>
                  <FormDescription>Your SAP username.</FormDescription>
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
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormDescription>Your SAP password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Login</Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
