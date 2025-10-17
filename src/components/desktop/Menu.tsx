"use client";
import React from "react";
import { BiGlobe, BiMenu, BiQuestionMark } from "react-icons/bi";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { BsQuestionCircle } from "react-icons/bs";
import useAuthCardDialogStore from "@/hooks/use-auth-card-dialog";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {};

const Menu = (props: Props) => {
  const { open, isOpen } = useAuthCardDialogStore();
  const { data: session } = useSession();

  return (
    <div className="hidden md:flex items-center rounded-full text-gray-600 gap-3 ">
      <div className="text-sm  font-semibold hover:cursor-pointer hover:bg-gray-200 p-2 rounded-full">
        Become a host
      </div>

      {session && session.user ? (
        <Avatar>
          <AvatarImage src={`${session.user.image}`} />
          <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
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
            {session?.user ? (
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
