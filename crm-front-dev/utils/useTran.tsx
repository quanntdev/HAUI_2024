import en from "../public/lang/en";
import vi from "../public/lang/vi";
import ja from "../public/lang/ja";

const langPackage = (lang: any) => {
  switch (lang) {
    case "en":
      return en;
    case "vi":
      return vi;
    case "ja":
      return ja;
    default:
      return en;
  }
};

const useTrans = () => {
  const defautLang = localStorage?.getItem("languages");

  const trans = langPackage(defautLang);

  return trans;
};

export default useTrans;
