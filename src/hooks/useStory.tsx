import { ErrorLine } from "@/api/graphql/error-line";
import {
  CreateStoryInput,
  CreateStoryResponseSuccess,
  FetchStoryFeedResponse,
  FetchStoryFeedResponseSuccess,
  GetStoryInput,
  GetStoryResponse,
  GetStoryResponseSuccess,
  ModifyStoryInput,
  ModifyStoryResponseSuccess,
  Mutation,
  Query,
} from "@/api/graphql/types";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import { useStoriesState } from "@/state/stories.state";
import { useUserState } from "@/state/user.state";
import gql from "graphql-tag";
import { useState } from "react";

export const useStoryCreate = () => {
  const [data, setData] = useState<CreateStoryResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const existingStories = useStoriesState((state) => state.stories);
  const setStories = useStoriesState((state) => state.setStories);

  const runMutation = async (
    args: CreateStoryInput
  ): Promise<CreateStoryResponseSuccess | undefined> => {
    try {
      const CREATE_STORY = gql`
        mutation CreateStory($input: CreateStoryInput!) {
          createStory(input: $input) {
            __typename
            ... on CreateStoryResponseSuccess {
              story {
                id
                userID
                caption
                pinned
                thumbnail
                showcaseThumbnail
                outboundLink
                createdAt
                expiresAt
                attachments {
                  id
                  thumbnail
                  stream
                  altText
                  url
                  type
                }
                author {
                  id
                  username
                  avatar
                  displayName
                }
              }
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<CreateStoryResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "createStory">>({
              mutation: CREATE_STORY,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.createStory.__typename === "CreateStoryResponseSuccess"
              ) {
                resolve(data.createStory);
              }
            })
            .catch((graphQLError: Error) => {
              if (graphQLError) {
                setErrors((errors) => [...errors, graphQLError.message]);
                reject();
              }
            });
        }
      );
      setData(result);
      setStories([...existingStories, result.story]);
      return result;
    } catch (e) {
      console.log(e);
      return;
    }
  };

  return { data, errors, runMutation };
};

export const useGetStory = () => {
  const [data, setData] = useState<GetStoryResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const existingStories = useStoriesState((state) => state.stories);
  const setStories = useStoriesState((state) => state.setStories);

  const runQuery = async (args: GetStoryInput) => {
    try {
      const GET_STORY = gql`
        query GetStory($input: GetStoryInput!) {
          getStory(input: $input) {
            __typename
            ... on GetStoryResponseSuccess {
              story {
                id
                userID
                caption
                pinned
                thumbnail
                showcaseThumbnail
                outboundLink
                createdAt
                expiresAt
                attachments {
                  id
                  thumbnail
                  stream
                  altText
                  url
                  type
                }
                author {
                  id
                  username
                  avatar
                  displayName
                }
              }
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<GetStoryResponseSuccess>(
        async (resolve, reject) => {
          client
            .query<{ getStory: GetStoryResponse }>({
              query: GET_STORY,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (data.getStory.__typename === "GetStoryResponseSuccess") {
                resolve(data.getStory);
              }
            })
            .catch((graphQLError: Error) => {
              if (graphQLError) {
                setErrors((errors) => [...errors, graphQLError.message]);
                reject();
              }
            });
        }
      );
      setData(result);
      const filtered = existingStories.filter(
        (story) => story.id !== result.story.id
      );
      setStories([...filtered, result.story]);
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runQuery };
};

export const useFetchStoryFeedQuery = () => {
  const [data, setData] = useState<FetchStoryFeedResponse>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [lastRequestTimestamp, setLastRequestTimestamp] = useState<string>(
    new Date().toISOString()
  );
  const client = useGraphqlClient();
  const setStories = useStoriesState((state) => state.setStories);

  const runQuery = async ({ refresh }: { refresh?: boolean }) => {
    console.log(`useFetchStoryFeedQuery()...`);
    const now = new Date().toISOString();
    const nonce = refresh ? now : lastRequestTimestamp;
    if (refresh) {
      setLastRequestTimestamp(now);
    }
    try {
      const FETCH_STORY_FEED = gql`
        query FetchStoryFeed($input: FetchStoryFeedInput!) {
          fetchStoryFeed(input: $input) {
            __typename
            ... on FetchStoryFeedResponseSuccess {
              stories {
                id
                userID
                caption
                pinned
                thumbnail
                showcaseThumbnail
                outboundLink
                createdAt
                expiresAt
                attachments {
                  id
                  thumbnail
                  stream
                  altText
                  url
                  type
                }
                author {
                  id
                  username
                  avatar
                  displayName
                }
              }
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<FetchStoryFeedResponseSuccess>(
        async (resolve, reject) => {
          client
            .query<{ fetchStoryFeed: FetchStoryFeedResponse }>({
              query: FETCH_STORY_FEED,
              variables: { input: { nonce } },
            })
            .then(({ data }) => {
              console.log(`Got response from fetchStoryFeed`, data);
              if (
                data.fetchStoryFeed.__typename ===
                "FetchStoryFeedResponseSuccess"
              ) {
                resolve(data.fetchStoryFeed);
              }
            })
            .catch((graphQLError: Error) => {
              if (graphQLError) {
                setErrors((errors) => [...errors, graphQLError.message]);
                reject();
              }
            });
        }
      );
      setData(result);
      setStories(result.stories);
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runQuery };
};

export const useModifyStory = () => {
  const [data, setData] = useState<ModifyStoryResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();
  const updateOrPushStory = useUserState((state) => state.updateOrPushStory);

  const runMutation = async (args: ModifyStoryInput) => {
    try {
      const MODIFY_STORY = gql`
        mutation ModifyStory($input: ModifyStoryInput!) {
          modifyStory(input: $input) {
            __typename
            ... on ModifyStoryResponseSuccess {
              story {
                id
                userID
                caption
                pinned
                showcase
                thumbnail
                showcaseThumbnail
                outboundLink
                createdAt
                expiresAt
                attachments {
                  id
                  thumbnail
                  stream
                  altText
                  url
                  type
                }
                author {
                  id
                  username
                  avatar
                  displayName
                }
              }
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<ModifyStoryResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "modifyStory">>({
              mutation: MODIFY_STORY,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.modifyStory.__typename === "ModifyStoryResponseSuccess"
              ) {
                resolve(data.modifyStory);
              }
            })
            .catch((graphQLError: Error) => {
              if (graphQLError) {
                setErrors((errors) => [...errors, graphQLError.message]);
                reject();
              }
            });
        }
      );
      setData(result);
      updateOrPushStory(result.story);
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runMutation };
};
