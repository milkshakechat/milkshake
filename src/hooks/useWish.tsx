import { ErrorLine } from "@/api/graphql/error-line";
import {
  CreateWishInput,
  CreateWishResponseSuccess,
  Mutation,
  Query,
} from "@/api/graphql/types";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import gql from "graphql-tag";
import { useState } from "react";
import {
  ListWishlistInput,
  ListWishlistResponseSuccess,
} from "../api/graphql/types";
import { useWishState } from "@/state/wish.state";
import { useUserState } from "@/state/user.state";

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

export const useListWishlist = () => {
  const [data, setData] = useState<ListWishlistResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const setMyWishlist = useWishState((state) => state.setMyWishlist);
  const selfUser = useUserState((state) => state.user);

  const runQuery = async (args: ListWishlistInput) => {
    try {
      const LIST_WISHLIST = gql`
        query ListWishlist($input: ListWishlistInput!) {
          listWishlist(input: $input) {
            __typename
            ... on ListWishlistResponseSuccess {
              wishlist {
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
      const result = await new Promise<ListWishlistResponseSuccess>(
        async (resolve, reject) => {
          client
            .query<{ listWishlist: Query["listWishlist"] }>({
              query: LIST_WISHLIST,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data.listWishlist.__typename === "ListWishlistResponseSuccess"
              ) {
                resolve(data.listWishlist);
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
      if (
        selfUser &&
        result.wishlist.every((w) => w.creatorID === selfUser.id)
      ) {
        setMyWishlist(result.wishlist);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runQuery };
};
