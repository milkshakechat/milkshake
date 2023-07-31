import { ErrorLines } from "@/api/graphql/error-line";
import { FriendshipAction, Maybe } from "@/api/graphql/types";
import {
  AppLayoutPadding,
  LayoutInteriorHeader,
  Spacer,
} from "@/components/AppLayout/AppLayout";
import StyleConfigPanel from "@/components/StyleConfigPanel/StyleConfigPanel";
import {
  useManageFriendship,
  useSearchByUsername,
  useSendFriendRequest,
  useViewPublicProfile,
} from "@/hooks/useFriendship";

import PP from "@/i18n/PlaceholderPrint";
import {
  Avatar,
  Badge,
  Dropdown,
  Input,
  List,
  Modal,
  QRCode,
  Checkbox,
  Space,
  Spin,
  Switch,
  Tabs,
  message,
  theme,
  Affix,
  Button,
  Result,
} from "antd";
import { useEffect, useState } from "react";
import {
  UserOutlined,
  UserAddOutlined,
  SearchOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { useUserState } from "@/state/user.state";
import {
  QRCODE_LOGO,
  UserID,
  FriendshipStatus,
  Friendship_Firestore,
  Username,
} from "@milkshakechat/helpers";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import {
  NavLink,
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ScreenSize, useWindowSize } from "@/api/utils/screen";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { cid } from "./i18n/types.i18n.ContactsPage";
import { useIntl } from "react-intl";

const sortStatusPriority: Record<FriendshipStatus, number> = {
  [FriendshipStatus.ACQUAINTANCE]: 0,
  [FriendshipStatus.GOT_REQUEST]: 1,
  [FriendshipStatus.SENT_REQUEST]: 2,
  [FriendshipStatus.DECLINED]: 3,
  [FriendshipStatus.BLOCKED]: 4,
  [FriendshipStatus.NONE]: 5,
  [FriendshipStatus.ACCEPTED]: 6,
};

export const ContactsPage = () => {
  enum ValidTabs {
    Friends = "friends",
    Requests = "requests",
  }
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const initialTab =
    tab && Object.values(ValidTabs).includes(tab as ValidTabs)
      ? tab
      : ValidTabs.Friends;
  const location = useLocation();
  const { screen, isMobile } = useWindowSize();

  const [searchPublicByUsernameString, setSearchPublicByUsernameString] =
    useState("");
  const [loadingSearchPublicByUsername, setLoadingSearchPublicByUsername] =
    useState(false);
  const user = useUserState((state) => state.user);
  const intl = useIntl();
  const { runMutation: runManageFriendship } = useManageFriendship();
  const [groupChatMode, setGroupChatMode] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<UserID[]>(
    []
  );
  const { token } = theme.useToken();
  const [searchString, setSearchString] = useState("");
  const [optimisticAccepted, setOptimisticAccepted] = useState<UserID[]>([]);
  const [optimisticDisabled, setOptimisticDisabled] = useState<UserID[]>([]);
  const {
    searchByExactUsername,
    foundUser: foundUserByUsername,
    clearSearchResult,
  } = useSearchByUsername();
  const [targetOfDecline, setTargetOfDecline] =
    useState<Friendship_Firestore | null>(null);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [targetOfBlock, setTargetOfBlock] =
    useState<Friendship_Firestore | null>(null);
  const [targetOfUnblock, setTargetOfUnblock] =
    useState<Friendship_Firestore | null>(null);
  const [targetOfRemoval, setTargetOfRemoval] =
    useState<Friendship_Firestore | null>(null);
  const [targetOfCancel, setTargetOfCancel] =
    useState<Friendship_Firestore | null>(null);
  const [loadingManageFriendships, setLoadingManageFriendships] = useState<
    UserID[]
  >([]);
  const {
    data: sendFriendRequestMutationData,
    errors: sendFriendRequestErrors,
    runMutation: sendFriendRequestMutation,
  } = useSendFriendRequest();
  const friendships = useUserState((state) => state.friendships);

  const _txt_alertSentFriendRequest = intl.formatMessage({
    id: `alertSentFriendRequest.${cid}`,
    defaultMessage: "Sent a friend request",
  });
  const _txt_alertWaitingForAcceptance = intl.formatMessage({
    id: `alertWaitingForAcceptance.${cid}`,
    defaultMessage: "Waiting for acceptance",
  });
  const _txt_alertDeclinedRequest = intl.formatMessage({
    id: `alertDeclinedRequest.${cid}`,
    defaultMessage: "Declined request",
  });
  const _txt_alertBlockedUser = intl.formatMessage({
    id: `alertBlockedUser.${cid}`,
    defaultMessage: "Blocked user",
  });
  const _txt_labelNotFriends = intl.formatMessage({
    id: `labelNotFriends.${cid}`,
    defaultMessage: "Not Friends",
  });
  const _txt_labelFriendRequestSent = intl.formatMessage({
    id: `labelFriendRequestSent.${cid}`,
    defaultMessage: "Friend Request Sent",
  });
  const _txt_labelSearchContacts = intl.formatMessage({
    id: `labelSearchContacts.${cid}`,
    defaultMessage: "Search Contacts",
  });
  const _txt_labelFriends = intl.formatMessage({
    id: `labelFriends.${cid}`,
    defaultMessage: "Friends",
  });
  const _txt_btnCancel = intl.formatMessage({
    id: `btnCancel.${cid}`,
    defaultMessage: "Cancel",
  });
  const _txt_btnGroupChat = intl.formatMessage({
    id: `btnGroupChat.${cid}`,
    defaultMessage: "Group Chat",
  });
  const _txt_btnViewProfile = intl.formatMessage({
    id: `btnViewProfile.${cid}`,
    defaultMessage: "View Profile",
  });
  const _txt_btnRemove = intl.formatMessage({
    id: `btnRemove.${cid}`,
    defaultMessage: "Remove",
  });
  const _txt_btnBlock = intl.formatMessage({
    id: `btnBlock.${cid}`,
    defaultMessage: "Block",
  });
  const _txt_btnChat = intl.formatMessage({
    id: `btnChat.${cid}`,
    defaultMessage: "Chat",
  });
  const _txt_btnStartGroupChat = intl.formatMessage({
    id: `btnStartGroupChat.${cid}`,
    defaultMessage: "Start Group Chat",
  });
  const _txt_labelRequests = intl.formatMessage({
    id: `labelRequests.${cid}`,
    defaultMessage: "Requests",
  });
  const _txt_btnSendAgain = intl.formatMessage({
    id: `btnSendAgain.${cid}`,
    defaultMessage: "Send Again",
  });
  const _txt_btnUnblock = intl.formatMessage({
    id: `btnUnblock.${cid}`,
    defaultMessage: "Unblock",
  });
  const _txt_btnDecline = intl.formatMessage({
    id: `btnDecline.${cid}`,
    defaultMessage: "Decline",
  });
  const _txt_alertAcceptedRequest = intl.formatMessage({
    id: `alertAcceptedRequest.${cid}`,
    defaultMessage: "Accepted friend request",
  });
  const _txt_btnAccept = intl.formatMessage({
    id: `btnAccept.${cid}`,
    defaultMessage: "Accept",
  });
  const _txt_btnAddFriend = intl.formatMessage({
    id: `btnAddFriend.${cid}`,
    defaultMessage: "Add Friend",
  });
  const _txt_labelContacts = intl.formatMessage({
    id: `labelContacts.${cid}`,
    defaultMessage: "Contacts",
  });
  const _txt_btnBack = intl.formatMessage({
    id: `btnBack.${cid}`,
    defaultMessage: "Back",
  });
  const _txt_btnAdd = intl.formatMessage({
    id: `btnAdd.${cid}`,
    defaultMessage: "Add",
  });
  const _txt_alertDeclinedRequest2 = intl.formatMessage({
    id: `alertDeclinedRequest.${cid}`,
    defaultMessage: "Declined friend request",
  });
  const _txt_btnConfirmDecline = intl.formatMessage({
    id: `btnConfirmDecline.${cid}`,
    defaultMessage: "Yes, Decline",
  });
  const _txt_labelHighlightDecline = intl.formatMessage({
    id: `labelHighlightDecline.${cid}`,
    defaultMessage: "DECLINE",
  });
  const _txt_labelAreYouSure = intl.formatMessage({
    id: `labelAreYouSure.${cid}`,
    defaultMessage: "Are you sure you want to",
  });
  const _txt_labelThisFriendRequest = intl.formatMessage({
    id: `labelThisFriendRequest.${cid}`,
    defaultMessage: "this friend request?",
  });
  const _txt_alertRemovedFriends = intl.formatMessage({
    id: `alertRemovedFriends.${cid}`,
    defaultMessage: "Removed from friends",
  });
  const _txt_btnYesRemove = intl.formatMessage({
    id: `btnYesRemove.${cid}`,
    defaultMessage: "Yes, Remove",
  });
  const _txt_btnBoldRemove = intl.formatMessage({
    id: `btnBoldRemove.${cid}`,
    defaultMessage: "REMOVE",
  });
  const _txt_labelRemoveFriendExplain = intl.formatMessage({
    id: `labelRemoveFriendExplain.${cid}`,
    defaultMessage:
      "this friend? They will have to accept a new friend request if you want to chat.",
  });
  const _txt_btnYesBlock = intl.formatMessage({
    id: `btnYesBlock.${cid}`,
    defaultMessage: "Yes, Block",
  });
  const _txt_btnBoldBlock = intl.formatMessage({
    id: `btnBoldBlock.${cid}`,
    defaultMessage: "BLOCK",
  });
  const _txt_labelRemoveFriendConfirmm = intl.formatMessage({
    id: `labelRemoveFriendConfirmm.${cid}`,
    defaultMessage:
      "this contact? They will not be able to send you messages or friend requests.",
  });
  const _txt_btnYesUnblock = intl.formatMessage({
    id: `btnYesUnblock.${cid}`,
    defaultMessage: "Yes, Unblock",
  });
  const _txt_labelBoldUnblock = intl.formatMessage({
    id: `labelBoldUnblock.${cid}`,
    defaultMessage: "UNBLOCK",
  });
  const _txt_labelConfirmUnblockK = intl.formatMessage({
    id: `labelConfirmUnblockK.${cid}`,
    defaultMessage: "this contact? They will be able to see you exist.",
  });
  const _txt_btnNo = intl.formatMessage({
    id: `btnNo.${cid}`,
    defaultMessage: "No",
  });
  const _txt_alertCancelledRequest = intl.formatMessage({
    id: `alertCancelledRequest.${cid}`,
    defaultMessage: "Cancelled friend request",
  });
  const _txt_btnYesCancel = intl.formatMessage({
    id: `btnYesCancel.${cid}`,
    defaultMessage: "Yes, Cancel",
  });
  const _txt_labelBoldCancel = intl.formatMessage({
    id: `labelBoldCancel.${cid}`,
    defaultMessage: "CANCEL",
  });
  const _txt_labelConfirmCancelExplain = intl.formatMessage({
    id: `labelConfirmCancelExplain.${cid}`,
    defaultMessage: "your friend request? You can send another one later.",
  });
  const _txt_btnSearch = intl.formatMessage({
    id: `btnSearch.${cid}`,
    defaultMessage: "Search",
  });
  const _txt_btnSearchLabel = intl.formatMessage({
    id: `btnSearchLabel.${cid}`,
    defaultMessage: "Exact Username Search",
  });
  const _txt_labelQRCode = intl.formatMessage({
    id: `labelQRCode.${cid}`,
    defaultMessage: "QR Code",
  });

  const _txt_btnVisitProfile = intl.formatMessage({
    id: `btnVisitProfile.${cid}`,
    defaultMessage: "Visit Profile",
  });
  const _txt_labelSearchUsers = intl.formatMessage({
    id: `labelSearchUsers.${cid}`,
    defaultMessage: "Search Users",
  });
  const _txt_alertMustExactMatch = intl.formatMessage({
    id: `alertMustExactMatch.${cid}`,
    defaultMessage: "Must be an exact username match",
  });
  const _txt_alertCopieidProfileLink = intl.formatMessage({
    id: `alertCopieidProfileLink.${cid}`,
    defaultMessage: "Copied profile link!",
  });
  const _txt_btnCopyURL = intl.formatMessage({
    id: `btnCopyURL.${cid}`,
    defaultMessage: "Copy URL",
  });
  const _txt_btnClose = intl.formatMessage({
    id: `btnClose.${cid}`,
    defaultMessage: "Close",
  });

  const subtitle = (status: FriendshipStatus) => {
    switch (status) {
      case FriendshipStatus.ACCEPTED:
        return "";
      case FriendshipStatus.GOT_REQUEST:
        return _txt_alertSentFriendRequest;
      case FriendshipStatus.SENT_REQUEST:
        return _txt_alertWaitingForAcceptance;
      case FriendshipStatus.DECLINED:
        return _txt_alertDeclinedRequest;
      case FriendshipStatus.BLOCKED:
        return _txt_alertBlockedUser;
      default:
        return _txt_labelNotFriends;
    }
  };

  const addFriend = async (userID: UserID) => {
    setLoadingManageFriendships((prev) => [...prev, userID]);
    await sendFriendRequestMutation({
      note: "",
      recipientID: userID,
    });
    setLoadingManageFriendships((prev) => prev.filter((id) => id !== userID));
    message.info(_txt_labelFriendRequestSent);
  };

  const renderRow = (fr: Friendship_Firestore, actions: React.ReactNode[]) => {
    // return <span>{fr.friendID}</span>;
    return (
      <List.Item
        actions={actions.map((act) => {
          if (groupChatMode) {
            return null;
          }
          return <div onClick={(e) => e.preventDefault()}>{act}</div>;
        })}
        style={{
          backgroundColor: optimisticDisabled.includes(fr.friendID)
            ? token.colorErrorBg
            : undefined,
        }}
      >
        <List.Item.Meta
          avatar={
            <$Horizontal
              alignItems="center"
              justifyContent="flex-start"
              spacing={2}
              onClick={() => {
                if (!groupChatMode) {
                  navigate({
                    pathname: "/user",
                    search: createSearchParams({
                      userID: fr.friendID,
                    }).toString(),
                  });
                } else {
                  if (selectedParticipants.includes(fr.friendID)) {
                    setSelectedParticipants((prev) =>
                      prev.filter((id) => id !== fr.friendID)
                    );
                  } else {
                    setSelectedParticipants((prev) => [...prev, fr.friendID]);
                  }
                }
              }}
            >
              {groupChatMode && (
                <Checkbox
                  onChange={(v) => {
                    const c = v.target.checked;
                    if (c) {
                      setSelectedParticipants((prev) => [...prev, fr.friendID]);
                    } else {
                      setSelectedParticipants((prev) =>
                        prev.filter((id) => id !== fr.friendID)
                      );
                    }
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  checked={selectedParticipants.includes(fr.friendID)}
                  style={{
                    transform: "scale(2)",
                    marginLeft: "10px",
                    marginRight: "20px",
                  }}
                />
              )}
              <Avatar
                style={{ backgroundColor: token.colorPrimaryText }}
                icon={<UserOutlined />}
                src={fr.avatar}
                size="large"
              />
            </$Horizontal>
          }
          title={
            <div
              onClick={() => {
                if (!groupChatMode) {
                  navigate({
                    pathname: "/user",
                    search: createSearchParams({
                      userID: fr.friendID,
                    }).toString(),
                  });
                } else {
                  if (selectedParticipants.includes(fr.friendID)) {
                    setSelectedParticipants((prev) =>
                      prev.filter((id) => id !== fr.friendID)
                    );
                  } else {
                    setSelectedParticipants((prev) => [...prev, fr.friendID]);
                  }
                }
              }}
            >
              <PP>{fr.friendNickname || `@${fr.username}`}</PP>
            </div>
          }
          description={
            <span
              style={{
                textOverflow: "ellipsis",
              }}
            >
              {subtitle(fr.status)}
            </span>
          }
        />
      </List.Item>
    );
  };

  const goToChatPage = (participants: UserID[]) => {
    const searchString = createSearchParams({
      participants: encodeURIComponent(participants.join(",")),
    }).toString();

    navigate({
      pathname: "/app/chats/chat",
      search: searchString,
    });
  };

  if (!user) {
    return <LoadingAnimation width="100%" height="100%" type="cookie" />;
  }

  const renderContactsList = () => {
    const searchText = _txt_labelSearchContacts;
    const handleFilter = (fr: Friendship_Firestore) => {
      return (
        fr.friendNickname.toLowerCase().includes(searchString.toLowerCase()) ||
        fr.username?.toLowerCase().includes(searchString.toLowerCase()) ||
        fr.friendID?.toLowerCase().includes(searchString.toLowerCase())
      );
    };
    const tabs = [
      {
        key: ValidTabs.Friends,
        label: `${
          friendships.filter((fr) => fr.status === FriendshipStatus.ACCEPTED)
            .length
        } ${_txt_labelFriends}`,
        children: (
          <>
            <$Horizontal spacing={2}>
              <Input
                prefix={<SearchOutlined />}
                placeholder={searchText}
                allowClear
                onChange={(e) => setSearchString(e.target.value)}
                style={{ width: "100%", flex: 1 }}
              />
              <Button
                type="primary"
                onClick={() => {
                  if (groupChatMode) {
                    setSelectedParticipants([]);
                  }
                  setGroupChatMode(!groupChatMode);
                }}
                ghost
              >
                {groupChatMode ? _txt_btnCancel : _txt_btnGroupChat}
              </Button>
            </$Horizontal>
            <Spacer />
            <List
              className="contacts-list"
              itemLayout="horizontal"
              dataSource={friendships
                .filter((fr) => fr.status === FriendshipStatus.ACCEPTED)
                .filter(handleFilter)}
              renderItem={(item) => {
                return renderRow(item, [
                  <Dropdown.Button
                    menu={{
                      items: [
                        {
                          key: "view-profile",
                          label: (
                            <NavLink to={`/user?userID=${item.friendID}`}>
                              <Button type="ghost">
                                {_txt_btnViewProfile}
                              </Button>
                            </NavLink>
                          ),
                        },
                        {
                          key: "remove-friend",
                          label: (
                            <Button
                              loading={loadingManageFriendships.includes(
                                item.friendID
                              )}
                              onClick={() => setTargetOfRemoval(item)}
                              type="ghost"
                            >
                              {_txt_btnRemove}
                            </Button>
                          ),
                        },
                        {
                          key: "block-friend",
                          label: (
                            <Button
                              loading={loadingManageFriendships.includes(
                                item.friendID
                              )}
                              onClick={() => setTargetOfBlock(item)}
                              type="ghost"
                            >
                              {_txt_btnBlock}
                            </Button>
                          ),
                        },
                      ],
                    }}
                    disabled={optimisticDisabled.includes(item.friendID)}
                    onClick={() => {
                      if (user) {
                        goToChatPage([user.id, item.friendID]);
                      }
                    }}
                  >
                    {_txt_btnChat}
                  </Dropdown.Button>,
                ]);
              }}
              style={{ width: "100%" }}
            />
            {groupChatMode && (
              <Affix offsetBottom={20}>
                <div style={{ backgroundColor: token.colorBgBase }}>
                  <Button
                    type="primary"
                    size="large"
                    disabled={selectedParticipants.length < 2}
                    onClick={() => {
                      goToChatPage([...selectedParticipants, user.id]);
                    }}
                    style={{
                      fontWeight: "bold",
                      width: "100%",
                      marginTop: "20px",
                    }}
                  >
                    {_txt_btnStartGroupChat}
                  </Button>
                </div>
              </Affix>
            )}
          </>
        ),
      },
      {
        key: ValidTabs.Requests,
        label: (
          <$Horizontal spacing={2} alignItems="center">
            <span style={{ marginRight: "5px" }}>{_txt_labelRequests}</span>
            <Badge
              count={
                friendships.filter(
                  (fr) => fr.status === FriendshipStatus.GOT_REQUEST
                ).length
              }
            />
          </$Horizontal>
        ),
        children: (
          <>
            <Input.Search
              placeholder={searchText}
              value={searchString}
              allowClear
              onChange={(e) => setSearchString(e.target.value)}
              style={{ width: "100%" }}
            />
            <Spacer />
            <List
              className="contacts-requests-list"
              itemLayout="horizontal"
              dataSource={friendships
                .filter((fr) => fr.status !== FriendshipStatus.ACCEPTED)
                .filter(handleFilter)
                .sort(
                  (a, b) =>
                    sortStatusPriority[a.status || FriendshipStatus.NONE] -
                    sortStatusPriority[b.status || FriendshipStatus.NONE]
                )}
              renderItem={(item) => {
                const renderActions = () => {
                  if (optimisticAccepted.includes(item.friendID)) {
                    if (isMobile) {
                      return [
                        <Button
                          type="primary"
                          ghost
                          onClick={() => {
                            if (user) {
                              goToChatPage([user.id, item.friendID]);
                            }
                          }}
                          style={{ minWidth: "100px" }}
                        >
                          {_txt_btnChat}
                        </Button>,
                      ];
                    }
                    return [
                      <NavLink to={`/user?userID=${item.friendID}`}>
                        <Button
                          onClick={() => console.log(`Go to friend page...`)}
                          type="link"
                        >
                          {_txt_btnViewProfile}
                        </Button>
                      </NavLink>,
                      <Button
                        type="primary"
                        ghost
                        onClick={() => {
                          if (user) {
                            goToChatPage([user.id, item.friendID]);
                          }
                        }}
                        style={{ minWidth: "100px" }}
                      >
                        {_txt_btnChat}
                      </Button>,
                    ];
                  }
                  if (item.status === FriendshipStatus.DECLINED) {
                    return [
                      <Dropdown.Button
                        onClick={() => addFriend(item.friendID)}
                        menu={{
                          items: [
                            {
                              key: "view-profile",
                              label: (
                                <NavLink to={`/user?userID=${item.friendID}`}>
                                  <Button type="ghost">
                                    {_txt_btnViewProfile}
                                  </Button>
                                </NavLink>
                              ),
                            },
                            {
                              key: "block-friend",
                              label: (
                                <Button
                                  loading={loadingManageFriendships.includes(
                                    item.friendID
                                  )}
                                  onClick={() => setTargetOfBlock(item)}
                                  type="ghost"
                                >
                                  {_txt_btnBlock}
                                </Button>
                              ),
                            },
                          ],
                        }}
                        loading={loadingManageFriendships.includes(
                          item.friendID
                        )}
                      >
                        {_txt_btnSendAgain}
                      </Dropdown.Button>,
                    ];
                  }
                  if (item.status === FriendshipStatus.BLOCKED) {
                    return [
                      <Button
                        loading={loadingManageFriendships.includes(
                          item.friendID
                        )}
                        onClick={() => setTargetOfUnblock(item)}
                        type="link"
                      >
                        {_txt_btnUnblock}
                      </Button>,
                    ];
                  }
                  if (item.status === FriendshipStatus.SENT_REQUEST) {
                    return [
                      <Dropdown.Button
                        onClick={() => addFriend(item.friendID)}
                        menu={{
                          items: [
                            {
                              key: "view-profile",
                              label: (
                                <NavLink to={`/user?userID=${item.friendID}`}>
                                  <Button type="ghost">
                                    {_txt_btnViewProfile}
                                  </Button>
                                </NavLink>
                              ),
                            },
                            {
                              key: "remove-friend",
                              label: (
                                <Button
                                  loading={loadingManageFriendships.includes(
                                    item.friendID
                                  )}
                                  onClick={() => setTargetOfCancel(item)}
                                  type="ghost"
                                >
                                  {_txt_btnCancel}
                                </Button>
                              ),
                            },
                            {
                              key: "block-friend",
                              label: (
                                <Button
                                  loading={loadingManageFriendships.includes(
                                    item.friendID
                                  )}
                                  onClick={() => setTargetOfBlock(item)}
                                  type="ghost"
                                >
                                  {_txt_btnBlock}
                                </Button>
                              ),
                            },
                          ],
                        }}
                        loading={loadingManageFriendships.includes(
                          item.friendID
                        )}
                      >
                        {_txt_btnSendAgain}
                      </Dropdown.Button>,
                    ];
                  }
                  if (item.status === FriendshipStatus.GOT_REQUEST) {
                    if (isMobile) {
                      return [
                        <Dropdown.Button
                          type="primary"
                          menu={{
                            items: [
                              {
                                key: "decline-profile",
                                label: (
                                  <Button
                                    loading={loadingManageFriendships.includes(
                                      item.friendID
                                    )}
                                    onClick={() => setTargetOfDecline(item)}
                                    type="ghost"
                                  >
                                    {_txt_btnDecline}
                                  </Button>
                                ),
                              },
                              {
                                key: "block-profile",
                                label: (
                                  <Button
                                    loading={loadingManageFriendships.includes(
                                      item.friendID
                                    )}
                                    onClick={() => setTargetOfBlock(item)}
                                    type="ghost"
                                  >
                                    {_txt_btnBlock}
                                  </Button>
                                ),
                              },
                              {
                                key: "view-profile",
                                label: (
                                  <NavLink to={`/user?userID=${item.friendID}`}>
                                    <Button type="ghost">
                                      {_txt_btnViewProfile}
                                    </Button>
                                  </NavLink>
                                ),
                              },
                            ],
                          }}
                          onClick={async () => {
                            setLoadingManageFriendships((prev) => [
                              ...prev,
                              item.friendID,
                            ]);
                            await runManageFriendship({
                              friendID: item.friendID,
                              action: FriendshipAction.AcceptRequest,
                            });
                            setLoadingManageFriendships((prev) =>
                              prev.filter((id) => id !== item.friendID)
                            );
                            setOptimisticAccepted((prev) => [
                              ...prev,
                              item.friendID,
                            ]);
                            message.success(_txt_alertAcceptedRequest);
                          }}
                          loading={loadingManageFriendships.includes(
                            item.friendID
                          )}
                          disabled={optimisticDisabled.includes(item.friendID)}
                        >
                          {_txt_btnAccept}
                        </Dropdown.Button>,
                      ];
                    }
                    return [
                      <Button
                        loading={loadingManageFriendships.includes(
                          item.friendID
                        )}
                        onClick={() => setTargetOfDecline(item)}
                        type="link"
                      >
                        {_txt_btnDecline}
                      </Button>,
                      <Button
                        loading={loadingManageFriendships.includes(
                          item.friendID
                        )}
                        onClick={async () => {
                          setLoadingManageFriendships((prev) => [
                            ...prev,
                            item.friendID,
                          ]);
                          await runManageFriendship({
                            friendID: item.friendID,
                            action: FriendshipAction.AcceptRequest,
                          });
                          setLoadingManageFriendships((prev) =>
                            prev.filter((id) => id !== item.friendID)
                          );
                          setOptimisticAccepted((prev) => [
                            ...prev,
                            item.friendID,
                          ]);
                          message.success(_txt_alertAcceptedRequest);
                        }}
                        type="primary"
                      >
                        {_txt_btnAccept}
                      </Button>,
                    ];
                  }
                  return [
                    <Dropdown.Button
                      loading={loadingManageFriendships.includes(item.friendID)}
                      onClick={() => addFriend(item.friendID)}
                      menu={{
                        items: [
                          {
                            key: "view-profile",
                            label: (
                              <NavLink to={`/user?userID=${item.friendID}`}>
                                <Button type="ghost">
                                  {_txt_btnViewProfile}
                                </Button>
                              </NavLink>
                            ),
                          },
                          {
                            key: "block-friend",
                            label: (
                              <Button
                                loading={loadingManageFriendships.includes(
                                  item.friendID
                                )}
                                onClick={() => setTargetOfBlock(item)}
                                type="ghost"
                              >
                                {_txt_btnBlock}
                              </Button>
                            ),
                          },
                        ],
                      }}
                    >
                      {_txt_btnAddFriend}
                    </Dropdown.Button>,
                  ];
                };
                return renderRow(item, renderActions());
              }}
              style={{ width: "100%" }}
            />
          </>
        ),
      },
    ];
    return (
      <Tabs
        defaultActiveKey={initialTab ? initialTab : "friends"}
        items={tabs}
        onChange={(tab) => {
          navigate({
            pathname: location.pathname,
            search: createSearchParams({
              tab,
            }).toString(),
          });
        }}
      />
    );
  };

  return (
    <>
      <LayoutInteriorHeader
        title={_txt_labelContacts}
        leftAction={
          <Button
            onClick={() => navigate("/app/chats")}
            type="link"
            icon={<LeftOutlined />}
            style={{ color: token.colorTextSecondary }}
          >
            {_txt_btnBack}
          </Button>
        }
        rightAction={
          <Button
            onClick={() => setShowAddContactModal(true)}
            type="primary"
            icon={<UserAddOutlined />}
          >
            {_txt_btnAdd}
          </Button>
        }
      />
      <AppLayoutPadding align="center">
        <>{renderContactsList()}</>
      </AppLayoutPadding>
      <Modal
        open={targetOfDecline ? true : false}
        onCancel={() => setTargetOfDecline(null)}
        footer={
          <Space
            direction="horizontal"
            style={{ justifyContent: "space-between", width: "100%" }}
          >
            <Button onClick={() => setTargetOfDecline(null)} type="link">
              {_txt_btnCancel}
            </Button>
            <div>
              {!isMobile && (
                <Button
                  loading={loadingManageFriendships.includes(
                    targetOfDecline?.friendID || ("" as UserID)
                  )}
                  onClick={() => {
                    setTargetOfBlock(targetOfDecline);
                    setTargetOfDecline(null);
                  }}
                  type="link"
                >
                  {_txt_btnBlock}
                </Button>
              )}

              <Button
                loading={
                  targetOfDecline &&
                  loadingManageFriendships.includes(targetOfDecline.friendID)
                    ? true
                    : false
                }
                onClick={async () => {
                  if (targetOfDecline) {
                    setLoadingManageFriendships((prev) => [
                      ...prev,
                      targetOfDecline.friendID,
                    ]);
                    await runManageFriendship({
                      friendID: targetOfDecline.friendID,
                      action: FriendshipAction.DeclineRequest,
                    });
                    setLoadingManageFriendships((prev) =>
                      prev.filter((id) => id !== targetOfDecline.friendID)
                    );
                    setOptimisticDisabled((prev) => [
                      ...prev,
                      targetOfDecline.friendID,
                    ]);
                    message.info(_txt_alertDeclinedRequest2);
                    setTargetOfDecline(null);
                  }
                }}
                type="primary"
                danger
              >
                {_txt_btnConfirmDecline}
              </Button>
            </div>
          </Space>
        }
      >
        <$Horizontal spacing={3}>
          <Avatar
            src={targetOfDecline?.avatar}
            style={{ backgroundColor: token.colorPrimaryText }}
            size="large"
          />
          <$Vertical
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <PP>
              <b>
                {targetOfDecline?.friendNickname ||
                  `@${targetOfDecline?.username}`}
              </b>
            </PP>
            <PP>
              <i>{targetOfDecline && subtitle(targetOfDecline.status)}</i>
            </PP>
          </$Vertical>
        </$Horizontal>
        <$Vertical
          padding={isMobile ? "20px" : "50px"}
          justifyContent="center"
          alignItems="center"
        >
          <PP>
            <span style={{ fontSize: "1.1rem", textAlign: "center" }}>
              {_txt_labelAreYouSure}{" "}
              <b style={{ color: token.colorErrorText }}>
                {_txt_labelHighlightDecline}
              </b>{" "}
              {_txt_labelThisFriendRequest}
            </span>
          </PP>
        </$Vertical>
      </Modal>
      <Modal
        open={targetOfRemoval ? true : false}
        onCancel={() => setTargetOfRemoval(null)}
        footer={
          <Space
            direction="horizontal"
            style={{ justifyContent: "flex-end", width: "100%" }}
          >
            <Button onClick={() => setTargetOfRemoval(null)} type="link">
              {_txt_btnCancel}
            </Button>
            <Button
              loading={
                targetOfRemoval &&
                loadingManageFriendships.includes(targetOfRemoval.friendID)
                  ? true
                  : false
              }
              onClick={async () => {
                if (targetOfRemoval) {
                  setLoadingManageFriendships((prev) => [
                    ...prev,
                    targetOfRemoval.friendID,
                  ]);
                  await runManageFriendship({
                    friendID: targetOfRemoval.friendID,
                    action: FriendshipAction.RemoveFriend,
                  });
                  setLoadingManageFriendships((prev) =>
                    prev.filter((id) => id !== targetOfRemoval.friendID)
                  );
                  setOptimisticDisabled((prev) => [
                    ...prev,
                    targetOfRemoval.friendID,
                  ]);
                  message.info(_txt_alertRemovedFriends);
                  setTargetOfRemoval(null);
                }
              }}
              type="primary"
              danger
            >
              {_txt_btnYesRemove}
            </Button>
          </Space>
        }
      >
        <$Horizontal spacing={3}>
          <Avatar
            src={targetOfRemoval?.avatar}
            style={{ backgroundColor: token.colorPrimaryText }}
            size="large"
          />
          <$Vertical
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <PP>
              <b>
                {targetOfRemoval?.friendNickname ||
                  `@${targetOfRemoval?.username}`}
              </b>
            </PP>
            <PP>
              <i>{targetOfRemoval && subtitle(targetOfRemoval.status)}</i>
            </PP>
          </$Vertical>
        </$Horizontal>
        <$Vertical
          padding={isMobile ? "20px" : "50px"}
          justifyContent="center"
          alignItems="center"
        >
          <PP>
            <span style={{ fontSize: "1.1rem", textAlign: "center" }}>
              {_txt_labelAreYouSure}{" "}
              <b style={{ color: token.colorErrorText }}>
                {_txt_btnBoldRemove}
              </b>{" "}
              {_txt_labelRemoveFriendExplain}
            </span>
          </PP>
        </$Vertical>
      </Modal>
      <Modal
        open={targetOfBlock ? true : false}
        onCancel={() => setTargetOfBlock(null)}
        footer={
          <Space
            direction="horizontal"
            style={{ justifyContent: "flex-end", width: "100%" }}
          >
            <Button onClick={() => setTargetOfBlock(null)} type="link">
              {_txt_btnCancel}
            </Button>
            <Button
              loading={
                targetOfBlock &&
                loadingManageFriendships.includes(targetOfBlock.friendID)
                  ? true
                  : false
              }
              onClick={async () => {
                if (targetOfBlock) {
                  setLoadingManageFriendships((prev) => [
                    ...prev,
                    targetOfBlock.friendID,
                  ]);
                  await runManageFriendship({
                    friendID: targetOfBlock.friendID,
                    action: FriendshipAction.Block,
                  });
                  setLoadingManageFriendships((prev) =>
                    prev.filter((id) => id !== targetOfBlock.friendID)
                  );
                  setOptimisticDisabled((prev) => [
                    ...prev,
                    targetOfBlock.friendID,
                  ]);
                  message.info(`Blocked this person`);
                  setTargetOfBlock(null);
                }
              }}
              type="primary"
              danger
            >
              {_txt_btnYesBlock}
            </Button>
          </Space>
        }
      >
        <$Horizontal spacing={3}>
          <Avatar
            src={targetOfBlock?.avatar}
            style={{ backgroundColor: token.colorPrimaryText }}
            size="large"
          />
          <$Vertical
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <PP>
              <b>
                {targetOfBlock?.friendNickname || `@${targetOfBlock?.username}`}
              </b>
            </PP>
            <PP>
              <i>{targetOfBlock && subtitle(targetOfBlock.status)}</i>
            </PP>
          </$Vertical>
        </$Horizontal>
        <$Vertical
          padding={isMobile ? "20px" : "50px"}
          justifyContent="center"
          alignItems="center"
        >
          <PP>
            <span style={{ fontSize: "1.1rem", textAlign: "center" }}>
              {_txt_labelAreYouSure}{" "}
              <b style={{ color: token.colorErrorText }}>{_txt_btnBoldBlock}</b>{" "}
              {_txt_labelRemoveFriendConfirmm}
            </span>
          </PP>
        </$Vertical>
      </Modal>
      <Modal
        open={targetOfUnblock ? true : false}
        onCancel={() => setTargetOfUnblock(null)}
        footer={
          <Space
            direction="horizontal"
            style={{ justifyContent: "flex-end", width: "100%" }}
          >
            <Button onClick={() => setTargetOfUnblock(null)} type="link">
              {_txt_btnCancel}
            </Button>
            <Button
              loading={
                targetOfUnblock &&
                loadingManageFriendships.includes(targetOfUnblock.friendID)
                  ? true
                  : false
              }
              onClick={async () => {
                if (targetOfUnblock) {
                  setLoadingManageFriendships((prev) => [
                    ...prev,
                    targetOfUnblock.friendID,
                  ]);
                  await runManageFriendship({
                    friendID: targetOfUnblock.friendID,
                    action: FriendshipAction.Unblock,
                  });
                  setLoadingManageFriendships((prev) =>
                    prev.filter((id) => id !== targetOfUnblock.friendID)
                  );
                  setOptimisticDisabled((prev) => [
                    ...prev,
                    targetOfUnblock.friendID,
                  ]);
                  message.info(`Unblocked this person`);
                  setTargetOfUnblock(null);
                }
              }}
              type="primary"
              danger
            >
              {_txt_btnYesUnblock}
            </Button>
          </Space>
        }
      >
        <$Horizontal spacing={3}>
          <Avatar
            src={targetOfUnblock?.avatar}
            style={{ backgroundColor: token.colorPrimaryText }}
            size="large"
          />
          <$Vertical
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <PP>
              <b>
                {targetOfUnblock?.friendNickname ||
                  `@${targetOfUnblock?.username}`}
              </b>
            </PP>
            <PP>
              <i>{targetOfUnblock && subtitle(targetOfUnblock.status)}</i>
            </PP>
          </$Vertical>
        </$Horizontal>
        <$Vertical
          padding={isMobile ? "20px" : "50px"}
          justifyContent="center"
          alignItems="center"
        >
          <PP>
            <span style={{ fontSize: "1.1rem", textAlign: "center" }}>
              {_txt_labelAreYouSure}{" "}
              <b style={{ color: token.colorWarningText }}>
                {_txt_labelBoldUnblock}
              </b>{" "}
              {_txt_labelConfirmUnblockK}
            </span>
          </PP>
        </$Vertical>
      </Modal>
      <Modal
        open={targetOfCancel ? true : false}
        onCancel={() => setTargetOfCancel(null)}
        footer={
          <Space
            direction="horizontal"
            style={{ justifyContent: "flex-end", width: "100%" }}
          >
            <Button onClick={() => setTargetOfCancel(null)} type="link">
              {_txt_btnNo}
            </Button>
            <Button
              loading={
                targetOfCancel &&
                loadingManageFriendships.includes(targetOfCancel.friendID)
                  ? true
                  : false
              }
              onClick={async () => {
                if (targetOfCancel) {
                  setLoadingManageFriendships((prev) => [
                    ...prev,
                    targetOfCancel.friendID,
                  ]);
                  await runManageFriendship({
                    friendID: targetOfCancel.friendID,
                    action: FriendshipAction.CancelRequest,
                  });
                  setLoadingManageFriendships((prev) =>
                    prev.filter((id) => id !== targetOfCancel.friendID)
                  );
                  setOptimisticDisabled((prev) => [
                    ...prev,
                    targetOfCancel.friendID,
                  ]);
                  message.info(_txt_alertCancelledRequest);
                  setTargetOfCancel(null);
                }
              }}
              type="primary"
              danger
            >
              {_txt_btnYesCancel}
            </Button>
          </Space>
        }
      >
        <$Horizontal spacing={3}>
          <Avatar
            src={targetOfCancel?.avatar}
            style={{ backgroundColor: token.colorPrimaryText }}
            size="large"
          />
          <$Vertical
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <PP>
              <b>
                {targetOfCancel?.friendNickname ||
                  `@${targetOfCancel?.username}`}
              </b>
            </PP>
            <PP>
              <i>{targetOfCancel && subtitle(targetOfCancel.status)}</i>
            </PP>
          </$Vertical>
        </$Horizontal>
        <$Vertical
          padding={isMobile ? "20px" : "50px"}
          justifyContent="center"
          alignItems="center"
        >
          <PP>
            <span style={{ fontSize: "1.1rem", textAlign: "center" }}>
              {_txt_labelAreYouSure}{" "}
              <b style={{ color: token.colorErrorText }}>
                {_txt_labelBoldCancel}
              </b>{" "}
              {_txt_labelConfirmCancelExplain}
            </span>
          </PP>
        </$Vertical>
      </Modal>
      <Modal
        open={showAddContactModal}
        onCancel={() => {
          setShowAddContactModal(false);
          clearSearchResult();
          setSearchPublicByUsernameString("");
        }}
        style={{ overflow: "hidden", top: 20 }}
        footer={null}
      >
        <div>
          {user && (
            <Tabs
              items={[
                {
                  key: "search",
                  label: _txt_btnSearch,
                  children: (
                    <$Vertical spacing={5}>
                      <Input.Search
                        placeholder={_txt_btnSearchLabel}
                        enterButton
                        allowClear
                        onChange={(e) =>
                          setSearchPublicByUsernameString(e.target.value)
                        }
                        value={searchPublicByUsernameString}
                        loading={loadingSearchPublicByUsername}
                        onSearch={async () => {
                          setLoadingSearchPublicByUsername(true);
                          await searchByExactUsername(
                            searchPublicByUsernameString as Username
                          );
                          setLoadingSearchPublicByUsername(false);
                        }}
                      />
                      <$Vertical
                        justifyContent="center"
                        alignItems="center"
                        style={{ height: "300px", minHeight: "300px" }}
                      >
                        {foundUserByUsername ? (
                          <$Horizontal
                            spacing={4}
                            style={{
                              flex: 1,
                              cursor: "pointer",
                              width: "100%",
                              alignItems: "flex-start",
                            }}
                            alignItems="center"
                          >
                            <Avatar
                              src={foundUserByUsername.avatar}
                              style={{
                                backgroundColor: token.colorPrimary,
                                height: 90,
                                width: 90,
                                minHeight: 90,
                                minWidth: 90,
                              }}
                              size={90}
                            />
                            <$Vertical
                              style={{
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                flex: 1,
                              }}
                            >
                              <$Horizontal
                                justifyContent="space-between"
                                style={{ width: "100%" }}
                              >
                                <$Vertical style={{ flex: 1 }}>
                                  <PP>
                                    <b
                                      style={{
                                        fontSize: isMobile
                                          ? "1.3rem"
                                          : "1.6rem",
                                        overflowWrap: "break-word",
                                        wordBreak: "break-all",
                                        whiteSpace: "normal",
                                      }}
                                    >
                                      {foundUserByUsername.username}
                                    </b>
                                  </PP>
                                  <PP>
                                    <i
                                      style={{
                                        fontSize: isMobile ? "1rem" : "1.1rem",
                                        marginTop: "0px",
                                      }}
                                    >{`@${foundUserByUsername.username}`}</i>
                                  </PP>
                                  <NavLink
                                    to={`/${foundUserByUsername.username}`}
                                  >
                                    <Button
                                      style={{
                                        width: "100px",
                                        marginTop: "10px",
                                      }}
                                    >
                                      {_txt_btnVisitProfile}
                                    </Button>
                                  </NavLink>
                                </$Vertical>
                              </$Horizontal>
                            </$Vertical>
                          </$Horizontal>
                        ) : (
                          <Result
                            icon={<UserOutlined />}
                            title={_txt_labelSearchUsers}
                            subTitle={_txt_alertMustExactMatch}
                          />
                        )}
                      </$Vertical>
                    </$Vertical>
                  ),
                },
                {
                  key: "qrCode",
                  label: _txt_labelQRCode,
                  children: (
                    <$Vertical>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: isMobile ? "column" : "row",
                          alignItems: isMobile ? "flex-start" : "center",
                          justifyContent: isMobile ? "center" : "flex-start",
                          gap: isMobile ? "15px" : "30px",
                        }}
                      >
                        <QRCode
                          bordered={false}
                          value={`${window.location}/add/${user.id}`}
                          color={token.colorText}
                          icon={QRCODE_LOGO}
                          {...{
                            size: isMobile
                              ? window.innerWidth - 100
                              : undefined,
                            iconSize: isMobile
                              ? (window.innerWidth - 100) / 4
                              : undefined,
                          }}
                        />
                        <$Vertical
                          alignItems="flex-start"
                          style={{
                            flexDirection: isMobile
                              ? "column-reverse"
                              : "column",
                          }}
                        >
                          <$Horizontal
                            justifyContent="flex-start"
                            alignItems="flex-start"
                          >
                            <Avatar
                              src={user.avatar}
                              size={isMobile ? 64 : 48}
                              style={{ marginRight: "10px" }}
                            />
                            <$Vertical>
                              <PP>
                                <div
                                  style={{
                                    fontSize: isMobile ? "1.3rem" : "1rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  {user.displayName}
                                </div>
                              </PP>
                              <PP>
                                <div
                                  style={{
                                    fontSize: isMobile ? "1rem" : "0.9rem",
                                  }}
                                >
                                  {`@${user.username}`}
                                </div>
                              </PP>
                            </$Vertical>
                          </$Horizontal>
                          <Spacer height={isMobile ? "20px" : "5px"} />
                          <div
                            style={{
                              padding: "10px",
                              fontSize: isMobile ? "1.2rem" : "1rem",
                              backgroundColor: token.colorSuccessBg,
                              color: token.colorSuccessText,
                              fontWeight: 700,
                              wordBreak: "break-all",
                            }}
                          >
                            <PP>
                              {user &&
                                `🔒${"\u00A0"}${window.location.host}/${
                                  user.username
                                }`}
                            </PP>
                          </div>
                        </$Vertical>
                      </div>
                      <Spacer />
                      <Space
                        direction="horizontal"
                        style={{
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Button
                          onClick={() => {
                            if (user) {
                              navigator.clipboard.writeText(
                                `${window.location.origin}/${user.username}`
                              );
                              message.success(_txt_alertCopieidProfileLink);
                            }
                          }}
                          type="primary"
                          style={{ marginLeft: isMobile ? "0px" : "10px" }}
                        >
                          {_txt_btnCopyURL}
                        </Button>
                        {isMobile ? (
                          <Button
                            onClick={() => setShowAddContactModal(false)}
                            type="ghost"
                          >
                            {_txt_btnClose}
                          </Button>
                        ) : null}
                      </Space>
                    </$Vertical>
                  ),
                },
              ]}
            />
          )}
          <Spacer />
        </div>
      </Modal>
    </>
  );
};
export default ContactsPage;
