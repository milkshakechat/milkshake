export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateString: { input: any; output: any; }
  GroupChatID: { input: any; output: any; }
  HexColorCode: { input: any; output: any; }
  PushToken: { input: any; output: any; }
  SendBirdInternalUserID: { input: any; output: any; }
  UserID: { input: any; output: any; }
};

export type ChatRoom = {
  __typename?: 'ChatRoom';
  chatRoomID: Scalars['String']['output'];
  participants: Array<Scalars['UserID']['output']>;
  pushConfig?: Maybe<PushConfig>;
  sendBirdChannelURL?: Maybe<Scalars['String']['output']>;
  sendBirdParticipants: Array<Scalars['UserID']['output']>;
};

export type CheckUsernameAvailableInput = {
  username: Scalars['String']['input'];
};

export type CheckUsernameAvailableResponse = CheckUsernameAvailableResponseSuccess | ResponseError;

export type CheckUsernameAvailableResponseSuccess = {
  __typename?: 'CheckUsernameAvailableResponseSuccess';
  isAvailable: Scalars['Boolean']['output'];
};

export type Contact = {
  __typename?: 'Contact';
  avatar?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  friendID: Scalars['UserID']['output'];
  status?: Maybe<FriendshipStatus>;
  username?: Maybe<Scalars['String']['output']>;
};

export type CreateStoryInput = {
  caption: Scalars['String']['input'];
  media?: InputMaybe<StoryMediaAttachmentInput>;
};

export type CreateStoryResponse = CreateStoryResponseSuccess | ResponseError;

export type CreateStoryResponseSuccess = {
  __typename?: 'CreateStoryResponseSuccess';
  story: Story;
};

export type CreateWishInput = {
  cookiePrice: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  stickerGraphic?: InputMaybe<Scalars['String']['input']>;
  stickerTitle?: InputMaybe<Scalars['String']['input']>;
  wishGraphics?: InputMaybe<Array<Scalars['String']['input']>>;
  wishTitle: Scalars['String']['input'];
};

export type CreateWishResponse = CreateWishResponseSuccess | ResponseError;

export type CreateWishResponseSuccess = {
  __typename?: 'CreateWishResponseSuccess';
  wish: Wish;
};

