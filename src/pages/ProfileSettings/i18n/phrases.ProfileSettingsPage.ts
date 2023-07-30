
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
  { key: "alertAllowNotif", text: "Allowed Notifications" },
{ key: "alertMutedNotif", text: "Muted Notifications" },
{ key: "infoUploading", text: "Uploading..." },
{ key: "labelChangeGroupPhoto", text: "Change Group Photo" },
{ key: "btnMute3Hours", text: "Mute for 3 hours" },
{ key: "btnUnMute", text: "Unmute" },
{ key: "btnMute1Day", text: "Mute for 1 day" },
{ key: "btnMuteIndef", text: "Mute Indefinately" },
{ key: "labelYourBalance", text: "Your Balance" },
{ key: "alertBoughtPremiumChat", text: "Bought premium chat for friends! Check your wallet confirmation in a few minutes." },
{ key: "btnConfirmPurchase", text: "Confirm Purchase" },
{ key: "labelGiftPremiumLong", text: "Gift Premium Chat" },
{ key: "infoBuyPremium", text: "Buy Premium Chat for your group members. 1 month = 1 cookie" },
{ key: "labelYourBalanceCookies", text: "cookies" },
{ key: "btnCancel", text: "Cancel" },
{ key: "btnMute", text: "Mute" },
{ key: "btnUnmute", text: "Unmute" },
{ key: "labelUploading", text: "Uploading..." },
{ key: "labelGroupchatName", text: "Groupchat Name" },
{ key: "labelGroupchatMembers", text: "Groupchat Members" },
{ key: "labelGiftPremium", text: "Gift Premium" },
{ key: "btnInvite", text: "Invite" },
{ key: "labelAddFriendChat", text: "Add Friend to Groupchat" },
{ key: "infoOnlyAdminsInvite", text: "Only admins can invite their friends to a groupchat" },
{ key: "tagAdmin", text: "Admin" },
{ key: "tagInviteSent", text: "Invite Sent" },
{ key: "menuViewProfile", text: "View Profile" },
{ key: "menuMakeAdmin", text: "Make Admin" },
{ key: "popConfirmResignTitle", text: "Confirm resign?" },
{ key: "popConfirmResignBody", text: "Are you sure you want to resign as admin? You may only leave the chat by resigning first. There must be at least 1 admin." },
{ key: "alertResignedAdmin", text: "Resigned as groupchat admin" },
{ key: "labelResignAdmin", text: "Resign Admin" },
{ key: "popConfirmRemoval", text: "Confirm removal?" },
{ key: "infoRemoveMember", text: "Are you sure you want to remove them from this groupchat?" },
{ key: "alertRemovedMember", text: "Removed them from groupchat!" },
{ key: "btnYes", text: "Yes" },
{ key: "btnNo", text: "No" },
{ key: "btnRemove", text: "Remove" },
{ key: "btnViewProfile", text: "View Profile" },
{ key: "btnConfirmLeave", text: "Confirm leave?" },
{ key: "infoLeaveGroupchat", text: "Are you sure you want to leave the groupchat? You can only rejoin if an admin friend re-invites you." },
{ key: "alertLeftGroupchat", text: "Left the groupchat" },
{ key: "menuLeaveChat", text: "Leave Chat" },
{ key: "linkUpdateSettings", text: "Update Settings" },
{ key: "switchLabelPro", text: "Pro" },
{ key: "switchLabelFree", text: "Free" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  