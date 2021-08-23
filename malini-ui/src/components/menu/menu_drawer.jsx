import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { useHistory, useLocation } from "react-router-dom";

import IconButton from '@material-ui/core/IconButton';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
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
  
