import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import styled from "styled-components";
import { Avatar } from "antd";
import StoriesHeader from "@/components/UserPageSkeleton/StoriesHeader/StoriesHeader";
import ChatPreviewRow from "@/components/ChatsList/ChatPreview/ChatPreview";
import ChatsList from "@/components/ChatsList/ChatsList/ChatsList";
import { Spacer } from "@/components/AppLayout/AppLayout";

const ConversationsPage = () => {
  const intl = useIntl();
  return (
    <$Vertical style={{ padding: "0px 10px" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <StoriesHeader />
      </div>
      <Spacer />
      <ChatsList />
    </$Vertical>
  );
};

export default ConversationsPage;
