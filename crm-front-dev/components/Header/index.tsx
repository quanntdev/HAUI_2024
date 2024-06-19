import * as React from "react";
import { Avatar, Box, ButtonBase } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconMenu2 } from "@tabler/icons";
import NotificationSection from "./NotificationSection";
import ProfileSection from "./ProfileSection";
import PropTypes from "prop-types";
import logo from "../../assets/images/Logo.png";
import Link from "next/link";
import LanguagesMenu from "./Languages";
import { connect } from "react-redux";
import { getSystemInfo } from "../../redux/actions/system";
import { URL_API_FILE_LOGO } from "../../constants";
import { useEffect } from "react";

const Header = ({ handleLeftDrawerToggle, ...props }: any) => {
  const { getSystemInfo } = props;
  const { dataSystem } = props.system;
  const theme: any = useTheme();

  useEffect(() => {
    if(!dataSystem) {
      getSystemInfo();
    }
  }, [dataSystem]);

  const handleLinkFile = (url: any) => {
    return URL_API_FILE_LOGO + url;
  };

  return (
    <Box sx={{ flexGrow: 1, margin: "16px 0" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: 228,
            display: "flex",
            [theme.breakpoints.down("md")]: {
              width: "auto",
            },
          }}
        >
          <Box
            component="span"
            sx={{
              display: { xs: "none", md: "block" },
              flexGrow: 1,
              margin: "auto",
            }}
          >
            <Link href="/">
              <a>
                <img
                  style={{width: "200px"}}
                  src={
                    dataSystem?.logo
                      ? handleLinkFile(dataSystem?.logo)
                      : logo?.src
                  }
                  alt="Logo"
                />
              </a>
            </Link>
          </Box>
        </Box>
        <ButtonBase
          sx={{ borderRadius: "12px", overflow: "hidden", ml: "10px" }}
        >
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: "all 0.2s ease-in-out 0s",
              background: "rgb(237, 231, 246)",
              color: "rgb(94, 53, 177)",
              "&:hover": {
                background: "rgb(94, 53, 177)",
                color: "rgb(237, 231, 246)",
              },
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
        <></>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ flexGrow: 1 }} />
        <LanguagesMenu />
        <NotificationSection />
        <ProfileSection />
      </Box>
    </Box>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func,
};

const mapStateToProps = (state: any) => ({
  auth: state.auth,
  system: state.system,
});

const mapDispatchToProps = { getSystemInfo };

export default connect(mapStateToProps, mapDispatchToProps)(Header);
