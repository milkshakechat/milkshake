import { i18n_Mapping } from "./types.i18n.shared";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "updateButtonHeader.___shared": "Cập nhật",
    "backButtonHeader.___shared": "Mặt sau",
    "privacyModeEnum.public.___shared": "Công cộng",
    "privacyModeEnum.private.___shared": "Riêng tư",
    "privacyModeEnum.hidden.___shared": "Ẩn giấu",
    "privacyModeEnum_helpTip.public.___shared": `Hồ sơ công khai có thể nhận tin nhắn từ bất kỳ ai và tên người dùng của bạn hiển thị với mọi người.`,
    "privacyModeEnum_helpTip.private.___shared": `Hồ sơ cá nhân chỉ có thể nhận tin nhắn từ bạn bè được chấp nhận. Bạn vẫn có thể được tìm thấy bởi tên người dùng của bạn.`,
    "privacyModeEnum_helpTip.hidden.___shared": `Không thể tìm thấy hồ sơ ẩn theo tên người dùng. Bạn phải thêm bạn bè để nhận tin nhắn hoặc sử dụng liên kết mời riêng tư đặc biệt.`,
  };
  return language;
};
