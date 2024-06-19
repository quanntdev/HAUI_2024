import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { Divider, List, Typography } from "@mui/material";
import NavItem from "../NavItem";
import NavCollapse from "../NavCollapse";
import admin from "../../../../constants/menu-items/admin";
import { useSelector } from 'react-redux';
import useTrans from "../../../../utils/useTran";

const NavGroup = ({ item }: any) => {
  const trans:any = useTrans();
  const theme: any = useTheme();
  const userLogin = useSelector((state: any) => state?.profile?.dataDetailProfile);

  let filteredChildren = [];
  if(userLogin?.role == 1) {
      filteredChildren = item?.children
  } else {
      filteredChildren = item.children.filter((menu: any) => menu.id != 'default');
  }

  const items = filteredChildren.map((menu: any) => {

    switch (menu.type) {
      case "collapse":
        return <NavCollapse key={menu.id} menu={menu} level={1} />;
      case "item":
        return <NavItem key={menu.id} item={menu} level={1} />;
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <>
      <List
        subheader={
          item.title && (
            <Typography
              variant="caption"
              sx={{ ...theme.typography.menuCaption }}
              display="block"
              gutterBottom
            >
              {(userLogin?.role == 1)? trans.menu[item.title] : ""}
              {(userLogin?.role == 2 && item.title != "Admin")? trans.menu[item.title] : ""}
              {item.caption && (
                <Typography
                  variant="caption"
                  sx={{ ...theme.typography.subMenuCaption }}
                  display="block"
                  gutterBottom
                >
                 {item.caption}
                </Typography>
              )}
            </Typography>
          )
        }
      >
        {items}
      </List>
      {!!(item.children[0].title !== admin?.children[0]?.title) && (
        <Divider sx={{ mt: 0.25, mb: 1.25 }} />
      )}
    </>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object,
};

export default NavGroup;
