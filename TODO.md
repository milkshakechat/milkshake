# To Do list

## Priority
- [✅] Set up graphql websockets
- [✅] Deploy to staging environment
- [✅] Check for auto-reconnecting websockets
- [✅] Set up pwa manifest and service worker, test deploy with ngrok
- [✅] Set up Zustrand
- [✅] Set up client routing with react-router
- [✅] Set up Firebase auth
- [✅] Fix issue when deployed, all routes go to /index.html and dont load the correct page
- [✅] Set up GraphQL websockets to include firebase auth token
- [✅] Set up backend user auth check helpers
- [✅] Transition backend from using .env to configFiles with secret manager
- [✅] Fix graphql `dairyfarm:authGuard.ts` file to properly instantiate firebase.auth using secret key loading
- [✅] Investigate `graphql-ws` issue with too many simultaneous connections from same client
- [✅] Test server side SendBird user creation
- [✅] Test SendBird client (fix localStorage too! initial load throws `Failed to connect to Sendbird: Error: Store is not initialized.`)
- [✅] Investigate how to prevent unauth SendBird client from creating new accounts
- [✅] Write skeleton of GQL & Firestore schema
- [✅] Determine whether cookie ownership balance should be on User or wallet abstraction
- [✅] Scope out responsibilities of frontend chat sdk vs backend server
- [🔵] Write interface skeleton of the base graphql operations
- [ ] Create GQL query for client to get SendBird user access token. Set up full flow
- [ ] Test SendBird chat ui
- [ ] Set up initial app skeleton
- [ ] Set up Firebase cloudfns
- [ ] Set up Firestore database (fn: onCreateUser)
- [ ] Set up Firebase storage
- [ ] Set up Firebase bucket ACL to only allow user to save to their own folder route
- [ ] Set up Zustrand with persistent memory. [docs](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
- [ ] Set up i18n language support
- [ ] Set up exclusive usernames and add blacklist of usernames (system usernames)


## Prod Release
- [ ] Set up prod version of google cloud project

## Backlog
- [ ] Disable graphql introspection in prod
- [ ] Update service worker to cache images and fonts from a list of authorized domains (currently only caches from same domain). [docs](https://create-react-app.dev/docs/making-a-progressive-web-app/)
- [ ] Set up a way to test the service worker locally (because by default it won't work in development env)
- [ ] Add partytown to the project so that app loads faster and load other scripts after [docs](https://www.youtube.com/watch?v=ZZIR1NGwy-s). for google tag manager & other scripts. [docs](https://partytown.builder.io/common-services)
- [ ] Set up SendBird auth tokens after setup of Firebase auth. Only allow secure chat. [docs](https://sendbird.com/docs/chat/v4/javascript/application/authenticating-a-user/authentication#2-connect-to-the-sendbird-server-with-a-user-id-and-a-token)



## Scaling

- [ ] Connect multiple cloudrun instances with the same memory. concurrent connections can be up to 1000 on a single large cloud run instance. [docs](https://cloud.google.com/run/docs/triggering/websockets)
- [ ] Add prod error masking in server graphql error logs. [docs](https://the-guild.dev/graphql/yoga-server/tutorial/basic/09-error-handling#yoga-error-masking)
- [ ] Check if the way we are doing graphql queries/mutations over websocket subscribe is dangerous for server when scaling to many clients. How does the client and server handle closing these connections? chatgpt said its auto-handled by `graphql-ws` library