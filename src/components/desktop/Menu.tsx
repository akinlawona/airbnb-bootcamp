"use client";
import React from "react";
import { BiGlobe, BiMenu, BiQuestionMark } from "react-icons/bi";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { BsQuestionCircle } from "react-icons/bs";
import useAuthCardDialogStore from "@/hooks/use-auth-card-dialog";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useCreateListingDialogStore from "@/hooks/use-create-listing-dialog";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUnreadMessageCount } from "@/hooks/use-unread-message-count";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Rocket,
  Settings,
  UserCircle,
} from "lucide-react";
import { AiFillProfile } from "react-icons/ai";
import { Badge } from "../ui/badge";

type Props = {};

const Menu = (props: Props) => {
  const { open, isOpen } = useAuthCardDialogStore();
  const { open: openHostDialog } = useCreateListingDialogStore();
  const user = useCurrentUser();
  const unreadCount = useUnreadMessageCount();

  return (
    <div className="hidden md:flex items-center rounded-full text-gray-600 gap-3 w-full justify-end">
      <div
        onClick={openHostDialog}
        className="text-sm  font-semibold hover:cursor-pointer hover:bg-gray-200 p-2 rounded-full"
      >
        Become a host
      </div>

      {user ? (
        <Avatar>
          <AvatarImage src={`${user?.image}`} />
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      ) : (
        <BiGlobe
          size={40}
          className="cursor-pointer border-[1px] rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition"
        />
      )}

      <Popover>
        <PopoverTrigger asChild>
          <BiMenu
            size={40}
            className="cursor-pointer border-[1px] rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition"
          />
        </PopoverTrigger>
        <PopoverContent className="mr-4">
          <div className="flex flex-col">
            {user && (
              <>
                <Link href="/wishlists">
                  <div className="flex items-center hover:bg-gray-200 rounded-lg p-2 gap-2 hover:cursor-pointer">
                    <Heart size={20} className="mr-2" />

                    <p className="text-sm ">Wishlists</p>
                  </div>
                </Link>
                <Link href="/trips/v1">
                  <div className="flex items-center hover:bg-gray-200 rounded-lg p-2 gap-2 hover:cursor-pointer">
                    <Rocket size={20} className="mr-2" />

                    <p className="text-sm ">Trips</p>
                  </div>
                </Link>
                <Link href="/messages">
                  <div className="flex items-center hover:bg-gray-200 rounded-lg p-2 gap-2 hover:cursor-pointer">
                    <MessageCircle size={20} className="mr-2" />
                    <p className="text-sm flex-1">Messages</p>
                    {unreadCount > 0 && (
                      <Badge variant="default" className="ml-auto">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                </Link>
                <Link href="/users/profile">
                  <div className="flex items-center hover:bg-gray-200 rounded-lg p-2 gap-2 hover:cursor-pointer">
                    <UserCircle size={20} className="mr-2" />

                    <p className="text-sm ">Profile</p>
                  </div>
                </Link>
                <hr className="my-2" />
              </>
            )}
            {user && (
              <Link href="/account-settings">
                <div className="flex items-center hover:bg-gray-200 rounded-lg p-2 gap-2 hover:cursor-pointer">
                  <Settings size={20} className="mr-2" />
                  <p className="text-sm ">Account Settings</p>
                </div>
              </Link>
            )}
            <div className="flex items-center hover:bg-gray-200 rounded-lg p-2 gap-2 hover:cursor-pointer">
              <BsQuestionCircle size={20} className="mr-2" />

              <p className="text-sm ">Help Center</p>
            </div>
            <hr className="my-2" />
            <div className="hover:bg-gray-200 p-2 gap-2 rounded-lg hover:cursor-pointer">
              <p className="text-sm font-semibold">Become a host</p>
              <p className="text-xs">
                {" "}
                It is easy to start hosting and earn extra income
              </p>
            </div>
            <hr className="my-2" />
            <div className="flex flex-col gap-2">
              <p className="text-sm  hover:bg-gray-200 rounded-lg p-2 gap-2 hover:cursor-pointer">
                Refer a Host
              </p>
              <p className="text-sm  hover:bg-gray-200 rounded-lg p-2 gap-2 hover:cursor-pointer">
                Find a co-host
              </p>
              <p className="text-sm  hover:bg-gray-200 rounded-lg p-2 gap-2 hover:cursor-pointer">
                Gift cards
              </p>
            </div>
            <hr className="my-2" />
            {user ? (
              <p
                onClick={() => signOut()}
                className="text-sm p-2 hover:bg-gray-200 rounded-lg gap-2 hover:cursor-pointer"
              >
                Logout
              </p>
            ) : (
              <p
                onClick={open}
                className="text-sm p-2 hover:bg-gray-200 rounded-lg gap-2 hover:cursor-pointer"
              >
                Log in or sign up
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Menu;
