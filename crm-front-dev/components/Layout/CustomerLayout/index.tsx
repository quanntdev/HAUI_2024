import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  title?: string;
}

const CustomerLayout = ({ children }: Props): JSX.Element => {
  return (
    <div
      style={{width: "90%", margin: "0 auto"}}
    >
      {children}
    </div>
  )
};

export default CustomerLayout;
