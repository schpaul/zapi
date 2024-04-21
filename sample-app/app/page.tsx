import MainMenu from "@/components/ui/home/home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu | Sample App",
};

export default function Home() {
  return <MainMenu />;
}
