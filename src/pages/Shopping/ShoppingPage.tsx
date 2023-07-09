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
import { Username } from "@milkshakechat/helpers";
import {
  Avatar,
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
} from "antd";
import Meta from "antd/es/card/Meta";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { BellFilled, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useNotificationsState } from "@/state/notifications.state";
import PP from "@/i18n/PlaceholderPrint";
import LogoCookie from "@/components/LogoText/LogoCookie";
import { WishlistSortByEnum } from "@/components/WishlistGallery/WishlistGallery";
import { Wish } from "@/api/graphql/types";

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
  const [sortBy, setSortBy] = useState<WishlistSortByEnum>(
    WishlistSortByEnum.highToLow
  );
  const notifications = useNotificationsState((state) => state.notifications);

  const {
    data: listWishlistData,
    errors: listWishlistErrors,
    runQuery: runListWishlistQuery,
  } = useListWishlist();

  useEffect(() => {
    runListWishlistQuery({});
  }, []);

  const marketplaceWishes = listWishlistData?.wishlist || [];

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
    marketplaceWishes.filter(
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
      <AppLayoutPadding
        maxWidths={{
          mobile: "100%",
          desktop: "100%",
        }}
        align="center"
      >
        <>
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
              Find Your Next Date
            </span>
          </$Horizontal>
          <$Horizontal
            justifyContent="center"
            style={{ width: "100%", marginTop: isMobile ? "0px" : "20px" }}
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
                <NavLink to={`/app/wish/${wish.id}`}>
                  <div style={{ padding: "10px" }}>
                    <Badge.Ribbon
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
                    >
                      <Card
                        bordered={false}
                        hoverable
                        cover={
                          <div
                            style={{
                              width: "100%",
                              height: "250px",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              alt={wish.wishTitle}
                              src={
                                wish.galleryMediaSet[0]?.medium ||
                                wish.thumbnail
                              }
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        }
                      >
                        <Meta
                          title={wish.wishTitle}
                          avatar={
                            <Avatar src={wish.author?.avatar} size="large" />
                          }
                          description={`With ${wish.author?.displayName}`}
                        />
                      </Card>
                    </Badge.Ribbon>
                  </div>
                </NavLink>
              </Col>
            ))}
          </Row>
        </>
      </AppLayoutPadding>
    </>
  );
};
export default ShoppingPage;
