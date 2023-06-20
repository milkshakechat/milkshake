import { ErrorLines } from "@/api/graphql/error-line";
import {
  Contact,
  FriendshipAction,
  FriendshipStatus,
  Maybe,
} from "@/api/graphql/types";
import {
  AppLayoutPadding,
  LayoutInteriorHeader,
  Spacer,
} from "@/components/AppLayout/AppLayout";
import StyleConfigPanel from "@/components/StyleConfigPanel/StyleConfigPanel";
import {
  useManageFriendship,
  useSendFriendRequest,
  useViewPublicProfile,
} from "@/hooks/useFriendship";
import { SearchOutlined } from "@ant-design/icons";
import { useListContacts } from "@/hooks/useProfile";
import {
  useDemoMutation,
  useDemoPing,
  useDemoQuery,
  useDemoSubscription,
} from "@/hooks/useTemplateGQL";
import PP from "@/i18n/PlaceholderPrint";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Input,
  List,
  Modal,
  QRCode,
  Skeleton,
  Space,
  Spin,
  Switch,
  Tabs,
  message,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { useUserState } from "@/state/user.state";
import { QRCODE_LOGO, UserID } from "@milkshakechat/helpers";
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

const subtitle = (status?: Maybe<FriendshipStatus>) => {
  switch (status) {
    case FriendshipStatus.Accepted:
      return "";
    case FriendshipStatus.GotRequest:
      return <PP>Sent a friend request</PP>;
    case FriendshipStatus.SentRequest:
      return <PP>Waiting for acceptance</PP>;
    case FriendshipStatus.Declined:
      return <PP>Declined request</PP>;
    case FriendshipStatus.Blocked:
      return <PP>Blocked user</PP>;
    default:
      return <PP>Not Friends</PP>;
  }
};

