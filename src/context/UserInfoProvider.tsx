import { useProfile } from "@/hooks/useProfile";
import useWebPermissions from "@/hooks/useWebPermissions";
import { useUserState } from "@/state/user.state";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";

interface Props {
  children: React.ReactNode;
}

export const UserInfoProvider = ({ children }: Props) => {
  const {
    data: profileData,
    errors: profileErrors,
    runQuery: getProfile,
  } = useProfile();
  const { checkWebPermissions } = useWebPermissions({});

  const { idToken, refetchNonce } = useUserState(
    (state) => ({
      idToken: state.idToken,
      refetchNonce: state.refetchNonce,
    }),
    shallow
  );

  useEffect(() => {
    checkWebPermissions();
  }, []);

  useEffect(() => {
    getProfile();
  }, [idToken, refetchNonce]);

  return <>{children}</>;
};
