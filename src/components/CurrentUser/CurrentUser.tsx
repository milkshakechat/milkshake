import { useUserState } from "@/state/user.state";

const CurrentUser = () => {
  const email = useUserState((state) => state.email);
  return <i>{`user: ${email}`}</i>;
};

export default CurrentUser;
