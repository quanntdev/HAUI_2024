import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  title?: string;
}

const NoLayout = ({ children }: Props): JSX.Element => {
  return (
    <div>
      {children}
    </div>
  )
};

export default NoLayout;
