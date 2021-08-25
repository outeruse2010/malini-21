import React, {useState, useEffect, useMemo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ModalHeader from '../utils/ModalHeader';

import { DataGrid } from '@material-ui/data-grid';
import {Button, IconButton, Tooltip, Typography, Box, Grid}  from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { dialog_atom } from '../utils/DialogComp';
import DialogComp from '../utils/DialogComp';
import { message_atom } from '../utils/SnakbarComp';
import SnakbarComp from '../utils/SnakbarComp';
import {gridDate, gridDateTime} from '../utils/app_utils';
import { AppStyles } from '../utils/app_styles';

import {login_atom} from '../login/login_api';
import {useRecoilState, useRecoilValue} from 'recoil';
import { fetch_users, user_atom } from './user_api';

const UserDetail = ({openUserDetailModal, toggleUserDetailModal}) => {

    const classes = useStyles();
    const appcls = AppStyles();

    const login_data = useRecoilValue(login_atom);
    const user_name = login_data.user_name;
    const allow_update = (login_data.allow_update === 'Y');

    const [user_list, setUser_list] = useRecoilState(user_atom);

    const [openDia, setOpenDia] = useState(false);
    const [selected_user_row, setSeleted_user_row] = useState(null);

    
    const [openEditUserModal, setOpenEditUserModal] = useState(false);

    useEffect(() => {
        const user_res = fetch_users();
        user_res.then(data => setUser_list(data));
    }, [openUserDetailModal]);


   

    const onAddNewClick = () => {
        setSeleted_user_row(null);
        setOpenEditUserModal(true);
    };

    const onEditClick = (row) => {
        setSeleted_user_row(row);
        setOpenEditUserModal(true);
    };

    const toggleEditUserModal = () => {
        setOpenEditUserModal(!openEditUserModal);
    };

    const onDeleteClick = (row) => {
        setSeleted_user_row(row);
        let title = 'Delete User Detail Row';
        let content = 'Are you sure to DELETE user [' + row['user_name'] + ']  ?';
        setDialog_message({title, content});
        setOpenDia(true);
    };

    const onDialogClose = (ans) => {
        if(ans === 'Y'){
            let user_id = selected_user_row['user_id'];
            let user_json = {user_id,  'updated_by': user_name};
            // const res = delete_cus_due(due_json);
            // res.then(data => {
            //     setAct_cus_due_atom_res(data);
            //     if(data.status === 'success'){
            //         const cus_due_res = fetch_customer_dues({cus_id});
            //         cus_due_res.then(cus_dues => setDue_list(cus_dues));
            //         getCustomerDetails();
            //     }            
            //     setAct_message(data);
            // });
        }
        setOpenDia(false);
    };


    const columns = [
        { field: 'user_name', headerName: 'User Name', width: 250 , headerClassName: appcls.data_grid_header}
        ,{ field: 'role_name', headerName: 'Role', width: 200 , headerClassName: appcls.data_grid_header}
        ,{ field: 'created_by', headerName: 'Created By', width: 200 , headerClassName: appcls.data_grid_header}
        ,{ field: 'created_on', headerName: 'Created On', width: 160, valueGetter: gridDateTime , headerClassName: appcls.data_grid_header}
        ,{ field: 'updated_by', headerName: 'Updated By', width: 200 , headerClassName: appcls.data_grid_header}
        ,{ field: 'updated_on', headerName: 'Updated On', width: 160, valueGetter: gridDateTime , headerClassName: appcls.data_grid_header}
        ];

    if(allow_update){
        columns.splice(0,0, { field: "user_id", headerName: "Edit", renderCell: renderEditButton ,  width: 105, disableColumnMenu:true, headerClassName: appcls.data_grid_header});
        columns.splice(1,0, { field: "id", headerName: "Delete", renderCell: renderDeleteButton,  width: 120 , disableColumnMenu:true, headerClassName: appcls.data_grid_header});
    }
    
    const dialog_memo = useMemo(()=> <DialogComp show={openDia} onDialogClose={(ans)=> onDialogClose(ans)}/>, [openDia]);

    return (
        <Modal open={openUserDetailModal} onClose={toggleUserDetailModal} className={classes.modal}  BackdropComponent={Backdrop}>
            <Fade in={openUserDetailModal}>
                <div className={classes.paper}>
                    <ModalHeader header='User Details' toggleModal={toggleUserDetailModal}/>

                    <SnakbarComp />
                    
                    <Grid container direction="row" justifyContent="space-between" alignItems="center" className={appcls.title_row}>
                        <Typography variant="h6"> User List </Typography>
                        {allow_update  &&  <Button type="button" onClick={onAddNewClick} size="small" color="primary" startIcon={<AddIcon />}> Add New </Button>}
                    </Grid>
                    
                    <div style={{ height: 300, width: '100%' }}>
                        <DataGrid rows={user_list} columns={columns}   disableSelectionOnClick rowsPerPageOptions={[]} rowHeight={30} headerHeight={32}/>
                    </div>

                    {dialog_memo}

                   
                </div>
            </Fade>
        </Modal>
    );
}

export default UserDetail;


const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow:'scroll',
      marginTop: 10,
      marginBottom: 5
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      width:'80%'
    },
    field:{
        marginBottom: theme.spacing(2)
    },
    btn: {marginLeft: theme.spacing(1)},
    area_btn: {margin: theme.spacing(1)},
    box_txt:{height: '16px', fontSize: 13, color: '#4527a0', marginBottom: theme.spacing(1)}
    
  }));
