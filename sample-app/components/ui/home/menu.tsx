import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Menu() {
  return (
    <main className="flex flex-col items-start justify-between p-24">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Your Apps
      </h1>
      <div className="mt-5 flex flex-wrap items-start gap-2">
        <Link href="/hello">
          <Card className="hover:scale-95 w-[225px] h-[225px]">
            <CardHeader>
              <CardTitle>Hello-World-App</CardTitle>
              <CardDescription>Simple app to say hello</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <svg
                className="w-24 h-24"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
              >
                <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm143.8 285.2C375.3 358.5 315.8 404.8 248 404.8s-127.3-46.3-143.8-111.6c-1.7-7.4 2.5-15.7 9.9-17.4 7.4-1.7 15.7 2.5 17.4 9.9 14.1 52.9 62 90.1 116.6 90.1s102.5-37.2 116.6-90.1c1.7-7.4 9.9-12.4 17.4-9.9 7.4 1.7 12.4 9.9 9.9 17.4z" />
              </svg>
            </CardContent>
          </Card>
        </Link>
        <Link href="/table">
          <Card className="hover:scale-95 w-[225px] h-[225px]">
            <CardHeader>
              <CardTitle>Table-Data-App</CardTitle>
              <CardDescription>Show table data</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <svg
                className="w-24 h-24"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M64 256V160H224v96H64zm0 64H224v96H64V320zm224 96V320H448v96H288zM448 256H288V160H448v96zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z" />
              </svg>
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  );
}
