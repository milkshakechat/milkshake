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
};

export type Annoucement = {
  __typename?: 'Annoucement';
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createStory: Story;
};


export type MutationCreateStoryArgs = {
  title: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  greetings: Scalars['String']['output'];
};


export type QueryGreetingsArgs = {
  input: Scalars['String']['input'];
};

export type Story = {
  __typename?: 'Story';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  announcements: Annoucement;
};

export type GetGreetingsQueryVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type GetGreetingsQuery = { __typename?: 'Query', greetings: string };

export type CreateStoryMutationVariables = Exact<{
  title: Scalars['String']['input'];
}>;


export type CreateStoryMutation = { __typename?: 'Mutation', createStory: { __typename?: 'Story', id: string, title: string } };

export type SubscribeAnnouncementsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeAnnouncementsSubscription = { __typename?: 'Subscription', announcements: { __typename?: 'Annoucement', message: string } };
