import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useUserState } from "@/state/user.state";
import { ScreenSize, useWindowSize } from "@/api/utils/screen";
import { v4 as uuidv4 } from "uuid";
import {
  Affix,
  Avatar,
  Button,
  Carousel,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Space,
  Spin,
  Switch,
  Upload,
  message,
  theme,
} from "antd";
import {
  AppLayoutPadding,
  LayoutInteriorHeader,
  Spacer,
} from "@/components/AppLayout/AppLayout";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import {
  CurrencyEnum,
  Username,
  WishID,
  Wish_Firestore,
  cookieToUSD,
  fxFromUSDToCurrency,
  getCompressedStickerUrl,
  getCompressedWishlistGraphicUrl,
  mapCurrencyEnumToSymbol,
} from "@milkshakechat/helpers";
import { useEffect, useState } from "react";
import {
  LeftOutlined,
  HeartFilled,
  LoadingOutlined,
  CheckCircleFilled,
  DeleteOutlined,
} from "@ant-design/icons";
import useSharedTranslations from "@/i18n/useSharedTranslations";
import { Rule } from "antd/es/form";
import { RcFile } from "antd/es/upload";
import useStorage from "@/hooks/useStorage";
import config from "@/config.env";
import { useCreateWish, useGetWish, useUpdateWish } from "@/hooks/useWish";
import { useWishState } from "@/state/wish.state";
import {
  UpdateWishInput,
  WishBuyFrequency,
  WishTypeEnum,
  WishlistVisibility,
} from "@/api/graphql/types";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import dayjs, { Dayjs } from "dayjs";

const formLayout = "horizontal";

interface StickerInitialFormValue {
  wishTitle: string;
  description: string;
  cookiePrice: number;
}

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

