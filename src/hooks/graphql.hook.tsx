import { createClient } from "graphql-ws";
import gql from "graphql-tag";
import { print } from "graphql/language/printer";
import {
  CreateStoryMutation,
  GetGreetingsQuery,
  Mutation,
  MutationCreateStoryArgs,
  QueryGreetingsArgs,
  SubscribeAnnouncementsSubscription,
} from "@/api/graphql/types";

const client = createClient({
  url: "ws://localhost:8888/graphql",
  shouldRetry: () => true,
});

// query
(async () => {
  const GET_GREETINGS = gql`
    query GetGreetings($input: String!) {
      greetings(input: $input)
    }
  `;
  const result = await new Promise<GetGreetingsQuery | undefined>(
    (resolve, reject) => {
      let result: any;
      client.subscribe(
        {
          query: print(GET_GREETINGS),
          variables: {
            input: "Hello world!",
          } as QueryGreetingsArgs,
        },
        {
          next: ({ data }: { data: GetGreetingsQuery | null }) => {
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
    }
  );
})();

// mutation
(async () => {
  const CREATE_STORY = gql`
    mutation CreateStory($title: String!) {
      createStory(title: $title) {
        id
        title
      }
    }
  `;
  const result = await new Promise<CreateStoryMutation | undefined>(
    (resolve, reject) => {
      let result: any;
      client.subscribe(
        {
          query: print(CREATE_STORY),
          variables: {
            title: "Hot Tea",
          } as MutationCreateStoryArgs,
        },
        {
          next: ({ data }: { data: CreateStoryMutation | null }) => {
            result = data;
            console.log(`Got mutation result:`, data);
          },
          error: reject,
          complete: () => {
            console.log(`Mutation complete!`);
            resolve(result);
          },
        }
      );
    }
  );
})();

// subscription
(async () => {
  const onNext = ({
    data,
  }: {
    data: SubscribeAnnouncementsSubscription | null;
  }) => {
    /* handle incoming values */
    console.log(`-- onNext`, data);
  };

  let unsubscribe = (data: any) => {
    /* complete the subscription */
    console.log(`-- unsubscribe`, data);
  };

  const SUBSCRIBE_ANNOUNCEMENTS = gql`
    subscription SubscribeAnnouncements {
      announcements {
        message
      }
    }
  `;
  await new Promise<SubscribeAnnouncementsSubscription | undefined>(
    (resolve, reject) => {
      unsubscribe = client.subscribe(
        {
          query: print(SUBSCRIBE_ANNOUNCEMENTS),
        },
        {
          next: onNext,
          error: reject,
          complete: () => resolve(undefined),
        }
      );
    }
  );
})();

export const hi = "hi";
