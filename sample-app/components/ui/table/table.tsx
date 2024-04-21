"use client";

import { APIRequest, APIResponse, MessageType } from "@/lib/definitions";
import { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAppStore } from "@/stores/appStore";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type TableRowData = {
  huident: string;
  product: string;
  proddescr: string;
  quantity: string;
  unit: string;
};

export default function TableExample() {
  const [data, setData] = useState<APIResponse | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);

  const appData = useAppStore();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!appData.userPassBase64str) {
      router.push("/login");
      setLoggedIn(false);
      return;
    } else {
      setLoggedIn(true);
    }

    getData();
    setLoading(false);
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
          Get-Table-Data App
        </h1>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          Sample ZAPI consumer
        </h3>
      </div>
      <div className="mt-5 w-full">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableCaption>A list of HUs</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">HU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data[0].value.map((row: TableRowData, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.huident}</TableCell>
                  <TableCell>{row.product}</TableCell>
                  <TableCell className="text-left">{row.proddescr}</TableCell>
                  <TableCell className="text-right">
                    {row.quantity + " " + row.unit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </main>
  );

  async function getData() {
    const apiRequest: APIRequest = {
      classname: "ZCL_APP_SAMPLE",
      method: "GET_TABLE_DATA",
      paramtab: [],
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
        setData(resData);

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
