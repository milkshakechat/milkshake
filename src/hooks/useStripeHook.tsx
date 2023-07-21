import { useEffect, useRef, useState } from "react";
import gql from "graphql-tag";
import {
  CreateSetupIntentResponseSuccess,
  Mutation,
  SavePaymentMethodInput,
  SavePaymentMethodResponseSuccess,
} from "@/api/graphql/types";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import { GraphQLError } from "graphql";
import { ErrorLine } from "@/api/graphql/error-line";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import config from "@/config.env";
import { useUserState } from "@/state/user.state";
import { StripePaymentMethodID } from "@milkshakechat/helpers";

export const useStripeHook = () => {
  const [stripePromise, setStripePromise] = useState<Stripe | null>(null);
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [loading, setLoading] = useState(false);

  const initStripe = async () => {
    console.log(`init stripe...`);
    const _stripePromise = await loadStripe(config.STRIPE.publishableKey);
    console.log(`_stripePromise`, _stripePromise);
    setStripePromise(_stripePromise);
  };

  return { initStripe, stripePromise };
};

export const useStripeSetupIntent = () => {
  const [data, setData] = useState<CreateSetupIntentResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useGraphqlClient();

  const runMutation = async () => {
    setLoading(true);
    try {
      const CREATE_SETUP_INTENT = gql`
        mutation CreateSetupIntent {
          createSetupIntent {
            __typename
            ... on CreateSetupIntentResponseSuccess {
              clientSecret
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<CreateSetupIntentResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "createSetupIntent">>({
              mutation: CREATE_SETUP_INTENT,
            })
            .then(({ data }) => {
              if (
                data?.createSetupIntent.__typename ===
                "CreateSetupIntentResponseSuccess"
              ) {
                resolve(data.createSetupIntent);
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

export const useStripeAttachCard = () => {
  const [data, setData] = useState<SavePaymentMethodResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useGraphqlClient();
  const updateDefaultPaymentMethod = useUserState(
    (state) => state.updateDefaultPaymentMethod
  );

  const runMutation = async (args: SavePaymentMethodInput) => {
    setLoading(true);
    try {
      const SAVE_PAYMENT_METHOD = gql`
        mutation SavePaymentMethod($input: SavePaymentMethodInput!) {
          savePaymentMethod(input: $input) {
            __typename
            ... on SavePaymentMethodResponseSuccess {
              paymentMethodID
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<SavePaymentMethodResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "savePaymentMethod">>({
              mutation: SAVE_PAYMENT_METHOD,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.savePaymentMethod.__typename ===
                "SavePaymentMethodResponseSuccess"
              ) {
                resolve(data.savePaymentMethod);
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
      updateDefaultPaymentMethod(
        result.paymentMethodID as StripePaymentMethodID
      );
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return { data, errors, loading, runMutation };
};
