import { useIntl } from "react-intl";
import { cid } from "./i18n/types.i18n.TemplateComponent";

const TemplateComponent = () => {
  const intl = useIntl();

  const title = intl.formatMessage({
    id: `${cid}.title`,
    defaultMessage: "TemplateComponent (English default)",
  });
  return <div>{title}</div>;
};

export default TemplateComponent;
