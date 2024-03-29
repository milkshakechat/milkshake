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
  WalletAliasID: { input: any; output: any; }
};

export type AddFriendToChatInput = {
  chatRoomID: Scalars['String']['input'];
  friendID: Scalars['UserID']['input'];
};

export type AddFriendToChatResponse = AddFriendToChatResponseSuccess | ResponseError;

export type AddFriendToChatResponseSuccess = {
  __typename?: 'AddFriendToChatResponseSuccess';
  status: Scalars['String']['output'];
};

export type AdminChatSettingsInput = {
  chatRoomID: Scalars['String']['input'];
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type AdminChatSettingsResponse = AdminChatSettingsResponseSuccess | ResponseError;

export type AdminChatSettingsResponseSuccess = {
  __typename?: 'AdminChatSettingsResponseSuccess';
  chatRoom: ChatRoom;
};

export type CancelSubscriptionInput = {
  purchaseManifestID: Scalars['String']['input'];
};

export type CancelSubscriptionResponse = CancelSubscriptionResponseSuccess | ResponseError;

export type CancelSubscriptionResponseSuccess = {
  __typename?: 'CancelSubscriptionResponseSuccess';
  status: Scalars['String']['output'];
};

export type CashOutTransactionInput = {
  initiatorWallet: Scalars['String']['input'];
  txMirrorID: Scalars['String']['input'];
};

export type CashOutTransactionResponse = CashOutTransactionResponseSuccess | ResponseError;

export type CashOutTransactionResponseSuccess = {
  __typename?: 'CashOutTransactionResponseSuccess';
  referenceID: Scalars['String']['output'];
};

export type ChatRoom = {
  __typename?: 'ChatRoom';
  admins: Array<Scalars['UserID']['output']>;
  chatRoomID: Scalars['String']['output'];
  participants: Array<Scalars['UserID']['output']>;
  pushConfig?: Maybe<PushConfig>;
  sendBirdChannelURL?: Maybe<Scalars['String']['output']>;
  thumbnail: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type CheckMerchantStatusInput = {
  getControlPanel?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CheckMerchantStatusResponse = CheckMerchantStatusResponseSuccess | ResponseError;

export type CheckMerchantStatusResponseSuccess = {
  __typename?: 'CheckMerchantStatusResponseSuccess';
  summary: MerchantOnboardingStatusSummary;
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

export type CreatePaymentIntentInput = {
  attribution?: InputMaybe<Scalars['String']['input']>;
  chatRoomID?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  promoCode?: InputMaybe<Scalars['String']['input']>;
  wishSuggest: WishSuggest;
};

export type CreatePaymentIntentResponse = CreatePaymentIntentResponseSuccess | ResponseError;

export type CreatePaymentIntentResponseSuccess = {
  __typename?: 'CreatePaymentIntentResponseSuccess';
  checkoutToken?: Maybe<Scalars['String']['output']>;
  purchaseManifestID: Scalars['String']['output'];
  referenceID: Scalars['String']['output'];
};

export type CreateSetupIntentResponse = CreateSetupIntentResponseSuccess | ResponseError;

export type CreateSetupIntentResponseSuccess = {
  __typename?: 'CreateSetupIntentResponseSuccess';
  clientSecret: Scalars['String']['output'];
};

export type CreateStoryInput = {
  allowSwipe?: InputMaybe<Scalars['Boolean']['input']>;
  caption: Scalars['String']['input'];
  geoPlaceID?: InputMaybe<Scalars['String']['input']>;
  linkedWishID?: InputMaybe<Scalars['String']['input']>;
  media?: InputMaybe<StoryMediaAttachmentInput>;
};

export type CreateStoryResponse = CreateStoryResponseSuccess | ResponseError;

export type CreateStoryResponseSuccess = {
  __typename?: 'CreateStoryResponseSuccess';
  story: Story;
};

export type CreateWishInput = {
  buyFrequency?: InputMaybe<WishBuyFrequency>;
  cookiePrice: Scalars['Int']['input'];
  countdownDate?: InputMaybe<Scalars['DateString']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  externalURL?: InputMaybe<Scalars['String']['input']>;
  isFavorite?: InputMaybe<Scalars['Boolean']['input']>;
  stickerGraphic?: InputMaybe<Scalars['String']['input']>;
  stickerTitle?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<WishlistVisibility>;
  wishGraphics?: InputMaybe<Array<Scalars['String']['input']>>;
  wishTitle: Scalars['String']['input'];
  wishType: WishTypeEnum;
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

export type FetchSwipeFeedInput = {
  nonce: Scalars['String']['input'];
};

export type FetchSwipeFeedResponse = FetchSwipeFeedResponseSuccess | ResponseError;

export type FetchSwipeFeedResponseSuccess = {
  __typename?: 'FetchSwipeFeedResponseSuccess';
  swipeStack: Array<SwipeStory>;
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
  Acquaintance = 'ACQUAINTANCE',
  Blocked = 'BLOCKED',
  Declined = 'DECLINED',
  GotRequest = 'GOT_REQUEST',
  None = 'NONE',
  SentRequest = 'SENT_REQUEST'
}

export enum GenderEnum {
  Female = 'female',
  Male = 'male',
  Other = 'other',
  Unknown = 'unknown'
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

export type GetWishInput = {
  wishID: Scalars['ID']['input'];
};

export type GetWishResponse = GetWishResponseSuccess | ResponseError;

export type GetWishResponseSuccess = {
  __typename?: 'GetWishResponseSuccess';
  wish: Wish;
};

export type InteractStoryInput = {
  storyID: Scalars['ID']['input'];
  swipeDislike?: InputMaybe<Scalars['String']['input']>;
  swipeLike?: InputMaybe<Scalars['String']['input']>;
  viewed?: InputMaybe<Scalars['String']['input']>;
};

export type InteractStoryResponse = InteractStoryResponseSuccess | ResponseError;

export type InteractStoryResponseSuccess = {
  __typename?: 'InteractStoryResponseSuccess';
  status: Scalars['String']['output'];
};

export enum LanguageEnum {
  Arabic = 'arabic',
  Bengali = 'bengali',
  Chinese = 'chinese',
  English = 'english',
  French = 'french',
  German = 'german',
  Hindi = 'hindi',
  Indonesian = 'indonesian',
  Italian = 'italian',
  Japanese = 'japanese',
  Korean = 'korean',
  Malaysian = 'malaysian',
  Polish = 'polish',
  Portuguese = 'portuguese',
  Russian = 'russian',
  Spanish = 'spanish',
  Tagalog = 'tagalog',
  Thai = 'thai',
  Turkish = 'turkish',
  Ukrainian = 'ukrainian',
  Urdu = 'urdu',
  Vietnamese = 'vietnamese'
}

export type LeaveChatInput = {
  chatRoomID: Scalars['String']['input'];
  targetUserID: Scalars['UserID']['input'];
};

export type LeaveChatResponse = LeaveChatResponseSuccess | ResponseError;

export type LeaveChatResponseSuccess = {
  __typename?: 'LeaveChatResponseSuccess';
  status: Scalars['String']['output'];
};

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
};

export type ListWishlistInput = {
  userID?: InputMaybe<Scalars['UserID']['input']>;
};

export type ListWishlistResponse = ListWishlistResponseSuccess | ResponseError;

export type ListWishlistResponseSuccess = {
  __typename?: 'ListWishlistResponseSuccess';
  wishlist: Array<Wish>;
};

export type LocationInfo = {
  __typename?: 'LocationInfo';
  geoHash: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  title: Scalars['String']['output'];
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

export type MerchantOnboardingStatusCapabilities = {
  __typename?: 'MerchantOnboardingStatusCapabilities';
  card_payments?: Maybe<Scalars['String']['output']>;
  charges_enabled: Scalars['Boolean']['output'];
  payouts_enabled: Scalars['Boolean']['output'];
  transfers?: Maybe<Scalars['String']['output']>;
};

export type MerchantOnboardingStatusSummary = {
  __typename?: 'MerchantOnboardingStatusSummary';
  anythingDue: Scalars['Boolean']['output'];
  anythingErrors: Scalars['Boolean']['output'];
  capabilities: MerchantOnboardingStatusCapabilities;
  email: Scalars['String']['output'];
  escrowWallet: Scalars['ID']['output'];
  hasMerchantPrivilege: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  stripeMerchantID?: Maybe<Scalars['ID']['output']>;
  stripePortalUrl?: Maybe<Scalars['String']['output']>;
  tradingWallet: Scalars['ID']['output'];
  userID: Scalars['ID']['output'];
};

export type ModifyProfileInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<GenderEnum>;
  geoPlaceID?: InputMaybe<Scalars['String']['input']>;
  interestedIn?: InputMaybe<Array<GenderEnum>>;
  language?: InputMaybe<LanguageEnum>;
  link?: InputMaybe<Scalars['String']['input']>;
  prefAboutMe?: InputMaybe<Scalars['String']['input']>;
  prefGeoBias?: InputMaybe<Scalars['Boolean']['input']>;
  prefLookingFor?: InputMaybe<Scalars['String']['input']>;
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
  addFriendToChat: AddFriendToChatResponse;
  adminChatSettings: AdminChatSettingsResponse;
  cancelSubscription: CancelSubscriptionResponse;
  cashOutTransaction: CashOutTransactionResponse;
  createPaymentIntent: CreatePaymentIntentResponse;
  createSetupIntent: CreateSetupIntentResponse;
  createStory: CreateStoryResponse;
  createWish: CreateWishResponse;
  demoMutation: DemoMutationResponse;
  interactStory: InteractStoryResponse;
  leaveChat: LeaveChatResponse;
  manageFriendship: ManageFriendshipResponse;
  markNotificationsAsRead: MarkNotificationsAsReadResponse;
  modifyProfile: ModifyProfileResponse;
  modifyStory: ModifyStoryResponse;
  promoteAdmin: PromoteAdminResponse;
  recallTransaction: RecallTransactionResponse;
  requestMerchantOnboarding: RequestMerchantOnboardingResponse;
  resignAdmin: ResignAdminResponse;
  revokePushTokens: RevokePushTokensResponse;
  savePaymentMethod: SavePaymentMethodResponse;
  sendFreeChat: SendFreeChatResponse;
  sendFriendRequest: SendFriendRequestResponse;
  sendTransfer: SendTransferResponse;
  socialPoke: SocialPokeResponse;
  topUpWallet: TopUpWalletResponse;
  updateChatSettings: UpdateChatSettingsResponse;
  updatePushToken: UpdatePushTokenResponse;
  updateWish: UpdateWishResponse;
  upgradePremiumChat: UpgradePremiumChatResponse;
};


export type MutationAddFriendToChatArgs = {
  input: AddFriendToChatInput;
};


export type MutationAdminChatSettingsArgs = {
  input: AdminChatSettingsInput;
};


export type MutationCancelSubscriptionArgs = {
  input: CancelSubscriptionInput;
};


export type MutationCashOutTransactionArgs = {
  input: CashOutTransactionInput;
};


export type MutationCreatePaymentIntentArgs = {
  input: CreatePaymentIntentInput;
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


export type MutationInteractStoryArgs = {
  input: InteractStoryInput;
};


export type MutationLeaveChatArgs = {
  input: LeaveChatInput;
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


export type MutationPromoteAdminArgs = {
  input: PromoteAdminInput;
};


export type MutationRecallTransactionArgs = {
  input: RecallTransactionInput;
};


export type MutationResignAdminArgs = {
  input: ResignAdminInput;
};


export type MutationSavePaymentMethodArgs = {
  input: SavePaymentMethodInput;
};


export type MutationSendFreeChatArgs = {
  input: SendFreeChatInput;
};


export type MutationSendFriendRequestArgs = {
  input: SendFriendRequestInput;
};


export type MutationSendTransferArgs = {
  input: SendTransferInput;
};


export type MutationSocialPokeArgs = {
  input: SocialPokeInput;
};


export type MutationTopUpWalletArgs = {
  input: TopUpWalletInput;
};


export type MutationUpdateChatSettingsArgs = {
  input: UpdateChatSettingsInput;
};


export type MutationUpdatePushTokenArgs = {
  input: UpdatePushTokenInput;
};


export type MutationUpdateWishArgs = {
  input: UpdateWishInput;
};


export type MutationUpgradePremiumChatArgs = {
  input: UpgradePremiumChatInput;
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

export enum PokeActionType {
  BookmarkWish = 'BOOKMARK_WISH',
  LikeStory = 'LIKE_STORY'
}

export type PremiumChatGiftReceiver = {
  months: Scalars['Int']['input'];
  targetUserID: Scalars['UserID']['input'];
};

export enum PrivacyModeEnum {
  Hidden = 'hidden',
  Private = 'private',
  Public = 'public'
}

export type PromoteAdminInput = {
  chatRoomID: Scalars['String']['input'];
  memberID: Scalars['UserID']['input'];
};

export type PromoteAdminResponse = PromoteAdminResponseSuccess | ResponseError;

export type PromoteAdminResponseSuccess = {
  __typename?: 'PromoteAdminResponseSuccess';
  status: Scalars['String']['output'];
};

export type PushConfig = {
  __typename?: 'PushConfig';
  allowPush?: Maybe<Scalars['Boolean']['output']>;
  snoozeUntil?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  checkMerchantStatus: CheckMerchantStatusResponse;
  checkUsernameAvailable: CheckUsernameAvailableResponse;
  demoPing: Ping;
  demoQuery: DemoQueryResponse;
  enterChatRoom: EnterChatRoomResponse;
  fetchRecentNotifications: FetchRecentNotificationsResponse;
  fetchStoryFeed: FetchStoryFeedResponse;
  fetchSwipeFeed: FetchSwipeFeedResponse;
  getMyProfile: GetMyProfileResponse;
  getStory: GetStoryResponse;
  getWish: GetWishResponse;
  listChatRooms: ListChatRoomsResponse;
  listContacts: ListContactsResponse;
  listWishlist: ListWishlistResponse;
  ping: Ping;
  viewPublicProfile: ViewPublicProfileResponse;
};


export type QueryCheckMerchantStatusArgs = {
  input: CheckMerchantStatusInput;
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


export type QueryFetchSwipeFeedArgs = {
  input: FetchSwipeFeedInput;
};


export type QueryGetStoryArgs = {
  input: GetStoryInput;
};


export type QueryGetWishArgs = {
  input: GetWishInput;
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

export type RecallTransactionInput = {
  recallerNote?: InputMaybe<Scalars['String']['input']>;
  txMirrorID: Scalars['String']['input'];
};

export type RecallTransactionResponse = RecallTransactionResponseSuccess | ResponseError;

export type RecallTransactionResponseSuccess = {
  __typename?: 'RecallTransactionResponseSuccess';
  referenceID: Scalars['String']['output'];
};

export type RequestMerchantOnboardingResponse = RequestMerchantOnboardingResponseSuccess | ResponseError;

export type RequestMerchantOnboardingResponseSuccess = {
  __typename?: 'RequestMerchantOnboardingResponseSuccess';
  registrationUrl: Scalars['String']['output'];
};

export type ResignAdminInput = {
  chatRoomID: Scalars['String']['input'];
};

export type ResignAdminResponse = ResignAdminResponseSuccess | ResponseError;

export type ResignAdminResponseSuccess = {
  __typename?: 'ResignAdminResponseSuccess';
  status: Scalars['String']['output'];
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

export type SavePaymentMethodInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  paymentMethodID: Scalars['String']['input'];
};

export type SavePaymentMethodResponse = ResponseError | SavePaymentMethodResponseSuccess;

export type SavePaymentMethodResponseSuccess = {
  __typename?: 'SavePaymentMethodResponseSuccess';
  paymentMethodID: Scalars['String']['output'];
};

export type SendFreeChatInput = {
  chatRoomID: Scalars['String']['input'];
  message: Scalars['String']['input'];
};

export type SendFreeChatResponse = ResponseError | SendFreeChatResponseSuccess;

export type SendFreeChatResponseSuccess = {
  __typename?: 'SendFreeChatResponseSuccess';
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

export type SendTransferInput = {
  amount: Scalars['Int']['input'];
  isPermaTransfer?: InputMaybe<Scalars['Boolean']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  recipientID: Scalars['UserID']['input'];
};

export type SendTransferResponse = ResponseError | SendTransferResponseSuccess;

export type SendTransferResponseSuccess = {
  __typename?: 'SendTransferResponseSuccess';
  referenceID: Scalars['String']['output'];
};

export type SocialPokeInput = {
  pokeActionType: PokeActionType;
  resourceID: Scalars['String']['input'];
  targetUserID: Scalars['UserID']['input'];
};

export type SocialPokeResponse = ResponseError | SocialPokeResponseSuccess;

export type SocialPokeResponseSuccess = {
  __typename?: 'SocialPokeResponseSuccess';
  status: Scalars['String']['output'];
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
  linkedWishID?: Maybe<Scalars['String']['output']>;
  location?: Maybe<LocationInfo>;
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

export type SwipeStory = {
  __typename?: 'SwipeStory';
  story: Story;
  wish?: Maybe<Wish>;
};

export type TopUpWalletInput = {
  amount: Scalars['Int']['input'];
  promoCode?: InputMaybe<Scalars['String']['input']>;
};

export type TopUpWalletResponse = ResponseError | TopUpWalletResponseSuccess;

export type TopUpWalletResponseSuccess = {
  __typename?: 'TopUpWalletResponseSuccess';
  checkoutToken?: Maybe<Scalars['String']['output']>;
  purchaseManifestID: Scalars['String']['output'];
  referenceID: Scalars['String']['output'];
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

export type UpdateWishInput = {
  buyFrequency?: InputMaybe<WishBuyFrequency>;
  cookiePrice?: InputMaybe<Scalars['Int']['input']>;
  countdownDate?: InputMaybe<Scalars['DateString']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  externalURL?: InputMaybe<Scalars['String']['input']>;
  isFavorite?: InputMaybe<Scalars['Boolean']['input']>;
  stickerGraphic?: InputMaybe<Scalars['String']['input']>;
  stickerTitle?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<WishlistVisibility>;
  wishGraphics?: InputMaybe<Array<Scalars['String']['input']>>;
  wishID: Scalars['ID']['input'];
  wishTitle?: InputMaybe<Scalars['String']['input']>;
  wishType?: InputMaybe<WishTypeEnum>;
};

export type UpdateWishResponse = ResponseError | UpdateWishResponseSuccess;

export type UpdateWishResponseSuccess = {
  __typename?: 'UpdateWishResponseSuccess';
  wish: Wish;
};

export type UpgradePremiumChatInput = {
  chatRoomID?: InputMaybe<Scalars['String']['input']>;
  targets: Array<PremiumChatGiftReceiver>;
};

export type UpgradePremiumChatResponse = ResponseError | UpgradePremiumChatResponseSuccess;

export type UpgradePremiumChatResponseSuccess = {
  __typename?: 'UpgradePremiumChatResponseSuccess';
  referenceIDs: Array<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  avatar: Scalars['String']['output'];
  bio: Scalars['String']['output'];
  createdAt: Scalars['DateString']['output'];
  currency: Scalars['String']['output'];
  defaultPaymentMethodID?: Maybe<Scalars['String']['output']>;
  disabled: Scalars['Boolean']['output'];
  displayName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  escrowWallet?: Maybe<Scalars['WalletAliasID']['output']>;
  fxRateFromUSD: Scalars['Float']['output'];
  gender: GenderEnum;
  id: Scalars['UserID']['output'];
  interestedIn: Array<GenderEnum>;
  isCreator: Scalars['Boolean']['output'];
  isPaidChat: Scalars['Boolean']['output'];
  language: LanguageEnum;
  link: Scalars['String']['output'];
  location?: Maybe<LocationInfo>;
  phone?: Maybe<Scalars['String']['output']>;
  prefAboutMe?: Maybe<Scalars['String']['output']>;
  prefGeoBias?: Maybe<Scalars['Boolean']['output']>;
  prefLookingFor?: Maybe<Scalars['String']['output']>;
  privacyMode: PrivacyModeEnum;
  sendBirdAccessToken?: Maybe<Scalars['String']['output']>;
  stories: Array<Story>;
  themeColor: Scalars['HexColorCode']['output'];
  tradingWallet?: Maybe<Scalars['WalletAliasID']['output']>;
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
  bio?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  id: Scalars['UserID']['output'];
  privacyMode: PrivacyModeEnum;
  stories: Array<Story>;
  username: Scalars['String']['output'];
};

export type Wish = {
  __typename?: 'Wish';
  author?: Maybe<WishAuthor>;
  buyFrequency: WishBuyFrequency;
  cookiePrice: Scalars['Int']['output'];
  countdownDate?: Maybe<Scalars['DateString']['output']>;
  createdAt: Scalars['DateString']['output'];
  creatorID: Scalars['ID']['output'];
  description: Scalars['String']['output'];
  externalURL?: Maybe<Scalars['String']['output']>;
  galleryMediaSet: Array<MediaSet>;
  id: Scalars['ID']['output'];
  isFavorite: Scalars['Boolean']['output'];
  stickerMediaSet: MediaSet;
  stickerTitle: Scalars['String']['output'];
  thumbnail: Scalars['String']['output'];
  visibility: WishlistVisibility;
  wishTitle: Scalars['String']['output'];
  wishType: WishTypeEnum;
};

export type WishAuthor = {
  __typename?: 'WishAuthor';
  avatar: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  id: Scalars['UserID']['output'];
  username: Scalars['String']['output'];
};

export enum WishBuyFrequency {
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  OneTime = 'ONE_TIME',
  Weekly = 'WEEKLY'
}

export type WishSuggest = {
  suggestedAmount?: InputMaybe<Scalars['Int']['input']>;
  suggestedFrequency?: InputMaybe<WishBuyFrequency>;
  wishID: Scalars['ID']['input'];
};

export enum WishTypeEnum {
  Event = 'EVENT',
  Gift = 'GIFT'
}

export enum WishlistVisibility {
  FriendsOnly = 'FRIENDS_ONLY',
  Hidden = 'HIDDEN',
  PublicMarketplace = 'PUBLIC_MARKETPLACE'
}

export type EnterChatRoomQueryQueryVariables = Exact<{
  input: EnterChatRoomInput;
}>;


export type EnterChatRoomQueryQuery = { __typename?: 'Query', enterChatRoom: { __typename: 'EnterChatRoomResponseSuccess', isNew: boolean, chatRoom: { __typename?: 'ChatRoom', chatRoomID: string, participants: Array<any>, admins: Array<any>, sendBirdChannelURL?: string | null, title: string, thumbnail: string, pushConfig?: { __typename?: 'PushConfig', snoozeUntil?: string | null, allowPush?: boolean | null } | null } } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type UpdateChatSettingsMutationVariables = Exact<{
  input: UpdateChatSettingsInput;
}>;


export type UpdateChatSettingsMutation = { __typename?: 'Mutation', updateChatSettings: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'UpdateChatSettingsResponseSuccess', chatRoom: { __typename?: 'ChatRoom', chatRoomID: string, participants: Array<any>, sendBirdChannelURL?: string | null, title: string, thumbnail: string, pushConfig?: { __typename?: 'PushConfig', snoozeUntil?: string | null, allowPush?: boolean | null } | null } } };

export type SendFreeChatMutationVariables = Exact<{
  input: SendFreeChatInput;
}>;


export type SendFreeChatMutation = { __typename?: 'Mutation', sendFreeChat: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'SendFreeChatResponseSuccess', status: string } };

export type UpgradePremiumChatMutationVariables = Exact<{
  input: UpgradePremiumChatInput;
}>;


export type UpgradePremiumChatMutation = { __typename?: 'Mutation', upgradePremiumChat: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'UpgradePremiumChatResponseSuccess', referenceIDs: Array<string> } };

export type AddFriendToChatMutationVariables = Exact<{
  input: AddFriendToChatInput;
}>;


export type AddFriendToChatMutation = { __typename?: 'Mutation', addFriendToChat: { __typename: 'AddFriendToChatResponseSuccess', status: string } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type LeaveChatMutationVariables = Exact<{
  input: LeaveChatInput;
}>;


export type LeaveChatMutation = { __typename?: 'Mutation', leaveChat: { __typename: 'LeaveChatResponseSuccess', status: string } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type ResignAdminMutationVariables = Exact<{
  input: ResignAdminInput;
}>;


export type ResignAdminMutation = { __typename?: 'Mutation', resignAdmin: { __typename: 'ResignAdminResponseSuccess', status: string } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type PromoteAdminMutationVariables = Exact<{
  input: PromoteAdminInput;
}>;


export type PromoteAdminMutation = { __typename?: 'Mutation', promoteAdmin: { __typename: 'PromoteAdminResponseSuccess', status: string } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type AdminChatSettingsMutationVariables = Exact<{
  input: AdminChatSettingsInput;
}>;


export type AdminChatSettingsMutation = { __typename?: 'Mutation', adminChatSettings: { __typename: 'AdminChatSettingsResponseSuccess', chatRoom: { __typename?: 'ChatRoom', chatRoomID: string, participants: Array<any>, admins: Array<any>, sendBirdChannelURL?: string | null, title: string, thumbnail: string } } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type SendFriendRequestMutationVariables = Exact<{
  input: SendFriendRequestInput;
}>;


export type SendFriendRequestMutation = { __typename?: 'Mutation', sendFriendRequest: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'SendFriendRequestResponseSuccess', status: FriendshipStatus } };

export type ViewPublicProfileQueryVariables = Exact<{
  input: ViewPublicProfileInput;
}>;


export type ViewPublicProfileQuery = { __typename?: 'Query', viewPublicProfile: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'ViewPublicProfileResponseSuccess', id: any, username: string, avatar?: string | null, displayName?: string | null, bio?: string | null, privacyMode: PrivacyModeEnum, stories: Array<{ __typename?: 'Story', id: string, userID: any, caption?: string | null, pinned?: boolean | null, showcase?: boolean | null, thumbnail: string, showcaseThumbnail?: string | null, outboundLink?: string | null, createdAt?: any | null, expiresAt?: any | null, attachments: Array<{ __typename?: 'StoryAttachment', id: string, userID: any, thumbnail?: string | null, stream?: string | null, altText?: string | null, url: string, type: StoryAttachmentType }>, author: { __typename?: 'StoryAuthor', id: any, username: string, avatar: string, displayName: string } }> } };

export type ManageFriendshipMutationVariables = Exact<{
  input: ManageFriendshipInput;
}>;


export type ManageFriendshipMutation = { __typename?: 'Mutation', manageFriendship: { __typename: 'ManageFriendshipResponseSuccess', status: FriendshipStatus } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type SocialPokeMutationVariables = Exact<{
  input: SocialPokeInput;
}>;


export type SocialPokeMutation = { __typename?: 'Mutation', socialPoke: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'SocialPokeResponseSuccess', status: string } };

export type CheckMerchantStatusQueryVariables = Exact<{
  input: CheckMerchantStatusInput;
}>;


export type CheckMerchantStatusQuery = { __typename?: 'Query', checkMerchantStatus: { __typename: 'CheckMerchantStatusResponseSuccess', summary: { __typename?: 'MerchantOnboardingStatusSummary', userID: string, tradingWallet: string, escrowWallet: string, name: string, email: string, hasMerchantPrivilege: boolean, stripeMerchantID?: string | null, stripePortalUrl?: string | null, anythingDue: boolean, anythingErrors: boolean, capabilities: { __typename?: 'MerchantOnboardingStatusCapabilities', card_payments?: string | null, transfers?: string | null, charges_enabled: boolean, payouts_enabled: boolean } } } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type RequestMerchantOnboardingMutationVariables = Exact<{ [key: string]: never; }>;


export type RequestMerchantOnboardingMutation = { __typename?: 'Mutation', requestMerchantOnboarding: { __typename: 'RequestMerchantOnboardingResponseSuccess', registrationUrl: string } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type GetMyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyProfileQuery = { __typename?: 'Query', getMyProfile: { __typename: 'GetMyProfileResponseSuccess', user: { __typename?: 'User', id: any, email: string, username: string, phone?: string | null, displayName: string, bio: string, avatar: string, link: string, disabled: boolean, isPaidChat: boolean, isCreator: boolean, createdAt: any, privacyMode: PrivacyModeEnum, themeColor: any, language: LanguageEnum, gender: GenderEnum, interestedIn: Array<GenderEnum>, sendBirdAccessToken?: string | null, tradingWallet?: any | null, escrowWallet?: any | null, defaultPaymentMethodID?: string | null, currency: string, fxRateFromUSD: number, prefGeoBias?: boolean | null, prefAboutMe?: string | null, prefLookingFor?: string | null, location?: { __typename?: 'LocationInfo', title: string, geoHash: string, latitude: number, longitude: number } | null, stories: Array<{ __typename?: 'Story', id: string, userID: any, caption?: string | null, pinned?: boolean | null, showcase?: boolean | null, thumbnail: string, showcaseThumbnail?: string | null, outboundLink?: string | null, createdAt?: any | null, expiresAt?: any | null, attachments: Array<{ __typename?: 'StoryAttachment', id: string, userID: any, thumbnail?: string | null, stream?: string | null, altText?: string | null, url: string, type: StoryAttachmentType }>, author: { __typename?: 'StoryAuthor', id: any, username: string, avatar: string, displayName: string } }> } } | { __typename: 'ResponseError' } };

export type CheckUsernameAvailableQueryVariables = Exact<{
  input: CheckUsernameAvailableInput;
}>;


export type CheckUsernameAvailableQuery = { __typename?: 'Query', checkUsernameAvailable: { __typename: 'CheckUsernameAvailableResponseSuccess', isAvailable: boolean } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type ModifyProfileMutationVariables = Exact<{
  input: ModifyProfileInput;
}>;


export type ModifyProfileMutation = { __typename?: 'Mutation', modifyProfile: { __typename: 'ModifyProfileResponseSuccess', user: { __typename?: 'User', id: any, avatar: string, username: string, displayName: string, bio: string, link: string, email: string, language: LanguageEnum, themeColor: any, privacyMode: PrivacyModeEnum, currency: string, fxRateFromUSD: number, gender: GenderEnum, interestedIn: Array<GenderEnum>, prefGeoBias?: boolean | null, prefAboutMe?: string | null, prefLookingFor?: string | null, location?: { __typename?: 'LocationInfo', title: string, geoHash: string, latitude: number, longitude: number } | null } } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

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


export type CreateStoryMutation = { __typename?: 'Mutation', createStory: { __typename: 'CreateStoryResponseSuccess', story: { __typename?: 'Story', id: string, userID: any, caption?: string | null, pinned?: boolean | null, thumbnail: string, showcaseThumbnail?: string | null, outboundLink?: string | null, createdAt?: any | null, expiresAt?: any | null, linkedWishID?: string | null, location?: { __typename?: 'LocationInfo', title: string, geoHash: string, latitude: number, longitude: number } | null, attachments: Array<{ __typename?: 'StoryAttachment', id: string, thumbnail?: string | null, stream?: string | null, altText?: string | null, url: string, type: StoryAttachmentType }>, author: { __typename?: 'StoryAuthor', id: any, username: string, avatar: string, displayName: string } } } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type GetStoryQueryVariables = Exact<{
  input: GetStoryInput;
}>;


export type GetStoryQuery = { __typename?: 'Query', getStory: { __typename: 'GetStoryResponseSuccess', story: { __typename?: 'Story', id: string, userID: any, caption?: string | null, pinned?: boolean | null, thumbnail: string, showcaseThumbnail?: string | null, outboundLink?: string | null, createdAt?: any | null, expiresAt?: any | null, linkedWishID?: string | null, location?: { __typename?: 'LocationInfo', title: string, geoHash: string, latitude: number, longitude: number } | null, attachments: Array<{ __typename?: 'StoryAttachment', id: string, thumbnail?: string | null, stream?: string | null, altText?: string | null, url: string, type: StoryAttachmentType }>, author: { __typename?: 'StoryAuthor', id: any, username: string, avatar: string, displayName: string } } } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type FetchStoryFeedQueryVariables = Exact<{
  input: FetchStoryFeedInput;
}>;


export type FetchStoryFeedQuery = { __typename?: 'Query', fetchStoryFeed: { __typename: 'FetchStoryFeedResponseSuccess', stories: Array<{ __typename?: 'Story', id: string, userID: any, caption?: string | null, pinned?: boolean | null, thumbnail: string, showcaseThumbnail?: string | null, outboundLink?: string | null, createdAt?: any | null, expiresAt?: any | null, linkedWishID?: string | null, location?: { __typename?: 'LocationInfo', title: string, geoHash: string, latitude: number, longitude: number } | null, attachments: Array<{ __typename?: 'StoryAttachment', id: string, thumbnail?: string | null, stream?: string | null, altText?: string | null, url: string, type: StoryAttachmentType }>, author: { __typename?: 'StoryAuthor', id: any, username: string, avatar: string, displayName: string } }> } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type ModifyStoryMutationVariables = Exact<{
  input: ModifyStoryInput;
}>;


export type ModifyStoryMutation = { __typename?: 'Mutation', modifyStory: { __typename: 'ModifyStoryResponseSuccess', story: { __typename?: 'Story', id: string, userID: any, caption?: string | null, pinned?: boolean | null, showcase?: boolean | null, thumbnail: string, showcaseThumbnail?: string | null, outboundLink?: string | null, createdAt?: any | null, expiresAt?: any | null, linkedWishID?: string | null, location?: { __typename?: 'LocationInfo', title: string, geoHash: string, latitude: number, longitude: number } | null, attachments: Array<{ __typename?: 'StoryAttachment', id: string, thumbnail?: string | null, stream?: string | null, altText?: string | null, url: string, type: StoryAttachmentType }>, author: { __typename?: 'StoryAuthor', id: any, username: string, avatar: string, displayName: string } } } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type CreateSetupIntentMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateSetupIntentMutation = { __typename?: 'Mutation', createSetupIntent: { __typename: 'CreateSetupIntentResponseSuccess', clientSecret: string } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type SavePaymentMethodMutationVariables = Exact<{
  input: SavePaymentMethodInput;
}>;


export type SavePaymentMethodMutation = { __typename?: 'Mutation', savePaymentMethod: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'SavePaymentMethodResponseSuccess', paymentMethodID: string } };

export type FetchSwipeFeedQueryVariables = Exact<{
  input: FetchSwipeFeedInput;
}>;


export type FetchSwipeFeedQuery = { __typename?: 'Query', fetchSwipeFeed: { __typename: 'FetchSwipeFeedResponseSuccess', swipeStack: Array<{ __typename?: 'SwipeStory', story: { __typename?: 'Story', id: string, userID: any, caption?: string | null, pinned?: boolean | null, thumbnail: string, showcaseThumbnail?: string | null, outboundLink?: string | null, createdAt?: any | null, expiresAt?: any | null, linkedWishID?: string | null, attachments: Array<{ __typename?: 'StoryAttachment', id: string, thumbnail?: string | null, stream?: string | null, altText?: string | null, url: string, type: StoryAttachmentType }>, author: { __typename?: 'StoryAuthor', id: any, username: string, avatar: string, displayName: string } }, wish?: { __typename?: 'Wish', id: string, creatorID: string, wishTitle: string, stickerTitle: string, description: string, thumbnail: string, cookiePrice: number, visibility: WishlistVisibility, isFavorite: boolean, buyFrequency: WishBuyFrequency, createdAt: any, wishType: WishTypeEnum, countdownDate?: any | null, externalURL?: string | null, galleryMediaSet: Array<{ __typename?: 'MediaSet', small: string, medium: string, large?: string | null }>, stickerMediaSet: { __typename?: 'MediaSet', small: string, medium: string, large?: string | null }, author?: { __typename?: 'WishAuthor', id: any, username: string, avatar: string, displayName: string } | null } | null }> } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type InteractStoryMutationVariables = Exact<{
  input: InteractStoryInput;
}>;


export type InteractStoryMutation = { __typename?: 'Mutation', interactStory: { __typename: 'InteractStoryResponseSuccess', status: string } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

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

export type SendTransferMutationVariables = Exact<{
  input: SendTransferInput;
}>;


export type SendTransferMutation = { __typename?: 'Mutation', sendTransfer: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'SendTransferResponseSuccess', referenceID: string } };

export type RecallTransactionMutationVariables = Exact<{
  input: RecallTransactionInput;
}>;


export type RecallTransactionMutation = { __typename?: 'Mutation', recallTransaction: { __typename: 'RecallTransactionResponseSuccess', referenceID: string } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type CreatePaymentIntentMutationVariables = Exact<{
  input: CreatePaymentIntentInput;
}>;


export type CreatePaymentIntentMutation = { __typename?: 'Mutation', createPaymentIntent: { __typename: 'CreatePaymentIntentResponseSuccess', checkoutToken?: string | null, referenceID: string, purchaseManifestID: string } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type CancelSubscriptionMutationVariables = Exact<{
  input: CancelSubscriptionInput;
}>;


export type CancelSubscriptionMutation = { __typename?: 'Mutation', cancelSubscription: { __typename: 'CancelSubscriptionResponseSuccess', status: string } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type TopUpWalletMutationVariables = Exact<{
  input: TopUpWalletInput;
}>;


export type TopUpWalletMutation = { __typename?: 'Mutation', topUpWallet: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'TopUpWalletResponseSuccess', checkoutToken?: string | null, referenceID: string, purchaseManifestID: string } };

export type CashOutTransactionMutationVariables = Exact<{
  input: CashOutTransactionInput;
}>;


export type CashOutTransactionMutation = { __typename?: 'Mutation', cashOutTransaction: { __typename: 'CashOutTransactionResponseSuccess', referenceID: string } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type UpdatePushTokenMutationVariables = Exact<{
  input: UpdatePushTokenInput;
}>;


export type UpdatePushTokenMutation = { __typename?: 'Mutation', updatePushToken: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'UpdatePushTokenResponseSuccess', status: string } };

export type RevokePushTokensMutationVariables = Exact<{ [key: string]: never; }>;


export type RevokePushTokensMutation = { __typename?: 'Mutation', revokePushTokens: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'RevokePushTokensResponseSuccess', status: string } };

export type CreateWishMutationVariables = Exact<{
  input: CreateWishInput;
}>;


export type CreateWishMutation = { __typename?: 'Mutation', createWish: { __typename: 'CreateWishResponseSuccess', wish: { __typename?: 'Wish', id: string, creatorID: string, wishTitle: string, stickerTitle: string, description: string, thumbnail: string, cookiePrice: number, visibility: WishlistVisibility, isFavorite: boolean, buyFrequency: WishBuyFrequency, createdAt: any, wishType: WishTypeEnum, countdownDate?: any | null, externalURL?: string | null, galleryMediaSet: Array<{ __typename?: 'MediaSet', small: string, medium: string, large?: string | null }>, stickerMediaSet: { __typename?: 'MediaSet', small: string, medium: string, large?: string | null } } } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type ListWishlistQueryVariables = Exact<{
  input: ListWishlistInput;
}>;


export type ListWishlistQuery = { __typename?: 'Query', listWishlist: { __typename: 'ListWishlistResponseSuccess', wishlist: Array<{ __typename?: 'Wish', id: string, creatorID: string, wishTitle: string, stickerTitle: string, description: string, thumbnail: string, cookiePrice: number, visibility: WishlistVisibility, isFavorite: boolean, buyFrequency: WishBuyFrequency, createdAt: any, wishType: WishTypeEnum, countdownDate?: any | null, externalURL?: string | null, galleryMediaSet: Array<{ __typename?: 'MediaSet', small: string, medium: string, large?: string | null }>, stickerMediaSet: { __typename?: 'MediaSet', small: string, medium: string, large?: string | null }, author?: { __typename?: 'WishAuthor', id: any, username: string, avatar: string, displayName: string } | null }> } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type GetWishQueryVariables = Exact<{
  input: GetWishInput;
}>;


export type GetWishQuery = { __typename?: 'Query', getWish: { __typename: 'GetWishResponseSuccess', wish: { __typename?: 'Wish', id: string, creatorID: string, wishTitle: string, stickerTitle: string, description: string, thumbnail: string, cookiePrice: number, visibility: WishlistVisibility, isFavorite: boolean, buyFrequency: WishBuyFrequency, createdAt: any, wishType: WishTypeEnum, countdownDate?: any | null, externalURL?: string | null, galleryMediaSet: Array<{ __typename?: 'MediaSet', small: string, medium: string, large?: string | null }>, stickerMediaSet: { __typename?: 'MediaSet', small: string, medium: string, large?: string | null }, author?: { __typename?: 'WishAuthor', id: any, username: string, avatar: string, displayName: string } | null } } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type UpdateWishMutationVariables = Exact<{
  input: UpdateWishInput;
}>;


export type UpdateWishMutation = { __typename?: 'Mutation', updateWish: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'UpdateWishResponseSuccess', wish: { __typename?: 'Wish', id: string, creatorID: string, wishTitle: string, stickerTitle: string, description: string, thumbnail: string, cookiePrice: number, visibility: WishlistVisibility, isFavorite: boolean, buyFrequency: WishBuyFrequency, createdAt: any, wishType: WishTypeEnum, countdownDate?: any | null, externalURL?: string | null, galleryMediaSet: Array<{ __typename?: 'MediaSet', small: string, medium: string, large?: string | null }>, stickerMediaSet: { __typename?: 'MediaSet', small: string, medium: string, large?: string | null } } } };
