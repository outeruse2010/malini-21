import React, {useState, useEffect, useMemo} from 'react';
import Grid from '@material-ui/core/Grid';
import {useRecoilState, useRecoilValue} from 'recoil';
import { cus_dashboard_atom , fetch_customer_dashboard_data} from './dashboard_api';
import { useStyles } from './chart_utils';
import ChartDataTable from './chart_data_table';

const CustomerDetail = () => {
    const classes = useStyles();
   
    const [cus_data_list, setCus_data_list] = useRecoilState(cus_dashboard_atom);

    useEffect(() => {
        const cus_data_res = fetch_customer_dashboard_data();
        cus_data_res.then(data => setCus_data_list(data));
    }, []);

    // console.log('****cus_data_list: ',cus_data_list);

    const cols = [{'field': 'area_name', name:'Area'}
                        ,{'field': 'no_of_customers', name:'No of customers'}
                        ,{'field': 'total_maketing', name:'Marketing Amt'}
                        ,{'field': 'total_due', name:'Due Amt'}];

    return (
      <div className={classes.root}>
        <Grid container spacing={4}  className={classes.grid_row} >
                <Grid item xs={7}> 
                    {/* <CustomLineChart data = {sale_expense_list} yfield1={'cash_sale_amount'} ylabel1={'Sale'} 
                    yfield2={'expense_amt'} ylabel2={'Expense'} xfield={'sale_expense_date_str'}/> */}
                 </Grid>
                <Grid item xs={5}>
                       <ChartDataTable rows = {cus_data_list} columns={cols}/>
                </Grid>
        </Grid>
      </div>
    )
};

export default CustomerDetail;
