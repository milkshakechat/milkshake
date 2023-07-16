import { useEffect, useRef, useState } from "react";
import gql from "graphql-tag";
import {
  DemoQueryQuery,
  DemoSubscriptionEvent,
  DemoSubscriptionSubscription,
  Ping,
  QueryDemoQueryArgs,
  Query,
  CheckMerchantStatusResponseSuccess,
  RequestMerchantOnboardingResponseSuccess,
  CheckMerchantStatusInput,
  Mutation,
  RequestMerchantOnboardingResponse,
} from "@/api/graphql/types";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import { GraphQLError } from "graphql";
import { ErrorLine } from "@/api/graphql/error-line";
import { ObservableSubscription } from "@apollo/client/core";

export const useCheckMerchantStatus = () => {
  const [data, setData] = useState<CheckMerchantStatusResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useGraphqlClient();

  const runQuery = async (args: CheckMerchantStatusInput) => {
    setLoading(true);
    try {
      const CHECK_MERCHANT_STATUS = gql`
        query CheckMerchantStatus($input: CheckMerchantStatusInput!) {
          checkMerchantStatus(input: $input) {
            __typename
            ... on CheckMerchantStatusResponseSuccess {
              summary {
                userID
                tradingWallet
                escrowWallet
                name
                email
                hasMerchantPrivilege
                stripeMerchantID
                stripePortalUrl
                anythingDue
                anythingErrors
                capabilities {
                  card_payments
                  transfers
                  charges_enabled
                  payouts_enabled
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
      const result = await new Promise<CheckMerchantStatusResponseSuccess>(
        async (resolve, reject) => {
          client
            .query<{ checkMerchantStatus: Query["checkMerchantStatus"] }>({
              query: CHECK_MERCHANT_STATUS,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data.checkMerchantStatus.__typename ===
                "CheckMerchantStatusResponseSuccess"
              ) {
                resolve(data.checkMerchantStatus);
              }
            })
            .catch((graphQLError: Error) => {
              if (graphQLError) {
                setErrors((errors) => [...errors, graphQLError.message]);
                setLoading(false);
                reject();
              }
            });
        }
      );
      setData(result);
      setLoading(false);
      return result.summary;
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return { data, errors, loading, runQuery };
};

export const useRequestMerchantOnboarding = () => {
  const [data, setData] = useState<RequestMerchantOnboardingResponseSuccess>();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const runMutation = async () => {
    setLoading(true);
    try {
      const REQUEST_MERCHANT_ONBOARDING = gql`
        mutation RequestMerchantOnboarding {
          requestMerchantOnboarding {
            __typename
            ... on RequestMerchantOnboardingResponseSuccess {
              registrationUrl
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result =
        await new Promise<RequestMerchantOnboardingResponseSuccess>(
          (resolve, reject) => {
            client
              .mutate<{
                requestMerchantOnboarding: RequestMerchantOnboardingResponse;
              }>({
                mutation: REQUEST_MERCHANT_ONBOARDING,
              })
              .then(({ data }) => {
                if (
                  data?.requestMerchantOnboarding.__typename ===
                  "RequestMerchantOnboardingResponseSuccess"
                ) {
                  resolve(data.requestMerchantOnboarding);
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
    }
  };

  return { data, errors, loading, runMutation };
};