const sortStatusPriority: Record<FriendshipStatus, number> = {
  [FriendshipStatus.GotRequest]: 1,
  [FriendshipStatus.SentRequest]: 2,
  [FriendshipStatus.Declined]: 3,
  [FriendshipStatus.Blocked]: 4,
  [FriendshipStatus.None]: 5,
  [FriendshipStatus.Accepted]: 6,
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
  const [showGlobalDirectory, setShowGlobalDirectory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user = useUserState((state) => state.user);

  const { runMutation: runManageFriendship } = useManageFriendship();

  const { token } = theme.useToken();
  const [searchString, setSearchString] = useState("");
  const [optimisticAccepted, setOptimisticAccepted] = useState<UserID[]>([]);
  const [optimisticDisabled, setOptimisticDisabled] = useState<UserID[]>([]);
  const [targetOfDecline, setTargetOfDecline] = useState<Contact | null>(null);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [targetOfBlock, setTargetOfBlock] = useState<Contact | null>(null);
  const [targetOfUnblock, setTargetOfUnblock] = useState<Contact | null>(null);
  const [targetOfRemoval, setTargetOfRemoval] = useState<Contact | null>(null);
  const [targetOfCancel, setTargetOfCancel] = useState<Contact | null>(null);
  const [loadingManageFriendships, setLoadingManageFriendships] = useState<
    UserID[]
  >([]);
  const {
    data: sendFriendRequestMutationData,
    errors: sendFriendRequestErrors,
    runMutation: sendFriendRequestMutation,
  } = useSendFriendRequest();
  const {
    data: listContactsData,
    errors: listContactsErrors,
    runQuery: runListContacts,
  } = useListContacts();

  useEffect(() => {
    run();
  }, []);

  const run = async () => {
    await runListContacts();
    setIsLoading(false);
  };

  const addFriend = async (userID: UserID) => {
    setLoadingManageFriendships((prev) => [...prev, userID]);
    await sendFriendRequestMutation({
      note: "Added from Global Directory",
      recipientID: userID,
    });
    setLoadingManageFriendships((prev) => prev.filter((id) => id !== userID));
    message.info("Friend Request Sent");
  };

  const renderRow = (fr: Contact, actions: React.ReactNode[]) => {
    return (
      <List.Item
        actions={actions.map((act) => {
          return <div onClick={(e) => e.preventDefault()}>{act}</div>;
        })}
        style={{
          backgroundColor: optimisticDisabled.includes(fr.friendID)
            ? token.colorErrorBg
            : undefined,
        }}
      >
        <Skeleton avatar title={false} loading={!listContactsData} active>
          <List.Item.Meta
            avatar={
              <div
                onClick={() => {
                  navigate({
                    pathname: "/user",
                    search: createSearchParams({
                      userID: fr.friendID,
                    }).toString(),
                  });
                }}
              >
                <Avatar
                  style={{ backgroundColor: token.colorPrimaryText }}
                  icon={<UserOutlined />}
                  src={fr.avatar}
                  size="large"
                />
              </div>
            }
            title={
              <div
                onClick={() => {
                  navigate({
                    pathname: "/user",
                    search: createSearchParams({
                      userID: fr.friendID,
                    }).toString(),
                  });
                }}
              >
                <PP>{fr.displayName}</PP>
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
        </Skeleton>
      </List.Item>
    );
  };

  const renderContactsList = () => {
    if (!listContactsData) {
      return <PP>No Contacts Yet</PP>;
    }
    const searchText = "Search Contacts"; // <P>Search Contacts</P>;
    const handleFilter = (fr: Contact) => {
      return (
        fr.displayName.toLowerCase().includes(searchString.toLowerCase()) ||
        fr.username?.toLowerCase().includes(searchString.toLowerCase()) ||
        fr.friendID?.toLowerCase().includes(searchString.toLowerCase())
      );
    };
    const tabs = [
      {
        key: ValidTabs.Friends,
        label: `${
          listContactsData.contacts.filter(
            (fr) => fr.status === FriendshipStatus.Accepted
          ).length
        } Friends`,
        children: (
          <>
            <Input.Search
              placeholder={searchText}
              allowClear
              onChange={(e) => setSearchString(e.target.value)}
              style={{ width: "100%" }}
            />
            <Spacer />
            <List
              className="contacts-list"
              loading={!listContactsData}
              itemLayout="horizontal"
              dataSource={listContactsData.contacts
                .filter((fr) => fr.status === FriendshipStatus.Accepted)
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
                  >
                    Chat
                  </Dropdown.Button>,
                ]);
              }}
              style={{ width: "100%" }}
            />
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
                listContactsData.contacts.filter(
                  (fr) => fr.status === FriendshipStatus.GotRequest
                ).length
              }
            />
          </$Horizontal>
        ),
        children: (
          <>
            <Input.Search
              placeholder={searchText}
              allowClear
              onChange={(e) => setSearchString(e.target.value)}
              style={{ width: "100%" }}
            />
            <Spacer />
            <List
              className="contacts-requests-list"
              loading={!listContactsData}
              itemLayout="horizontal"
              dataSource={listContactsData.contacts
                .filter((fr) => fr.status !== FriendshipStatus.Accepted)
                .filter(handleFilter)
                .sort(
                  (a, b) =>
                    sortStatusPriority[a.status || FriendshipStatus.None] -
                    sortStatusPriority[b.status || FriendshipStatus.None]
                )}
              renderItem={(item) => {
                const renderActions = () => {
                  if (optimisticAccepted.includes(item.friendID)) {
                    if (isMobile) {
                      return [
                        <Button
                          type="primary"
                          ghost
                          onClick={() => console.log(`Go to chat page...`)}
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
                        onClick={() => console.log(`Go to chat page...`)}
                        style={{ minWidth: "100px" }}
                      >
                        <PP>Chat</PP>
                      </Button>,
                    ];
                  }
                  if (item.status === FriendshipStatus.Declined) {
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
                  if (item.status === FriendshipStatus.Blocked) {
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
                  if (item.status === FriendshipStatus.SentRequest) {
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
                  if (item.status === FriendshipStatus.GotRequest) {
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
    return listContactsData ? (
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
    ) : (
      <PP>No Contacts Yet</PP>
    );
  };

  const renderGlobalDirectory = () => {
    return (
      <List
        className="contacts-list"
        loading={!listContactsData}
        itemLayout="horizontal"
        dataSource={listContactsData?.globalDirectory.filter(
          (fr) => user && fr.friendID !== user.id
        )}
        renderItem={(item) =>
          renderRow(item, [
            <Button
              loading={loadingManageFriendships.includes(item.friendID)}
              onClick={() => addFriend(item.friendID)}
              type="link"
            >
              <PP>Add Friend</PP>
            </Button>,
          ])
        }
        style={{ width: "100%" }}
      />
    );
  };
  return (
    <>
      <LayoutInteriorHeader
        title={<PP>{showGlobalDirectory ? "Global Directory" : "Contacts"}</PP>}
        rightAction={
          <Button
            onClick={() => setShowAddContactModal(true)}
            type="primary"
            icon={<SearchOutlined />}
          >
            Search
          </Button>
        }
      />
      <AppLayoutPadding align="center">
        <>
          {isLoading ? (
            <Spin />
          ) : showGlobalDirectory ? (
            renderGlobalDirectory()
          ) : (
            renderContactsList()
          )}
          <Spacer />
          <Space direction="horizontal">
            <Switch
              checkedChildren={<PP>Global</PP>}
              unCheckedChildren={<PP>Contacts</PP>}
              checked={showGlobalDirectory}
              onChange={(bool) => {
                setShowGlobalDirectory(bool);
              }}
            />
          </Space>
        </>
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
                    targetOfDecline?.friendID
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
              <b>{targetOfDecline?.displayName}</b>
            </PP>
            <PP>
              <i>{subtitle(targetOfDecline?.status)}</i>
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
              <b>{targetOfRemoval?.displayName}</b>
            </PP>
            <PP>
              <i>{subtitle(targetOfRemoval?.status)}</i>
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
              <b>{targetOfBlock?.displayName}</b>
            </PP>
            <PP>
              <i>{subtitle(targetOfBlock?.status)}</i>
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
              <b>{targetOfUnblock?.displayName}</b>
            </PP>
            <PP>
              <i>{subtitle(targetOfUnblock?.status)}</i>
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
              <b>{targetOfCancel?.displayName}</b>
            </PP>
            <PP>
              <i>{subtitle(targetOfCancel?.status)}</i>
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
        onCancel={() => setShowAddContactModal(false)}
        title={
          <PP>
            <h3>Add me on Milkshake.chat</h3>
          </PP>
        }
        style={{ overflow: "hidden" }}
        footer={
          <Space
            direction="horizontal"
            style={{ justifyContent: "space-between", width: "100%" }}
          >
            <Button onClick={() => setShowAddContactModal(false)} type="ghost">
              Close
            </Button>
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
            >
              <PP>Copy URL</PP>
            </Button>
          </Space>
        }
      >
        <div>
          {user && (
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                justifyContent: "center",
                gap: isMobile ? "15px" : "30px",
              }}
            >
              <QRCode
                bordered={false}
                value={`${window.location}/add/${user.id}`}
                color={token.colorText}
                icon={QRCODE_LOGO}
                {...{
                  size: isMobile ? window.innerWidth - 100 : undefined,
                  iconSize: isMobile
                    ? (window.innerWidth - 100) / 4
                    : undefined,
                }}
              />
              <$Vertical alignItems="flex-start">
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
                      <div style={{ fontSize: isMobile ? "1rem" : "0.9rem" }}>
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
                      `🔒${"\u00A0"}${window.location.host}/${user.username}`}
                  </PP>
                </div>
              </$Vertical>
            </div>
          )}
          <Spacer />
        </div>
      </Modal>
    </>
  );
};
export default ContactsPage;
