import useTrans from "../utils/useTran";

export const renderGenderUser = (dataGender: any) => {
  const trans = useTrans();
  if (dataGender === true) {
    return trans.contact.male;
  } else {
    return trans.contact.female;
  }
};
