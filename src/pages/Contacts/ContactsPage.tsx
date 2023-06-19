import { ErrorLines } from "@/api/graphql/error-line";
import { Contact, FriendshipStatus, Maybe } from "@/api/graphql/types";
import {
  AppLayoutPadding,
  LayoutInteriorHeader,
  Spacer,
} from "@/components/AppLayout/AppLayout";
import StyleConfigPanel from "@/components/StyleConfigPanel/StyleConfigPanel";
import {
  useSendFriendRequest,
  useViewPublicProfile,
} from "@/hooks/useFriendship";
import { QrcodeOutlined } from "@ant-design/icons";
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
import { useLocation } from "react-router-dom";
import { ScreenSize, useWindowSize } from "@/api/utils/screen";

const subtitle = (status?: Maybe<FriendshipStatus>) => {
  switch (status) {
    case FriendshipStatus.Accepted:
      return "";
    case FriendshipStatus.GotRequest:
      return <PP>Sent a friend request</PP>;
    case FriendshipStatus.SentRequest:
      return <PP>Waiting for acceptance</PP>;
    default:
      return <PP>Not Friends</PP>;
  }
};

export const ContactsPage = () => {
  const { screen, isMobile } = useWindowSize();
  const [showGlobalDirectory, setShowGlobalDirectory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user = useUserState((state) => state.user);
  const location = useLocation();
  const [isAddingFriend, setIsAddingFriend] = useState<UserID | null>(null);
  const { token } = theme.useToken();
  const [searchString, setSearchString] = useState("");
  const [optimisticAccepted, setOptimisticAccepted] = useState<UserID[]>([]);
  const [targetOfRejection, setTargetOfRejection] = useState<Contact | null>(
    null
  );
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [targetOfBlock, setTargetOfBlock] = useState<Contact | null>(null);
  const [targetOfRemoval, setTargetOfRemoval] = useState<Contact | null>(null);
  const [targetOfCancel, setTargetOfCancel] = useState<Contact | null>(null);
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
    setIsAddingFriend(userID);
    await sendFriendRequestMutation({
      note: "Added from Global Directory",
      recipientID: userID,
    });
    setIsAddingFriend(null);
    message.info("Friend Request Sent");
  };

  const renderRow = (fr: Contact, actions: React.ReactNode[]) => {
    return (
      <List.Item actions={actions}>
        <Skeleton avatar title={false} loading={!listContactsData} active>
          <List.Item.Meta
            avatar={
              <Avatar
                style={{ backgroundColor: token.colorPrimaryText }}
                icon={<UserOutlined />}
                src={fr.avatar}
                size="large"
              />
            }
            title={<PP>{fr.displayName}</PP>}
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
    console.log(`listContactsData.contacts`, listContactsData?.contacts);
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
        key: "friends",
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
                          label: <Button type="ghost">View Profile</Button>,
                        },
                        {
                          key: "remove-friend",
                          label: (
                            <Button
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
        key: "requests",
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
                .filter(handleFilter)}
              renderItem={(item) => {
                const renderActions = () => {
                  if (optimisticAccepted.includes(item.friendID)) {
                    return [
                      <Button
                        onClick={() => console.log(`Go to friend page...`)}
                        type="link"
                      >
                        <PP>View Profile</PP>
                      </Button>,
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
                      <Button
                        loading={isAddingFriend === item.friendID}
                        onClick={() => console.log("remove")}
                        type="link"
                      >
                        <PP>Remove</PP>
                      </Button>,
                      <Button
                        loading={isAddingFriend === item.friendID}
                        onClick={() => console.log("Unblock")}
                      >
                        <PP>Request Again</PP>
                      </Button>,
                    ];
                  }
                  if (item.status === FriendshipStatus.Blocked) {
                    return [
                      <Button
                        loading={isAddingFriend === item.friendID}
                        onClick={() => console.log("Unblock")}
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
                              label: <Button type="ghost">View Profile</Button>,
                            },
                            {
                              key: "remove-friend",
                              label: (
                                <Button
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
                        Send Again
                      </Dropdown.Button>,
                    ];
                  }
                  if (item.status === FriendshipStatus.GotRequest) {
                    if (isMobile) {
                      return [
                        <Dropdown.Button
                          menu={{
                            items: [
                              {
                                key: "view-profile",
                                label: (
                                  <Button
                                    onClick={() => setTargetOfRejection(item)}
                                    type="ghost"
                                  >
                                    Reject
                                  </Button>
                                ),
                              },
                              {
                                key: "view-profile",
                                label: (
                                  <Button
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
                                  <Button type="ghost">View Profile</Button>
                                ),
                              },
                            ],
                          }}
                        >
                          Accept
                        </Dropdown.Button>,
                      ];
                    }
                    return [
                      <Button
                        onClick={() => setTargetOfRejection(item)}
                        type="link"
                      >
                        Reject
                      </Button>,
                      <Button
                        loading={isAddingFriend === item.friendID}
                        onClick={async () => {
                          await addFriend(item.friendID);
                          setOptimisticAccepted((prev) => [
                            ...prev,
                            item.friendID,
                          ]);
                        }}
                        type="primary"
                      >
                        <PP>Accept</PP>
                      </Button>,
                    ];
                  }
                  return [];
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
        defaultActiveKey="friends"
        items={tabs}
        onChange={(e) => {
          console.log(`e`, e);
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
            <Button onClick={() => addFriend(item.friendID)} type="link">
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
            icon={<QrcodeOutlined />}
          >
            Add
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
        open={targetOfRejection ? true : false}
        onCancel={() => setTargetOfRejection(null)}
        footer={
          <Space
            direction="horizontal"
            style={{ justifyContent: "space-between", width: "100%" }}
          >
            <Button onClick={() => setTargetOfRejection(null)} type="link">
              <PP>Cancel</PP>
            </Button>
            <div>
              {!isMobile && (
                <Button
                  onClick={() => {
                    setTargetOfBlock(targetOfRejection);
                    setTargetOfRejection(null);
                  }}
                  type="link"
                >
                  <PP>Block</PP>
                </Button>
              )}

              <Button type="primary" danger>
                <PP>Yes, Reject</PP>
              </Button>
            </div>
          </Space>
        }
      >
        <$Horizontal spacing={3}>
          <Avatar
            src={targetOfRejection?.avatar}
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
              <b>{targetOfRejection?.displayName}</b>
            </PP>
            <PP>
              <i>{subtitle(targetOfRejection?.status)}</i>
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
              <b style={{ color: token.colorErrorActive }}>REJECT</b> this
              friend request?
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
            <Button type="primary" danger>
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
              <b style={{ color: token.colorErrorActive }}>REMOVE</b> this
              friend? They will have to accept a new friend request if you want
              to chat.
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
            <Button type="primary" danger>
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
              <b style={{ color: token.colorErrorActive }}>BLOCK</b> this
              contact? They will not be able to send you messages or friend
              requests.
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
            <Button type="primary" danger>
              <PP>Yes, Cancel</PP>
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
              <b style={{ color: token.colorErrorActive }}>CANCEL</b> your
              friend request? You can send another one later.
            </span>
          </PP>
        </$Vertical>
      </Modal>
      <Modal
        open={showAddContactModal}
        onCancel={() => setShowAddContactModal(false)}
        title={
          <PP>
            <h3>Add me on Milkshake Chat</h3>
          </PP>
        }
        style={{ overflow: "hidden" }}
        footer={
          <Space
            direction="horizontal"
            style={{ justifyContent: "space-between", width: "100%" }}
          >
            <Button onClick={() => setShowAddContactModal(false)} type="ghost">
              Cancel
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
                value={`${window.location}/add/${user.id}`}
                icon={QRCODE_LOGO}
                {...{
                  size:
                    screen === ScreenSize.mobile
                      ? window.innerWidth - 100
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
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  <PP>
                    {user && `🔒${window.location.host}/${user.username}`}
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
