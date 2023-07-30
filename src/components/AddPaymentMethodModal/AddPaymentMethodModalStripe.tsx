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
  Elements,
  useStripe,
  useElements,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import {
  useStripeAttachCard,
  useStripeHook,
  useStripeSetupIntent,
} from "@/hooks/useStripeHook";
import { useEffect, useState } from "react";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";

interface AddPaymentMethodProps {
  isOpen: boolean;
  toggleOpen: (bool: boolean) => void;
}
export const AddPaymentMethodModalStripe = ({
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
      title="Add Credit Card"
      onCancel={() => toggleOpen(false)}
      footer={null}
    >
      <AddPaymentPanel toggleOpen={toggleOpen} />
    </Modal>
  );
};
export default AddPaymentMethodModalStripe;

interface AddPaymentPanelProps {
  toggleOpen: (bool: boolean) => void;
}
const AddPaymentPanel = ({ toggleOpen }: AddPaymentPanelProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const selfUser = useUserState((state) => state.user);
  const [email, setEmail] = useState(selfUser?.email || "");
  const {
    data: createSetupIntentData,
    runMutation: runCreateSetupIntentMutation,
  } = useStripeSetupIntent();

  const { runMutation: runAttachCardMutation } = useStripeAttachCard();

  useEffect(() => {
    runCreateSetupIntentMutation();
  }, []);

  if (!createSetupIntentData || !selfUser) {
    return <LoadingAnimation width="100%" height="60vh" type="cookie" />;
  }

  const { clientSecret } = createSetupIntentData;

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    const paymentElement = elements.getElement(CardElement);
    if (!paymentElement) {
      return;
    }
    setIsLoading(true);

    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: paymentElement,
      },
    });

    console.log(`result`, result);
    if (result.error) {
      setErrors((errors) => [result.error.message as ErrorLine]);
    } else if (result.setupIntent && result.setupIntent.payment_method) {
      await runAttachCardMutation({
        paymentMethodID: result.setupIntent.payment_method as string,
        email,
      });
      setIsLoading(false);
      toggleOpen(false);
      message.success("Successfully added payment method");
    }
  };
  return (
    <section>
      <$Vertical spacing={3} justifyContent="center">
        <div style={{ padding: "30px 0px" }}>
          <CardElement />
        </div>
        {!selfUser.email && (
          <$Vertical spacing={1}>
            <label>Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </$Vertical>
        )}
        <ErrorLines errors={errors} />
        <$Horizontal justifyContent="flex-end" spacing={2} width="100%">
          <Button key="back" onClick={() => toggleOpen(false)}>
            Cancel
          </Button>
          <Button
            loading={isLoading}
            key="save"
            type="primary"
            disabled={!email}
            onClick={() => handleSubmit()}
          >
            Save
          </Button>
        </$Horizontal>
      </$Vertical>
    </section>
  );
};
