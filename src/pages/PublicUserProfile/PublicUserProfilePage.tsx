import { ErrorLines } from "@/api/graphql/error-line";
import StyleConfigPanel from "@/components/StyleConfigPanel/StyleConfigPanel";
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
    errors: demoQueryErrors,
    runQuery: runDemoQuery,
  } = useDemoQuery();

  const {
    data: demoMutationData,
    errors: demoMutationErrors,
    runMutation: runDemoMutation,
  } = useDemoMutation();

  const {
    data: demoSubscriptionData,
    errors: demoSubscriptionErrors,
    runSubscription: runDemoSubscription,
  } = useDemoSubscription();

  const {
    data: pingData,
    errors: pingErrors,
    runQuery: runPingQuery,
  } = useDemoPing();

  const executeGraphQL = () => {
    console.log(`Executing GraphQL Operations...`);
    runDemoQuery({ name: "Hello" });
    runDemoMutation({ name: "Big Title" });
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
        <ErrorLines errors={pingErrors} />
      </section>
      <br />
      <section>
        <h3>Query</h3>
        {demoQueryData && <span>{demoQueryData.message}</span>}
        <ErrorLines errors={demoQueryErrors} />
      </section>
      <br />
      <section>
        <h3>Mutation</h3>
        {demoMutationData && <span>{demoMutationData.item.title}</span>}

        <ErrorLines errors={demoMutationErrors} />
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
        <ErrorLines errors={demoSubscriptionErrors} />
      </section>
      <br />
      <StyleConfigPanel />
      <br />
      <br />
      <br />
    </div>
  );
};
export default UserProfilePage;
