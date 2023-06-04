import {
  useCreateStory,
  useGetGreetings,
  useSubscribeAnnouncements,
} from "@/components/Template/useGQL.template";

export const TemplateComponent = () => {
  const {
    data: greetingsData,
    error: greetingsError,
    runQuery: greetingsQuery,
  } = useGetGreetings();

  const {
    data: createStoryData,
    error: createStoryError,
    runMutation: createStoryMutation,
  } = useCreateStory();

  const {
    data: announcementsData,
    error: announcementsError,
    runSubscription: announcementsSubscription,
  } = useSubscribeAnnouncements();

  const executeGraphQL = () => {
    console.log(`Executing GraphQL Operations...`);
    greetingsQuery({ input: "Hello" });
    createStoryMutation({ title: "Big Title" });
    announcementsSubscription();
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
        {greetingsData && <span>{greetingsData.greetings}</span>}
        {greetingsError && (
          <span style={{ color: "red" }}>{greetingsError.message}</span>
        )}
      </section>
      <br />
      <section>
        <h3>Mutation</h3>
        {createStoryData && <span>{createStoryData.createStory.title}</span>}
        {createStoryError && (
          <span style={{ color: "red" }}>{createStoryError.message}</span>
        )}
      </section>
      <br />
      <section>
        <h3>Subscription</h3>
        {announcementsData && (
          <div>
            {announcementsData.map((a, i) => (
              <p key={`${i}-${a.message}`}>{a.message}</p>
            ))}
          </div>
        )}
        {announcementsError && (
          <span style={{ color: "red" }}>{announcementsError.message}</span>
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
