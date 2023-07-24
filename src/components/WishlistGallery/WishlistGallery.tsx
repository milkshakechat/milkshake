import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { useUserState } from "@/state/user.state";
import { Avatar, Button, Dropdown, Input, List, Tag, theme, Badge } from "antd";
import {
  FilterOutlined,
  SearchOutlined,
  SketchOutlined,
} from "@ant-design/icons";
import { Spacer } from "@/components/AppLayout/AppLayout";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Wish } from "@/api/graphql/types";
import { useWindowSize } from "@/api/utils/screen";
import { HeartFilled } from "@ant-design/icons";
import BookmarkIcon from "../BookmarkIcon/BookmarkIcon";
import LogoCookie from "../LogoText/LogoCookie";

export enum WishlistSortByEnum {
  favorite = "Favorite",
  lowToHigh = "Low to High",
  highToLow = "High to Low",
  recent = "Recent",
}
interface WishlistGalleryProps {
  wishlist: Wish[];
}
const WishlistGallery = ({ wishlist }: WishlistGalleryProps) => {
  const intl = useIntl();
  const { token } = theme.useToken();
  const [searchString, setSearchString] = useState("");
  const { screen, isMobile } = useWindowSize();
  const [sortBy, setSortBy] = useState<WishlistSortByEnum>(
    WishlistSortByEnum.highToLow
  );
  const selfUser = useUserState((state) => state.user);
  const viewingOwnProfile =
    selfUser && wishlist.every((w) => w.creatorID === selfUser.id);

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
    wishlist.filter((w) =>
      w.wishTitle.toLowerCase().includes(searchString.toLowerCase())
    )
  );

  return (
    <$Vertical>
      <$Horizontal justifyContent="space-between">
        <Input
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          addonBefore={<SearchOutlined />}
          placeholder="Search"
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

        {viewingOwnProfile && (
          <NavLink to="/app/wish/new">
            <Button
              type="primary"
              style={{
                marginLeft: "10px",
              }}
            >
              <PP>New Wish</PP>
            </Button>
          </NavLink>
        )}
      </$Horizontal>
      <Spacer />
      <List
        itemLayout="horizontal"
        dataSource={filterSortedWishlist}
        renderItem={(item, index) => (
          <NavLink to={`/app/wish/${item.id}`}>
            <List.Item
              style={{
                borderBottom: `1px solid ${token.colorBgContainerDisabled}`,
              }}
            >
              <List.Item.Meta
                title={
                  <Badge dot={item.isFavorite} offset={[5, 0]}>
                    {item.wishTitle}
                  </Badge>
                }
                description={
                  <$Horizontal alignItems="center">
                    {item.description && !isMobile
                      ? `${item.description.slice(0, 40)}${
                          item.description.length > 40 ? "..." : ""
                        }`
                      : ""}
                  </$Horizontal>
                }
              />

              <$Horizontal alignItems="center" style={{ marginRight: "20px " }}>
                <LogoCookie width={"16px"} fill={`${token.colorPrimary}9A`} />
                <span
                  style={{
                    marginLeft: "10px",
                    fontSize: "1rem",
                    color: `${token.colorPrimary}`,
                  }}
                >{`${item.cookiePrice}`}</span>
              </$Horizontal>

              {viewingOwnProfile ? (
                <NavLink to={`/app/wish/${item.id}/edit`}>
                  <Button>Edit</Button>
                </NavLink>
              ) : null
              // <Button
              //   onClick={(e) => {
              //     e.preventDefault();
              //     e.stopPropagation();
              //   }}
              // >
              //   Buy
              // </Button>
              }

              {!viewingOwnProfile && (
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  style={{ marginLeft: "10px", width: "16px" }}
                >
                  <BookmarkIcon fill={`${token.colorPrimaryActive}AA`} />
                </div>
              )}
            </List.Item>
          </NavLink>
        )}
      />
    </$Vertical>
  );
};

export default WishlistGallery;
