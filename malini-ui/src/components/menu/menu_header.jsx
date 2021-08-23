import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {drawerWidth} from './menu_const';

import {login_atom} from '../content/login/login_api';
import {useRecoilValue} from 'recoil';

function MenuHeader ({onMenuIconClick, open}) {
    const login_data = useRecoilValue(login_atom);
    let success = false, user_name = '';
    if(login_data && login_data.status){
      success = (login_data.status === 'success');
      user_name = login_data.user_name;
    }    
    const classes = useStyles();
    return (
        <AppBar position="fixed" className={clsx(classes.appBar, { [classes.appBarShift]: open, })} >
        <Toolbar>         
            <Grid container direction="row" justifyContent="space-between" alignItems="center" >
                {success && 
                <IconButton  onClick={() => onMenuIconClick()} color="inherit" aria-label="open drawer"  edge="start" className={clsx(classes.menuButton, open && classes.hide)} >
                  <MenuIcon /></IconButton>}
                  <Typography variant="h3" noWrap className={classes.title_color}> Malini </Typography>
                  {success && <div><PersonIcon /><Typography noWrap className={classes.title_color}> {user_name} </Typography></div>}
            </Grid>
        </Toolbar>
      </AppBar>
    );
}

export default MenuHeader;

const useStyles = makeStyles((theme) => ({
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
      appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
      hide: {
        display: 'none',
      },
      title_color:{ color: '#ede7f6'}

    
  }));
  


