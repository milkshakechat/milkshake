import { theme } from "antd";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";

const JankyCurtain = ({ loading }: { loading: boolean }) => {
  const { token } = theme.useToken();
  if (!loading) return null;
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 10,
        backgroundColor: token.colorBgContainer,
        width: "100vw",
        height: "100vh",
        top: 0,
      }}
    >
      <LoadingAnimation
        width="100%"
        height="100%"
        fill={token.colorPrimaryBg}
      />
    </div>
  );
};

export default JankyCurtain;

/**
 *
 * <div style={{ position: 'relative' }}>
 *  <JankyCurtain loading={shinyLoading} />
 * </div>
 *
 */
