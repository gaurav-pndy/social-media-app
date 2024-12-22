import { UNFOLLOW_USER_MUTATION } from "@/graphql/mutations/mutations";
import { useMutation } from "@apollo/client";

const useUnfollow = (
  userId: string | undefined,
  personId: string | undefined
) => {
  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION); // The mutation to remove the existing follow relationship between logged in user and selected user.

  const handleUnfollow = () => {
    unfollowUser({
      variables: { follower_id: userId, following_id: personId },
    }); // Calling the UNFOLLOW_USER_MUTATION
  };

  return { handleUnfollow };
};

export default useUnfollow;
