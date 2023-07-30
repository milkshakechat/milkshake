import { ErrorLine, ErrorLines } from "@/api/graphql/error-line";
import { useWindowSize } from "@/api/utils/screen";
import StyleConfigPanel from "@/components/StyleConfigPanel/StyleConfigPanel";
import {
  useDemoMutation,
  useDemoPing,
  useDemoQuery,
  useDemoSubscription,
} from "@/hooks/useTemplateGQL";
import { useUserState } from "@/state/user.state";
import { Button, Input, Modal, message, theme } from "antd";
import { useIntl } from "react-intl";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PP from "@/i18n/PlaceholderPrint";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation";
import {
  CardElement,
  CardNumberElement,
  CardMonthElement,
  CardYearElement,
  CardCvvElement,
  useRecurly,
} from "@recurly/react-recurly";

// import {
//   CardElement,
//   Elements,
//   useStripe,
//   useElements,
//   LinkAuthenticationElement,
// } from "@stripe/react-stripe-js";
// import {
//   useStripeAttachCard,
//   useStripeHook,
//   useStripeSetupIntent,
// } from "@/hooks/useStripeHook";
import { FormEvent, useEffect, useRef, useState } from "react";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import { Spacer } from "../AppLayout/AppLayout";
import { paymentCardsVisual } from "@milkshakechat/helpers";
import { useRecurlyAttachCard } from "@/hooks/useStripeHook";

interface AddPaymentMethodProps {
  isOpen: boolean;
  toggleOpen: (bool: boolean) => void;
}
export const AddPaymentMethodModalRecurly = ({
  isOpen,
  toggleOpen,
}: AddPaymentMethodProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const { token } = theme.useToken();

  if (!selfUser) {
    return <LoadingAnimation width="100%" height="100%" type="cookie" />;
  }

  return (
    <Modal
      open={isOpen}
      title={
        <$Horizontal spacing={3} justifyContent="flex-start">
          <span>Add Credit Card</span>
          <img src={paymentCardsVisual} style={{ maxWidth: "100px" }} />
        </$Horizontal>
      }
      onCancel={() => toggleOpen(false)}
      footer={null}
    >
      <Spacer />
      <AddPaymentPanel toggleOpen={toggleOpen} />
    </Modal>
  );
};
export default AddPaymentMethodModalRecurly;

interface AddPaymentPanelProps {
  toggleOpen: (bool: boolean) => void;
}
const AddPaymentPanel = ({ toggleOpen }: AddPaymentPanelProps) => {
  const elements = window.recurly.Elements();
  const cardElement = elements.CardElement();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const selfUser = useUserState((state) => state.user);
  const [email, setEmail] = useState(selfUser?.email || "");
  const [initializing, setInitializing] = useState(true);
  const { screen, isMobile } = useWindowSize();

  const formRef = useRef<HTMLFormElement>(null);
  const recurly = useRecurly();

  useEffect(() => {
    setTimeout(() => {
      setInitializing(false);
    }, 1000);
  }, []);

  const { runMutation: runAttachCardMutation } = useRecurlyAttachCard();

  if (!selfUser || initializing) {
    return <LoadingAnimation width="100%" height="60vh" type="cookie" />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (formRef.current) {
      setIsLoading(true);
      recurly.token(formRef.current, async (err, token) => {
        if (err) {
          // handle error
          console.log(err);
          setErrors((errors) => [err.message as ErrorLine]);
        } else {
          // save the token.id, and submit it to the Recurly API from your server

          console.log(`got the recurly token`, token);
          await runAttachCardMutation({
            paymentMethodID: token.id,
            email,
          });
          setIsLoading(false);
          toggleOpen(false);
          message.success("Successfully added payment method");
        }
      });
    }

    // const result = await stripe.confirmCardSetup(clientSecret, {
    //   payment_method: {
    //     card: paymentElement,
    //   },
    // });
    // console.log(`result`, result);
    // if (result.error) {
    //   setErrors((errors) => [result.error.message as ErrorLine]);
    // } else if (result.setupIntent && result.setupIntent.payment_method) {
    //   await runAttachCardMutation({
    //     paymentMethodID: result.setupIntent.payment_method as string,
    //     email,
    //   });
    //   setIsLoading(false);
    //   toggleOpen(false);
    //   message.success("Successfully added payment method");
    // }
  };
  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <style>
        {`
        .recurly-element-number {
          width: 100%
        }
        .recurly-element-month {
          width: 100%
        }
        .recurly-element-year {
          width: 100%
        }
        .recurly-element-cvv {
          width: 100%
        }
        `}
      </style>
      <$Vertical spacing={2} justifyContent="center" alignItems="stretch">
        <$Vertical
          spacing={2}
          alignItems="stretch"
          style={{
            minWidth: "100%",
            maxWidth: isMobile ? "none" : "400px",
          }}
        >
          <$Vertical style={{ flex: 1 }}>
            <label>Card Number</label>
            <CardNumberElement />
          </$Vertical>
          <$Horizontal spacing={1} justifyContent="flex-start">
            <$Vertical>
              <label>Month</label>
              <CardMonthElement />
            </$Vertical>
            <$Vertical>
              <label>Year</label>
              <CardYearElement />
            </$Vertical>
            <$Vertical>
              <label>CVV</label>
              <CardCvvElement />
            </$Vertical>
          </$Horizontal>
        </$Vertical>
        <$Horizontal spacing={2}>
          <$Vertical spacing={1} style={{ flex: 1 }}>
            <label>First Name</label>
            <Input
              type="text"
              data-recurly="first_name"
              placeholder="First name"
            />
          </$Vertical>
          <$Vertical spacing={1} style={{ flex: 1 }}>
            <label>Last Name</label>
            <Input
              type="text"
              data-recurly="last_name"
              placeholder="Last name"
            />
          </$Vertical>
          <$Vertical spacing={1} style={{ flex: 1 }}>
            <label>Postal Code</label>
            <Input
              type="text"
              data-recurly="postal_code"
              placeholder="Postal Code"
            />
          </$Vertical>
        </$Horizontal>
        {selfUser.email && (
          <$Vertical spacing={1}>
            <label>Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </$Vertical>
        )}
        <Spacer />
        <ErrorLines errors={errors} />
        <$Horizontal justifyContent="flex-start" spacing={2} width="100%">
          <Button key="back" onClick={() => toggleOpen(false)}>
            Cancel
          </Button>
          <Button
            loading={isLoading}
            key="save"
            type="primary"
            disabled={!email}
            htmlType="submit"
          >
            Save & Continue
          </Button>
        </$Horizontal>
      </$Vertical>
    </form>
  );
};
