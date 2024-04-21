"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAppStore } from "@/stores/appStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function UserNav() {
  const pathname = usePathname();
  const appData = useAppStore();
  const router = useRouter();

  // disable for Login
  if (pathname == "/login") {
    return <></>;
  }

  return (
    <div className="flex items-center justify-between space-y-2 p-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          <Link href="/">Menu</Link>
        </h2>
      </div>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src=""
                  alt={appData.firstName + " " + appData.lastName}
                />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{appData.firstName + " " + appData.lastName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  { appData.email }
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                appData.logout();
                router.push("/login");
              }}
            >
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  function getInitials() {
    const firstName = appData.firstName ? appData.firstName : "";
    const lastName = appData.lastName ? appData.lastName : "";

    return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
  }
}
