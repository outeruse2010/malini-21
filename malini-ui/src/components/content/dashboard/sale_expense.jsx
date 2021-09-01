import React, {useState, useEffect, useMemo} from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {login_atom} from '../login/login_api';
import { message_atom } from '../utils/SnakbarComp';
import {useRecoilState, useRecoilValue} from 'recoil';
import { fetch_sale_expense_dashboard_data} from './dashboard_api';
import { DataGrid } from '@material-ui/data-grid';
import { CustomLineChart, CustomAreaChart, useStyles, CustomBarChart, DasboardDataGrid } from './chart_utils';
import { gridDateTime } from './../utils/app_utils';

import Card from '@material-ui/core/Card';
import { CardHeader } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';


const SaleExpense = () => {
    const classes = useStyles();
    const login_data = useRecoilValue(login_atom);
    const user_name = login_data.user_name;

    const [act_message, setAct_message] = useRecoilState(message_atom);
    const [last_30_days, setLast_30_days] = useState([]);
    const [weekly, setWeekly] = useState([]);
    const [monthly, setMonthly] = useState([]);
    

    useEffect(()=>{
        const sale_exp_res = fetch_sale_expense_dashboard_data();
        sale_exp_res.then(data => {
            console.log('****data: ',data);
            if(data['status'] === 'error'){
                setAct_message(sale_exp_res);
            }else {                
                setLast_30_days(data['daily']);
                setWeekly(data['weekly']);
                setMonthly(data['monthly']);
            }
        });
    }, []);


    const daily_cols = [{field: 'sale_expense_date', headerName:'Date',valueGetter: gridDateTime, width:105,  align:'left', headerAlign: "left", type:'date'}
                        ,{field: 'cash_sale_amount', headerName:'Sale', width:110, align:'left', headerAlign: "left",  type: 'number'}
                        ,{field: 'expense_amt', headerName:'Expense', width:110, align:'left', headerAlign: "left",  type: 'number'}];
    const weekly_cols = [{field: 'id', headerName:'Week No', align:'left',align:'left', headerAlign: "left",   type:'number'}
                        ,{field: 'total_cash_sale', headerName:'Cash Sale', width:110,  align:'left', headerAlign: "left",  type: 'number'}
                        ,{field: 'total_expense', headerName:'Expense', width:110, align:'left', headerAlign: "left",   type: 'number'}];
     const monthly_cols = [{field: 'id', headerName:'Month No',   align:'left', headerAlign: "left", type:'number'}
                        ,{field: 'total_cash_sale', headerName:'Cash Sale', width:110, align:'left', headerAlign: "left",  type: 'number'}
                        ,{field: 'total_expense', headerName:'Expense', width:110, align:'left', headerAlign: "left",  type: 'number'}];

    return (
      <div className={classes.root}>
        <Grid container spacing={4} >
                <Grid item xs={9}> 
                    <Grid container   spacing={2} >
                            <Grid item >                                 
                                <CustomLineChart title='Last 30 Days Sale Expense'  data = {last_30_days} yfield1={'cash_sale_amount'} ylabel1={'Sale'}  yfield2={'expense_amt'} ylabel2={'Expense'} xfield={'sale_expense_date_str'}/>
                            </Grid>
                             <Grid item > 
                                    <CustomBarChart title='Last 4 Weeks  Sale Expense' data = {weekly}   yfield2={'total_cash_sale'} ylabel2={'Cash Sale'}  yfield3={'total_expense'} ylabel3={'Expend'} xfield={'id'}/>
                            </Grid>
                            <Grid item > 
                                    <CustomBarChart title='Last 6 Months Sale Expense' data = {monthly}   yfield2={'total_cash_sale'} ylabel2={'Cash Sale'}  yfield3={'total_expense'} ylabel3={'Expend'} xfield={'id'}/>
                            </Grid>
                        </Grid>
                 </Grid>
                <Grid item xs={3}>
                       <DasboardDataGrid rows={last_30_days} columns={daily_cols} title='Last 30 days sale expense'/>
                        <DasboardDataGrid rows={weekly} columns={weekly_cols} title='Last 4 weeks sale expense'/>
                        <DasboardDataGrid rows={monthly} columns={monthly_cols} title='Last 6 months sale expense'/>                
                </Grid>
        </Grid>
      </div>
    )
};

export default SaleExpense;

