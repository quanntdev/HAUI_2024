import useTrans from "../utils/useTran";

export const showGender = (dataGender: number) => {
  const trans = useTrans();

  switch (dataGender) {
    case 0:
      return trans.contact.female;

    case 1:
      return trans.contact.male;

    default:
      return "";
  }
};
