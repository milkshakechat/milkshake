import {
  useDemoMutation,
  useDemoQuery,
  useDemoSubscription,
} from "@/components/Template/useTemplate.graphql";

export const TemplateComponent = () => {
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

  const executeGraphQL = () => {
    console.log(`Executing GraphQL Operations...`);
    runDemoQuery({ input: "Hello" });
    runDemoMutation({ title: "Big Title" });
    runDemoSubscription();
  };

  return (
    <div>
      <h2>
        <code>{`<TemplateComponent />`}</code>
      </h2>
      <button onClick={executeGraphQL}>Run GraphQL Operations</button>
      <br />
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
      <br />
      <br />
      <br />
    </div>
  );
};
export default TemplateComponent;
