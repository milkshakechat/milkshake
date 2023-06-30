import { ErrorLine } from "@/api/graphql/error-line";
import {
  CreateWishInput,
  CreateWishResponseSuccess,
  Mutation,
} from "@/api/graphql/types";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import gql from "graphql-tag";
import { useState } from "react";

export const useCreateWish = () => {
  const [data, setData] = useState<CreateWishResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const runMutation = async (args: CreateWishInput) => {
    try {
      const CREATE_WISH = gql`
        mutation CreateWish($input: CreateWishInput!) {
          createWish(input: $input) {
            __typename
            ... on CreateWishResponseSuccess {
              wish {
                id
                creatorID
                wishTitle
                stickerTitle
                description
                thumbnail
                cookiePrice
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
      const result = await new Promise<CreateWishResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "createWish">>({
              mutation: CREATE_WISH,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (data?.createWish.__typename === "CreateWishResponseSuccess") {
                resolve(data.createWish);
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
