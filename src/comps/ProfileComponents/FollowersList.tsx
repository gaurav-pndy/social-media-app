import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/services/supaBaseClient";
import { FullUser } from "@/types/types";
import { useEffect, useState } from "react";
import FollowCard from "../FeedComponents/FollowCard";

interface FollowersListProps {
  noOfFollowers: number;
  followersIds: string[];
  isFollowingIds: string[];
}

const FollowersList: React.FC<FollowersListProps> = ({
  noOfFollowers,
  followersIds,
  isFollowingIds: initialFollowingIds,
}) => {
  const [followersData, setFollowersData] = useState<FullUser[]>([]);
  const [isFollowingIds, setIsFollowingIds] =
    useState<string[]>(initialFollowingIds);

  useEffect(() => {
    const fetchFollowersData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .in("uid", followersIds);

      if (error) {
        console.log(error);
      } else {
        setFollowersData(data);
      }
    };

    fetchFollowersData();
  }, [followersIds]);

  const handleFollowStatusChange = (uid: string, isFollowing: boolean) => {
    setIsFollowingIds((prevIds) =>
      isFollowing ? [...prevIds, uid] : prevIds.filter((id) => id !== uid)
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="cursor-pointer hover:underline">
          <strong className="text-lg">{noOfFollowers}</strong> followers
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] sm:max-h-[650px] overflow-auto custom-scrollbar bg-black">
        <DialogHeader>
          <DialogTitle>Followers</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div>
          {followersData.length !== 0 ? (
            followersData.map((follower) => (
              <div
                key={follower?.uid}
                className="flex items-center px-3 py-2 justify-between mb-2 border border-white border-opacity-20 bg-gray-950 rounded-xl"
              >
                <FollowCard
                  person={follower}
                  isFollowingIds={isFollowingIds}
                  onFollowStatusChange={handleFollowStatusChange}
                />
              </div>
            ))
          ) : (
            <p>No followers yet.</p>
          )}
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersList;
