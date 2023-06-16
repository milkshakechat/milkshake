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
  ModifyProfileInput,
  ModifyProfileResponseSuccess,
  Mutation,
} from "@/api/graphql/types";
import { useUserState } from "@/state/user.state";
import { Observable, FetchResult } from "@apollo/client/core";
import { shallow } from "zustand/shallow";
import { useStyleConfigGlobal } from "@/state/styleconfig.state";
import { localeEnum } from "@milkshakechat/helpers";

export const useProfile = () => {
  const [data, setData] = useState<GetMyProfileResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();
  const setGQLUser = useUserState((state) => state.setGQLUser);
  const { switchLocale, switchTheme, switchColor } = useStyleConfigGlobal(
    (state) => ({
      themeType: state.themeType,
      locale: state.locale,
      themeColor: state.themeColor,
      switchLocale: state.switchLocale,
      switchTheme: state.switchTheme,
      switchColor: state.switchColor,
    }),
    shallow
  );

  const runQuery = async () => {
    try {
      const result = await new Promise<GetMyProfileResponseSuccess>(
        (resolve, reject) => {
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
                    privacyMode
                    themeColor
                    language
                  }
                }
              }
            }
          `;
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
      const { language, themeColor } = result.user;

      switchLocale(language as unknown as localeEnum);
      switchColor(themeColor);
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

export const useUpdateProfile = () => {
  const [data, setData] = useState<ModifyProfileResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const { triggerRefetch } = useUserState(
    (state) => ({
      triggerRefetch: state.triggerRefetch,
    }),
    shallow
  );

  const runMutation = async (args: ModifyProfileInput) => {
    try {
      const MODIFY_PROFILE = gql`
        mutation ModifyProfile($input: ModifyProfileInput!) {
          modifyProfile(input: $input) {
            __typename
            ... on ModifyProfileResponseSuccess {
              user {
                id
                avatar
                username
                displayName
                bio
                link
                language
                themeColor
                privacyMode
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
      const result = await new Promise<ModifyProfileResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "modifyProfile">>({
              mutation: MODIFY_PROFILE,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.modifyProfile.__typename ===
                "ModifyProfileResponseSuccess"
              ) {
                resolve(data.modifyProfile);
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
      triggerRefetch();
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runMutation };
};
