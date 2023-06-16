import { ErrorLines } from "@/api/graphql/error-line";
import QuickNav from "@/components/QuickNav/QuickNav";
import { useProfile } from "@/hooks/useProfile";
import { useUserState } from "@/state/user.state";
import AppLayout from "@/AppLayout";
import TemplateComponentGQL from "@/components/TemplateComponentGQL/TemplateComponentGQL";
import TemplateComponent from "@/components/TemplateComponent/TemplateComponent";

export const SettingsPage = () => {
  const user = useUserState((state) => state.user);

  return (
    <div>
      <QuickNav />
      <h2>
        <code>{`<SettingsPage />`}</code>
      </h2>
      <br />
      <br />
      <section>
        <h3>Profile</h3>
        {user && <span>{user.id}</span>}
        <br />
        {user && <span>{user.email}</span>}
      </section>
      <br />
      <br />
      <TemplateComponent />
      <br />
      <br />
      <TemplateComponentGQL />
    </div>
  );
};
export default SettingsPage;
