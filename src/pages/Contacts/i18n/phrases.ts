export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "______";
const phrases: PhraseSet[] = [{ key: "______", text: "______" }];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;
