import { ErrorLine } from "@/api/graphql/error-line";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import gql from "graphql-tag";
import { useState } from "react";
import { print } from "graphql/language/printer";
import { GraphQLError } from "graphql";
import {
  CheckUsernameAvailableInput,
  CheckUsernameAvailableResponseSuccess,
  GetMyProfileQuery,
  GetMyProfileResponse,
  GetMyProfileResponseSuccess,
} from "@/api/graphql/types";
import { useUserState } from "@/state/user.state";
import { Observable, FetchResult } from "@apollo/client/core";

export const useProfile = () => {
  const [data, setData] = useState<GetMyProfileResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();
  const setGQLUser = useUserState((state) => state.setGQLUser);

  const runQuery = async () => {
    try {
      const GET_MY_PROFILE = gql`
        query GetMyProfile {
          getMyProfile {
            __typename
            ... on GetMyProfileResponseSuccess {
              user {
                id
                email
                username
                phone
                displayName
                bio
                avatar
                link
                disabled
                isPaidChat
                isCreator
                createdAt
              }
            }
          }
        }
      `;
      const result = await new Promise<GetMyProfileResponseSuccess>(
        (resolve, reject) => {
          client
            .query<GetMyProfileQuery>({
              query: GET_MY_PROFILE,
            })
            .then(({ data }) => {
              if (
                data.getMyProfile.__typename === "GetMyProfileResponseSuccess"
              ) {
                resolve(data.getMyProfile);
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
      setGQLUser(result.user);
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runQuery };
};

export const useCheckUsernameAvailable = () => {
  const [data, setData] = useState<CheckUsernameAvailableResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const runQuery = async (args: CheckUsernameAvailableInput) => {
    try {
      const CHECK_USERNAME_AVAILABLE = gql`
        query CheckUsernameAvailable($input: CheckUsernameAvailableInput!) {
          checkUsernameAvailable(input: $input) {
            __typename
            ... on CheckUsernameAvailableResponseSuccess {
              isAvailable
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<CheckUsernameAvailableResponseSuccess>(
        async (resolve, reject) => {
          client
            .query({
              query: CHECK_USERNAME_AVAILABLE,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data.checkUsernameAvailable.__typename ===
                "CheckUsernameAvailableResponseSuccess"
              ) {
                resolve(data.checkUsernameAvailable);
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

  return { data, errors, runQuery };
};
