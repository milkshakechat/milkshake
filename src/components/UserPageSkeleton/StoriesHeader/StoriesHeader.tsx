import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { Avatar, theme } from "antd";
import styled from "styled-components";
import { useWindowSize } from "@/api/utils/screen";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const StoriesHeader = () => {
  const intl = useIntl();
  const { screen, isMobile } = useWindowSize();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  return (
    <$StoriesHeader backgroundColor={token.colorBgContainer}>
      {
        // create an array from a number
        Array.from(Array(30).keys()).map((k, i) => {
          return (
            <div
              key={i}
              onClick={() => {
                navigate({
                  pathname: "/app/story/new",
                });
              }}
            >
              <Avatar
                size={75}
                {...{
                  icon: i === 0 ? <PlusOutlined /> : null,
                }}
              />
            </div>
          );
        })
      }
    </$StoriesHeader>
  );
};

export default StoriesHeader;

export const $StoriesHeader = styled.div<{
  padding?: string;
  backgroundColor: string;
}>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow-x: scroll;
  gap: 10px;
  padding: 10px 0px;
  ${(props) => props.padding && `padding: ${props.padding};`}
  ${(props) => `background-color: ${props.backgroundColor};`}
`;
