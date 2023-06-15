import { ErrorLines } from "@/api/graphql/error-line";
import DarkModeSwitch from "@/components/DarkModeSwitch/DarkModeSwitch";
import QuickNav from "@/components/QuickNav/QuickNav";
import {
  useDemoMutation,
  useDemoPing,
  useDemoQuery,
  useDemoSubscription,
} from "@/components/TemplateComponentGQL/useTemplate.graphql";
import { useProfile } from "@/hooks/useProfile";

export const SettingsPage = () => {
  const {
    data: profileData,
    errors: profileErrors,
    runQuery: getProfile,
  } = useProfile();

  const executeGraphQL = () => {
    console.log(`Executing GraphQL Operations...`);
    getProfile();
  };

  return (
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
        <ErrorLines errors={profileErrors} />
      </section>
      <br />
    </div>
  );
};
export default SettingsPage;
