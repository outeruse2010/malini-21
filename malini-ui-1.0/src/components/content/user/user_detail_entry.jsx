import React,{useState, useEffect} from 'react';

import { makeStyles } from '@mui/styles';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import {TextField, Button}  from '@mui/material';

import {login_atom} from '../login/login_api';
import {useRecoilValue, useRecoilState} from 'recoil';

import ModalHeader from '../utils/ModalHeader';
import SnakbarComp from '../utils/SnakbarComp';
import { message_atom } from '../utils/SnakbarComp';

import {user_atom, act_user_atom, fetch_users, fetch_roles, add_update_user_detail, role_atom} from './user_api';
import AutoCompleteComp from './../utils/AutoCompleteComp';

const UserDetailEntry = ({selected_user_row, openEditUserModal, toggleEditUserModal}) => {
    const classes = useStyles();

    const login_data = useRecoilValue(login_atom);
    const user_name = login_data.user_name;

    const [user_list, setUser_list] = useRecoilState(user_atom);
    const [role_list, setRole_list] = useRecoilState(role_atom);

    const [user_nm, setUser_nm] = useState('');
    const [user_pass, setUser_pass] = useState('');
    const [role_name, setRole_name] = useState('');

    const [userNmErr, setUserNmErr] = useState(false);
    const [userPassErr, setUserPassErr] = useState(false);
    const [roleNameErr, setRoleNameErr] = useState(false);

    const [act_user_atom_res, setAct_user_atom_res] = useRecoilState(act_user_atom);
    const [act_message, setAct_message] = useRecoilState(message_atom);

    const action = selected_user_row ? 'Update' : 'Add New';

    useEffect(()=>{
        onReset();
        if(role_list.length === 0){
            const role_res = fetch_roles();
            role_res.then(data => setRole_list(data));
        }
        if(selected_user_row){
            setUser_nm(selected_user_row['user_name']);
            setUser_pass(selected_user_row['user_pass']);
            setRole_name(selected_user_row['role_name']);
        }
    }, [openEditUserModal]);

    const onSubmit = (e) => {
        e.preventDefault();
        if(!user_nm){
            setUserNmErr(true);
            return;
        }
        if(!user_pass){
            setUserPassErr(true);
            return;
        }
        if(!role_name){
            setRoleNameErr(true);
            return;
        }
        const input = { 'user_nm': user_nm,'user_pass': user_pass, 'role_name': role_name};

        if(selected_user_row){
            input['usr_id']= selected_user_row['user_id'];
            input['updated_by'] = user_name;
        }else{
            input['created_by'] = user_name;
        }
        const res = add_update_user_detail(input);
        res.then(data => {
                setAct_user_atom_res(data);
                if(data.status === 'success'){
                    toggleEditUserModal(false);
                    const user_res = fetch_users();
                    user_res.then(users => setUser_list(users));
                }            
                setAct_message(data);
            });
        };


    const onReset = () => {
        setUser_nm('');
        setUser_pass('');
        setRole_name('');
    };

    const onRoleChange = (selected_role) => {
        setRoleNameErr(false);
        setRole_name(selected_role); 
    };

    const onUserNmChange = (e) =>{
            setUserNmErr(false);
            setUser_nm(e.target.value);
    };

    const onUserPassChange = (e) => {
        setUserPassErr(false);
        setUser_pass(e.target.value);
    }

    return (
        <Modal open={openEditUserModal} onClose={toggleEditUserModal}  size='small' className={classes.modal} >
            <Fade in={openEditUserModal}>
                <div className={classes.paper}>
                    <ModalHeader header={action + ' User Detail'} toggleModal={toggleEditUserModal}/>

                    <Stack  component="form"  onSubmit={onSubmit}  spacing={2}  noValidate  autoComplete="off"  >
                        
                        <TextField  value={user_nm} onChange={onUserNmChange} label="User Name" fullWidth variant="outlined" className={classes.field} size="small" required error={userNmErr} />
                        <TextField  type='password'  value={user_pass} onChange={onUserPassChange} label="Password" fullWidth variant="outlined" className={classes.field} size="small" required error={userPassErr} />
                        <AutoCompleteComp label='Role' value_list={role_list} label_field={'role_name'} value_field={'role_name'} value={role_name} onComboValueChange = {onRoleChange} required={true} error={roleNameErr}/>
                        <Stack direction='row' spacing={1}>
                                <Button type="submit" variant="contained" color="primary" size="small">{action}</Button>
                                {(action === 'Add New') && <Button type="reset" variant="contained" size="small" className={classes.btn}>Reset</Button>}
                                {(action === 'Update') && <Button onClick={toggleEditUserModal} variant="contained" size="small" className={classes.btn}>Cancel</Button>}
                        </Stack>

                    </Stack>
                    
                    <SnakbarComp />
                </div>
            </Fade>
        </Modal>
    )
}

export default UserDetailEntry;


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
    },
    field:{
        marginBottom: theme.spacing(2)
    },
    btn: {marginLeft: theme.spacing(1)},
    area_btn: {margin: theme.spacing(1)},
    
  }));

