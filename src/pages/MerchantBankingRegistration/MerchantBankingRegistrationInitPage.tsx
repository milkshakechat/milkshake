import { ErrorLines } from "@/api/graphql/error-line";
import { useWindowSize } from "@/api/utils/screen";
import StyleConfigPanel from "@/components/StyleConfigPanel/StyleConfigPanel";
import {
  useDemoMutation,
  useDemoPing,
  useDemoQuery,
  useDemoSubscription,
} from "@/hooks/useTemplateGQL";
import { useUserState } from "@/state/user.state";
import { Button, Input, Result, Steps, Tag, message, theme } from "antd";
import { useIntl } from "react-intl";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PP from "@/i18n/PlaceholderPrint";
import {
  useCheckMerchantStatus,
  useRequestMerchantOnboarding,
} from "@/hooks/useMerchant";
import { useEffect, useState } from "react";
import { AppLayoutPadding, Spacer } from "@/components/AppLayout/AppLayout";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import LogoText from "@/components/LogoText/LogoText";
import {
  InfoCircleOutlined,
  UserOutlined,
  SolutionOutlined,
  LoadingOutlined,
  SmileOutlined,
  BankOutlined,
} from "@ant-design/icons";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { GENERAL_SUPPORT_EMAIL, Username } from "@milkshakechat/helpers";

export const MerchantBankingRegistrationInitPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const { token } = theme.useToken();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: checkMerchantStatusData,
    runQuery: runCheckMerchantStatusQuery,
  } = useCheckMerchantStatus();

  const {
    data: requestMerchantOnboardingData,
    loading: requestMerchantOnboardingLoading,
    runMutation: runRequestMerchantOnboardingMutation,
  } = useRequestMerchantOnboarding();

  useEffect(() => {
    runCheckMerchantStatusQuery({});
  }, []);

  const lacksMerchantPrivilege =
    checkMerchantStatusData &&
    !checkMerchantStatusData.summary.hasMerchantPrivilege;
  const hasExistingStripeAccount =
    checkMerchantStatusData && checkMerchantStatusData.summary.stripeAccountID
      ? true
      : false;
  const registrationUrl =
    requestMerchantOnboardingData &&
    requestMerchantOnboardingData.registrationUrl;
  const refreshedRegistrationUrl =
    checkMerchantStatusData && checkMerchantStatusData.summary.stripePortalUrl;
  const activePendingMerchantOnboarding =
    checkMerchantStatusData &&
    !lacksMerchantPrivilege &&
    checkMerchantStatusData.summary.stripeAccountID &&
    !checkMerchantStatusData.summary.capabilities.transfers &&
    (checkMerchantStatusData.summary.anythingDue ||
      checkMerchantStatusData.summary.anythingErrors);
  const successfulMerchantRegistration =
    checkMerchantStatusData &&
    !lacksMerchantPrivilege &&
    checkMerchantStatusData.summary.stripeAccountID &&
    checkMerchantStatusData.summary.capabilities.transfers === "active" &&
    checkMerchantStatusData.summary.capabilities.payouts_enabled &&
    !checkMerchantStatusData.summary.anythingErrors;

  useEffect(() => {
    if (lacksMerchantPrivilege) {
      setCurrentStep(0);
    } else if (activePendingMerchantOnboarding) {
      setCurrentStep(1);
    } else if (successfulMerchantRegistration) {
      setCurrentStep(3);
    }
  }, [lacksMerchantPrivilege, activePendingMerchantOnboarding]);

  if (!selfUser || requestMerchantOnboardingLoading) {
    return <LoadingAnimation width="100%" height="100%" type="cookie" />;
  }

  console.log(`checkMerchantStatusData`, checkMerchantStatusData);
  console.log(`requestMerchantOnboardingData`, requestMerchantOnboardingData);

  console.log(
    `activePendingMerchantOnboarding`,
    activePendingMerchantOnboarding
  );

  const getStartedKYC = async () => {
    setIsLoading(true);
    setCurrentStep(1);
    await runRequestMerchantOnboardingMutation();
    setIsLoading(false);
  };

  const refetchRegistrationLink = async () => {
    setIsLoading(true);
    if (refreshedRegistrationUrl) {
      window.open(refreshedRegistrationUrl, "_blank");
      setIsLoading(false);
      return;
    }
    const registrationLink = await runCheckMerchantStatusQuery({
      getControlPanel: true,
    });
    // open link in new tab
    if (registrationLink && registrationLink.stripePortalUrl) {
      window.open(registrationLink.stripePortalUrl, "_blank");
      setIsLoading(false);
    }
  };

  return (
    <AppLayoutPadding
      maxWidths={{
        mobile: "100%",
        desktop: "100%",
      }}
      align="center"
    >
      <>
        <UserBadgeHeader
          user={{
            id: selfUser.id,
            avatar: selfUser.avatar,
            displayName: selfUser.displayName,
            username: selfUser.username as Username,
          }}
          glowColor={token.colorPrimaryText}
          backButton={true}
          backButtonAction={() => {
            navigate({
              pathname: "/app/profile/settings",
            });
          }}
          actionButton={
            <Button icon={<InfoCircleOutlined />}>
              <PP>Help</PP>
            </Button>
          }
        />
        <Spacer />
        <Steps
          current={currentStep}
          items={[
            {
              title: "Request Privileges",
              icon: <UserOutlined />,
            },
            {
              title: "Submit Documents",
              icon: <SolutionOutlined />,
            },
            {
              title: "Bank Approval",
              icon: <BankOutlined /> || <LoadingOutlined />,
            },
            {
              title: "Done",
              icon: <SmileOutlined />,
            },
          ]}
        />
        {!isMobile && <Spacer height="100px" />}
        {lacksMerchantPrivilege && currentStep === 0 && (
          <Result
            status="warning"
            title="You do not have merchant privileges"
            subTitle={`Email us at ${GENERAL_SUPPORT_EMAIL} to request access to merchant privileges.`}
            extra={
              <a href={`mailto:${GENERAL_SUPPORT_EMAIL}`}>
                <Button key="console">Request Access</Button>
              </a>
            }
          />
        )}
        {!lacksMerchantPrivilege &&
          !hasExistingStripeAccount &&
          currentStep === 0 && (
            <Result
              status="success"
              title="You are approved for Merchant Privileges"
              subTitle={`Connect your bank account to start receiving payments. Payment processing is handled by Stripe.`}
              extra={[
                <Button onClick={getStartedKYC} type="primary" key="console">
                  Get Started
                </Button>,
                <Button key="info">View Agreement</Button>,
              ]}
            />
          )}
        {registrationUrl && currentStep === 1 && (
          <Result
            icon={<BankOutlined />}
            title="You are approved for Merchant Privileges"
            subTitle={`Connect your bank account to start receiving payments. Payment processing is handled by Stripe.`}
            extra={[
              registrationUrl ? (
                <Button
                  loading={isLoading}
                  onClick={() => {
                    window.open(registrationUrl, "_blank");
                  }}
                  type="primary"
                  key="console"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  loading={isLoading}
                  onClick={getStartedKYC}
                  type="primary"
                  key="console"
                >
                  Get Started
                </Button>
              ),
              <Button key="info">View Agreement</Button>,
            ]}
          />
        )}
        {activePendingMerchantOnboarding && currentStep === 1 && (
          <$Vertical>
            <Result
              icon={<SolutionOutlined />}
              title="You still have Documents to Submit"
              subTitle={`Complete your bank registration to start receiving payments. Payment processing is handled by Stripe.`}
              extra={[
                <Button
                  onClick={refetchRegistrationLink}
                  loading={isLoading}
                  type="primary"
                  key="console"
                >
                  Continue
                </Button>,
                <Button key="info">View Agreement</Button>,
              ]}
            />
          </$Vertical>
        )}
        {successfulMerchantRegistration && currentStep === 3 && (
          <$Vertical>
            <Result
              status="success"
              title="Successfully registered for Merchant Payouts"
              subTitle={`Your bank account linked will receive the payouts. Payment processing is handled by Stripe.`}
              extra={[
                <Button
                  onClick={refetchRegistrationLink}
                  loading={isLoading}
                  type="primary"
                  key="console"
                >
                  Open Stripe
                </Button>,
                <Button key="info">View Agreement</Button>,
              ]}
            />
          </$Vertical>
        )}
        {registrationUrl || refreshedRegistrationUrl ? (
          <$Horizontal
            justifyContent="center"
            style={{ width: "100%", flex: 1 }}
          >
            <$Vertical
              spacing={2}
              alignItems="center"
              style={{ maxWidth: "800px" }}
            >
              <span style={{ color: token.colorTextDescription }}>
                {successfulMerchantRegistration
                  ? `Visit the Stripe Portal to manage your banking`
                  : `Visit the Stripe Portal to continue registration`}
              </span>
              <$Horizontal spacing={1}>
                <Button
                  size="small"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      registrationUrl || refreshedRegistrationUrl || ""
                    );
                    message.success("Copied link to Stripe Portal");
                  }}
                  style={{ color: token.colorTextDescription }}
                >
                  Copy
                </Button>
                <Input
                  size="small"
                  value={registrationUrl || refreshedRegistrationUrl || ""}
                ></Input>
              </$Horizontal>
            </$Vertical>
          </$Horizontal>
        ) : null}
      </>
    </AppLayoutPadding>
  );
};
export default MerchantBankingRegistrationInitPage;