export type DemoMutatedItem = {
  __typename?: 'DemoMutatedItem';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type DemoMutationInput = {
  name: Scalars['String']['input'];
};

export type DemoMutationResponse = DemoMutationResponseSuccess | ResponseError;

export type DemoMutationResponseSuccess = {
  __typename?: 'DemoMutationResponseSuccess';
  item: DemoMutatedItem;
};

export type DemoQueryInput = {
  name: Scalars['String']['input'];
};

export type DemoQueryResponse = DemoQueryResponseSuccess | ResponseError;

export type DemoQueryResponseSuccess = {
  __typename?: 'DemoQueryResponseSuccess';
  message: Scalars['String']['output'];
};

export type DemoSubscriptionEvent = {
  __typename?: 'DemoSubscriptionEvent';
  message: Scalars['String']['output'];
};

export type EnterChatRoomInput = {
  chatRoomID?: InputMaybe<Scalars['String']['input']>;
  participants?: InputMaybe<Array<Scalars['UserID']['input']>>;
};

export type EnterChatRoomResponse = EnterChatRoomResponseSuccess | ResponseError;

export type EnterChatRoomResponseSuccess = {
  __typename?: 'EnterChatRoomResponseSuccess';
  chatRoom: ChatRoom;
  isNew: Scalars['Boolean']['output'];
};

export type FetchRecentNotificationsInput = {
  nonce?: InputMaybe<Scalars['String']['input']>;
};

export type FetchRecentNotificationsResponse = FetchRecentNotificationsResponseSuccess | ResponseError;

export type FetchRecentNotificationsResponseSuccess = {
  __typename?: 'FetchRecentNotificationsResponseSuccess';
  notifications: Array<NotificationGql>;
};

export type FetchStoryFeedInput = {
  nonce?: InputMaybe<Scalars['String']['input']>;
};

export type FetchStoryFeedResponse = FetchStoryFeedResponseSuccess | ResponseError;

export type FetchStoryFeedResponseSuccess = {
  __typename?: 'FetchStoryFeedResponseSuccess';
  stories: Array<Story>;
};

export enum FriendshipAction {
  AcceptRequest = 'ACCEPT_REQUEST',
  Block = 'BLOCK',
  CancelRequest = 'CANCEL_REQUEST',
  DeclineRequest = 'DECLINE_REQUEST',
  RemoveFriend = 'REMOVE_FRIEND',
  Unblock = 'UNBLOCK'
}

export enum FriendshipStatus {
  Accepted = 'ACCEPTED',
  Blocked = 'BLOCKED',
  Declined = 'DECLINED',
  GotRequest = 'GOT_REQUEST',
  None = 'NONE',
  SentRequest = 'SENT_REQUEST'
}

export type GetMyProfileResponse = GetMyProfileResponseSuccess | ResponseError;

export type GetMyProfileResponseSuccess = {
  __typename?: 'GetMyProfileResponseSuccess';
  user: User;
};

export type GetStoryInput = {
  storyID: Scalars['ID']['input'];
};

export type GetStoryResponse = GetStoryResponseSuccess | ResponseError;

export type GetStoryResponseSuccess = {
  __typename?: 'GetStoryResponseSuccess';
  story: Story;
};

export enum LanguageEnum {
  Arabic = 'arabic',
  Chinese = 'chinese',
  English = 'english',
  Japanese = 'japanese',
  Korean = 'korean',
  Spanish = 'spanish',
  Thai = 'thai',
  Vietnamese = 'vietnamese'
}

export type ListChatRoomsResponse = ListChatRoomsResponseSuccess | ResponseError;

export type ListChatRoomsResponseSuccess = {
  __typename?: 'ListChatRoomsResponseSuccess';
  chatRooms: Array<ChatRoom>;
};

export type ListContactsInput = {
  nonce?: InputMaybe<Scalars['String']['input']>;
};

export type ListContactsResponse = ListContactsResponseSuccess | ResponseError;

export type ListContactsResponseSuccess = {
  __typename?: 'ListContactsResponseSuccess';
  contacts: Array<Contact>;
  globalDirectory: Array<Contact>;
};

export type ListWishlistInput = {
  userID: Scalars['UserID']['input'];
};

export type ListWishlistResponse = ListWishlistResponseSuccess | ResponseError;

export type ListWishlistResponseSuccess = {
  __typename?: 'ListWishlistResponseSuccess';
  wishlist: Array<Wish>;
};

export type ManageFriendshipInput = {
  action: FriendshipAction;
  friendID: Scalars['UserID']['input'];
};

export type ManageFriendshipResponse = ManageFriendshipResponseSuccess | ResponseError;

export type ManageFriendshipResponseSuccess = {
  __typename?: 'ManageFriendshipResponseSuccess';
  status: FriendshipStatus;
};

export type MarkNotificationsAsReadInput = {
  read: Array<Scalars['ID']['input']>;
  unread: Array<Scalars['ID']['input']>;
};

export type MarkNotificationsAsReadResponse = MarkNotificationsAsReadResponseSuccess | ResponseError;

export type MarkNotificationsAsReadResponseSuccess = {
  __typename?: 'MarkNotificationsAsReadResponseSuccess';
  notifications: Array<NotificationGql>;
};

export type MediaSet = {
  __typename?: 'MediaSet';
  large?: Maybe<Scalars['String']['output']>;
  medium: Scalars['String']['output'];
  small: Scalars['String']['output'];
};

export type ModifyProfileInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<LanguageEnum>;
  link?: InputMaybe<Scalars['String']['input']>;
  privacyMode?: InputMaybe<PrivacyModeEnum>;
  themeColor?: InputMaybe<Scalars['HexColorCode']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type ModifyProfileResponse = ModifyProfileResponseSuccess | ResponseError;

export type ModifyProfileResponseSuccess = {
  __typename?: 'ModifyProfileResponseSuccess';
  user: User;
};

export type ModifyStoryInput = {
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  previewable?: InputMaybe<Scalars['Boolean']['input']>;
  showcase?: InputMaybe<Scalars['Boolean']['input']>;
  storyID: Scalars['ID']['input'];
};

export type ModifyStoryResponse = ModifyStoryResponseSuccess | ResponseError;

export type ModifyStoryResponseSuccess = {
  __typename?: 'ModifyStoryResponseSuccess';
  story: Story;
};

export type Mutation = {
  __typename?: 'Mutation';
  createStory: CreateStoryResponse;
  createWish: CreateWishResponse;
  demoMutation: DemoMutationResponse;
  manageFriendship: ManageFriendshipResponse;
  markNotificationsAsRead: MarkNotificationsAsReadResponse;
  modifyProfile: ModifyProfileResponse;
  modifyStory: ModifyStoryResponse;
  revokePushTokens: RevokePushTokensResponse;
  sendFriendRequest: SendFriendRequestResponse;
  updateChatSettings: UpdateChatSettingsResponse;
  updatePushToken: UpdatePushTokenResponse;
};


export type MutationCreateStoryArgs = {
  input: CreateStoryInput;
};


export type MutationCreateWishArgs = {
  input: CreateWishInput;
};


export type MutationDemoMutationArgs = {
  input: DemoMutationInput;
};


export type MutationManageFriendshipArgs = {
  input: ManageFriendshipInput;
};


export type MutationMarkNotificationsAsReadArgs = {
  input: MarkNotificationsAsReadInput;
};


export type MutationModifyProfileArgs = {
  input: ModifyProfileInput;
};


export type MutationModifyStoryArgs = {
  input: ModifyStoryInput;
};


export type MutationSendFriendRequestArgs = {
  input: SendFriendRequestInput;
};


export type MutationUpdateChatSettingsArgs = {
  input: UpdateChatSettingsInput;
};


export type MutationUpdatePushTokenArgs = {
  input: UpdatePushTokenInput;
};

export type NotificationGql = {
  __typename?: 'NotificationGql';
  createdAt: Scalars['DateString']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  markedRead: Scalars['Boolean']['output'];
  relatedChatRoomID?: Maybe<Scalars['ID']['output']>;
  route?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type Ping = {
  __typename?: 'Ping';
  timestamp: Scalars['String']['output'];
};

export enum PrivacyModeEnum {
  Hidden = 'hidden',
  Private = 'private',
  Public = 'public'
}

export type PushConfig = {
  __typename?: 'PushConfig';
  allowPush?: Maybe<Scalars['Boolean']['output']>;
  snoozeUntil?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  checkUsernameAvailable: CheckUsernameAvailableResponse;
  demoPing: Ping;
  demoQuery: DemoQueryResponse;
  enterChatRoom: EnterChatRoomResponse;
  fetchRecentNotifications: FetchRecentNotificationsResponse;
  fetchStoryFeed: FetchStoryFeedResponse;
  getMyProfile: GetMyProfileResponse;
  getStory: GetStoryResponse;
  listChatRooms: ListChatRoomsResponse;
  listContacts: ListContactsResponse;
  listWishlist: ListWishlistResponse;
  ping: Ping;
  viewPublicProfile: ViewPublicProfileResponse;
};


export type QueryCheckUsernameAvailableArgs = {
  input: CheckUsernameAvailableInput;
};


export type QueryDemoQueryArgs = {
  input: DemoQueryInput;
};


export type QueryEnterChatRoomArgs = {
  input: EnterChatRoomInput;
};


export type QueryFetchRecentNotificationsArgs = {
  input: FetchRecentNotificationsInput;
};


export type QueryFetchStoryFeedArgs = {
  input: FetchStoryFeedInput;
};


export type QueryGetStoryArgs = {
  input: GetStoryInput;
};


export type QueryListContactsArgs = {
  input: ListContactsInput;
};


export type QueryListWishlistArgs = {
  input: ListWishlistInput;
};


export type QueryViewPublicProfileArgs = {
  input: ViewPublicProfileInput;
};

export type ResponseError = {
  __typename?: 'ResponseError';
  error: Status;
};

export type RevokePushTokensResponse = ResponseError | RevokePushTokensResponseSuccess;

export type RevokePushTokensResponseSuccess = {
  __typename?: 'RevokePushTokensResponseSuccess';
  status: Scalars['String']['output'];
};

export type SendFriendRequestInput = {
  note?: InputMaybe<Scalars['String']['input']>;
  recipientID: Scalars['UserID']['input'];
  utmAttribution?: InputMaybe<Scalars['String']['input']>;
};

export type SendFriendRequestResponse = ResponseError | SendFriendRequestResponseSuccess;

export type SendFriendRequestResponseSuccess = {
  __typename?: 'SendFriendRequestResponseSuccess';
  status: FriendshipStatus;
};

export type Status = {
  __typename?: 'Status';
  code: StatusCode;
  message: Scalars['String']['output'];
};

export enum StatusCode {
  BadRequest = 'BadRequest',
  Forbidden = 'Forbidden',
  InvalidOperation = 'InvalidOperation',
  NotFound = 'NotFound',
  NotImplemented = 'NotImplemented',
  ServerError = 'ServerError',
  Success = 'Success',
  Unauthorized = 'Unauthorized'
}

export type Story = {
  __typename?: 'Story';
  attachments: Array<StoryAttachment>;
  author: StoryAuthor;
  caption?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateString']['output']>;
  expiresAt?: Maybe<Scalars['DateString']['output']>;
  id: Scalars['ID']['output'];
  outboundLink?: Maybe<Scalars['String']['output']>;
  pinned?: Maybe<Scalars['Boolean']['output']>;
  showcase?: Maybe<Scalars['Boolean']['output']>;
  showcaseThumbnail?: Maybe<Scalars['String']['output']>;
  thumbnail: Scalars['String']['output'];
  userID: Scalars['UserID']['output'];
};

export type StoryAttachment = {
  __typename?: 'StoryAttachment';
  altText?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  stream?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  type: StoryAttachmentType;
  url: Scalars['String']['output'];
  userID: Scalars['UserID']['output'];
};

export enum StoryAttachmentType {
  Image = 'IMAGE',
  Video = 'VIDEO'
}

export type StoryAuthor = {
  __typename?: 'StoryAuthor';
  avatar: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  id: Scalars['UserID']['output'];
  username: Scalars['String']['output'];
};

export type StoryMediaAttachmentInput = {
  assetID: Scalars['String']['input'];
  type: StoryAttachmentType;
  url: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  demoSubscription: DemoSubscriptionEvent;
};

export type UpdateChatSettingsInput = {
  allowPush?: InputMaybe<Scalars['Boolean']['input']>;
  chatRoomID: Scalars['String']['input'];
  snoozeUntil?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateChatSettingsResponse = ResponseError | UpdateChatSettingsResponseSuccess;

export type UpdateChatSettingsResponseSuccess = {
  __typename?: 'UpdateChatSettingsResponseSuccess';
  chatRoom: ChatRoom;
};

export type UpdatePushTokenInput = {
  active: Scalars['Boolean']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  token: Scalars['PushToken']['input'];
};

export type UpdatePushTokenResponse = ResponseError | UpdatePushTokenResponseSuccess;

export type UpdatePushTokenResponseSuccess = {
  __typename?: 'UpdatePushTokenResponseSuccess';
  status: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  avatar: Scalars['String']['output'];
  bio: Scalars['String']['output'];
  createdAt: Scalars['DateString']['output'];
  disabled: Scalars['Boolean']['output'];
  displayName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['UserID']['output'];
  isCreator: Scalars['Boolean']['output'];
  isPaidChat: Scalars['Boolean']['output'];
  language: LanguageEnum;
  link: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  privacyMode: PrivacyModeEnum;
  sendBirdAccessToken?: Maybe<Scalars['String']['output']>;
  stories: Array<Story>;
  themeColor: Scalars['HexColorCode']['output'];
  username: Scalars['String']['output'];
};

export type ViewPublicProfileInput = {
  userID?: InputMaybe<Scalars['UserID']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type ViewPublicProfileResponse = ResponseError | ViewPublicProfileResponseSuccess;

export type ViewPublicProfileResponseSuccess = {
  __typename?: 'ViewPublicProfileResponseSuccess';
  avatar?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  id: Scalars['UserID']['output'];
  stories: Array<Story>;
  username: Scalars['String']['output'];
};

export type Wish = {
  __typename?: 'Wish';
  cookiePrice: Scalars['Int']['output'];
  creatorID: Scalars['ID']['output'];
  description: Scalars['String']['output'];
  galleryMediaSet: Array<MediaSet>;
  id: Scalars['ID']['output'];
  isFavorite: Scalars['Boolean']['output'];
  stickerMediaSet: MediaSet;
  stickerTitle: Scalars['String']['output'];
  thumbnail: Scalars['String']['output'];
  wishTitle: Scalars['String']['output'];
};

export type ListChatRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListChatRoomsQuery = { __typename?: 'Query', listChatRooms: { __typename: 'ListChatRoomsResponseSuccess', chatRooms: Array<{ __typename?: 'ChatRoom', chatRoomID: string, participants: Array<any>, sendBirdParticipants: Array<any>, sendBirdChannelURL?: string | null, pushConfig?: { __typename?: 'PushConfig', snoozeUntil?: string | null, allowPush?: boolean | null } | null }> } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type EnterChatRoomQueryQueryVariables = Exact<{
  input: EnterChatRoomInput;
}>;


export type EnterChatRoomQueryQuery = { __typename?: 'Query', enterChatRoom: { __typename: 'EnterChatRoomResponseSuccess', isNew: boolean, chatRoom: { __typename?: 'ChatRoom', chatRoomID: string, participants: Array<any>, sendBirdParticipants: Array<any>, sendBirdChannelURL?: string | null, pushConfig?: { __typename?: 'PushConfig', snoozeUntil?: string | null, allowPush?: boolean | null } | null } } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type UpdateChatSettingsMutationVariables = Exact<{
  input: UpdateChatSettingsInput;
}>;


export type UpdateChatSettingsMutation = { __typename?: 'Mutation', updateChatSettings: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'UpdateChatSettingsResponseSuccess', chatRoom: { __typename?: 'ChatRoom', chatRoomID: string, participants: Array<any>, sendBirdParticipants: Array<any>, sendBirdChannelURL?: string | null, pushConfig?: { __typename?: 'PushConfig', snoozeUntil?: string | null, allowPush?: boolean | null } | null } } };

export type SendFriendRequestMutationVariables = Exact<{
  input: SendFriendRequestInput;
}>;


export type SendFriendRequestMutation = { __typename?: 'Mutation', sendFriendRequest: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'SendFriendRequestResponseSuccess', status: FriendshipStatus } };

export type ViewPublicProfileQueryVariables = Exact<{
  input: ViewPublicProfileInput;
}>;


export type ViewPublicProfileQuery = { __typename?: 'Query', viewPublicProfile: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'ViewPublicProfileResponseSuccess', id: any, username: string, avatar?: string | null, displayName?: string | null, stories: Array<{ __typename?: 'Story', id: string, userID: any, caption?: string | null, pinned?: boolean | null, showcase?: boolean | null, thumbnail: string, showcaseThumbnail?: string | null, outboundLink?: string | null, createdAt?: any | null, expiresAt?: any | null, attachments: Array<{ __typename?: 'StoryAttachment', id: string, userID: any, thumbnail?: string | null, stream?: string | null, altText?: string | null, url: string, type: StoryAttachmentType }>, author: { __typename?: 'StoryAuthor', id: any, username: string, avatar: string, displayName: string } }> } };

export type ManageFriendshipMutationVariables = Exact<{
  input: ManageFriendshipInput;
}>;


export type ManageFriendshipMutation = { __typename?: 'Mutation', manageFriendship: { __typename: 'ManageFriendshipResponseSuccess', status: FriendshipStatus } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type GetMyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyProfileQuery = { __typename?: 'Query', getMyProfile: { __typename: 'GetMyProfileResponseSuccess', user: { __typename?: 'User', id: any, email: string, username: string, phone?: string | null, displayName: string, bio: string, avatar: string, link: string, disabled: boolean, isPaidChat: boolean, isCreator: boolean, createdAt: any, privacyMode: PrivacyModeEnum, themeColor: any, language: LanguageEnum, sendBirdAccessToken?: string | null, stories: Array<{ __typename?: 'Story', id: string, userID: any, caption?: string | null, pinned?: boolean | null, showcase?: boolean | null, thumbnail: string, showcaseThumbnail?: string | null, outboundLink?: string | null, createdAt?: any | null, expiresAt?: any | null, attachments: Array<{ __typename?: 'StoryAttachment', id: string, userID: any, thumbnail?: string | null, stream?: string | null, altText?: string | null, url: string, type: StoryAttachmentType }>, author: { __typename?: 'StoryAuthor', id: any, username: string, avatar: string, displayName: string } }> } } | { __typename: 'ResponseError' } };

export type CheckUsernameAvailableQueryVariables = Exact<{
  input: CheckUsernameAvailableInput;
}>;


export type CheckUsernameAvailableQuery = { __typename?: 'Query', checkUsernameAvailable: { __typename: 'CheckUsernameAvailableResponseSuccess', isAvailable: boolean } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type ModifyProfileMutationVariables = Exact<{
  input: ModifyProfileInput;
}>;


export type ModifyProfileMutation = { __typename?: 'Mutation', modifyProfile: { __typename: 'ModifyProfileResponseSuccess', user: { __typename?: 'User', id: any, avatar: string, username: string, displayName: string, bio: string, link: string, language: LanguageEnum, themeColor: any, privacyMode: PrivacyModeEnum } } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type ListContactsQueryVariables = Exact<{
  input: ListContactsInput;
}>;


export type ListContactsQuery = { __typename?: 'Query', listContacts: { __typename: 'ListContactsResponseSuccess', contacts: Array<{ __typename?: 'Contact', friendID: any, username?: string | null, displayName: string, avatar?: string | null, status?: FriendshipStatus | null }>, globalDirectory: Array<{ __typename?: 'Contact', friendID: any, username?: string | null, displayName: string, avatar?: string | null, status?: FriendshipStatus | null }> } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type FetchRecentNotificationsQueryVariables = Exact<{
  input: FetchRecentNotificationsInput;
}>;


export type FetchRecentNotificationsQuery = { __typename?: 'Query', fetchRecentNotifications: { __typename: 'FetchRecentNotificationsResponseSuccess', notifications: Array<{ __typename?: 'NotificationGql', id: string, title: string, description?: string | null, route?: string | null, thumbnail?: string | null, relatedChatRoomID?: string | null, createdAt: any, markedRead: boolean }> } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type MarkNotificationsAsReadMutationVariables = Exact<{
  input: MarkNotificationsAsReadInput;
}>;


export type MarkNotificationsAsReadMutation = { __typename?: 'Mutation', markNotificationsAsRead: { __typename: 'MarkNotificationsAsReadResponseSuccess', notifications: Array<{ __typename?: 'NotificationGql', id: string, title: string, description?: string | null, route?: string | null, thumbnail?: string | null, relatedChatRoomID?: string | null, createdAt: any, markedRead: boolean }> } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type CreateStoryMutationVariables = Exact<{
  input: CreateStoryInput;
}>;


export type CreateStoryMutation = { __typename?: 'Mutation', createStory: { __typename: 'CreateStoryResponseSuccess', story: { __typename?: 'Story', id: string, userID: any, caption?: string | null, pinned?: boolean | null, thumbnail: string, showcaseThumbnail?: string | null, outboundLink?: string | null, createdAt?: any | null, expiresAt?: any | null, attachments: Array<{ __typename?: 'StoryAttachment', id: string, thumbnail?: string | null, stream?: string | null, altText?: string | null, url: string, type: StoryAttachmentType }>, author: { __typename?: 'StoryAuthor', id: any, username: string, avatar: string, displayName: string } } } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type GetStoryQueryVariables = Exact<{
  input: GetStoryInput;
}>;


export type GetStoryQuery = { __typename?: 'Query', getStory: { __typename: 'GetStoryResponseSuccess', story: { __typename?: 'Story', id: string, userID: any, caption?: string | null, pinned?: boolean | null, thumbnail: string, showcaseThumbnail?: string | null, outboundLink?: string | null, createdAt?: any | null, expiresAt?: any | null, attachments: Array<{ __typename?: 'StoryAttachment', id: string, thumbnail?: string | null, stream?: string | null, altText?: string | null, url: string, type: StoryAttachmentType }>, author: { __typename?: 'StoryAuthor', id: any, username: string, avatar: string, displayName: string } } } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type FetchStoryFeedQueryVariables = Exact<{
  input: FetchStoryFeedInput;
}>;


export type FetchStoryFeedQuery = { __typename?: 'Query', fetchStoryFeed: { __typename: 'FetchStoryFeedResponseSuccess', stories: Array<{ __typename?: 'Story', id: string, userID: any, caption?: string | null, pinned?: boolean | null, thumbnail: string, showcaseThumbnail?: string | null, outboundLink?: string | null, createdAt?: any | null, expiresAt?: any | null, attachments: Array<{ __typename?: 'StoryAttachment', id: string, thumbnail?: string | null, stream?: string | null, altText?: string | null, url: string, type: StoryAttachmentType }>, author: { __typename?: 'StoryAuthor', id: any, username: string, avatar: string, displayName: string } }> } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type ModifyStoryMutationVariables = Exact<{
  input: ModifyStoryInput;
}>;


export type ModifyStoryMutation = { __typename?: 'Mutation', modifyStory: { __typename: 'ModifyStoryResponseSuccess', story: { __typename?: 'Story', id: string, userID: any, caption?: string | null, pinned?: boolean | null, showcase?: boolean | null, thumbnail: string, showcaseThumbnail?: string | null, outboundLink?: string | null, createdAt?: any | null, expiresAt?: any | null, attachments: Array<{ __typename?: 'StoryAttachment', id: string, thumbnail?: string | null, stream?: string | null, altText?: string | null, url: string, type: StoryAttachmentType }>, author: { __typename?: 'StoryAuthor', id: any, username: string, avatar: string, displayName: string } } } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type DemoQueryQueryVariables = Exact<{
  input: DemoQueryInput;
}>;


export type DemoQueryQuery = { __typename?: 'Query', demoQuery: { __typename: 'DemoQueryResponseSuccess', message: string } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type DemoMutationMutationVariables = Exact<{
  input: DemoMutationInput;
}>;


export type DemoMutationMutation = { __typename?: 'Mutation', demoMutation: { __typename: 'DemoMutationResponseSuccess', item: { __typename?: 'DemoMutatedItem', id: string, title: string } } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type DemoSubscriptionSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type DemoSubscriptionSubscription = { __typename?: 'Subscription', demoSubscription: { __typename?: 'DemoSubscriptionEvent', message: string } };

export type DemoPingQueryVariables = Exact<{ [key: string]: never; }>;


export type DemoPingQuery = { __typename?: 'Query', demoPing: { __typename?: 'Ping', timestamp: string } };

export type UpdatePushTokenMutationVariables = Exact<{
  input: UpdatePushTokenInput;
}>;


export type UpdatePushTokenMutation = { __typename?: 'Mutation', updatePushToken: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'UpdatePushTokenResponseSuccess', status: string } };

export type RevokePushTokensMutationVariables = Exact<{ [key: string]: never; }>;


export type RevokePushTokensMutation = { __typename?: 'Mutation', revokePushTokens: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'RevokePushTokensResponseSuccess', status: string } };

export type CreateWishMutationVariables = Exact<{
  input: CreateWishInput;
}>;


export type CreateWishMutation = { __typename?: 'Mutation', createWish: { __typename: 'CreateWishResponseSuccess', wish: { __typename?: 'Wish', id: string, creatorID: string, wishTitle: string, stickerTitle: string, description: string, thumbnail: string, cookiePrice: number, isFavorite: boolean, galleryMediaSet: Array<{ __typename?: 'MediaSet', small: string, medium: string, large?: string | null }>, stickerMediaSet: { __typename?: 'MediaSet', small: string, medium: string, large?: string | null } } } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };
