import { FOLLOW_USER_MUTATION } from "@/graphql/mutations/mutations";
import { useMutation } from "@apollo/client";

export const useFollow = (
  userId: string | undefined,
  personId: string | undefined
) => {
  const [followUser] = useMutation(FOLLOW_USER_MUTATION);

  const handleFollow = () => {
    followUser({
      variables: { follower_id: userId, following_id: personId },
    }); // Calling the FOLLOW_USER_MUTATION.
  };

  return { handleFollow };
};
