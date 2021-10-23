import React, {useState, useEffect, useMemo} from 'react';
import { DataGrid ,visibleSortedGridRowIdsSelector} from '@mui/x-data-grid';
import {TextField, Button, Typography, Grid, InputLabel, FormControl}  from '@mui/material';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import {login_atom} from '../login/login_api';
import {useRecoilState, useRecoilValue} from 'recoil';
import { dialog_atom } from '../utils/DialogComp';
import DialogComp from '../utils/DialogComp';
import { message_atom } from '../utils/SnakbarComp';
import SnakbarComp from '../utils/SnakbarComp';
import {gridDate, gridDateTime} from '../utils/app_utils';
import {sale_expense_atom, act_sale_expense_atom, fetch_daily_sale_expenses, delete_daily_sale_expense} from './sale_expense_api';
import DailySaleExpenseEntry from './daily_sale_expense_entry';
import { AppStyles } from '../utils/app_styles';
import moment from 'moment';

const DailySaleExpense = () => {
    const appcls = AppStyles();
    const login_data = useRecoilValue(login_atom);
    const user_name = login_data.user_name;

    const [openDia, setOpenDia] = useState(false);
    const [act_message, setAct_message] = useRecoilState(message_atom);
    const [dialog_message, setDialog_message] = useRecoilState(dialog_atom);
    const [act_sale_expense_res, setAct_sale_expense_res] = useRecoilState(act_sale_expense_atom);
    const [sale_expense_list, setSale_expense_list] = useRecoilState(sale_expense_atom);
    const [selected_sale_expense, setSelected_sale_expense] = useState(null);
    const [openSaleExpenseModal, setOpenSaleExpenseModal] = useState(false);

    const today = moment().format('YYYY-MM-DD');
    const day_back_30 = moment().subtract(30,'days').format('YYYY-MM-DD');
    const [dateRangeType, setDateRangeType] = useState('Daily');
    const [from_date, setFrom_date] = useState(day_back_30);
    const [to_date, setTo_date] = useState(today);
    const [fromDtErr, setFromDtErr] = useState(false);
    const [toDtErr, setToDtErr] = useState(false);

    const [total, setTotal] = useState(0);
    const [total_txt_color, setTotal_txt_color] = useState('primary');


    useEffect(() => {
        get_sale_expense_list(day_back_30, today);
    }, []);

    const get_sale_expense_list = (fdt, tdt, dtRangeType=null) =>{
        dtRangeType  = dtRangeType ? dtRangeType : dateRangeType ;
        const input = {dateRangeType: dtRangeType, from_date :fdt, to_date: tdt};
        const sale_exp_res = fetch_daily_sale_expenses(input); 
        sale_exp_res.then(data => {
            if(data['status'] === 'error'){
                setAct_message(sale_exp_res);
            }else {
                const sale_expense_rows = data['sale_expense_rows'];
                const total = data['total'];
                if(total && (total['profit']  <  0) ){
                        setTotal_txt_color('secondary');
                }
                setTotal(total);
                setSale_expense_list(sale_expense_rows);
            }
        });
    }

    const onDateRangeTypeChange = (e) => {
        const dRangeType = e.target.value;
        get_sale_expense_list(from_date, to_date, dRangeType);
        setDateRangeType(dRangeType);
    };

    const onFromDateChange = (e) => {
        let fdt = e.target.value;
        setFrom_date(fdt);
        if( !fdt || moment(fdt).isAfter(today)){
            setFromDtErr(true);
        }
        else if(moment(fdt).isAfter(to_date)){
            setToDtErr(true);
        }else{
            get_sale_expense_list(from_date, to_date);
            setFromDtErr(false);
        }
    };

    const onToDateChange = (e) => {
        let todt = e.target.value;
        setTo_date(todt);
        if( !todt || moment(todt).isAfter(today)){
            setToDtErr(true);
        }
        else if(moment(from_date).isAfter(todt)){
            setFromDtErr(true);
        }else {
            get_sale_expense_list(from_date, todt);
            setToDtErr(false);
        }
    };

    
    const toggleSaleExpenseModal = () => {        
        setOpenSaleExpenseModal(!openSaleExpenseModal);
    };

    const onAddNewClick = () => {
        setSelected_sale_expense(null);
        toggleSaleExpenseModal();
    }


    const onDialogClose = (ans) => {
        if(ans === 'Y'){
            let sale_expense_id = selected_sale_expense['sale_expense_id'];
            let expense_name = selected_sale_expense['expense_name'];

            let input_json = {sale_expense_id, expense_name, updated_by: user_name};

            const res = delete_daily_sale_expense(input_json);
            res.then(data => {
                setAct_sale_expense_res(data);
                if(data.status === 'success'){
                    const sale_exp_res = fetch_daily_sale_expenses();
                    sale_exp_res.then(sale_exps => setSale_expense_list(sale_exps));
                }            
                setAct_message(data);
            });
        }
        setOpenDia(false);
    };

    
//   console.log("visibleRows", visibleRows);
let dt_range_col = { field: 'sale_exp_date', headerName: 'Sale/Exp Date', width: 170, valueGetter: gridDate, headerClassName: appcls.data_grid_header, type:'date'} ;
if(dateRangeType === 'Monthly'){
    dt_range_col = { field: 'sale_exp_date', headerName: 'Sale/Exp Month', width: 180,  headerClassName: appcls.data_grid_header, type:'number'} ;
}
else if(dateRangeType === 'Yearly'){
    dt_range_col = { field: 'sale_exp_date', headerName: 'Sale/Exp Year', width: 180,  headerClassName: appcls.data_grid_header, type:'number'} ;
}

const profitCellColor = (cellValues) => {
     let v = cellValues.value;
     let cls = v > 0 ?  appcls.green_text : appcls.red_text;
     return (<span className={cls}>{v}</span>);
};
    const columns = [
        dt_range_col
        ,{ field: 'total_cash_sale', headerName: 'Cash Sale', width: 140, headerClassName: appcls.data_grid_header, type:'number'}
        ,{ field: 'total_expense', headerName: 'Exp Amt', width: 130, headerClassName: appcls.data_grid_header, type:'number'}
        ,{ field: 'profit', headerName: 'Remaining', width: 130,  headerClassName: appcls.data_grid_header, type:'number',
            renderCell: (cellValues)=>  profitCellColor(cellValues)   }
     ];

    const dialog_memo = useMemo(()=> <DialogComp show={openDia} onDialogClose={(ans)=> onDialogClose(ans)}/>, [openDia]);

    return (
        <div>
            <SnakbarComp />
            <Grid container direction="row" justifyContent="space-between" alignItems="center" className={appcls.title_row}>
                <Typography variant="h6"> Daily Sale Expenses </Typography>

                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel >Date Range Type</InputLabel>
                <Select   value={dateRangeType}  onChange={onDateRangeTypeChange}  variant='standard' label="Date Range Type" >
                        <MenuItem value='Daily' > Daily </MenuItem>
                        <MenuItem value='Monthly'> Monthly </MenuItem>
                        <MenuItem value='Yearly' > Yearly </MenuItem>
                </Select>
                </FormControl>

                <TextField type="date" value={from_date} onChange={onFromDateChange} 
                                     label="From Date (dd/mm/yyyy)" variant="outlined" error={fromDtErr}
                                      InputLabelProps={{ shrink: true, }} size="small"/>  
                 <TextField type="date" value={to_date} onChange={onToDateChange} 
                                     label="To Date (dd/mm/yyyy)" variant="outlined"  error={toDtErr}
                                      InputLabelProps={{ shrink: true, }} size="small"/>  
                {total &&  <Typography color={total_txt_color} > <strong>Total</strong>   [ Sale: {total['total_sale']},  Exp: {total['total_expense']},  Remaining: {total['total_profit']} ] </Typography>}
                <Button type="button" onClick={onAddNewClick} size="small" color="primary" startIcon={<AddIcon />}> Add New </Button>
            </Grid>

            <div style={{ height: 500, width: '100%' }}>
                <DataGrid rows={sale_expense_list} columns={columns}  disableSelectionOnClick rowsPerPageOptions={[]} rowHeight={30} headerHeight={32}/>
            </div>

            <DailySaleExpenseEntry selected_sale_expense={selected_sale_expense} openSaleExpenseModal={openSaleExpenseModal} toggleSaleExpenseModal={toggleSaleExpenseModal} />
            {dialog_memo}
                     
        </div>
    )
};

export default DailySaleExpense;
