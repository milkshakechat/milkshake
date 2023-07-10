import { ErrorLines } from "@/api/graphql/error-line";
import { useWindowSize } from "@/api/utils/screen";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import {
  AppLayoutPadding,
  LayoutLogoHeader,
  Spacer,
} from "@/components/AppLayout/AppLayout";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import LogoText from "@/components/LogoText/LogoText";
import StyleConfigPanel from "@/components/StyleConfigPanel/StyleConfigPanel";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import { BRANDED_FONT } from "@/config.env";
import {
  useDemoMutation,
  useDemoPing,
  useDemoQuery,
  useDemoSubscription,
} from "@/hooks/useTemplateGQL";
import { useListWishlist } from "@/hooks/useWish";
import { useUserState } from "@/state/user.state";
import { UserID, Username, WishID } from "@milkshakechat/helpers";
import {
  Avatar,
  Drawer,
  Card,
  Col,
  Row,
  theme,
  Badge,
  Input,
  Button,
  Dropdown,
  Tag,
  Alert,
  Affix,
  Tooltip,
} from "antd";
import Meta from "antd/es/card/Meta";
import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import {
  NavLink,
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  BellFilled,
  SearchOutlined,
  FilterOutlined,
  ArrowRightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNotificationsState } from "@/state/notifications.state";
import PP from "@/i18n/PlaceholderPrint";
import LogoCookie from "@/components/LogoText/LogoCookie";
import { WishlistSortByEnum } from "@/components/WishlistGallery/WishlistGallery";
import { Wish, WishAuthor } from "@/api/graphql/types";
import { useWishState } from "@/state/wish.state";
import shallow from "zustand/shallow";
import Countdown from "antd/es/statistic/Countdown";
import BookmarkIcon from "@/components/BookmarkIcon/BookmarkIcon";
import QuickChat from "@/components/QuickChat/QuickChat";

