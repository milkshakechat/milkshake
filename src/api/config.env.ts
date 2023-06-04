const devConfig = {
  GRAPHQL_SOCKET_SERVER: "ws://localhost:8080/graphql",
  SENDBIRD_APP_ID: "D24F8D62-B601-4978-8DFB-F17DB6CD741F",
};
const stagingConfig = {
  GRAPHQL_SOCKET_SERVER:
    "wss://milkshake-sockets-hcdyzvq35a-wm.a.run.app/graphql",
  SENDBIRD_APP_ID: "D24F8D62-B601-4978-8DFB-F17DB6CD741F",
};
const prodConfig = {
  GRAPHQL_SOCKET_SERVER:
    "wss://milkshake-sockets-hcdyzvq35a-wm.a.run.app/graphql",
  SENDBIRD_APP_ID: "D24F8D62-B601-4978-8DFB-F17DB6CD741F",
};

export default (() => {
  // console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV === "production") {
    return prodConfig;
    // @ts-ignore
  } else if (process.env.NODE_ENV === "staging") {
    return stagingConfig;
  }
  return devConfig;
})();
