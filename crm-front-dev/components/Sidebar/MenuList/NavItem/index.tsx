import PropTypes from "prop-types";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { MENU_OPEN, SET_MENU } from "../../../../redux/constants";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useRouter } from "next/router";
import useTrans from "../../../../utils/useTran";
import { getListTask, getTotalAssign } from "../../../../redux/actions/task";

const NavItem = (props: any) => {
  const trans: any = useTrans();
  const theme: any = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const customization: any = useSelector((state: any) => state.customization);
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));
  const { item, level, getTotalAssign } = props;
  const {
    total,
    dataListTask,
    dataTaskDelete,
    dataUpdateTask,
    dataCreateTask,
    dataUpdateTaskStatus,
  } = props.task;

  const Icon = item.icon;
  const itemIcon = item?.icon ? (
    <Icon stroke={1.5} size="1.3rem" />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width:
          customization?.isOpen.findIndex((id: any) => id === item?.id) > -1
            ? 8
            : 6,
        height:
          customization?.isOpen.findIndex((id: any) => id === item?.id) > -1
            ? 8
            : 6,
      }}
      fontSize={level > 0 ? "inherit" : "medium"}
    />
  );

  useEffect(() => {
    getTotalAssign();
  }, [
    dataListTask,
    dataCreateTask,
    dataTaskDelete,
    dataUpdateTask,
    dataUpdateTaskStatus,
  ]);

  let itemTarget = "_self";
  if (item.target) {
    itemTarget = "_blank";
  }

  let listItemProps: any = {
    // component: forwardRef((props, ref) => <Link href={item.url} target={itemTarget}><a></a></Link>)
  };
  if (item?.external) {
    listItemProps = { component: "a", href: item.url, target: itemTarget };
  }

  const itemHandler = (id: any, url: string) => {
    dispatch({ type: MENU_OPEN, id });
    if (matchesSM) dispatch({ type: SET_MENU, opened: false });
    router.push(url);
  };

  // active menu item on page load
  useEffect(() => {
    const currentIndex = router?.pathname
      .toString()
      .split("/")
      .findIndex((id) => id === item.id);
    if (currentIndex > -1) {
      dispatch({ type: MENU_OPEN, id: item.id });
    }
  }, [item, dispatch, router]);

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        borderRadius: `${customization?.borderRadius}px`,
        mb: 0.5,
        alignItems: "flex-start",
        backgroundColor: level > 1 ? "transparent !important" : "inherit",
        py: level > 1 ? 1 : 1.25,
        pl: `${level * 24}px`,
      }}
      selected={
        customization?.isOpen.findIndex((id: any) => id === item.id) > -1
      }
      onClick={() => itemHandler(item.id, item.url)}
    >
      <ListItemIcon sx={{ my: "auto", minWidth: !item?.icon ? 18 : 36 }}>
        {itemIcon}
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography color="inherit">
            {item.title === "task" ? (
              <span style={{ marginRight: "15px" }}>
                {trans.menu[item.title]}
                {total && (
                  <small
                    style={{
                      marginLeft: "5px",
                      borderRadius: "50%",
                      padding: "2px 5px",
                      backgroundColor: "rgb(244, 67, 67)",
                      color: "white",
                    }}
                  >
                    {total}
                  </small>
                )}
              </span>
            ) : (
              trans.menu[item.title]
            )}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography
              variant="caption"
              sx={{ ...theme.typography.subMenuCaption }}
              display="block"
              gutterBottom
            >
              {item.caption}
            </Typography>
          )
        }
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
};

const mapStateToProps = (state: any) => ({
  task: state.task,
});

const mapDispatchToProps = {
  getListTask,
  getTotalAssign,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavItem);
