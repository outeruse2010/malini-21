import React from 'react';
import {  useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Drawer from '@mui/material/Drawer';
import { useHistory, useLocation } from "react-router-dom";

import IconButton from '@mui/material/IconButton';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {drawerWidth} from './menu_const';

function MenuDrawer({menu_items, onMenuIconClick, open}) {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const location = useLocation();

    return (
        <Drawer className={classes.drawer} variant="persistent" anchor="left" open={open} classes={{ paper: classes.drawerPaper}} >
        <div className={classes.drawerHeader}>
          <IconButton onClick={onMenuIconClick}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {menu_items.map((mnu, index) => 
           <div key={index}>
              <ListItem button key={mnu.title} onClick={()=> history.push(mnu.path)} 
              className={(location.path === mnu.path) ? classes.active : null}>                
                  <ListItemText primary={mnu.title} button='true'/>
              </ListItem>
              {mnu.divide && <Divider key={index}/>}
           </div>
          )}
        </List>
        <Divider />

      </Drawer>
    )
}

export default MenuDrawer;

const useStyles = makeStyles((theme) => ({

    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },

    active:{background: '#f4f4f4'}
  }));
  
