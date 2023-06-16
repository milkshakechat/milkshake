import { useProfile } from "@/hooks/useProfile";
import { useUserState } from "@/state/user.state";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export const UserInfoProvider = ({ children }: Props) => {
  const {
    data: profileData,
    errors: profileErrors,
    runQuery: getProfile,
  } = useProfile();

  const idToken = useUserState((state) => state.idToken);

  useEffect(() => {
    getProfile();
  }, [idToken]);

  return <>{children}</>;
};
