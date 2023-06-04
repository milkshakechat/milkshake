import DarkModeSwitch from "@/components/DarkModeSwitch/DarkModeSwitch";
import {
  useDemoMutation,
  useDemoPing,
  useDemoQuery,
  useDemoSubscription,
} from "@/components/TemplateComponentGQL/useTemplate.graphql";
import { useParams } from "react-router-dom";

export const UserProfilePage = () => {
  const { username } = useParams();

  const {
    data: demoQueryData,
    error: demoQueryError,
    runQuery: runDemoQuery,
  } = useDemoQuery();

  const {
    data: demoMutationData,
    error: demoMutationError,
    runMutation: runDemoMutation,
  } = useDemoMutation();

  const {
    data: demoSubscriptionData,
    error: demoSubscriptionError,
    runSubscription: runDemoSubscription,
  } = useDemoSubscription();

  const {
    data: pingData,
    error: pingError,
    runQuery: runPingQuery,
  } = useDemoPing();

  const executeGraphQL = () => {
    console.log(`Executing GraphQL Operations...`);
    runDemoQuery({ input: "Hello" });
    runDemoMutation({ title: "Big Title" });
    runDemoSubscription();
    runPingQuery();
  };

  return (
    <div>
      <h2>
        <code>{`<UserProfilePage />`}</code>
      </h2>
      <h3>{`@${username}`}</h3>
      <button onClick={executeGraphQL}>Run GraphQL Operations</button>
      <br />
      <br />
      <section>
        <h3>Ping</h3>
        {pingData && <span>{pingData.timestamp}</span>}
        {pingError && <span style={{ color: "red" }}>{pingError.message}</span>}
      </section>
      <br />
      <section>
        <h3>Query</h3>
        {demoQueryData && <span>{demoQueryData.demoQuery}</span>}
        {demoQueryError && (
          <span style={{ color: "red" }}>{demoQueryError.message}</span>
        )}
      </section>
      <br />
      <section>
        <h3>Mutation</h3>
        {demoMutationData && <span>{demoMutationData.demoMutation.title}</span>}
        {demoMutationError && (
          <span style={{ color: "red" }}>{demoMutationError.message}</span>
        )}
      </section>
      <br />
      <section>
        <h3>Subscription</h3>
        {demoSubscriptionData && (
          <div>
            {demoSubscriptionData.map((a, i) => (
              <p key={`${i}-${a.message}`}>{a.message}</p>
            ))}
          </div>
        )}
        {demoSubscriptionError && (
          <span style={{ color: "red" }}>{demoSubscriptionError.message}</span>
        )}
      </section>
      <br />
      <DarkModeSwitch />
      <br />
      <br />
      <br />
    </div>
  );
};
export default UserProfilePage;