export const ShoppingPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const [searchString, setSearchString] = useState("");
  const { token } = theme.useToken();
  const observer = useRef<IntersectionObserver | null>(null);
  const wishRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [quickChatUser, setQuickChatUser] = useState<{
    user: WishAuthor | null;
    wishID: WishID;
  } | null>(null);

  const { lastFocusedScrollPosition, setLastFocusedScrollPosition } =
    useWishState(
      (state) => ({
        lastFocusedScrollPosition: state.lastFocusedScrollPosition,
        setLastFocusedScrollPosition: state.setLastFocusedScrollPosition,
      }),
      shallow
    );

  const [lastIntersectedId, setLastIntersectedId] = useState<string | null>(
    lastFocusedScrollPosition
  );

  useEffect(() => {
    console.log(`lastFocusedScrollPosition`, lastFocusedScrollPosition);
    if (lastFocusedScrollPosition) {
      setLastFocusedScrollPosition(lastFocusedScrollPosition);
    }

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log(`Found an intersection!`, entry);
          setLastIntersectedId(entry.target.id);
        }
      });
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (lastIntersectedId) {
      setLastFocusedScrollPosition(lastIntersectedId as WishID);
    }
  }, [lastIntersectedId]);

  // Effect for initial page load
  useEffect(() => {
    const ref = wishRefs.current.find((ref) => ref?.id === lastIntersectedId);
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const [sortBy, setSortBy] = useState<WishlistSortByEnum>(
    WishlistSortByEnum.recent
  );
  const notifications = useNotificationsState((state) => state.notifications);
  const marketplaceWishlist = useWishState(
    (state) => state.marketplaceWishlist
  );

  const sortByRecent = (wishlist: Wish[]) => {
    return wishlist.slice().sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const sortByPrice = (wishlist: Wish[], lowToHigh: boolean) => {
    return wishlist.slice().sort((a, b) => {
      return lowToHigh
        ? a.cookiePrice - b.cookiePrice
        : b.cookiePrice - a.cookiePrice;
    });
  };

  const sortByFavorite = (wishlist: Wish[]) => {
    return wishlist.slice().sort((a, b) => {
      return a.isFavorite ? -1 : 1;
    });
  };

  const sortWishlist = (wishlist: Wish[]) => {
    if (sortBy === WishlistSortByEnum.recent) {
      return sortByRecent(wishlist);
    } else if (sortBy === WishlistSortByEnum.lowToHigh) {
      return sortByPrice(wishlist, true);
    } else if (sortBy === WishlistSortByEnum.highToLow) {
      return sortByPrice(wishlist, false);
    }
    return sortByFavorite(wishlist);
  };

  const filterSortedWishlist = sortWishlist(
    marketplaceWishlist.filter(
      (wish) =>
        wish.wishTitle.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
        (wish.author?.displayName || "")
          .toLowerCase()
          .indexOf(searchString.toLowerCase()) > -1 ||
        (wish.author?.username || "")
          .toLowerCase()
          .indexOf(searchString.toLowerCase()) > -1
    )
  );

  if (!selfUser) {
    return <LoadingAnimation width="100%" height="100%" type="cookie" />;
  }

  const visitUser = (uid: UserID) => {
    if (uid) {
      navigate({
        pathname: `/user`,
        search: createSearchParams({
          userID: uid,
        }).toString(),
      });
    }
  };

  return (
    <>
      <Affix offsetTop={0}>
        <Alert
          message={
            <$Horizontal justifyContent="space-between">
              <span>
                {isMobile
                  ? `You have 100% refund protection`
                  : `Milkshake protects you with 100% refund guarantee for 90 days`}
              </span>

              <Button type="link" size="small">
                Learn More
              </Button>
            </$Horizontal>
          }
          type="success"
          banner
        />
      </Affix>
      {isMobile ? (
        <LayoutLogoHeader
          rightAction={
            <NavLink to="/app/notifications">
              <$Horizontal>
                <BellFilled
                  style={{ color: token.colorBgSpotlight, fontSize: "1.2rem" }}
                />
                <Badge
                  count={notifications.filter((n) => !n.markedRead).length}
                  style={{ margin: "0px 5px" }}
                />
              </$Horizontal>
            </NavLink>
          }
        />
      ) : null}

      <Spacer height={isMobile ? "20px" : "70px"} />
      <$Horizontal justifyContent="center">
        <span
          style={{
            color: token.colorTextBase,
            fontSize: isMobile ? "1.5rem" : "1.8rem",
            fontWeight: 700,
            fontFamily: BRANDED_FONT,
            margin: isMobile ? "0px 0px 30px 0px" : "0px",
          }}
        >
          Find Something to Do
        </span>
      </$Horizontal>
      <$Horizontal
        justifyContent="center"
        style={{
          width: "100%",
          marginTop: isMobile ? "0px" : "20px",
          marginBottom: isMobile ? "20px" : "0px",
          padding: "0px 10px",
        }}
      >
        <Input
          placeholder="Search Dates"
          allowClear
          addonBefore={<SearchOutlined />}
          onChange={(e) => setSearchString(e.target.value)}
          style={{ width: isMobile ? "100%" : "300px" }}
          suffix={
            <Dropdown
              menu={{
                items: [
                  {
                    key: WishlistSortByEnum.favorite,
                    label: (
                      <Button
                        type={
                          sortBy === WishlistSortByEnum.favorite
                            ? "link"
                            : "ghost"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSortBy(WishlistSortByEnum.favorite);
                        }}
                      >
                        {WishlistSortByEnum.favorite}
                      </Button>
                    ),
                  },

                  {
                    key: WishlistSortByEnum.lowToHigh,
                    label: (
                      <Button
                        type={
                          sortBy === WishlistSortByEnum.lowToHigh
                            ? "link"
                            : "ghost"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSortBy(WishlistSortByEnum.lowToHigh);
                        }}
                      >
                        {WishlistSortByEnum.lowToHigh}
                      </Button>
                    ),
                  },
                  {
                    key: WishlistSortByEnum.highToLow,
                    label: (
                      <Button
                        type={
                          sortBy === WishlistSortByEnum.highToLow
                            ? "link"
                            : "ghost"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSortBy(WishlistSortByEnum.highToLow);
                        }}
                      >
                        {WishlistSortByEnum.highToLow}
                      </Button>
                    ),
                  },
                  {
                    key: WishlistSortByEnum.recent,
                    label: (
                      <Button
                        type={
                          sortBy === WishlistSortByEnum.recent
                            ? "link"
                            : "ghost"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSortBy(WishlistSortByEnum.recent);
                        }}
                      >
                        {WishlistSortByEnum.recent}
                      </Button>
                    ),
                  },
                ],
              }}
              arrow
            >
              <Button
                type="link"
                size="small"
                icon={
                  <FilterOutlined
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  />
                }
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                style={{
                  border: "0px solid white",
                  color: token.colorTextDescription,
                  zIndex: 1,
                }}
              ></Button>
            </Dropdown>
          }
        />
      </$Horizontal>
      <Spacer height={isMobile ? "20px" : "70px"} />

      <Row gutter={0}>
        {filterSortedWishlist.map((wish, index) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={6} key={wish.id}>
            <div
              key={wish.id}
              id={wish.id}
              ref={(el) => {
                wishRefs.current[index] = el;
                if (el && observer.current) {
                  observer.current.observe(el);
                }
              }}
              style={{
                marginBottom: isMobile ? "50px" : "0px",
                // border: isMobile ? "none" : `1px solid ${token.colorBorder}`,
              }}
            >
              <NavLink to={`/app/wish/${wish.id}`}>
                <div style={{ padding: isMobile ? "0px" : "10px" }}>
                  <$Horizontal
                    spacing={3}
                    justifyContent="space-between"
                    alignItems="flex-end"
                    style={{
                      width: "100%",
                      padding: "10px",
                      bottom: 0,
                    }}
                  >
                    <$Horizontal>
                      <Avatar
                        src={wish.author?.avatar}
                        style={{ backgroundColor: token.colorPrimaryText }}
                        size="large"
                        onClick={() => visitUser(wish.author?.id)}
                      />
                      <$Vertical
                        style={{
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          color: token.colorTextBase,
                          marginLeft: "10px",
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          visitUser(wish.author?.id);
                        }}
                      >
                        <PP>
                          <b>
                            {wish.author?.displayName || wish.author?.username}
                          </b>
                        </PP>
                        <PP>
                          <i>{`@${wish.author?.username}`}</i>
                        </PP>
                      </$Vertical>
                    </$Horizontal>
                    <Button
                      size={isMobile ? "middle" : "small"}
                      type="primary"
                      ghost
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuickChatUser({
                          user: wish.author || null,
                          wishID: wish.id as WishID,
                        });
                      }}
                      style={{ marginLeft: "5px" }}
                    >
                      Message
                    </Button>
                  </$Horizontal>
                  <div
                    style={{
                      width: "100%",
                      height: isMobile ? "auto" : "300px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <$Vertical
                      style={{
                        backgroundColor: "rgba(0,0,0,0.7)",
                        color: token.colorWhite,
                        width: "100%",
                        padding: "10px",
                        marginTop: isMobile ? "-5px" : "0px",
                        position: "absolute",
                        bottom: 0,
                      }}
                    >
                      <$Horizontal
                        style={{
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          style={{
                            marginRight: "10px",
                            width: isMobile ? "20px" : "16px",
                            paddingTop: "3px",
                          }}
                        >
                          <BookmarkIcon fill={`rgba(256,256,256,0.5)`} />
                        </div>
                        <$Vertical style={{ flex: 1 }}>
                          <$Horizontal>{`${wish.wishTitle} with ${wish.author?.displayName}`}</$Horizontal>

                          {wish.countdownDate && (
                            <Countdown
                              value={new Date(wish.countdownDate).getTime()}
                              valueStyle={{
                                fontSize: "0.8rem",
                                color: token.colorWhite,
                              }}
                              prefix={
                                <span
                                  style={{
                                    fontSize: "0.8rem",
                                    color: token.colorWhite,
                                  }}
                                >
                                  {"RSVP by"}
                                </span>
                              }
                              onFinish={() => console.log("Finished countdown")}
                              style={{ color: token.colorWhite }}
                            />
                          )}
                        </$Vertical>
                        <div style={{ marginLeft: "5px" }}>
                          <ArrowRightOutlined color={`rgba(256,256,256,0.5)`} />
                        </div>
                      </$Horizontal>
                      <$Horizontal style={{ marginTop: "20px" }}>
                        <Avatar.Group>
                          <Avatar
                            size="small"
                            src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"
                          />
                          <a href="https://ant.design">
                            <Avatar
                              size="small"
                              style={{ backgroundColor: "#f56a00" }}
                            >
                              K
                            </Avatar>
                          </a>
                          <Tooltip title="Ant User" placement="top">
                            <Avatar
                              size="small"
                              style={{ backgroundColor: "#87d068" }}
                              icon={<UserOutlined />}
                            />
                          </Tooltip>
                        </Avatar.Group>
                        <span
                          style={{
                            marginLeft: "10px",
                            color: token.colorWhite,
                            fontSize: "0.9rem",
                          }}
                        >
                          Melissa & 3 others are going
                        </span>
                      </$Horizontal>
                    </$Vertical>
                    <img
                      alt={wish.wishTitle}
                      src={wish.galleryMediaSet[0]?.medium || wish.thumbnail}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
              </NavLink>
            </div>
          </Col>
        ))}
      </Row>
      <QuickChat
        isOpen={quickChatUser !== null}
        onClose={() => setQuickChatUser(null)}
        user={quickChatUser?.user || null}
        textPlaceholder="Are you coming to my event?"
        actionButton={
          <NavLink to={`/app/wish/${quickChatUser?.wishID}`}>
            <Button>View Event</Button>
          </NavLink>
        }
      />
    </>
  );
};
export default ShoppingPage;

{
  /* <Badge.Ribbon
                      text={
                        <$Horizontal style={{ padding: "2px" }}>
                          <LogoCookie width="12px" fill={token.colorWhite} />
                          <span
                            style={{ marginLeft: "5px", fontWeight: "bold" }}
                          >
                            {wish.cookiePrice}
                          </span>
                        </$Horizontal>
                      }
                      color={
                        wish.isFavorite ? token.colorError : token.colorPrimary
                      }
                    ></Badge.Ribbon> */
}
