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
  { key: "title", text: "Edit Profile" },
  { key: "changePicture", text: "Change Picture" },
  { key: "uploading", text: "Uploading..." },
  { key: "displayName", text: "Display Name" },
  { key: "username", text: "Username" },
  { key: "bio", text: "Bio" },
  { key: "link", text: "Link" },
  { key: "usernameAvailable", text: "Username is available" },
  { key: "usernameUnavailable", text: "Username is not available" },
  { key: "titleHiddenPref", text: "Hidden Preferences" },
  {
    key: "explainHiddenPref",
    text: "Let Milkshake help find people you like. Only you can see these preferences.",
  },
  { key: "labelLoc", text: "Location" },
  {
    key: "tooltipLoc",
    text: "When enabled, you will only see stories and people from your chosen location. You can change this anytime.",
  },
  { key: "labelIAmA", text: "I am a..." },
  { key: "labelInterestedIn", text: "Interested in..." },
  { key: "optionMan", text: "Man" },
  { key: "optionWoman", text: "Woman" },
  { key: "optionMen", text: "Men" },
  { key: "optionWomen", text: "Women" },
  { key: "optionOther", text: "Other" },
  { key: "labelMyInterests", text: "My Interests" },
  { key: "labelLookingFor", text: "Looking For" },
  { key: "placeholderLinkWebsite", text: "Link to Website" },
  { key: "placeholderLoc", text: "Anywhere in the world" },
  {
    key: "placeholderMyInterests",
    text: "List some things you like or make you special (both good and bad)",
  },
  { key: "placeholderLookingFor", text: "Describe what you are looking for" },
  { key: "placeholderPublicBio", text: "Public Biography" },
  { key: "placeholderDisplayName", text: "Public Display Name" },
  { key: "placeholderUsername", text: "Public Username" },
  { key: "errorMsgUsername", text: "You must have a username!" },
  {
    key: "errorMsgUsernameChar",
    text: "Username must be more than 1 character",
  },
  { key: "errorMsgMaxChar", text: "Username must be less than 30 characters" },
  {
    key: "errorMsgValidChar",
    text: "Username can only contain letters, numbers, periods and underscores",
  },
  { key: "errorMsgBioChar", text: "Bio must be less than 120 characters" },
  { key: "errorMsgUrl", text: "Must be a valid URL" },
  {
    key: "errorMsgDisplayName",
    text: "Display must be less than 50 characters",
  },
  {
    key: "alertProfileUpdated",
    text: "Profile updated!",
  },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
