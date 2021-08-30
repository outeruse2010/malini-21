import React, {useState, useEffect, useMemo} from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {login_atom} from '../login/login_api';
import { message_atom } from '../utils/SnakbarComp';
import {useRecoilState, useRecoilValue} from 'recoil';
import {sale_expense_atom, act_sale_expense_atom, fetch_daily_sale_expenses} from '../sale_expense/sale_expense_api';
import ChartDataTable from './chart_data_table';
import {CustomLineChart, useStyles} from './chart_utils';


const SaleExpense = () => {
    const classes = useStyles();
    const login_data = useRecoilValue(login_atom);
    const user_name = login_data.user_name;

    const [act_message, setAct_message] = useRecoilState(message_atom);
    const [sale_expense_list, setSale_expense_list] = useRecoilState(sale_expense_atom);
    

    useEffect(()=>{
        const sale_exp_res = fetch_daily_sale_expenses();
        sale_exp_res.then(data => {
           // console.log('****data: ', data);
            if(data['status'] === 'error'){
                setAct_message(sale_exp_res);
            }else {
                setSale_expense_list(data);
            }
        });
    }, []);

    const cols = [{'field': 'sale_expense_date_str', name:'Date'}
                        ,{'field': 'cash_sale_amount', name:'Sale'}
                        ,{'field': 'expense_amt', name:'Expense'}];

                

    return (
      <div className={classes.root}>
        <Grid container spacing={4}  className={classes.grid_row} >
                <Grid item xs={7}> 
                    <CustomLineChart data = {sale_expense_list} yfield1={'cash_sale_amount'} ylabel1={'Sale'} 
                    yfield2={'expense_amt'} ylabel2={'Expense'} xfield={'sale_expense_date_str'}/>
                 </Grid>
                <Grid item xs={5}>
                       <ChartDataTable rows = {sale_expense_list} columns={cols}/>
                </Grid>
        </Grid>
      </div>
    )
};

export default SaleExpense;




// const useStyles = makeStyles((theme) => ({
//     root: {
//       flexGrow: 1,
//     },
//     grid_row: {
//         height: '40vh',
//     },
//   }));
