import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';

const ITEM_HEIGHT = 30;

const GridActionMenu = ({menu_items, row, onGirdMenuClick}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (menu_item) => {
    onGirdMenuClick(menu_item, row);
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleClick} size="small" >
        <MoreVertIcon color="primary" size="small"/>
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {menu_items.map((menu_item) => (
          <MenuItem key={menu_item} onClick={()=>handleClose(menu_item)} size="small">
            <SendIcon size='small'/><MoreVertIcon size="small" color="disabled"/>
            <Typography variant="inherit" >{menu_item}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default GridActionMenu;
