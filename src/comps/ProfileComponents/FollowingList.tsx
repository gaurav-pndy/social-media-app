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

interface FollowingListProps {
  noOfFollowing: number;
  followingIds: string[];
  isFollowingIds: string[];
}

const FollowingList: React.FC<FollowingListProps> = ({
  noOfFollowing,
  followingIds,
  isFollowingIds: initialFollowingIds,
}) => {
  const [followingData, setFollowingData] = useState<FullUser[]>([]);
  const [isFollowingIds, setIsFollowingIds] =
    useState<string[]>(initialFollowingIds);

  useEffect(() => {
    const fetchFollowingData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .in("uid", followingIds);

      if (error) {
        console.log(error);
      } else {
        setFollowingData(data);
      }
    };

    fetchFollowingData();
  }, [followingIds]);

  const handleFollowStatusChange = (uid: string, isFollowing: boolean) => {
    setIsFollowingIds((prevIds) =>
      isFollowing ? [...prevIds, uid] : prevIds.filter((id) => id !== uid)
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="cursor-pointer hover:underline">
          <strong className="text-lg">{noOfFollowing}</strong> following
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] sm:max-h-[650px] overflow-auto custom-scrollbar bg-black">
        <DialogHeader>
          <DialogTitle>Following</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div>
          {followingData.length !== 0 ? (
            followingData.map((user) => (
              <div
                key={user?.uid}
                className="flex items-center px-3 py-2 justify-between mb-2 border border-white border-opacity-20 bg-gray-950 rounded-xl"
              >
                <FollowCard
                  person={user}
                  isFollowingIds={isFollowingIds}
                  onFollowStatusChange={handleFollowStatusChange}
                />
              </div>
            ))
          ) : (
            <p>No followings yet.</p>
          )}
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FollowingList;
