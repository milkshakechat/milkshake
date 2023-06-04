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

export type DemoMutatedItem = {
  __typename?: 'DemoMutatedItem';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type DemoSubscriptionEvent = {
  __typename?: 'DemoSubscriptionEvent';
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  demoMutation: DemoMutatedItem;
};


export type MutationDemoMutationArgs = {
  title: Scalars['String']['input'];
};

export type Ping = {
  __typename?: 'Ping';
  timestamp: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  demoPing: Ping;
  demoQuery: Scalars['String']['output'];
  ping: Ping;
};


export type QueryDemoQueryArgs = {
  input: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  demoSubscription: DemoSubscriptionEvent;
};

export type DemoQueryQueryVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type DemoQueryQuery = { __typename?: 'Query', demoQuery: string };

export type DemoMutationMutationVariables = Exact<{
  title: Scalars['String']['input'];
}>;


export type DemoMutationMutation = { __typename?: 'Mutation', demoMutation: { __typename?: 'DemoMutatedItem', id: string, title: string } };

export type DemoSubscriptionSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type DemoSubscriptionSubscription = { __typename?: 'Subscription', demoSubscription: { __typename?: 'DemoSubscriptionEvent', message: string } };

export type DemoPingQueryVariables = Exact<{ [key: string]: never; }>;


export type DemoPingQuery = { __typename?: 'Query', demoPing: { __typename?: 'Ping', timestamp: string } };
