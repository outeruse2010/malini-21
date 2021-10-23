import React, {useState, useEffect, useMemo} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {Button, IconButton, Tooltip, Typography, Grid}  from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import {login_atom} from '../login/login_api';
import {useRecoilState, useRecoilValue} from 'recoil';
import { dialog_atom } from '../utils/DialogComp';
import DialogComp from '../utils/DialogComp';
import { message_atom } from '../utils/SnakbarComp';
import SnakbarComp from '../utils/SnakbarComp';
import {gridDate, gridDateTime} from '../utils/app_utils';
import {sale_atom, act_sale_atom, fetch_daily_sales, delete_daily_sale} from './sale_expense_api';
import DailySaleEntry from './daily_sale_entry';
import { AppStyles } from '../utils/app_styles';


const DailySales = () => {
    const appcls = AppStyles();
    const login_data = useRecoilValue(login_atom);
    const user_name = login_data.user_name;

    const [openDia, setOpenDia] = useState(false);
    const [act_message, setAct_message] = useRecoilState(message_atom);
    const [dialog_message, setDialog_message] = useRecoilState(dialog_atom);
    const [act_sale_res, setAct_sale_res] = useRecoilState(act_sale_atom);
    const [sale_list, setSale_list] = useRecoilState(sale_atom);
    const [selected_sale, setSelected_sale] = useState(null);
    const [openSaleModal, setOpenSaleModal] = useState(false);



    useEffect(() => {
        const sale_res = fetch_daily_sales();            
        sale_res.then(data => {
            if(data['status'] === 'error'){
                setAct_message(sale_res);
            }else {
                setSale_list(data);
            }
        });
    }, []);

    
    const toggleSaleModal = () => {        
        setOpenSaleModal(!openSaleModal);
    };

    const onAddNewClick = () => {
        setSelected_sale(null);
        toggleSaleModal();
    }

    const onDeleteClick = (row) => {
        setSelected_sale(row);
        let title = 'Delete Sale ';
        let content = 'Are you sure to DELETE sale ?';
        setDialog_message({title, content});
        setOpenDia(true);
    };

    const onEditClick = (row) => {
        setSelected_sale(row);
        setOpenSaleModal(true);
    };

    const onDialogClose = (ans) => {
        if(ans === 'Y'){
            let sale_id = selected_sale['sale_id'];

            let input_json = {sale_id,  updated_by: user_name};

            const res = delete_daily_sale(input_json);
            res.then(data => {
                setAct_sale_res(data);
                if(data.status === 'success'){
                    const sale_res = fetch_daily_sales();
                    sale_res.then(sale_exps => setSale_list(sale_exps));
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
        { field: "sale_id", headerName: "Edit", renderCell: renderEditButton ,  width: 90, disableColumnMenu:true, headerClassName: appcls.data_grid_header}
        ,{ field: "", headerName: "Delete", renderCell: renderDeleteButton,  width: 95, disableColumnMenu:true, headerClassName: appcls.data_grid_header}
        ,{ field: 'sale_date', headerName: 'Sale Date', width: 160, valueGetter: gridDate, headerClassName: appcls.data_grid_header}
        ,{ field: 'cash_sale_amount', headerName: 'Cash Sale', width: 140, headerClassName: appcls.data_grid_header}       
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
                <Typography variant="h6"> Daily Sales </Typography>
                <Button type="button" onClick={onAddNewClick} size="small" color="primary" startIcon={<AddIcon />}> Add New </Button>
            </Grid>

            <div style={{ height: 500, width: '100%' }}>
                <DataGrid rows={sale_list} columns={columns}   disableSelectionOnClick rowsPerPageOptions={[]} rowHeight={30} headerHeight={32}/>
            </div>

            <DailySaleEntry selected_sale={selected_sale} openSaleModal={openSaleModal} toggleSaleModal={toggleSaleModal} />
            {dialog_memo}
                     
        </div>
    )
};

export default DailySales;
