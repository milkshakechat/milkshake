export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "ProfileSettingsPage";
const phrases: PhraseSet[] = [
  { key: "alertSentFriendRequest", text: "Sent a friend request" },
  { key: "alertWaitingForAcceptance", text: "Waiting for acceptance" },
  { key: "alertDeclinedRequest", text: "Declined request" },
  { key: "alertBlockedUser", text: "Blocked user" },
  { key: "labelNotFriends", text: "Not Friends" },
  { key: "labelFriendRequestSent", text: "Friend Request Sent" },
  { key: "labelSearchContacts", text: "Search Contacts" },
  { key: "labelFriends", text: "Friends" },
  { key: "btnCancel", text: "Cancel" },
  { key: "btnGroupChat", text: "Group Chat" },
  { key: "btnViewProfile", text: "View Profile" },
  { key: "btnRemove", text: "Remove" },
  { key: "btnBlock", text: "Block" },
  { key: "btnChat", text: "Chat" },
  { key: "btnStartGroupChat", text: "Start Group Chat" },
  { key: "labelRequests", text: "Requests" },
  { key: "btnSendAgain", text: "Send Again" },
  { key: "btnUnblock", text: "Unblock" },
  { key: "btnDecline", text: "Decline" },
  { key: "alertAcceptedRequest", text: "Accepted friend request" },
  { key: "btnAccept", text: "Accept" },
  { key: "btnAddFriend", text: "Add Friend" },
  { key: "labelContacts", text: "Contacts" },
  { key: "labelQRCode", text: "QR Code" },
  { key: "btnBack", text: "Back" },
  { key: "btnAdd", text: "Add" },
  { key: "alertDeclinedRequest2", text: "Declined friend request" },
  { key: "btnConfirmDecline", text: "Yes, Decline" },
  { key: "labelHighlightDecline", text: "DECLINE" },
  { key: "labelAreYouSure", text: "Are you sure you want to" },
  { key: "labelThisFriendRequest", text: "this friend request?" },
  { key: "alertRemovedFriends", text: "Removed from friends" },
  { key: "btnYesRemove", text: "Yes, Remove" },
  { key: "btnBoldRemove", text: "REMOVE" },
  {
    key: "labelRemoveFriendExplain",
    text: "this friend? They will have to accept a new friend request if you want to chat.",
  },
  { key: "btnYesBlock", text: "Yes, Block" },
  { key: "btnBoldBlock", text: "BLOCK" },
  {
    key: "labelRemoveFriendConfirmm",
    text: "this contact? They will not be able to send you messages or friend requests.",
  },
  { key: "btnYesUnblock", text: "Yes, Unblock" },
  { key: "labelBoldUnblock", text: "UNBLOCK" },
  {
    key: "labelConfirmUnblockK",
    text: "this contact? They will be able to see you exist.",
  },
  { key: "btnNo", text: "No" },
  { key: "alertCancelledRequest", text: "Cancelled friend request" },
  { key: "btnYesCancel", text: "Yes, Cancel" },
  { key: "labelBoldCancel", text: "CANCEL" },
  {
    key: "labelConfirmCancelExplain",
    text: "your friend request? You can send another one later.",
  },
  { key: "btnSearch", text: "Search" },
  { key: "btnSearchLabel", text: "Exact Username Search" },
  { key: "btnVisitProfile", text: "Visit Profile" },
  { key: "labelSearchUsers", text: "Search Users" },
  { key: "alertMustExactMatch", text: "Must be an exact username match" },
  { key: "alertCopieidProfileLink", text: "Copied profile link!" },
  { key: "btnCopyURL", text: "Copy URL" },
  { key: "btnClose", text: "Close" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
