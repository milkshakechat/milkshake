import { useIntl, FormattedMessage } from "react-intl";
import { cid } from "./i18n/types.i18n.TemplateComponent";

const TemplateComponent = () => {
  const intl = useIntl();

  const title = intl.formatMessage({
    id: `title.${cid}`,
    defaultMessage: "TemplateComponent (English fallback)",
  });
  return <div>{title}</div>;
};

export default TemplateComponent;
