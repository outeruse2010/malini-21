import React, {useState, useEffect, useMemo} from 'react';
import { DataGrid } from '@material-ui/data-grid';
import {Button, Typography, Grid}  from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
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



    useEffect(() => {
        const sale_exp_res = fetch_daily_sale_expenses();            
        sale_exp_res.then(data => {
            if(data['status'] === 'error'){
                setAct_message(sale_exp_res);
            }else {
                setSale_expense_list(data);
            }
        });
    }, []);

    
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
    

    const columns = [
        { field: 'sale_exp_date', headerName: 'Sale/Exp Date', width: 160, valueGetter: gridDate, headerClassName: appcls.data_grid_header, type:'date'}
        ,{ field: 'total_cash_sale', headerName: 'Cash Sale', width: 140, headerClassName: appcls.data_grid_header}
        ,{ field: 'total_expense', headerName: 'Exp Amt', width: 130, headerClassName: appcls.data_grid_header}
        ,{ field: 'created_by', headerName: 'Created By', width: 200, headerClassName: appcls.data_grid_header}
        ,{ field: 'created_on', headerName: 'Created On', width: 160, valueGetter: gridDateTime, headerClassName: appcls.data_grid_header}
      ];

    const dialog_memo = useMemo(()=> <DialogComp show={openDia} onDialogClose={(ans)=> onDialogClose(ans)}/>, [openDia]);

    return (
        <div>
            <SnakbarComp />
            <Grid container direction="row" justifyContent="space-between" alignItems="center" className={appcls.title_row}>
                <Typography variant="h6"> Daily Sale Expenses </Typography>
                <Button type="button" onClick={onAddNewClick} size="small" color="primary" startIcon={<AddIcon />}> Add New </Button>
            </Grid>

            <div style={{ height: 500, width: '100%' }}>
                <DataGrid rows={sale_expense_list} columns={columns}   disableSelectionOnClick rowsPerPageOptions={[]} rowHeight={30} headerHeight={32}/>
            </div>

            <DailySaleExpenseEntry selected_sale_expense={selected_sale_expense} openSaleExpenseModal={openSaleExpenseModal} toggleSaleExpenseModal={toggleSaleExpenseModal} />
            {dialog_memo}
                     
        </div>
    )
};

export default DailySaleExpense;
