import React, {useState} from 'react';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {drawerWidth} from './menu_const';

import {login_atom} from '../content/login/login_api';
import {useRecoilValue} from 'recoil';
import UserDetail from './../content/user/user_detail';

function MenuHeader ({onMenuIconClick, open}) {
    const login_data = useRecoilValue(login_atom);
    let success = false, user_name = '';
    if(login_data && login_data.status){
      success = (login_data.status === 'success');
      user_name = login_data.user_name;
    }    
    const classes = useStyles();

    const [openUserDetailModal, setOpenUserDetailModal] = useState(false);

    const toggleUserDetailModal = () => setOpenUserDetailModal(!openUserDetailModal);

    return (
        <AppBar position="fixed" className={clsx(classes.appBar, { [classes.appBarShift]: open, })} >
        <Toolbar>         
            <Grid container direction="row" justifyContent="space-between" alignItems="center" >
                {success && 
                <IconButton  onClick={() => onMenuIconClick()} color="inherit" aria-label="open drawer"  edge="start" className={clsx(classes.menuButton, open && classes.hide)} >
                  <MenuIcon /></IconButton>}
                  <Typography variant="h3" noWrap className={classes.title_color}> Malini </Typography>
                  {success && <div> <IconButton onClick={toggleUserDetailModal }><PersonAddIcon /></IconButton><Typography noWrap className={classes.title_color}> {user_name} </Typography></div>}
            </Grid>
        </Toolbar>
        <UserDetail openUserDetailModal={openUserDetailModal} toggleUserDetailModal={toggleUserDetailModal}/>
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
  


