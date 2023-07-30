
import { i18n_Mapping } from "./types.i18n.shared";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "updateButtonHeader.___shared": "업데이트",
"backButtonHeader.___shared": "뒤쪽에",
"cancelButton.___shared": "취소",
"privacyModeEnum.public.___shared": "공공의",
"privacyModeEnum.private.___shared": "사적인",
"privacyModeEnum.hidden.___shared": "숨겨진",
"privacyModeEnum_helpTip.public.___shared": "공개 프로필은 모든 사람으로부터 메시지를 받을 수 있으며 사용자 이름은 모든 사람이 볼 수 있습니다.",
"privacyModeEnum_helpTip.private.___shared": "비공개 프로필은 수락된 친구의 메시지만 받을 수 있습니다. 여전히 사용자 이름으로 찾을 수 있습니다.",
"privacyModeEnum_helpTip.hidden.___shared": "숨겨진 프로필은 사용자 이름으로 찾을 수 없습니다. 메시지를 받으려면 친구를 추가하거나 특별한 비공개 초대 링크를 사용해야 합니다.",
  };
  return language;
};
  