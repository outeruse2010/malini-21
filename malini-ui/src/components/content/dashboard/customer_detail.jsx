import React, {useState, useEffect, useMemo} from 'react';
import Grid from '@material-ui/core/Grid';

import {  fetch_customer_dashboard_data} from './dashboard_api';
import { useStyles, CustomMixBarChart, DasboardDataGrid, CustomShapePieChart } from './chart_utils';

const CustomerDetail = () => {
    const classes = useStyles();
   
    const [cus_data_list, setCus_data_list] = useState([]);

    useEffect(() => {
        const cus_data_res = fetch_customer_dashboard_data();
        cus_data_res.then(data => setCus_data_list(data));
    }, []);

    const cols = [{field: 'area_name', headerName:'Area', width:100,  align:'left', headerAlign: "left" }
                        ,{field: 'no_of_customers', headerName:'Customers', width:100,   align:'left', headerAlign: "left",  type: 'number'}
                        ,{field: 'total_maketing', headerName:'Marketing Amt', width:110,   align:'left', headerAlign: "left",  type: 'number'}
                        ,{field: 'total_due', headerName:'Due Amt', width:110,   align:'left', headerAlign: "left",  type: 'number'}];

    return (
      <div className={classes.root}>
        <Grid container spacing={4} >
                <Grid item xs={9}> 
                <Grid container   spacing={2} >
                       <Grid item > 
                              <CustomMixBarChart title='Areawise Marketing & Due' data = {cus_data_list} barLabel1={'no_of_customers'}   yfield2={'total_maketing'} ylabel2={'Marketing Amt'}  yfield3={'total_due'} ylabel3={'Due Amt'} xfield={'area_name'}/>
                         </Grid>
                        <Grid item > 
                            <CustomShapePieChart  title='Customers in areas'
                            data={cus_data_list}  yfield1='no_of_customers'  ylabel1='Customers'  yfield2='total_maketing'  ylabel2='M' 
                            yfield3='total_due'  ylabel3='D' xfield='area_name'/>
                         </Grid>
                    </Grid>
                 </Grid>
                <Grid item xs={3}>
                        <DasboardDataGrid rows={cus_data_list} columns={cols} title='Areawise Marketing & Due'/>
                </Grid>
        </Grid>
      </div>
    )
};

export default CustomerDetail;
