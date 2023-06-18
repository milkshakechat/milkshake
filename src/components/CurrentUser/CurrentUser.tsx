import { useUserState } from "@/state/user.state";

const CurrentUser = () => {
  const user = useUserState((state) => state.user);
  return <i>{`user: ${user?.email}`}</i>;
};

export default CurrentUser;
