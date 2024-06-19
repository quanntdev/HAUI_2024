import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { updateUserLanguagues } from "../../../redux/actions/profile";
import "/node_modules/flag-icons/css/flag-icons.min.css";

const LanguagesMenu = (props:any) => {
  const { updateUserLanguagues } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const router = useRouter();
  const open = Boolean(anchorEl);
  const handleClick = React.useCallback((event: any) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleChangeLanguages = (value: any) => {
    updateUserLanguagues({languages: value})
    handleClose();
    localStorage.setItem("languages", value);
    router.push({
      pathname: router.pathname,
      query: router?.query
    });
  };

  const changeLabel = (label: any) => {
    switch (label) {
      case "vi":
        return  (<><span className="fi fi-vn icon-flag"></span> Vietnamese</>)
      case "en":
        return  (<><span className="fi fi-gb-eng icon-flag"></span> English</>)
      case "ja":
        return  (<><span className="fi fi-jp icon-flag"></span> Japanese</>);
    }
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {changeLabel(localStorage.getItem("languages"))}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem >
          <div onClick={() => handleChangeLanguages("en")} >
            <span  className="fi fi-gb-eng icon-flag"></span> English
          </div>
        </MenuItem>
        <MenuItem >
        <div onClick={() => handleChangeLanguages("vi")}>
          <span   className="fi fi-vn icon-flag"></span> Vietnamese
        </div>
        </MenuItem>
        <MenuItem>
        <div onClick={() => handleChangeLanguages("ja")}>
          <span  className="fi fi-jp icon-flag"></span> Japanese
        </div>
        </MenuItem>
      </Menu>
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  profile: state.profile,
});

const mapDispatchToProps = {
  updateUserLanguagues,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguagesMenu);
