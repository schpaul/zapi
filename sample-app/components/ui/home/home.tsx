"use client";

import Menu from "@/components/ui/home/menu";
import { useAppStore } from "@/stores/appStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MainMenu() {
  const appData = useAppStore();
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

  return <Menu />;
}