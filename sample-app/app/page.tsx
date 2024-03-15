"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { APIRequest, APIResponse, ParamLine } from "@/lib/definitions";
import { useState } from "react";

export default function Home() {
  const [reqName, setReqName] = useState("");
  const [resText, setResName] = useState("");

  return (
    <main className="flex flex-col items-center text-center justify-between p-24">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Say Hello
        </h1>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          Sample z-api consumer
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

    const res = await fetch("/api?client=001&request=" + jsonRequest);

    const data = await res.json();

    console.log("Response: ", data);

    const resData: APIResponse = data;

    setResName(resData.data[0].value.data);
  }
}
