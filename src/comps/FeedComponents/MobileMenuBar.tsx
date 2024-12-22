import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/useAuth";
import { FullUser } from "@/types/types";
import React, { useEffect, useState } from "react";
import { supabase } from "@/services/supaBaseClient";
import FollowCard from "./FollowCard";

import { CircleUserRoundIcon, UsersRoundIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface MobileMenuBarProps {
  followingIds: string[];
}
const MobileMenuBar: React.FC<MobileMenuBarProps> = ({ followingIds }) => {
  const { user } = useAuth(); // Fetching logged in user using custom hook.

  const [allUsersData, setAllUsersData] = useState<FullUser[]>([]);

  // Fetching the details of logged in user from 'users' table in database using custom hook.

  const [isFollowingIds, setIsFollowingIds] = useState<string[]>(followingIds);

  useEffect(() => {
    // The function to fetch the details of all users except logged in user from 'users' table in database.
    const fetchAllUsers = async () => {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .neq("uid", user?.id);

      if (userError) {
        console.log(userError);
      } else {
        setAllUsersData(userData);
      }
    };

    fetchAllUsers();
  }, [user, followingIds]);

  const handleFollowStatusChange = (uid: string, isFollowing: boolean) => {
    setIsFollowingIds((prevIds) =>
      isFollowing ? [...prevIds, uid] : prevIds.filter((id) => id !== uid)
    );
  };
  return (
    <NavigationMenu className="md:hidden fixed bottom-0 rounded-t-2xl left-0">
      <NavigationMenuList className="flex h-[7vh] w-[100vw] px-1 ">
        <NavigationMenuItem className="w-1/2 flex h-full justify-center items-center bg-[#030008] bg-opacity-80 rounded-lg">
          <NavigationMenuTrigger>
            <UsersRoundIcon size={32} />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-black ">
            <div className="">
              <h2 className="text-xl text-gray-400 p-4">Follow more users</h2>
              {allUsersData.map(
                (person) =>
                  !followingIds.includes(person.uid) && (
                    <div
                      key={person.id}
                      className="flex items-center px-3 py-4 justify-between mt-1 border border-white border-opacity-20 bg-gray-950 rounded-xl"
                    >
                      <FollowCard
                        person={person}
                        isFollowingIds={isFollowingIds}
                        onFollowStatusChange={handleFollowStatusChange}
                      />
                    </div>
                  )
              )}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem className="w-1/2 h-full rounded-lg flex justify-center items-center bg-[#030008] bg-opacity-80 ">
          <Link to={`/profile/${user?.id}`}>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <CircleUserRoundIcon size={32} />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default MobileMenuBar;
