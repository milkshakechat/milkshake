import { ErrorLine } from "@/api/graphql/error-line";
import {
  CreateStoryInput,
  CreateStoryResponseSuccess,
  Mutation,
} from "@/api/graphql/types";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import gql from "graphql-tag";
import { useState } from "react";

export const useStoryCreate = () => {
  const [data, setData] = useState<CreateStoryResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const runMutation = async (args: CreateStoryInput) => {
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
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runMutation };
};
