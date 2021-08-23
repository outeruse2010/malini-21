import React,{useState} from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import clsx from 'clsx';
import { makeStyles} from '@material-ui/core/styles';

import {login_atom} from '../content/login/login_api';
import {useRecoilValue} from 'recoil';

import MenuHeader from './menu_header';
import UserLogin from '../content/login/user_login';
import Customers from '../content/customer/Customers';
import CustomerArea from '../content/customer/CustomerArea';

import MenuDrawer from './menu_drawer';
import {drawerWidth} from './menu_const';
import ExpenseTypes from '../content/sale_expense/expense_types';
import DailySaleExpense from '../content/sale_expense/daily_sale_expense';

const menu_items = [  
  {"title": "Customer Area","component": CustomerArea, "path": "/customer_areas", "icon": "", "divide": false}
  ,{"title": "Customers","component": Customers, "path": "/", "icon": "", "divide": false}
  ,{"title": "Expense Types","component": ExpenseTypes, "path": "/expense_types", "icon": "", "divide": false}
  ,{"title": "Daily Sale Expense","component": DailySaleExpense, "path": "/daily_sale_expense", "icon": "", "divide": false}
                    ];

function AppMenu() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const login_data = useRecoilValue(login_atom);
  let success = false, user_name = '';
  if(login_data && login_data.status){
    success = (login_data.status === 'success');
    user_name = login_data.user_name;
  }  
  

  return (
    
    <div className={classes.root}>
      <MenuHeader onMenuIconClick = {()=> setOpen(!open)}  open={open}/>
      {!success && <UserLogin />}
      {success && 
      <Router>
        <MenuDrawer menu_items={menu_items} onMenuIconClick = {()=> setOpen(!open)}  open={open} />      
        <main className={clsx(classes.content, { [classes.contentShift]: open, })} >
          <div className={classes.drawerHeader} />
          <Switch>
            {menu_items.map(r => <Route path={r.path} exact component={r.component} key={r.title}/> )}
          </Switch>
        </main>
      </Router>}
    </div>
    
  );
}

export default AppMenu;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  
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
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  active:{background: '#ede7f6'},
  title_color:{ color: '#ede7f6'}
}));
