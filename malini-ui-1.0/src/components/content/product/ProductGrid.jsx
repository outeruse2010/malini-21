import React, {useState, useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {Button, IconButton, Tooltip, Typography, Box}  from '@mui/material';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ProductEntry from './ProductEntry';
import {product_list_atom,  fetch_product_list, delete_product,act_product_list_atom} from './product_api';

import {login_atom} from '../login/login_api';
import {useRecoilState, useRecoilValue} from 'recoil';
import { message_atom } from '../utils/SnakbarComp';
import SnakbarComp from '../utils/SnakbarComp';
import {gridDateTime} from '../utils/app_utils';
import { AppStyles } from './../utils/app_styles';

import DeleteDataComp from './../utils/DeleteDataComp';

const ProductGrid = () => {
    const classes = AppStyles();
    const login_data = useRecoilValue(login_atom);
    const user_name = login_data.user_name;
    const allow_update = (login_data.allow_update === 'Y');

    const [product_list, setProduct_list] = useRecoilState(product_list_atom);
    const [act_product_res, setAct_product_res] = useRecoilState(act_product_list_atom);
    
    const [act_message, setAct_message] = useRecoilState(message_atom);
    const [openProductModal, setOpenProductModal] = useState(false);
    const [selected_product, setSelected_product] = useState(null);

    const [openDelModal, setOpenDelModal] = useState(false);
    const [title, setTitle] = useState('');


    useEffect(() => {
            const product_res = fetch_product_list();            
            product_res.then(data => {
                if(data['status'] === 'error'){
                    setAct_message(product_res);
                }else {
                    setProduct_list(data);
                }
            });
        }, []);

    

    const toggleProductModal = () => {        
        setOpenProductModal(!openProductModal);
    };

    const onAddNewClick = () => {
        setSelected_product(null);
        toggleProductModal();
    }

    const onDeleteClick = (row) => {
        setSelected_product(row);
        let title = '  Product [' + row['product_name'] + '] ';
        setTitle(title);
        toggleDelModal();
    };

    const onEditClick = (row) => {
        setSelected_product(row);
        setOpenProductModal(true);
    };

    const toggleDelModal = () => {        
        setOpenDelModal(!openDelModal);
    };

    const onDelete = (comments) => {
        let product_id = selected_product['product_id'];
        let product_name = selected_product['product_name'];
        let input_json = {product_id, product_name, comments, updated_by: user_name};

            const res = delete_product(input_json);
            res.then(data => {
                setAct_product_res(data);
                if(data.status === 'success'){
                    const product_res = fetch_product_list();
                    product_res.then(products => setProduct_list(products));
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
        { field: 'product_name', headerName: 'Name', width: 180, headerClassName: classes.data_grid_header}
		,{ field: 'product_type', headerName: 'Type', width: 300, headerClassName: classes.data_grid_header}
		,{ field: 'quality', headerName: 'Quality', width: 300, headerClassName: classes.data_grid_header}
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
                <Typography variant="h6"> Products </Typography>
                {allow_update  && <Button type="button" onClick={onAddNewClick} size="small" color="primary" startIcon={<AddIcon />}> Add New Product</Button>}
            </Grid>

            <div style={{ height: 500, width: '100%' }}>
                <DataGrid rows={product_list} columns={columns}   disableSelectionOnClick rowsPerPageOptions={[]} rowHeight={30} headerHeight={32}/>
            </div>

            <ProductEntry selected_product={selected_product} openProductModal={openProductModal} toggleProductModal={toggleProductModal} />
           
           <DeleteDataComp title={title}  openDelModal ={openDelModal} toggleDelModal={toggleDelModal} onDelete={onDelete} />
                                   
        </div>
    );
}

export default ProductGrid;
