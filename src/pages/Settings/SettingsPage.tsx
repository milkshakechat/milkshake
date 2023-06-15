import { ErrorLines } from "@/api/graphql/error-line";
import StyleConfigPanel from "@/components/StyleConfigPanel/StyleConfigPanel";
import QuickNav from "@/components/QuickNav/QuickNav";
import {
  useDemoMutation,
  useDemoPing,
  useDemoQuery,
  useDemoSubscription,
} from "@/components/TemplateComponentGQL/useTemplate.graphql";
import { useProfile } from "@/hooks/useProfile";
import { useUserState } from "@/state/user.state";
import AppLayout from "@/components/AppLayout/AppLayout";

export const SettingsPage = () => {
  const {
    data: profileData,
    errors: profileErrors,
    runQuery: getProfile,
  } = useProfile();

  const user = useUserState((state) => state.user);

  const executeGraphQL = () => {
    console.log(`Executing GraphQL Operations...`);
    getProfile();
  };

  return (
    <AppLayout>
      <div>
        <QuickNav />
        <h2>
          <code>{`<SettingsPage />`}</code>
        </h2>
        <button onClick={executeGraphQL}>Run GraphQL Operations</button>
        <br />
        <br />
        <section>
          <h3>Profile</h3>
          {profileData && <span>{profileData.user.id}</span>}
          <br />
          {user && <span>{user.email}</span>}
          <ErrorLines errors={profileErrors} />
        </section>
        <br />
      </div>
    </AppLayout>
  );
};
export default SettingsPage;
