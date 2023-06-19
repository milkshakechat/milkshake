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

export type ListContactsResponse = ListContactsResponseSuccess | ResponseError;

export type ListContactsResponseSuccess = {
  __typename?: 'ListContactsResponseSuccess';
  contacts: Array<Contact>;
  globalDirectory: Array<Contact>;
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

export type Mutation = {
  __typename?: 'Mutation';
  demoMutation: DemoMutationResponse;
  manageFriendship: ManageFriendshipResponse;
  modifyProfile: ModifyProfileResponse;
  sendFriendRequest: SendFriendRequestResponse;
  updatePushToken: UpdatePushTokenResponse;
};


export type MutationDemoMutationArgs = {
  input: DemoMutationInput;
};


export type MutationManageFriendshipArgs = {
  input: ManageFriendshipInput;
};


export type MutationModifyProfileArgs = {
  input: ModifyProfileInput;
};


export type MutationSendFriendRequestArgs = {
  input: SendFriendRequestInput;
};


export type MutationUpdatePushTokenArgs = {
  input: UpdatePushTokenInput;
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

export type Query = {
  __typename?: 'Query';
  checkUsernameAvailable: CheckUsernameAvailableResponse;
  demoPing: Ping;
  demoQuery: DemoQueryResponse;
  getMyProfile: GetMyProfileResponse;
  listContacts: ListContactsResponse;
  ping: Ping;
  viewPublicProfile: ViewPublicProfileResponse;
};


export type QueryCheckUsernameAvailableArgs = {
  input: CheckUsernameAvailableInput;
};


export type QueryDemoQueryArgs = {
  input: DemoQueryInput;
};


export type QueryViewPublicProfileArgs = {
  input: ViewPublicProfileInput;
};

export type ResponseError = {
  __typename?: 'ResponseError';
  error: Status;
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

export type Subscription = {
  __typename?: 'Subscription';
  demoSubscription: DemoSubscriptionEvent;
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
  username: Scalars['String']['output'];
};

export type SendFriendRequestMutationVariables = Exact<{
  input: SendFriendRequestInput;
}>;


export type SendFriendRequestMutation = { __typename?: 'Mutation', sendFriendRequest: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'SendFriendRequestResponseSuccess', status: FriendshipStatus } };

export type ViewPublicProfileQueryVariables = Exact<{
  input: ViewPublicProfileInput;
}>;


export type ViewPublicProfileQuery = { __typename?: 'Query', viewPublicProfile: { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } | { __typename: 'ViewPublicProfileResponseSuccess', id: any, username: string, avatar?: string | null, displayName?: string | null } };

export type ManageFriendshipMutationVariables = Exact<{
  input: ManageFriendshipInput;
}>;


export type ManageFriendshipMutation = { __typename?: 'Mutation', manageFriendship: { __typename: 'ManageFriendshipResponseSuccess', status: FriendshipStatus } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type GetMyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyProfileQuery = { __typename?: 'Query', getMyProfile: { __typename: 'GetMyProfileResponseSuccess', user: { __typename?: 'User', id: any, email: string, username: string, phone?: string | null, displayName: string, bio: string, avatar: string, link: string, disabled: boolean, isPaidChat: boolean, isCreator: boolean, createdAt: any, privacyMode: PrivacyModeEnum, themeColor: any, language: LanguageEnum } } | { __typename: 'ResponseError' } };

export type CheckUsernameAvailableQueryVariables = Exact<{
  input: CheckUsernameAvailableInput;
}>;


export type CheckUsernameAvailableQuery = { __typename?: 'Query', checkUsernameAvailable: { __typename: 'CheckUsernameAvailableResponseSuccess', isAvailable: boolean } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type ModifyProfileMutationVariables = Exact<{
  input: ModifyProfileInput;
}>;


export type ModifyProfileMutation = { __typename?: 'Mutation', modifyProfile: { __typename: 'ModifyProfileResponseSuccess', user: { __typename?: 'User', id: any, avatar: string, username: string, displayName: string, bio: string, link: string, language: LanguageEnum, themeColor: any, privacyMode: PrivacyModeEnum } } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

export type ListContactsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListContactsQuery = { __typename?: 'Query', listContacts: { __typename: 'ListContactsResponseSuccess', contacts: Array<{ __typename?: 'Contact', friendID: any, username?: string | null, displayName: string, avatar?: string | null, status?: FriendshipStatus | null }>, globalDirectory: Array<{ __typename?: 'Contact', friendID: any, username?: string | null, displayName: string, avatar?: string | null, status?: FriendshipStatus | null }> } | { __typename: 'ResponseError', error: { __typename?: 'Status', message: string } } };

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
