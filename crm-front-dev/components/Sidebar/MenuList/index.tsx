// material-ui
import { Typography } from "@mui/material";

// project imports
import NavGroup from "./NavGroup";
import menuItem from "../../../constants/menu-items";

const MenuList = () => {
  const navItems = menuItem.items.map((item: any) => {
    if (item.type == "group") {
      return <NavGroup key={item.id} item={item} />;
    } else {
      return (
        <Typography key={item.id} variant="h6" color="error" align="center">
          Menu Items Error
        </Typography>
      );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
