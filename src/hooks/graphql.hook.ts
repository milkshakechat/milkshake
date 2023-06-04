import { createClient } from "graphql-ws";

const client = createClient({
  url: "ws://localhost:8888/graphql",
  shouldRetry: () => true,
});

// query
(async () => {
  const result = await new Promise((resolve, reject) => {
    let result: any;
    client.subscribe(
      {
        query: "{ hello }",
      },
      {
        next: (data) => {
          result = data;
          console.log(`Got query result:`, data);
        },
        error: reject,
        complete: () => {
          console.log(`Query complete!`);
          resolve(result);
        },
      }
    );
  });

  // expect(result).toEqual({ hello: "Hello World!" });
})();

// subscription
(async () => {
  const onNext = (data: any) => {
    /* handle incoming values */
    console.log(`-- onNext`, data);
  };

  let unsubscribe = (data: any) => {
    /* complete the subscription */
    console.log(`-- unsubscribe`, data);
  };

  await new Promise((resolve, reject) => {
    unsubscribe = client.subscribe(
      {
        query: "subscription { greetings }",
      },
      {
        next: onNext,
        error: reject,
        complete: () => resolve("done subscriptioin"),
      }
    );
  });

  // expect(onNext).toBeCalledTimes(5); // we say "Hi" in 5 languages
})();

export const hi = "hi";
