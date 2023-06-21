import { useIntl, FormattedMessage } from "react-intl";
import { $Vertical, $Horizontal } from "@/api/utils/spacing";
import { Card, theme } from "antd";
import { useWindowSize } from "@/api/utils/screen";

interface TimelineGalleryProps {
  media: { title: string; count: number }[];
}

const TimelineGallery = ({ media }: TimelineGalleryProps) => {
  const { screen, isMobile } = useWindowSize();
  const intl = useIntl();
  const { token } = theme.useToken();

  const renderTimelineRow = ({
    title,
    count,
  }: {
    title: string;
    count: number;
  }) => {
    return (
      <$Vertical key={title}>
        <span
          style={{
            fontSize: "1rem",
            margin: isMobile ? "20px 0px 5px 0px" : "20px 0px 10px 0px",
          }}
        >
          {title}
        </span>
        <$Horizontal style={{ overflowX: "scroll" }}>
          {
            // create an array from a number
            Array.from(Array(count).keys()).map((i) => {
              return (
                <Card
                  key={i}
                  hoverable
                  style={{
                    minWidth: 130,
                    height: 200,
                    backgroundColor: token.colorBgContainerDisabled,
                    marginRight: "10px",
                  }}
                ></Card>
              );
            })
          }
        </$Horizontal>
      </$Vertical>
    );
  };

  return (
    <$Vertical>
      {media.map((row) => {
        return renderTimelineRow(row);
      })}
    </$Vertical>
  );
};

export default TimelineGallery;
