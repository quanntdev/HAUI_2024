import { useState, useRef, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { Avatar, Box, Button, Chip, Stack } from "@mui/material";
import { IconSettings } from "@tabler/icons";
import { useRouter } from "next/router";
import getLinkAvatar from "../../../utility/getLinkAvatar";
import useTrans from "../../../utils/useTran";

const ProfileSection = (props: any) => {
  const { dataDetailProfile } = props.profile;
  const theme: any = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const trans = useTrans();
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef: any = useRef(null);

  useEffect(() => {
    setOpen(false);
  }, [router]);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, [setOpen]);

  const prevOpen = useRef(open);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    document.cookie = `${process.env.NEXT_PUBLIC_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    router.push("/login");
  }, [router]);

  const handleOpenProfile = useCallback(() => {
    setOpen(false);
    router.push("/profile");
  }, [setOpen, router]);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const profileItemList = (
    <Stack
      direction="column"
      sx={{ position: "absolute", left: "-12px" }}
      gap={1}
    >
      <Button
        variant="contained"
        sx={{ marginTop: 1, width: "120px", textTransform: "capitalize" }}
        onClick={handleOpenProfile}
      >
        {trans.home.profile}
      </Button>
      <Button sx={{textTransform: "capitalize"}} onClick={handleLogout} variant="contained">
        {trans.home.logout}
      </Button>
    </Stack>
  );

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Chip
        sx={{
          height: "48px",
          alignItems: "center",
          borderRadius: "27px",
          transition: "all 0.2s ease-in-out 0s",
          backgroundColor: "rgb(227, 242, 253)",
          borderColor: "rgb(227, 242, 253)",
          color: "rgb(33, 150, 243)",
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: "rgb(33, 150, 243)",
            background: "rgb(33, 150, 243) !important",
            color: "rgb(227, 242, 253)",
            "& svg": {
              stroke: "rgb(227, 242, 253)",
            },
          },
          "& .MuiChip-label": {
            lineHeight: 0,
          },
        }}
        icon={
          <Avatar
            src={getLinkAvatar(dataDetailProfile?.profile?.profileImg) ?? null}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: "8px 0 8px 8px !important",
              cursor: "pointer",
            }}
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={
          <IconSettings
            stroke={1.5}
            size="1.5rem"
            color={theme.palette.primary.main}
          />
        }
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      {open ? profileItemList : ""}
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  profile: state.profile,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSection);
