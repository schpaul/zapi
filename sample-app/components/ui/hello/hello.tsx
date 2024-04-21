"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  APIRequest,
  APIResponse,
  MessageType,
  ParamLine,
} from "@/lib/definitions";
import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/appStore";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function Hello() {
  const [reqName, setReqName] = useState("");
  const [resText, setResName] = useState("");

  const appData = useAppStore();
  const { toast } = useToast();
  const router = useRouter();

  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!appData.userPassBase64str) {
      router.push("/login");
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn)
    return (
      <main className="flex flex-col items-start justify-between p-24">
        <p>Redirect</p>
      </main>
    );

  return (
    <main className="flex flex-col items-center text-center justify-between p-24">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Say Hello
        </h1>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          Sample ZAPI consumer
        </h3>
      </div>
      <div className="flex flex-row gap-1 pt-16">
        <Input
          onChange={(event) => {
            event.preventDefault();
            setReqName(event.currentTarget.value);
          }}
          placeholder="Enter your name"
        />
        <Button
          onClick={() => {
            getData(reqName);
          }}
        >
          Say hello
        </Button>
      </div>
      <p className="leading-7 [&:not(:first-child)]:mt-6">{resText}</p>
    </main>
  );

  async function getData(name: string) {
    const methodParam: ParamLine = { name: "I_NAME", data: name };

    const apiRequest: APIRequest = {
      classname: "ZCL_APP_SAMPLE",
      method: "GET_DATA",
      paramtab: [methodParam],
    };

    const jsonRequest = JSON.stringify(apiRequest);

    try {
      const res = await fetch(
        "/api?client=" +
          appData.client +
          "&request=" +
          jsonRequest +
          "&token=" +
          appData.userPassBase64str
      );

      const data = await res.json();

      const resData: APIResponse = data;

      if (resData.state == MessageType.Error) {
        toast({
          variant: "destructive",
          title: "Error...",
          description: resData.message,
        });
      } else {
        setResName(resData.data[0].value.data);

        toast({
          variant: "default",
          title: "Message from Backend",
          description: resData.message,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error...",
        description: (error as Error).message,
      });
    }
  }
}
