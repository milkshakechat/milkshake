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
    WishlistSortByEnum.favorite
  );
  const user = useUserState((state) => state.user);
  const viewingOwnProfile = true;

  const sortByRecent = (wishlist: Wish[]) => {};

  const sortByPrice = (wishlist: Wish[]) => {};

  const sortByFavorite = (wishlist: Wish[]) => {};

  const filterSortedWishlist = wishlist.filter((w) =>
    w.wishTitle.toLowerCase().includes(searchString.toLowerCase())
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
          <NavLink to="/app/wishlist/new">
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
          <NavLink to="/app/">
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
                      ? `${item.description.slice(0, 40)}...`
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

              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                Buy
              </Button>

              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                style={{ marginLeft: "10px", width: "16px" }}
              >
                <BookmarkIcon fill={`${token.colorPrimaryActive}AA`} />
              </div>
            </List.Item>
          </NavLink>
        )}
      />
    </$Vertical>
  );
};

export default WishlistGallery;

{
  /* <$Horizontal alignItems="center">
                    {!item.isFavorite && (
                      <HeartFilled
                        style={{
                          color: token.colorErrorActive,
                          marginRight: "5px",
                        }}
                      />
                    )}
                    {item.wishTitle}
                  </$Horizontal> */
}

// avatar={
//   <Badge dot>
//     <Avatar src={item.thumbnail} />
//   </Badge>
// }
