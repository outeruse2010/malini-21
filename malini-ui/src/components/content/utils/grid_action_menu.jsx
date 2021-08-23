import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';

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
