import React, {useState, useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {Button, IconButton, Tooltip, Typography, Box}  from '@mui/material';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SupplierEntry from './SupplierEntry';
import {supplier_list_atom,  fetch_supplier_list, delete_supplier,act_supplier_list_atom} from './supplier_api';

import {login_atom} from '../login/login_api';
import {useRecoilState, useRecoilValue} from 'recoil';
import { message_atom } from '../utils/SnakbarComp';
import SnakbarComp from '../utils/SnakbarComp';
import {gridDateTime} from '../utils/app_utils';
import { AppStyles } from './../utils/app_styles';

import DeleteDataComp from './../utils/DeleteDataComp';

const SupplierGrid = () => {
    const classes = AppStyles();
    const login_data = useRecoilValue(login_atom);
    const user_name = login_data.user_name;
    const allow_update = (login_data.allow_update === 'Y');

    const [openDia, setOpenDia] = useState(false);
    const [supplier_list, setSupplier_list] = useRecoilState(supplier_list_atom);
    const [act_supplier_res, setAct_supplier_res] = useRecoilState(act_supplier_list_atom);
    
    const [act_message, setAct_message] = useRecoilState(message_atom);
    const [openSupplierModal, setOpenSupplierModal] = useState(false);
    const [selected_supplier, setSelected_supplier] = useState(null);

    const [openDelModal, setOpenDelModal] = useState(false);
    const [title, setTitle] = useState('');


    useEffect(() => {
            const supplier_res = fetch_supplier_list();            
            supplier_res.then(data => {
                if(data['status'] === 'error'){
                    setAct_message(supplier_res);
                }else {
                    setSupplier_list(data);
                }
            });
        }, []);

    

    const toggleSupplierModal = () => {        
        setOpenSupplierModal(!openSupplierModal);
    };

    const onAddNewClick = () => {
        setSelected_supplier(null);
        toggleSupplierModal();
    }

    const onDeleteClick = (row) => {
        setSelected_supplier(row);
        let title = '  Supplier [' + row['supplier_name'] + '] ';
        setTitle(title);
        toggleDelModal();
    };

    const onEditClick = (row) => {
        setSelected_supplier(row);
        setOpenSupplierModal(true);
    };

    const toggleDelModal = () => {        
        setOpenDelModal(!openDelModal);
    };

    const onDelete = (comments) => {
        let supplier_id = selected_supplier['supplier_id'];
        let supplier_name = selected_supplier['supplier_name'];
        let input_json = {supplier_id, supplier_name, comments, updated_by: user_name};

            const res = delete_supplier(input_json);
            res.then(data => {
                setAct_supplier_res(data);
                if(data.status === 'success'){
                    const supplier_res = fetch_supplier_list();
                    supplier_res.then(suppliers => setSupplier_list(suppliers));
                }            
                setAct_message(data);
                toggleDelModal();
            });
    }
    

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
        { field: 'supplier_name', headerName: 'Name', width: 180, headerClassName: classes.data_grid_header}
		,{ field: 'brand', headerName: 'Brand', width: 300, headerClassName: classes.data_grid_header}
		,{ field: 'location', headerName: 'Location', width: 300, headerClassName: classes.data_grid_header}
		,{ field: 'address', headerName: 'Address', width: 300, headerClassName: classes.data_grid_header}
        ,{ field: 'contact_type', headerName: 'Contact Type', width: 300, headerClassName: classes.data_grid_header}
		,{ field: 'contact_nos', headerName: 'Contact Nos', width: 300, headerClassName: classes.data_grid_header}
		,{ field: 'whatsapp_no', headerName: 'Whatsapp No', width: 300, headerClassName: classes.data_grid_header}
		,{ field: 'description', headerName: 'Description', width: 300, headerClassName: classes.data_grid_header}
		,{ field: 'comments', headerName: 'Comments', width: 300, headerClassName: classes.data_grid_header}
		
        ,{ field: 'created_by', headerName: 'Created By', width: 200, headerClassName: classes.data_grid_header}
        ,{ field: 'created_on', headerName: 'Created On', width: 160, valueGetter: gridDateTime, headerClassName: classes.data_grid_header}
        ,{ field: 'updated_by', headerName: 'Updated By', width: 200, headerClassName: classes.data_grid_header}
        ,{ field: 'updated_on', headerName: 'Updated On', width: 160, valueGetter: gridDateTime, headerClassName: classes.data_grid_header}
        ];

        if(allow_update){
            columns.splice(0,0,{ field: "supplier_id", headerName: "Edit", renderCell: renderEditButton ,  width: 105, disableColumnMenu:true, headerClassName: classes.data_grid_header} );
            columns.splice(1,0,  { field: "id", headerName: "Delete", renderCell: renderDeleteButton,  width: 120,  disableColumnMenu:true, headerClassName: classes.data_grid_header});
        }


    return (
        <div>
            <SnakbarComp />

            <Grid container direction="row" justifyContent="space-between" alignItems="center" className={classes.title_row}>
                <Typography variant="h6"> Suppliers </Typography>
                {allow_update  && <Button type="button" onClick={onAddNewClick} size="small" color="primary" startIcon={<AddIcon />}> Add New Supplier</Button>}
            </Grid>

            <div style={{ height: 500, width: '100%' }}>
                <DataGrid rows={supplier_list} columns={columns}   disableSelectionOnClick rowsPerPageOptions={[]} rowHeight={30} headerHeight={32}/>
            </div>

            <SupplierEntry selected_supplier={selected_supplier} openSupplierModal={openSupplierModal} toggleSupplierModal={toggleSupplierModal} />
           
           <DeleteDataComp title={title}  openDelModal ={openDelModal} toggleDelModal={toggleDelModal} onDelete={onDelete} />
                                   
        </div>
    );
}

export default SupplierGrid;
