import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { useUserState } from "@/state/user.state";
import { Button, Dropdown, Input, theme } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Spacer } from "@/components/AppLayout/AppLayout";
import { useState } from "react";

export enum WishlistSortByEnum {
  favorite = "Favorite",
  lowToHigh = "Low to High",
  highToLow = "High to Low",
  recent = "Recent",
}
interface WishlistGalleryProps {
  children?: React.ReactNode | React.ReactNode[];
}
const WishlistGallery = ({ children }: WishlistGalleryProps) => {
  const intl = useIntl();
  const { token } = theme.useToken();
  const [sortBy, setSortBy] = useState<WishlistSortByEnum>(
    WishlistSortByEnum.favorite
  );
  const user = useUserState((state) => state.user);
  const viewingOwnProfile = true;
  return (
    <$Vertical>
      <$Horizontal justifyContent="space-between">
        <Input
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
          <Button
            type="primary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            style={{
              marginLeft: "10px",
            }}
          >
            <PP>New Wish</PP>
          </Button>
        )}
      </$Horizontal>
    </$Vertical>
  );
};

export default WishlistGallery;
