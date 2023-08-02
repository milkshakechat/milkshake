import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { Affix, Avatar, Button, Divider, Input, List, theme } from "antd";
import ChatPreview, { ChatPreviewProps } from "../ChatPreview/ChatPreview";
import { UserID } from "@milkshakechat/helpers";
import { useState } from "react";
import { SearchOutlined, PlusSquareFilled } from "@ant-design/icons";
import { Spacer } from "@/components/AppLayout/AppLayout";
import { useWindowSize } from "@/api/utils/screen";
import { ChatRoomFE } from "@/state/chats.state";
import { NavLink } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRealtimeChatRooms } from "@/hooks/useChat";

interface ChatsListProps {
  chatPreviews: ChatRoomFE[];
}
const ChatsList = ({ chatPreviews }: ChatsListProps) => {
  const intl = useIntl();

  const [searchString, setSearchString] = useState("");
  const { screen, isMobile } = useWindowSize();

  const { DEFAULT_BATCH_SIZE_CHATROOMS, paginateChatRooms, isLoading } =
    useRealtimeChatRooms();

  const _txt_searchChats_272 = intl.formatMessage({
    id: "_txt_searchChats_272.___ChatsList",
    defaultMessage: "Search Chats",
  });
  const _txt_newChat_8ae = intl.formatMessage({
    id: "_txt_newChat_8ae.___ChatsList",
    defaultMessage: "New Chat",
  });
  const { token } = theme.useToken();
  const _txt_endOfList_fbd = intl.formatMessage({
    id: "_txt_endOfList_fbd.___NotificationsPage",
    defaultMessage: "End of List",
  });
  const _txt_loadMore_b63 = intl.formatMessage({
    id: "_txt_loadMore_b63.___NotificationsPage",
    defaultMessage: "Load More",
  });
  return (
    <$Vertical>
      <Affix offsetTop={isMobile ? 100 : 100}>
        <$Horizontal>
          <Input
            placeholder={_txt_searchChats_272}
            allowClear
            onChange={(e) => setSearchString(e.target.value)}
            style={{ width: "100%" }}
            prefix={<SearchOutlined />}
            suffix={<></>}
          />
          <NavLink to="/app/friends">
            <Button
              icon={<PlusSquareFilled />}
              type="primary"
              style={{ marginLeft: "5px" }}
            >
              {_txt_newChat_8ae}
            </Button>
          </NavLink>
        </$Horizontal>
      </Affix>
      <Spacer height="10px" />
      <div id="scrollableDiv" style={{ overflow: "auto", height: "100%" }}>
        <InfiniteScroll
          dataLength={chatPreviews.length}
          next={paginateChatRooms}
          hasMore={!(chatPreviews.length < DEFAULT_BATCH_SIZE_CHATROOMS)}
          loader={
            <$Horizontal
              justifyContent="center"
              style={{
                textAlign: "center",
                width: "100%",
                padding: "20px",
              }}
            >
              <Button loading={isLoading} onClick={paginateChatRooms}>
                {_txt_loadMore_b63}
              </Button>
            </$Horizontal>
          }
          endMessage={
            <$Horizontal
              justifyContent="center"
              style={{
                textAlign: "center",
                width: "100%",
                padding: "20px",
              }}
            >
              <Divider plain>{_txt_endOfList_fbd}</Divider>
            </$Horizontal>
          }
          scrollableTarget="scrollableDiv"
        >
          {/* <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              color: token.colorBgContainerDisabled,
            }}
          > */}
          <List
            itemLayout="horizontal"
            dataSource={chatPreviews.filter((chat) => {
              return (
                chat.title.toLowerCase().indexOf(searchString.toLowerCase()) >
                -1
              );
            })}
            renderItem={(item, index) => {
              return <ChatPreview preview={item} />;
            }}
          />
          {/* </div> */}
        </InfiniteScroll>
      </div>
      <Spacer />
    </$Vertical>
  );
};

export default ChatsList;
