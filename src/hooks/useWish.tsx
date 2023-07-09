import { ErrorLine } from "@/api/graphql/error-line";
import {
  CreateWishInput,
  CreateWishResponseSuccess,
  GetWishInput,
  GetWishResponseSuccess,
  Mutation,
  Query,
  UpdateWishInput,
  UpdateWishResponseSuccess,
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
  const upsertWish = useWishState((state) => state.upsertWish);
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
      if (result.wish) {
        upsertWish(result.wish);
      }
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
  const setMarketplaceWishlist = useWishState(
    (state) => state.setMarketplaceWishlist
  );
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
      if (!args.userID) {
        // assumes no userID means all public marketplace wishlists
        setMarketplaceWishlist(result.wishlist);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runQuery };
};

export const useGetWish = () => {
  const [data, setData] = useState<GetWishResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const runQuery = async (args: GetWishInput) => {
    try {
      const GET_WISH = gql`
        query GetWish($input: GetWishInput!) {
          getWish(input: $input) {
            __typename
            ... on GetWishResponseSuccess {
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
      const result = await new Promise<GetWishResponseSuccess>(
        async (resolve, reject) => {
          client
            .query<{ getWish: Query["getWish"] }>({
              query: GET_WISH,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (data.getWish.__typename === "GetWishResponseSuccess") {
                resolve(data.getWish);
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
      return result.wish;
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runQuery };
};

export const useUpdateWish = () => {
  const [data, setData] = useState<UpdateWishResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();
  const upsertWish = useWishState((state) => state.upsertWish);

  const runMutation = async (args: UpdateWishInput) => {
    try {
      const UPDATE_WISH = gql`
        mutation UpdateWish($input: UpdateWishInput!) {
          updateWish(input: $input) {
            __typename
            ... on UpdateWishResponseSuccess {
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
      const result = await new Promise<UpdateWishResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "updateWish">>({
              mutation: UPDATE_WISH,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (data?.updateWish.__typename === "UpdateWishResponseSuccess") {
                resolve(data.updateWish);
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
      if (result.wish) {
        upsertWish(result.wish);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runMutation };
};
