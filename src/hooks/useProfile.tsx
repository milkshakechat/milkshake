import { ErrorLine } from "@/api/graphql/error-line";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import gql from "graphql-tag";
import { useState } from "react";
import { print } from "graphql/language/printer";
import { GraphQLError } from "graphql";
import {
  GetMyProfileQuery,
  GetMyProfileResponse,
  GetMyProfileResponseSuccess,
} from "@/api/graphql/types";
import { useUserState } from "@/state/user.state";

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
          client.subscribe(
            {
              query: print(GET_MY_PROFILE),
            },
            {
              next: ({
                data,
                errors: graphQLErrors,
              }: {
                data: GetMyProfileQuery;
                errors: readonly GraphQLError[];
              }) => {
                if (graphQLErrors && graphQLErrors.length > 0) {
                  setErrors(graphQLErrors.map((e) => e.message));
                  client.dispose();
                }
                if (
                  data.getMyProfile.__typename === "GetMyProfileResponseSuccess"
                ) {
                  resolve(data.getMyProfile);
                  setGQLUser(data.getMyProfile.user);
                }
              },
              error: reject,
              complete: () => {},
            }
          );
        }
      );
      setData(result);
    } catch (e) {
      console.log(e);
      setErrors([...errors, ((e as any) || {}).message]);
    }
  };

  return { data, errors, runQuery };
};
