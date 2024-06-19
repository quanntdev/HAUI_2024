// assets
import { IconUsers } from "@tabler/icons";
import PublicIcon from '@mui/icons-material/Public';
import WifiChannelIcon from '@mui/icons-material/WifiChannel';
import SettingsIcon from '@mui/icons-material/Settings';
import FormatListNumberedRtlIcon from '@mui/icons-material/FormatListNumberedRtl';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';

// constant
const icons = { ApartmentOutlinedIcon, IconUsers, PublicIcon, WifiChannelIcon, SettingsIcon, FormatListNumberedRtlIcon };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const admin = {
  id: "admin",
  title: `system_setting`,
  type: "group",
  children: [
    {
      id: "default",
      title: `account_manager`,
      type: "item",
      url: "/user",
      icon: icons.IconUsers,
      breadcrumbs: false,
    },
    // {
    //   id: "default",
    //   title: `country_manage`,
    //   type: "item",
    //   url: "/country",
    //   icon: icons.PublicIcon,
    //   breadcrumbs: false,
    // },
    // {
    //   id: "default",
    //   title: `sale_channel`,
    //   type: "item",
    //   url: "/salechannel",
    //   icon: icons.WifiChannelIcon,
    //   breadcrumbs: false,
    // },
    // {
    //   id: "default",
    //   title: `level_customer`,
    //   type: "item",
    //   url: "/level",
    //   icon: icons.FormatListNumberedRtlIcon,
    //   breadcrumbs: false,
    // },
    // {
    //   id: "default",
    //   title: `industry`,
    //   type: "item",
    //   url: "/industry",
    //   icon: icons.ApartmentOutlinedIcon,
    //   breadcrumbs: false,
    // },
    // {
    //   id: "default",
    //   title: `web_setting`,
    //   type: "item",
    //   url: "/setting",
    //   icon: icons.SettingsIcon,
    //   breadcrumbs: false,
    // },

  ],
};

export default admin;
