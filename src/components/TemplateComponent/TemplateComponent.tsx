import { useIntl, FormattedMessage } from "react-intl";
import { cid } from "./i18n/types.i18n.TemplateComponent";

const TemplateComponent = () => {
  const intl = useIntl();

  const title = intl.formatMessage({
    id: `i18n_TemplateComponent.title`,
    defaultMessage: "TemplateComponent (English fallback)",
  });
  return (
    <div>
      {title}
      <br />
      <FormattedMessage id="message" defaultMessage={"yoo"} />
    </div>
  );
};

export default TemplateComponent;
