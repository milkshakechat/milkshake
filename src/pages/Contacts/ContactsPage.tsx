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

const subtitle = (status: FriendshipStatus) => {
  switch (status) {
    case FriendshipStatus.ACCEPTED:
      return "";
    case FriendshipStatus.GOT_REQUEST:
      return <PP>Sent a friend request</PP>;
    case FriendshipStatus.SENT_REQUEST:
      return <PP>Waiting for acceptance</PP>;
    case FriendshipStatus.DECLINED:
      return <PP>Declined request</PP>;
    case FriendshipStatus.BLOCKED:
      return <PP>Blocked user</PP>;
    default:
      return <PP>Not Friends</PP>;
  }
};

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
  console.log(`got friendships`, friendships);
  const addFriend = async (userID: UserID) => {
    setLoadingManageFriendships((prev) => [...prev, userID]);
    await sendFriendRequestMutation({
      note: "Added from Global Directory",
      recipientID: userID,
    });
    setLoadingManageFriendships((prev) => prev.filter((id) => id !== userID));
    message.info("Friend Request Sent");
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
    const searchText = "Search Contacts"; // <P>Search Contacts</P>;
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
        } Friends`,
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
                {groupChatMode ? "Cancel" : `Group Chat`}
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
                              <Button type="ghost">View Profile</Button>
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
                              Remove
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
                              Block
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
                    Chat
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
                    Start Group Chat
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
            <span style={{ marginRight: "5px" }}>Requests</span>
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
                          <PP>Chat</PP>
                        </Button>,
                      ];
                    }
                    return [
                      <NavLink to={`/user?userID=${item.friendID}`}>
                        <Button
                          onClick={() => console.log(`Go to friend page...`)}
                          type="link"
                        >
                          <PP>View Profile</PP>
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
                        <PP>Chat</PP>
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
                                  <Button type="ghost">View Profile</Button>
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
                                  Block
                                </Button>
                              ),
                            },
                          ],
                        }}
                        loading={loadingManageFriendships.includes(
                          item.friendID
                        )}
                      >
                        Send Again
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
                        <PP>Unblock</PP>
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
                                  <Button type="ghost">View Profile</Button>
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
                                  Cancel
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
                                  Block
                                </Button>
                              ),
                            },
                          ],
                        }}
                        loading={loadingManageFriendships.includes(
                          item.friendID
                        )}
                      >
                        Send Again
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
                                    Decline
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
                                    Block
                                  </Button>
                                ),
                              },
                              {
                                key: "view-profile",
                                label: (
                                  <NavLink to={`/user?userID=${item.friendID}`}>
                                    <Button type="ghost">View Profile</Button>
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
                            message.success(`Accepted friend request`);
                          }}
                          loading={loadingManageFriendships.includes(
                            item.friendID
                          )}
                          disabled={optimisticDisabled.includes(item.friendID)}
                        >
                          Accept
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
                        Decline
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
                          message.success(`Accepted friend request`);
                        }}
                        type="primary"
                      >
                        <PP>Accept</PP>
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
                                <Button type="ghost">View Profile</Button>
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
                                Block
                              </Button>
                            ),
                          },
                        ],
                      }}
                    >
                      Add Friend
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
          console.log(`Changing tab... ${tab}`);
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
        title={<PP>{"Contacts"}</PP>}
        leftAction={
          <Button
            onClick={() => navigate("/app/chats")}
            type="link"
            icon={<LeftOutlined />}
            style={{ color: token.colorTextSecondary }}
          >
            Back
          </Button>
        }
        rightAction={
          <Button
            onClick={() => setShowAddContactModal(true)}
            type="primary"
            icon={<UserAddOutlined />}
          >
            Add
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
              <PP>Cancel</PP>
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
                  <PP>Block</PP>
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
                    message.info(`Declined friend request`);
                    setTargetOfDecline(null);
                  }
                }}
                type="primary"
                danger
              >
                <PP>Yes, Decline</PP>
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
              Are you sure you want to{" "}
              <b style={{ color: token.colorErrorText }}>DECLINE</b> this friend
              request?
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
              <PP>Cancel</PP>
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
                  message.info(`Removed from friends`);
                  setTargetOfRemoval(null);
                }
              }}
              type="primary"
              danger
            >
              <PP>Yes, Remove</PP>
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
              Are you sure you want to{" "}
              <b style={{ color: token.colorErrorText }}>REMOVE</b> this friend?
              They will have to accept a new friend request if you want to chat.
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
              <PP>Cancel</PP>
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
              <PP>Yes, Block</PP>
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
              Are you sure you want to{" "}
              <b style={{ color: token.colorErrorText }}>BLOCK</b> this contact?
              They will not be able to send you messages or friend requests.
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
              <PP>Cancel</PP>
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
              <PP>Yes, Unblock</PP>
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
              Are you sure you want to{" "}
              <b style={{ color: token.colorWarningText }}>UNBLOCK</b> this
              contact? They will be able to see you exist.
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
              <PP>No</PP>
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
                  message.info(`Cancelled friend request`);
                  setTargetOfCancel(null);
                }
              }}
              type="primary"
              danger
            >
              <PP>Yes, Cancel</PP>
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
              Are you sure you want to{" "}
              <b style={{ color: token.colorErrorText }}>CANCEL</b> your friend
              request? You can send another one later.
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
                  label: `Search`,
                  children: (
                    <$Vertical spacing={5}>
                      <Input.Search
                        placeholder="Exact Username Search"
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
                                      Visit Profile
                                    </Button>
                                  </NavLink>
                                </$Vertical>
                              </$Horizontal>
                            </$Vertical>
                          </$Horizontal>
                        ) : (
                          <Result
                            icon={<UserOutlined />}
                            title="Search Users"
                            subTitle="Must be an exact username match"
                          />
                        )}
                      </$Vertical>
                    </$Vertical>
                  ),
                },
                {
                  key: "qrCode",
                  label: `QR Code`,
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
                              message.success(<PP>Copied profile link!</PP>);
                            }
                          }}
                          type="primary"
                          style={{ marginLeft: isMobile ? "0px" : "10px" }}
                        >
                          <PP>Copy URL</PP>
                        </Button>
                        {isMobile ? (
                          <Button
                            onClick={() => setShowAddContactModal(false)}
                            type="ghost"
                          >
                            Close
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
