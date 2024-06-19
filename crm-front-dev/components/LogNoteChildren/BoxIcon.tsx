import * as React from 'react';
import PopperUnstyled from '@mui/base/PopperUnstyled';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { Button, MenuItem, MenuList, styled } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import styles from "./style.module.scss";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Popup = styled(PopperUnstyled)({
  zIndex: 1000,
});

export default function BoxIcon(props: any) {
  const {handleDelete,  handleEdit} = props;
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleListKeyDown = (event:any) => {
    if (event.key === 'Tab') {
      setAnchorEl(null);
    } else if (event.key === 'Escape') {
      anchorEl?.focus();
      setAnchorEl(null);
    }
  };

  return (
    <div>
      <Button
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreHorizIcon
         style={{
          position:'relative',
          left:'-20px'
         }} 
        />
      </Button>
      <Popup
        role={undefined}
        id="composition-menu"
        open={open}
        anchorEl={anchorEl}
        disablePortal
        className={styles["custome_popup"]}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 4],
            },
          },
        ]}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <MenuList
            onKeyDown={handleListKeyDown}
            sx={{ boxShadow: 'md', bgcolor: 'background.body' }}
          >
            <MenuItem onClick={handleEdit}>
                <EditIcon />
            </MenuItem>
            <MenuItem onClick={handleDelete}>
                <DeleteForeverIcon />
            </MenuItem>
          </MenuList>
        </ClickAwayListener>
      </Popup>
    </div>
  );
}
