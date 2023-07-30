
import { i18n_Mapping } from "./types.i18n.shared";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "updateButtonHeader.___shared": "アップデート",
"backButtonHeader.___shared": "戻る",
"cancelButton.___shared": "キャンセル",
"privacyModeEnum.public.___shared": "公共",
"privacyModeEnum.private.___shared": "プライベート",
"privacyModeEnum.hidden.___shared": "隠れた",
"privacyModeEnum_helpTip.public.___shared": "公開プロフィールは誰からでもメッセージを受信でき、あなたのユーザー名は誰にでも表示されます。",
"privacyModeEnum_helpTip.private.___shared": "非公開プロフィールは、承認された友達からのみメッセージを受信できます。ユーザー名で引き続き見つけることができます。",
"privacyModeEnum_helpTip.hidden.___shared": "非表示のプロファイルはユーザー名では見つけることができません。メッセージを受信するには友達を追加するか、特別なプライベート招待リンクを使用する必要があります。",
  };
  return language;
};
  