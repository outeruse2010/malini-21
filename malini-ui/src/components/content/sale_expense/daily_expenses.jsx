import React, {useState, useEffect, useMemo} from 'react';
import { DataGrid } from '@material-ui/data-grid';
import {Button, IconButton, Tooltip, Typography, Grid}  from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import {login_atom} from '../login/login_api';
import {useRecoilState, useRecoilValue} from 'recoil';
import { dialog_atom } from '../utils/DialogComp';
import DialogComp from '../utils/DialogComp';
import { message_atom } from '../utils/SnakbarComp';
import SnakbarComp from '../utils/SnakbarComp';
import {gridDate, gridDateTime} from '../utils/app_utils';
import {expense_atom, act_expense_atom, fetch_daily_expenses, delete_daily_expense} from './sale_expense_api';
import DailyExpenseEntry from './daily_expense_entry';
import { AppStyles } from '../utils/app_styles';


const DailyExpenses = () => {
    const appcls = AppStyles();
    const login_data = useRecoilValue(login_atom);
    const user_name = login_data.user_name;

    const [openDia, setOpenDia] = useState(false);
    const [act_message, setAct_message] = useRecoilState(message_atom);
    const [dialog_message, setDialog_message] = useRecoilState(dialog_atom);
    const [act_expense_res, setAct_expense_res] = useRecoilState(act_expense_atom);
    const [expense_list, setExpense_list] = useRecoilState(expense_atom);
    const [selected_expense, setSelected_expense] = useState(null);
    const [openExpenseModal, setOpenExpenseModal] = useState(false);



    useEffect(() => {
        const expense_res = fetch_daily_expenses();            
        expense_res.then(data => {
            if(data['status'] === 'error'){
                setAct_message(expense_res);
            }else {
                setExpense_list(data);
            }
        });
    }, []);

    
    const toggleExpenseModal = () => {        
        setOpenExpenseModal(!openExpenseModal);
    };

    const onAddNewClick = () => {
        setSelected_expense(null);
        toggleExpenseModal();
    }

    const onDeleteClick = (row) => {
        setSelected_expense(row);
        let title = 'Delete Expense ';
        let content = 'Are you sure to DELETE expense ?';
        setDialog_message({title, content});
        setOpenDia(true);
    };

    const onEditClick = (row) => {
        setSelected_expense(row);
        setOpenExpenseModal(true);
    };

    const onDialogClose = (ans) => {
        if(ans === 'Y'){
            let expense_id = selected_expense['expense_id'];

            let input_json = {expense_id,  updated_by: user_name};

            const res = delete_daily_expense(input_json);
            res.then(data => {
                setAct_expense_res(data);
                if(data.status === 'success'){
                    const expense_res = fetch_daily_expenses();
                    expense_res.then(exps => setExpense_list(exps));
                }            
                setAct_message(data);
            });
        }
        setOpenDia(false);
    };
    
    
    const renderEditButton = (params) => {
        return (            
            <IconButton onClick={() => {onEditClick(params.row);}}>
                <Tooltip title="Edit" arrow><EditIcon fontSize="small" color='primary'/></Tooltip>
            </IconButton>
        );
    }

    const renderDeleteButton = (params) => {
        return (            
            <IconButton onClick={() => {onDeleteClick(params.row) }}>
                <Tooltip title="Delete" arrow><DeleteIcon fontSize="small"  color='secondary'/></Tooltip>
            </IconButton>
        );
    }

    const columns = [
        { field: "expense_id", headerName: "Edit", renderCell: renderEditButton ,  width: 90, disableColumnMenu:true, headerClassName: appcls.data_grid_header}
        ,{ field: "", headerName: "Delete", renderCell: renderDeleteButton,  width: 95, disableColumnMenu:true, headerClassName: appcls.data_grid_header}
        ,{ field: 'expense_date', headerName: 'Expense Date', width: 160, valueGetter: gridDate, headerClassName: appcls.data_grid_header}
        ,{ field: 'expense_amt', headerName: 'Expense', width: 140, headerClassName: appcls.data_grid_header}
        ,{ field: 'expense_name', headerName: 'Exp Type', width: 150, headerClassName: appcls.data_grid_header}
        ,{ field: 'comments', headerName: 'Comments', width: 300, headerClassName: appcls.data_grid_header}
        ,{ field: 'created_by', headerName: 'Created By', width: 200, headerClassName: appcls.data_grid_header}
        ,{ field: 'created_on', headerName: 'Created On', width: 160, valueGetter: gridDateTime, headerClassName: appcls.data_grid_header}
        ,{ field: 'updated_by', headerName: 'Updated By', width: 200, headerClassName: appcls.data_grid_header}
        ,{ field: 'updated_on', headerName: 'Updated On', width: 160, valueGetter: gridDateTime, headerClassName: appcls.data_grid_header}
        ];

    const dialog_memo = useMemo(()=> <DialogComp show={openDia} onDialogClose={(ans)=> onDialogClose(ans)}/>, [openDia]);

    return (
        <div>
            <SnakbarComp />
            <Grid container direction="row" justifyContent="space-between" alignItems="center" className={appcls.title_row}>
                <Typography variant="h6"> Daily Expenses </Typography>
                <Button type="button" onClick={onAddNewClick} size="small" color="primary" startIcon={<AddIcon />}> Add New </Button>
            </Grid>

            <div style={{ height: 500, width: '100%' }}>
                <DataGrid rows={expense_list} columns={columns}   disableSelectionOnClick rowsPerPageOptions={[]} rowHeight={30} headerHeight={32}/>
            </div>

            <DailyExpenseEntry selected_expense={selected_expense} openExpenseModal={openExpenseModal} toggleExpenseModal={toggleExpenseModal} />
            {dialog_memo}
                     
        </div>
    )
};

export default DailyExpenses;
