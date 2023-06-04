import React, { useEffect, useRef, useState } from "react";
import gql from "graphql-tag";
import { print } from "graphql/language/printer";
import { client } from "@/api/graphql";
import {
  Annoucement,
  CreateStoryMutation,
  GetGreetingsQuery,
  MutationCreateStoryArgs,
  QueryGreetingsArgs,
  SubscribeAnnouncementsSubscription,
} from "@/api/graphql/types";

export const useGetGreetings = () => {
  const [data, setData] = useState<GetGreetingsQuery>();
  const [error, setError] = useState<Error>();

  const runQuery = async (args: QueryGreetingsArgs) => {
    try {
      const GET_GREETINGS = gql`
        query GetGreetings($input: String!) {
          greetings(input: $input)
        }
      `;
      const result = await new Promise<GetGreetingsQuery>((resolve, reject) => {
        client.subscribe(
          {
            query: print(GET_GREETINGS),
            variables: args,
          },
          {
            next: ({ data }: { data: GetGreetingsQuery }) => resolve(data),
            error: reject,
            complete: () => {},
          }
        );
      });
      setData(result);
    } catch (e) {
      setError(e as unknown as Error);
    }
  };

  return { data, error, runQuery };
};

export const useCreateStory = () => {
  const [data, setData] = useState<CreateStoryMutation>();
  const [error, setError] = useState<Error>();

  const runMutation = async (args: MutationCreateStoryArgs) => {
    try {
      const CREATE_STORY = gql`
        mutation CreateStory($title: String!) {
          createStory(title: $title) {
            id
            title
          }
        }
      `;
      const result = await new Promise<CreateStoryMutation>(
        (resolve, reject) => {
          client.subscribe(
            {
              query: print(CREATE_STORY),
              variables: args,
            },
            {
              next: ({ data }: { data: CreateStoryMutation }) => resolve(data),
              error: reject,
              complete: () => {},
            }
          );
        }
      );
      setData(result);
    } catch (e) {
      setError(e as unknown as Error);
    }
  };

  return { data, error, runMutation };
};

export const useSubscribeAnnouncements = () => {
  const [events, setEvents] = useState<Annoucement[]>([]);
  const eventsRef = useRef(events); // create a reference
  const [error, setError] = useState<Error>();

  useEffect(() => {
    eventsRef.current = events; // update the reference whenever events change
  }, [events]);

  const runSubscription = async () => {
    let unsubscribe = null;

    try {
      const SUBSCRIBE_ANNOUNCEMENTS = gql`
        subscription SubscribeAnnouncements {
          announcements {
            message
          }
        }
      `;
      unsubscribe = await client.subscribe(
        { query: print(SUBSCRIBE_ANNOUNCEMENTS) },
        {
          next: ({ data }: { data: SubscribeAnnouncementsSubscription }) => {
            console.log(`Incoming event: `, data.announcements);
            console.log(`Current Events: `, eventsRef.current); // access the latest events
            setEvents((prevEvents) => [...prevEvents, data.announcements]);
          },
          error: setError,
          complete: () => {},
        }
      );
    } catch (e) {
      setError(e as unknown as Error);
    }

    return unsubscribe;
  };

  return { data: events, error, runSubscription };
};
