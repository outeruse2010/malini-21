import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

import SaleExpense from './sale_expense';
import CustomerDetail from './customer_detail';

const DashBoard = () => {
    const classes = useStyles();
    
    return (
      <div>
        <SaleExpense/>
        <CustomerDetail/>
      </div>
      
    )
};

export default DashBoard;

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      display: "flex",
    flex: 1
    },
  }));
