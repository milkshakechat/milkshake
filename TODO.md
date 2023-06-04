# To Do list

## Priority
- [✅] Set up graphql websockets
- [✅] Deploy to staging environment
- [✅] Check for auto-reconnecting websockets
- [✅] Set up pwa manifest and service worker, test deploy with ngrok
- [✅] Set up Zustrand
- [ ] Set up client routing with react-router
- [ ] Set up Firebase auth
- [ ] Set up Firebase storage
- [ ] Set up Firestore database
- [ ] Set up i18n language support
- [ ] Set up server side SendBird user creation
- [ ] Transition backend from using .env to configFiles with secret manager
- [ ] Set up backend auth check helpers (including graphql introspection by developers, as well as user auth)
- [ ] Set up SendBird chat
- [ ] Set up firebase bucket ACL to only allow user to save to their own folder route

## Backlog
- [ ] Update service worker to cache images and fonts from a list of authorized domains (currently only caches from same domain). [docs](https://create-react-app.dev/docs/making-a-progressive-web-app/)
- [ ] Set up a way to test the service worker locally (because by default it won't work in development env)
- [ ] Add partytown to the project so that app loads faster and load other scripts after [docs](https://www.youtube.com/watch?v=ZZIR1NGwy-s). for google tag manager & other scripts. [docs](https://partytown.builder.io/common-services)
- [ ] Set up SendBird auth tokens after setup of Firebase auth. Only allow secure chat. [docs](https://sendbird.com/docs/chat/v4/javascript/application/authenticating-a-user/authentication#2-connect-to-the-sendbird-server-with-a-user-id-and-a-token)



## Scaling

- [ ] Connect multiple cloudrun instances with the same memory. concurrent connections can be up to 1000 on a single large cloud run instance. [docs](https://cloud.google.com/run/docs/triggering/websockets)