interface NewWishPageProps {}
const NewWishPage = ({}: NewWishPageProps) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const navigate = useNavigate();
  const { wishID: wishIDFromURL } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const { uploadFile } = useStorage();
  const [isUploadingSticker, setIsUploadingSticker] = useState(false);
  const [graphicsUrl, setGraphicsUrl] = useState<string[]>([]);
  const [buyFrequency, setBuyFrequency] = useState<WishBuyFrequency>(
    WishBuyFrequency.OneTime
  );
  const [compressedGraphicsUrl, setCompressedGraphicsUrl] = useState<string[]>(
    []
  );
  const [stickerUrl, setStickerUrl] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [compressedStickerUrl, setCompressedStickerUrl] = useState("");
  const tab = searchParams.get("tab");
  const [submitted, setSubmitted] = useState(false);
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const [finishedLoadingEdit, setFinishedLoadingEdit] = useState(false);
  const [wishName, setWishName] = useState("");
  const [wishAbout, setWishAbout] = useState("");
  const [stickerTitle, setStickerTitle] = useState("");
  const [countdownDate, setCountdownDate] = useState<Dayjs | null>(null);
  const [wishVisibility, setWishVisibility] = useState<WishlistVisibility>(
    WishlistVisibility.PublicMarketplace
  );
  const [showAdvancedView, setShowAdvancedView] = useState(false);
  const [wishType, setWishType] = useState<WishTypeEnum>(WishTypeEnum.Gift);
  const [externalUrl, setExternalUrl] = useState("");
  const { token } = theme.useToken();
  const [isUploadingGraphics, setIsUploadingGraphics] = useState(false);
  const { backButtonText, updateButtonText } = useSharedTranslations();
  const [priceInCookies, setPriceInCookies] = useState(20);

  const { runMutation: runUpdateWishMutation } = useUpdateWish();

  const { data: getWishData, runQuery: runGetWishQuery } = useGetWish();

  const _txt_wishCreated_cbc = intl.formatMessage({
    id: "_txt_wishCreated_cbc.___NewWishPage",
    defaultMessage: "Wish created!",
  });
  const _txt_wishUpdated_b02 = intl.formatMessage({
    id: "_txt_wishUpdated_b02.___NewWishPage",
    defaultMessage: "Wish updated!",
  });
  const _txt_isNotAnImageFile_67c = intl.formatMessage({
    id: "_txt_isNotAnImageFile_67c.___NewWishPage",
    defaultMessage: "is not an image file",
  });
  const _txt_updateWish_c8a = intl.formatMessage({
    id: "_txt_updateWish_c8a.___NewWishPage",
    defaultMessage: "Update Wish",
  });
  const _txt_createWish_bd8 = intl.formatMessage({
    id: "_txt_createWish_bd8.___NewWishPage",
    defaultMessage: "Create Wish",
  });
  const _txt_wishNameMustBeLessThan_ef8 = intl.formatMessage({
    id: "_txt_wishNameMustBeLessThan_ef8.___NewWishPage",
    defaultMessage: "Wish name must be less than ",
  });
  const _txt_charactersLength_c6d = intl.formatMessage({
    id: "_txt_charactersLength_c6d.___NewWishPage",
    defaultMessage: "characters length",
  });
  const _txt_wishDescriptionMustBeLessThan_982 = intl.formatMessage({
    id: "_txt_wishDescriptionMustBeLessThan_982.___NewWishPage",
    defaultMessage: "Wish description must be less than ",
  });
  const _txt_mustBeAValidUrl_e12 = intl.formatMessage({
    id: "_txt_mustBeAValidUrl_e12.___NewWishPage",
    defaultMessage: "Must be a valid URL",
  });
  const _txt_createdWish_619 = intl.formatMessage({
    id: "_txt_createdWish_619.___NewWishPage",
    defaultMessage: "Created Wish",
  });
  const _txt_createAnother_e15 = intl.formatMessage({
    id: "_txt_createAnother_e15.___NewWishPage",
    defaultMessage: "Create Another",
  });
  const _txt_viewWish_6a8 = intl.formatMessage({
    id: "_txt_viewWish_6a8.___NewWishPage",
    defaultMessage: "View Wish",
  });
  const _txt_uploading_586 = intl.formatMessage({
    id: "_txt_uploading_586.___NewWishPage",
    defaultMessage: "Uploading...",
  });
  const _txt_images_330 = intl.formatMessage({
    id: "_txt_images_330.___NewWishPage",
    defaultMessage: "images",
  });
  const _txt_event_31e = intl.formatMessage({
    id: "_txt_event_31e.___NewWishPage",
    defaultMessage: "Event",
  });
  const _txt_gift_b3b = intl.formatMessage({
    id: "_txt_gift_b3b.___NewWishPage",
    defaultMessage: "Gift",
  });
  const _txt_removeGraphic_b15 = intl.formatMessage({
    id: "_txt_removeGraphic_b15.___NewWishPage",
    defaultMessage: "Remove graphic?",
  });
  const _txt_areYouSureToRemoveImage_395 = intl.formatMessage({
    id: "_txt_areYouSureToRemoveImage_395.___NewWishPage",
    defaultMessage: "Are you sure to remove image #",
  });
  const _txt_yes_361 = intl.formatMessage({
    id: "_txt_yes_361.___NewWishPage",
    defaultMessage: "Yes",
  });
  const _txt_no_574 = intl.formatMessage({
    id: "_txt_no_574.___NewWishPage",
    defaultMessage: "No",
  });
  const _txt_wishName_556 = intl.formatMessage({
    id: "_txt_wishName_556.___NewWishPage",
    defaultMessage: "Wish Name",
  });
  const _txt_whatDoYouWishFor_ad7 = intl.formatMessage({
    id: "_txt_whatDoYouWishFor_ad7.___NewWishPage",
    defaultMessage: "What do you wish for?",
  });
  const _txt_about_692 = intl.formatMessage({
    id: "_txt_about_692.___NewWishPage",
    defaultMessage: "About",
  });
  const _txt_whyYouLikeThisWishOptional_b7f = intl.formatMessage({
    id: "_txt_whyYouLikeThisWishOptional_b7f.___NewWishPage",
    defaultMessage: "Why you like this wish (optional)",
  });
  const _txt_externalLink_ceb = intl.formatMessage({
    id: "_txt_externalLink_ceb.___NewWishPage",
    defaultMessage: "External link",
  });
  const _txt_linkToEventOrShoppingPage_716 = intl.formatMessage({
    id: "_txt_linkToEventOrShoppingPage_716.___NewWishPage",
    defaultMessage: "Link to event or shopping page",
  });
  const _txt_priceInCookies_ea9 = intl.formatMessage({
    id: "_txt_priceInCookies_ea9.___NewWishPage",
    defaultMessage: "Price in Cookies",
  });
  const _txt_wishlistsArePurchasedWithCookiesTheInappCurrencyOfMilkshakeChatYouCanRedeemCookiesForCash_7b1 =
    intl.formatMessage({
      id: "_txt_wishlistsArePurchasedWithCookiesTheInappCurrencyOfMilkshakeChatYouCanRedeemCookiesForCash_7b1.___NewWishPage",
      defaultMessage:
        "Wishlists are purchased with COOKIES, the in-app currency of Milkshake Chat. You can redeem COOKIES for cash.",
    });
  const _txt_howOftenThisWishPriceWillBeChargedToTheCustomerFan_3f2 =
    intl.formatMessage({
      id: "_txt_howOftenThisWishPriceWillBeChargedToTheCustomerFan_3f2.___NewWishPage",
      defaultMessage:
        "How often this wish price will be charged to the customer fan.",
    });
  const _txt_frequency_fa1 = intl.formatMessage({
    id: "_txt_frequency_fa1.___NewWishPage",
    defaultMessage: "Frequency",
  });
  const _txt_onceTimePayment_7f8 = intl.formatMessage({
    id: "_txt_onceTimePayment_7f8.___NewWishPage",
    defaultMessage: "Once Time Payment",
  });
  const _txt_dailyRecurring_dd1 = intl.formatMessage({
    id: "_txt_dailyRecurring_dd1.___NewWishPage",
    defaultMessage: "Daily Recurring",
  });
  const _txt_weeklyRecurring_d51 = intl.formatMessage({
    id: "_txt_weeklyRecurring_d51.___NewWishPage",
    defaultMessage: "Weekly Recurring",
  });
  const _txt_monthlyRecurring_5da = intl.formatMessage({
    id: "_txt_monthlyRecurring_5da.___NewWishPage",
    defaultMessage: "Monthly Recurring",
  });
  const _txt_doYouWantToAllowAnyoneToBuyThisWishOrFriendsOnly_a9e =
    intl.formatMessage({
      id: "_txt_doYouWantToAllowAnyoneToBuyThisWishOrFriendsOnly_a9e.___NewWishPage",
      defaultMessage:
        "Do you want to allow anyone to buy this wish, or friends only?",
    });
  const _txt_friendsOnly_6c8 = intl.formatMessage({
    id: "_txt_friendsOnly_6c8.___NewWishPage",
    defaultMessage: "Friends Only",
  });
  const _txt_publicMarketplace_433 = intl.formatMessage({
    id: "_txt_publicMarketplace_433.___NewWishPage",
    defaultMessage: "Public Marketplace",
  });
  const _txt_optionalCountdownTimerForYourEventOrWish_5cc = intl.formatMessage({
    id: "_txt_optionalCountdownTimerForYourEventOrWish_5cc.___NewWishPage",
    defaultMessage: "Optional countdown timer for your event or wish.",
  });
  const _txt_countdown_fae = intl.formatMessage({
    id: "_txt_countdown_fae.___NewWishPage",
    defaultMessage: "Countdown",
  });
  const _txt_favorite_317 = intl.formatMessage({
    id: "_txt_favorite_317.___NewWishPage",
    defaultMessage: "Favorite",
  });
  const _txt_isThisAFavoritedWishlistItem_cc3 = intl.formatMessage({
    id: "_txt_isThisAFavoritedWishlistItem_cc3.___NewWishPage",
    defaultMessage: "Is this a favorited wishlist item?",
  });
  const _txt_regular_a2d = intl.formatMessage({
    id: "_txt_regular_a2d.___NewWishPage",
    defaultMessage: "Regular",
  });
  const _txt_stickerGraphic_30e = intl.formatMessage({
    id: "_txt_stickerGraphic_30e.___NewWishPage",
    defaultMessage: "Sticker Graphic",
  });
  const _txt_anyoneWhoBuysYourWishlistItemWillGetAnExclusiveStickerForChat_502 =
    intl.formatMessage({
      id: "_txt_anyoneWhoBuysYourWishlistItemWillGetAnExclusiveStickerForChat_502.___NewWishPage",
      defaultMessage:
        "Anyone who buys your wishlist item will get an exclusive sticker for chat",
    });
  const _txt_changeSticker_a62 = intl.formatMessage({
    id: "_txt_changeSticker_a62.___NewWishPage",
    defaultMessage: "Change Sticker",
  });
  const _txt_stickerName_265 = intl.formatMessage({
    id: "_txt_stickerName_265.___NewWishPage",
    defaultMessage: "Sticker Name",
  });
  const _txt_theNameOfTheStickerThatBuyersWillSeeInTheirChats_9bc =
    intl.formatMessage({
      id: "_txt_theNameOfTheStickerThatBuyersWillSeeInTheirChats_9bc.___NewWishPage",
      defaultMessage:
        "The name of the sticker that buyers will see in their chats.",
    });
  const _txt_stickerNameOptional_24e = intl.formatMessage({
    id: "_txt_stickerNameOptional_24e.___NewWishPage",
    defaultMessage: "Sticker Name (optional)",
  });
  const _txt_simple_24g = intl.formatMessage({
    id: "_txt_simple_24g.___NewWishPage",
    defaultMessage: "Simple",
  });
  const _txt_advanced_24g = intl.formatMessage({
    id: "_txt_advanced_24g.___NewWishPage",
    defaultMessage: "Advanced",
  });
  const _txt_newWish_24g = intl.formatMessage({
    id: "_txt_newWish_24g.___NewWishPage",
    defaultMessage: "New Wish",
  });
  const _txt_editWish_24g = intl.formatMessage({
    id: "_txt_editWish_24g.___NewWishPage",
    defaultMessage: "Edit Wish",
  });
  const _txt_uploadImages_24g = intl.formatMessage({
    id: "_txt_uploadImages_24g.___NewWishPage",
    defaultMessage: "Upload Images",
  });

  useEffect(() => {
    if (wishIDFromURL && !wishName) {
      const run = async () => {
        const wish = await runGetWishQuery({
          wishID: wishIDFromURL,
        });
        if (wish) {
          setShowAdvancedView(true);
          const { wishTitle, description, cookiePrice, stickerTitle } = wish;
          setWishName(wishTitle);
          setWishAbout(description);
          setPriceInCookies(cookiePrice);
          setStickerTitle(stickerTitle);
          setGraphicsUrl(wish.galleryMediaSet.map((g) => g.medium));
          setCompressedGraphicsUrl(wish.galleryMediaSet.map((g) => g.medium));
          setStickerUrl(wish.stickerMediaSet.medium);
          setCompressedStickerUrl(wish.stickerMediaSet.medium);
          setIsFavorite(wish.isFavorite);
          setBuyFrequency(wish.buyFrequency);
          setWishVisibility(wish.visibility);
          setFinishedLoadingEdit(true);
          setWishType(wish.wishType);
          if (wish.externalURL) setExternalUrl(wish.externalURL);
          if (wish.countdownDate) {
            setCountdownDate(dayjs(wish.countdownDate));
          }
        }
      };
      run();
    }
  }, [wishIDFromURL]);

  const {
    data: createWishData,
    errors: createWishErrors,
    runMutation: runCreateWishMutation,
  } = useCreateWish();

  const submitForm = async () => {
    setIsSubmitting(true);
    await runCreateWishMutation({
      wishTitle: wishName,
      stickerTitle: stickerTitle,
      description: wishAbout,
      cookiePrice: priceInCookies,
      wishGraphics: graphicsUrl,
      stickerGraphic: stickerUrl,
      isFavorite: isFavorite,
      buyFrequency: buyFrequency,
      visibility: wishVisibility,
      wishType: WishTypeEnum.Event,
      externalURL: externalUrl,
      countdownDate: countdownDate ? countdownDate.toISOString() : undefined,
    });
    setIsSubmitting(false);
    setSubmitted(true);
    message.success(_txt_wishCreated_cbc);
  };

  const updateForm = async () => {
    if (!wishIDFromURL || !getWishData) return;
    setIsSubmitting(true);
    const updateParams: UpdateWishInput = {
      wishID: wishIDFromURL as WishID,
    };
    if (getWishData.wish.wishTitle !== wishName) {
      updateParams.wishTitle = wishName;
    }
    if (getWishData.wish.stickerTitle !== stickerTitle) {
      updateParams.stickerTitle = stickerTitle;
    }

    if (getWishData.wish.cookiePrice !== priceInCookies) {
      updateParams.cookiePrice = priceInCookies;
    }

    if (getWishData.wish.description !== wishAbout) {
      updateParams.description = wishAbout;
    }

    if (getWishData.wish.isFavorite !== isFavorite) {
      updateParams.isFavorite = isFavorite;
    }
    if (getWishData.wish.buyFrequency !== buyFrequency) {
      updateParams.buyFrequency = buyFrequency;
    }
    if (getWishData.wish.visibility !== wishVisibility) {
      updateParams.visibility = wishVisibility;
    }
    if (getWishData.wish.stickerMediaSet.medium !== stickerUrl) {
      updateParams.stickerGraphic = stickerUrl;
    }
    if (getWishData.wish.wishType !== wishType) {
      updateParams.wishType = wishType;
    }
    if (getWishData.wish.externalURL !== externalUrl) {
      updateParams.externalURL = externalUrl;
    }
    if (getWishData.wish.countdownDate !== countdownDate?.toISOString()) {
      updateParams.countdownDate = countdownDate?.toISOString();
    }
    if (
      getWishData.wish.galleryMediaSet
        .map((m) => m.medium)
        .slice()
        .sort() != graphicsUrl.slice().sort()
    ) {
      updateParams.wishGraphics = graphicsUrl;
    }
    await runUpdateWishMutation(updateParams);
    setIsSubmitting(false);
    setSubmitted(true);
    message.success(_txt_wishUpdated_b02);
    navigate({
      pathname: `/app/wish/${wishIDFromURL}`,
    });
  };

  const validateFile = (file: File) => {
    if (
      file.type.toLowerCase() in
      ["image/png", "image/jpeg", "image/jpg", "image/gif"]
    ) {
      message.error(`${file.name} ${_txt_isNotAnImageFile_67c}`);
      return false;
    }
    return true;
  };

  const maySubmitForm =
    wishName.length > 0 &&
    priceInCookies > 0 &&
    !isUploadingGraphics &&
    !isUploadingSticker;

  const renderSubmitButton = () => {
    return (
      <Affix offsetBottom={0}>
        <div
          style={{
            backgroundColor: token.colorBgBase,
            padding: isMobile ? "20px" : undefined,
          }}
        >
          {wishIDFromURL ? (
            <Button
              type="primary"
              size="large"
              loading={isSubmitting}
              onClick={updateForm}
              disabled={!maySubmitForm}
              style={{
                fontWeight: "bold",
                width: "100%",
              }}
            >
              {_txt_updateWish_c8a}
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              loading={isSubmitting}
              onClick={submitForm}
              disabled={!maySubmitForm}
              style={{
                fontWeight: "bold",
                width: "100%",
              }}
            >
              {_txt_createWish_bd8}
            </Button>
          )}
        </div>
      </Affix>
    );
  };
  const MAX_GRAPHICS = 4;
  const onFormLayoutChange = () => {};
  const formItemLayout =
    screen === ScreenSize.mobile
      ? null
      : { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
  const buttonItemLayout =
    screen === ScreenSize.mobile
      ? null
      : { wrapperCol: { span: 20, offset: 4 } };
  const [currentSlide, setCurrentSlide] = useState(0);
  const onSlideCarousel = (slideNum: number) => {
    console.log(slideNum);
    setCurrentSlide(slideNum);
  };

  const clearForAnotherWish = () => {
    setWishName("");
    setWishAbout("");
    setStickerTitle("");
    setPriceInCookies(20);
    setGraphicsUrl([]);
    setCompressedGraphicsUrl([]);
    setStickerUrl("");
    setCompressedStickerUrl("");
    setSubmitted(false);
    setBuyFrequency(WishBuyFrequency.OneTime);
    setWishVisibility(WishlistVisibility.FriendsOnly);
  };
  const uploadWishlistGraphics = async (file: string | Blob | RcFile) => {
    if (selfUser) {
      setIsUploadingGraphics(true);
      const assetID = uuidv4();
      const url = await uploadFile({
        file: file as File,
        path: `users/${selfUser.id}/wishlist/${assetID}.png`,
      });
      console.log(`assetID`, assetID);
      if (url && selfUser && selfUser.id) {
        const resized = getCompressedWishlistGraphicUrl({
          userID: selfUser.id,
          assetID,
          bucketName: config.FIREBASE.storageBucket,
        });
        setGraphicsUrl((prev) => [...prev, url].slice(0, MAX_GRAPHICS));
        setCompressedGraphicsUrl((prev) =>
          [...prev, resized].slice(0, MAX_GRAPHICS)
        );
      }
      setIsUploadingGraphics(false);

      return url;
    }
  };

  const removeGraphic = () => {
    const url = graphicsUrl[currentSlide];
    if (url.indexOf("default_gift.jpeg") > -1) {
      setGraphicsUrl((prev) => prev.filter((u) => u !== url));
      setCompressedGraphicsUrl((prev) => prev.filter((u) => u !== url));
      return;
    }
    const extractAssetID = (url: string) => {
      return url.split("wishlist%2F").pop()?.split(".").shift();
    };

    const assetID = extractAssetID(url);
    console.log(`assetID`, assetID);
    if (assetID) {
      setGraphicsUrl((prev) => prev.filter((u) => u.indexOf(assetID) === -1));
      setCompressedGraphicsUrl((prev) =>
        prev.filter((u) => u.indexOf(assetID) === -1)
      );
    }
  };
  const uploadSticker = async (file: string | Blob | RcFile) => {
    if (selfUser) {
      setIsUploadingSticker(true);
      const assetID = uuidv4();
      const url = await uploadFile({
        file: file as File,
        path: `users/${selfUser.id}/sticker/${assetID}.png`,
      });
      if (url && selfUser && selfUser.id) {
        const resized = getCompressedStickerUrl({
          userID: selfUser.id,
          assetID,
          bucketName: config.FIREBASE.storageBucket,
        });
        setStickerUrl(url);
        setCompressedStickerUrl(resized);
      }
      setIsUploadingSticker(false);

      return url;
    }
  };
  if (!selfUser || (wishIDFromURL && !finishedLoadingEdit)) {
    return <LoadingAnimation width="100vw" height="100vh" type="cookie" />;
  }

  const MAX_WISH_NAME_CHARS = 60;
  const wishNameRules: Rule[] = [
    {
      max: MAX_WISH_NAME_CHARS,
      message: `${_txt_wishNameMustBeLessThan_ef8} ${MAX_WISH_NAME_CHARS} ${_txt_charactersLength_c6d}`,
    },
  ];
  const MAX_WISH_ABOUT_CHARS = 560;
  const aboutRules: Rule[] = [
    {
      max: MAX_WISH_ABOUT_CHARS,
      message: `${_txt_wishDescriptionMustBeLessThan_982} ${MAX_WISH_ABOUT_CHARS} ${_txt_charactersLength_c6d}`,
    },
  ];

  const priceRules: Rule[] = [];
  const linkRules: Rule[] = [
    {
      type: "url",
      message: _txt_mustBeAValidUrl_e12,
    },
  ];

  return (
    <>
      <LayoutInteriorHeader
        leftAction={
          <Button
            onClick={() => navigate(-1)}
            type="link"
            icon={<LeftOutlined />}
            style={{ color: token.colorTextSecondary }}
          >
            {backButtonText}
          </Button>
        }
        title={wishIDFromURL ? _txt_editWish_24g : _txt_newWish_24g}
        rightAction={
          <Switch
            checkedChildren={_txt_advanced_24g}
            unCheckedChildren={_txt_simple_24g}
            checked={showAdvancedView}
            onChange={(v) => {
              setShowAdvancedView(v);
            }}
          />
        }
      />
      {submitted ? (
        <AppLayoutPadding align="center">
          <$Vertical
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: "70px 50px",
            }}
          >
            <CheckCircleFilled
              style={{ color: token.colorSuccessActive, fontSize: "3rem" }}
            />
            <PP>
              <div
                style={{
                  fontSize: "1.2rem",
                  margin: "20px 0px 50px 0px",
                  fontWeight: "bold",
                  color: token.colorTextHeading,
                }}
              >
                {_txt_createdWish_619}
              </div>
            </PP>
            <Button
              size="large"
              onClick={clearForAnotherWish}
              type="primary"
              style={{ fontWeight: "bold" }}
            >
              {_txt_createAnother_e15}
            </Button>
            <Button
              type="link"
              onClick={() => {
                navigate({
                  pathname: `/app/profile`,
                  search: createSearchParams({
                    view: "wishlist",
                  }).toString(),
                });
              }}
              style={{ marginTop: "20px" }}
            >
              {_txt_viewWish_6a8}
            </Button>
          </$Vertical>
        </AppLayoutPadding>
      ) : (
        <>
          <AppLayoutPadding align="center">
            <Form
              {...formItemLayout}
              layout={formLayout}
              form={form}
              colon={false}
              initialValues={{
                wishName: wishName,
                about: wishAbout,
                price: priceInCookies,
                stickerTitle: stickerTitle,
                buyFrequency: buyFrequency,
                visibility: wishVisibility,
                link: externalUrl,
                countdown: countdownDate,
              }}
              onFieldsChange={onFormLayoutChange}
              style={{ width: "100%" }}
            >
              <Form.Item {...buttonItemLayout} name="graphics">
                {graphicsUrl.length > 0 ? (
                  <Carousel afterChange={onSlideCarousel}>
                    {graphicsUrl.map((url) => {
                      return (
                        <div key={url}>
                          <img
                            src={url}
                            style={{
                              width: "100%",
                              height: isMobile ? "160px" : "250px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      );
                    })}
                  </Carousel>
                ) : (
                  <Carousel afterChange={onSlideCarousel}>
                    <div>
                      <h3 style={contentStyle}>1</h3>
                    </div>
                    <div>
                      <h3 style={contentStyle}>2</h3>
                    </div>
                    <div>
                      <h3 style={contentStyle}>3</h3>
                    </div>
                    <div>
                      <h3 style={contentStyle}>4</h3>
                    </div>
                  </Carousel>
                )}

                <$Horizontal
                  justifyContent="space-between"
                  alignItems="flex-start"
                  style={{ marginTop: "10px" }}
                >
                  <Upload
                    showUploadList={false}
                    maxCount={4}
                    multiple
                    customRequest={async (options) => {
                      try {
                        await uploadWishlistGraphics(options.file);
                        if (options && options.onSuccess) {
                          options.onSuccess({});
                        }
                      } catch (e) {
                        if (options.onError) {
                          options.onError(e as Error);
                        }
                      }
                    }}
                    beforeUpload={validateFile}
                  >
                    <Button>{_txt_uploadImages_24g}</Button>
                    {isUploadingGraphics ? (
                      <span style={{ marginLeft: "10px" }}>
                        <LoadingOutlined />

                        {_txt_uploading_586}
                      </span>
                    ) : (
                      <span
                        style={{
                          marginLeft: "10px",
                          color: token.colorTextDisabled,
                        }}
                      >
                        <PP>{`${graphicsUrl.length}/${MAX_GRAPHICS} ${_txt_images_330}`}</PP>
                      </span>
                    )}
                  </Upload>

                  <Select
                    style={{ width: "100px" }}
                    onChange={(v) => setWishType(v)}
                    value={wishType}
                    options={[
                      { value: WishTypeEnum.Event, label: _txt_event_31e },
                      { value: WishTypeEnum.Gift, label: _txt_gift_b3b },
                    ]}
                  />
                </$Horizontal>
                {graphicsUrl.length > 0 && (
                  <Popconfirm
                    title={_txt_removeGraphic_b15}
                    description={`${_txt_areYouSureToRemoveImage_395}${
                      currentSlide + 1
                    }?`}
                    onConfirm={removeGraphic}
                    okText={_txt_yes_361}
                    cancelText={_txt_no_574}
                  >
                    <DeleteOutlined
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 2,
                      }}
                    />
                  </Popconfirm>
                )}
              </Form.Item>
              <Spacer height={isMobile ? "10px" : "20px"} />
              <Form.Item
                required
                label={_txt_wishName_556}
                name="wishName"
                rules={wishNameRules}
              >
                <Input
                  value={wishName}
                  onChange={(e) =>
                    setWishName(e.target.value.slice(0, MAX_WISH_NAME_CHARS))
                  }
                  placeholder={_txt_whatDoYouWishFor_ad7}
                />
              </Form.Item>
              {showAdvancedView && (
                <Form.Item
                  label={_txt_about_692}
                  name="about"
                  rules={aboutRules}
                >
                  <Input.TextArea
                    rows={3}
                    value={wishAbout}
                    onChange={(e) =>
                      setWishAbout(
                        e.target.value.slice(0, MAX_WISH_ABOUT_CHARS)
                      )
                    }
                    placeholder={_txt_whyYouLikeThisWishOptional_b7f}
                    style={{ resize: "none" }}
                  />
                </Form.Item>
              )}
              {showAdvancedView && (
                <Form.Item
                  label={_txt_externalLink_ceb}
                  name="link"
                  rules={linkRules}
                >
                  <Input
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder={_txt_linkToEventOrShoppingPage_716}
                    style={{ resize: "none" }}
                  />
                </Form.Item>
              )}
              <Divider />

              <Form.Item
                required
                label={_txt_priceInCookies_ea9}
                name="price"
                rules={priceRules}
                tooltip={
                  <PP>
                    {
                      _txt_wishlistsArePurchasedWithCookiesTheInappCurrencyOfMilkshakeChatYouCanRedeemCookiesForCash_7b1
                    }
                  </PP>
                }
              >
                <InputNumber
                  min={1}
                  max={9999}
                  value={parseInt(priceInCookies.toFixed(0))}
                  step={1}
                  precision={0}
                  // @ts-ignore
                  onChange={(v) => {
                    if (v) {
                      setPriceInCookies(parseInt(v.toFixed(0)));
                    }
                  }}
                  addonAfter={`~${mapCurrencyEnumToSymbol(
                    (selfUser?.currency || "") as CurrencyEnum
                  )}${fxFromUSDToCurrency({
                    amount: cookieToUSD(priceInCookies),
                    fxRate: selfUser?.fxRateFromUSD || 1,
                    currency:
                      (selfUser?.currency as CurrencyEnum) || CurrencyEnum.USD,
                  })} ${selfUser?.currency}`}
                  style={{ flex: 1, width: "100%" }}
                />
              </Form.Item>
              {showAdvancedView && (
                <Form.Item
                  label={_txt_frequency_fa1}
                  name="buyFrequency"
                  tooltip={
                    _txt_howOftenThisWishPriceWillBeChargedToTheCustomerFan_3f2
                  }
                >
                  <Select
                    value={buyFrequency}
                    style={{ width: "100%" }}
                    onChange={(v) => {
                      setBuyFrequency(v);
                    }}
                    options={[
                      {
                        value: WishBuyFrequency.OneTime,
                        label: _txt_onceTimePayment_7f8,
                      },
                      {
                        value: WishBuyFrequency.Daily,
                        label: _txt_dailyRecurring_dd1,
                      },
                      {
                        value: WishBuyFrequency.Weekly,
                        label: _txt_weeklyRecurring_d51,
                      },
                      {
                        value: WishBuyFrequency.Monthly,
                        label: _txt_monthlyRecurring_5da,
                      },
                    ]}
                  />
                </Form.Item>
              )}
              <Divider />
              {showAdvancedView && (
                <Form.Item
                  label={<PP>Visibility</PP>}
                  name="visibility"
                  tooltip={
                    _txt_doYouWantToAllowAnyoneToBuyThisWishOrFriendsOnly_a9e
                  }
                >
                  <Select
                    value={wishVisibility}
                    style={{ width: "100%" }}
                    onChange={(v) => {
                      setWishVisibility(v);
                    }}
                    options={[
                      {
                        value: WishlistVisibility.FriendsOnly,
                        label: _txt_friendsOnly_6c8,
                      },
                      {
                        value: WishlistVisibility.PublicMarketplace,
                        label: _txt_publicMarketplace_433,
                      },
                    ]}
                  />
                </Form.Item>
              )}
              {showAdvancedView && (
                <Form.Item
                  label={_txt_countdown_fae}
                  name="countdown"
                  tooltip={_txt_optionalCountdownTimerForYourEventOrWish_5cc}
                >
                  <DatePicker
                    showTime
                    onChange={(v) => {
                      console.log(v);
                      setCountdownDate(v);
                    }}
                    onOk={(x) => console.log(x)}
                  />
                </Form.Item>
              )}
              {showAdvancedView && (
                <Form.Item
                  label={_txt_favorite_317}
                  name="favorite"
                  tooltip={_txt_isThisAFavoritedWishlistItem_cc3}
                >
                  <Switch
                    checkedChildren="Favorite"
                    unCheckedChildren={_txt_regular_a2d}
                    checked={isFavorite}
                    onChange={(v) => {
                      setIsFavorite(v);
                    }}
                  />
                </Form.Item>
              )}
              <Divider />
              {showAdvancedView && (
                <Form.Item
                  name="stickerImage"
                  label={_txt_stickerGraphic_30e}
                  tooltip={
                    _txt_anyoneWhoBuysYourWishlistItemWillGetAnExclusiveStickerForChat_502
                  }
                >
                  <Avatar
                    size={64}
                    src={stickerUrl}
                    style={{ backgroundColor: token.colorPrimaryText }}
                    icon={<HeartFilled />}
                  />
                  <Upload
                    showUploadList={false}
                    customRequest={async (options) => {
                      try {
                        await uploadSticker(options.file);
                        if (options && options.onSuccess) {
                          options.onSuccess({});
                        }
                      } catch (e) {
                        if (options.onError) {
                          options.onError(e as Error);
                        }
                      }
                    }}
                    beforeUpload={validateFile}
                  >
                    <Button type="link" style={{ marginLeft: 16 }}>
                      {isUploadingSticker ? (
                        <Space direction="horizontal">
                          <Spin />
                          <Spacer width="5px" />
                          <span>{_txt_uploading_586}</span>
                        </Space>
                      ) : (
                        <span>{_txt_changeSticker_a62}</span>
                      )}
                    </Button>
                  </Upload>
                </Form.Item>
              )}

              {showAdvancedView && (
                <Form.Item
                  label={_txt_stickerName_265}
                  name="stickerTitle"
                  rules={wishNameRules}
                  tooltip={
                    _txt_theNameOfTheStickerThatBuyersWillSeeInTheirChats_9bc
                  }
                >
                  <Input
                    value={stickerTitle}
                    onChange={(e) =>
                      setStickerTitle(
                        e.target.value.slice(0, MAX_WISH_NAME_CHARS)
                      )
                    }
                    placeholder={_txt_stickerNameOptional_24e}
                  />
                </Form.Item>
              )}

              {!isMobile && (
                <Form.Item {...buttonItemLayout} name="submit">
                  {renderSubmitButton()}
                </Form.Item>
              )}
            </Form>
          </AppLayoutPadding>
          {isMobile && renderSubmitButton()}
        </>
      )}
    </>
  );
};

export default NewWishPage;
