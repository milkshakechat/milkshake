import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import { cid } from "./i18n/types.i18n.TemplateComponent";
import PP from "@/i18n/PlaceholderPrint";

interface TemplateComponentProps {
  children?: React.ReactNode | React.ReactNode[];
}
const TemplateComponent = ({ children }: TemplateComponentProps) => {
  const intl = useIntl();

  const title = intl.formatMessage({
    id: `title.${cid}`,
    defaultMessage: "TemplateComponent (English fallback)",
  });
  return (
    <div>
      <PP>{title}</PP>
    </div>
  );
};

export default TemplateComponent;
