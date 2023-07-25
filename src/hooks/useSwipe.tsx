import { useEffect, useRef, useState } from "react";
import gql from "graphql-tag";
import {
  FetchSwipeFeedResponseSuccess,
  FetchSwipeFeedInput,
  Mutation,
  Query,
  InteractStoryInput,
  InteractStoryResponseSuccess,
} from "@/api/graphql/types";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import { GraphQLError } from "graphql";
import { ErrorLine } from "@/api/graphql/error-line";
import { useSwipeState } from "@/state/swipe.state";

export const useFetchSwipeFeed = () => {
  const [data, setData] = useState<FetchSwipeFeedResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useGraphqlClient();
  const setStoryStack = useSwipeState((state) => state.setStoryStack);

  const runQuery = async (args: FetchSwipeFeedInput) => {
    setLoading(true);
    try {
      const FETCH_SWIPE_FEED = gql`
        query FetchSwipeFeed($input: FetchSwipeFeedInput!) {
          fetchSwipeFeed(input: $input) {
            __typename
            ... on FetchSwipeFeedResponseSuccess {
              swipeStack {
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
                  linkedWishID
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
                wish {
                  id
                  creatorID
                  wishTitle
                  stickerTitle
                  description
                  thumbnail
                  cookiePrice
                  visibility
                  galleryMediaSet {
                    small
                    medium
                    large
                  }
                  stickerMediaSet {
                    small
                    medium
                    large
                  }
                  isFavorite
                  buyFrequency
                  createdAt
                  author {
                    id
                    username
                    avatar
                    displayName
                  }
                  wishType
                  countdownDate
                  externalURL
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
      const result = await new Promise<FetchSwipeFeedResponseSuccess>(
        async (resolve, reject) => {
          client
            .query<{ fetchSwipeFeed: Query["fetchSwipeFeed"] }>({
              query: FETCH_SWIPE_FEED,
              variables: { input: args },
            })
            .then(({ data }) => {
              console.log(`FETCH SWIPE FEED`, data);
              if (
                data.fetchSwipeFeed.__typename ===
                "FetchSwipeFeedResponseSuccess"
              ) {
                resolve(data.fetchSwipeFeed);
              }
              setLoading(false);
            })
            .catch((graphQLError: Error) => {
              if (graphQLError) {
                setErrors((errors) => [...errors, graphQLError.message]);
                reject();
              }
              setLoading(false);
            });
        }
      );
      setData(result);
      setStoryStack(result.swipeStack);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return { data, errors, loading, runQuery };
};

export const useInteractStory = () => {
  const [data, setData] = useState<InteractStoryResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useGraphqlClient();

  const runMutation = async (args: InteractStoryInput) => {
    setLoading(true);
    try {
      const INTERACT_STORY = gql`
        mutation InteractStory($input: InteractStoryInput!) {
          interactStory(input: $input) {
            __typename
            ... on InteractStoryResponseSuccess {
              status
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<InteractStoryResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "interactStory">>({
              mutation: INTERACT_STORY,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.interactStory.__typename ===
                "InteractStoryResponseSuccess"
              ) {
                resolve(data.interactStory);
              }
              setLoading(false);
            })
            .catch((graphQLError: Error) => {
              if (graphQLError) {
                setErrors((errors) => [...errors, graphQLError.message]);
                reject();
              }
              setLoading(false);
            });
        }
      );
      setData(result);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return { data, errors, loading, runMutation };
};
