import React, {useState, useEffect} from 'react';
import { makeStyles } from '@mui/styles';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import ModalHeader from '../utils/ModalHeader';

import {TextField, Button}  from '@mui/material';

import {useRecoilState} from 'recoil';

import {supplier_list_atom, add_update_supplier, fetch_supplier_list,act_supplier_list_atom} from './supplier_api';
import SnakbarComp, {message_atom} from '../utils/SnakbarComp';

import {login_atom} from '../login/login_api';
import {useRecoilValue} from 'recoil';


const SupplierEntry = ({selected_supplier, openSupplierModal, toggleSupplierModal}) => {
    const classes = useStyles();
    const login_data = useRecoilValue(login_atom);
    const user_name = login_data.user_name;
    const action = selected_supplier ? 'Update' : 'Add New';
	
	    //Global State
    const [supplier_list, setSupplier_list] = useRecoilState(supplier_list_atom);
    const [act_supplier_res, setAct_supplier_res] = useRecoilState(act_supplier_list_atom);
    const [act_message, setAct_message] = useRecoilState(message_atom);

    //Component State
    const [supplier_name, setSupplier_name] = useState('');
    const [brand, setBrand] = useState('');
    const [payment_type, setPayment_type] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [contact_type, setContact_type] = useState('');
    const [contact_nos, setContact_nos] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp_no, setWhatsapp_no] = useState('');
    const [description, setDescription] = useState('');
    const [comments, setComments] = useState('');

    const [supplierNameErr, setSupplierNameErr] = useState(false);

    useEffect(()=> {
        onReset(); 
        if(selected_supplier){
            setSupplier_name(selected_supplier.supplier_name);
            setBrand(selected_supplier.brand);
            setPayment_type(selected_supplier.payment_type);
            setLocation(selected_supplier.location);
            setAddress(selected_supplier.address);
            setContact_type(selected_supplier.contact_type);
            setContact_nos(selected_supplier.contact_nos);
            setEmail(selected_supplier.email);
            setWhatsapp_no(selected_supplier.whatsapp_no);
            setDescription(selected_supplier.description);
            setComments(selected_supplier.comments);
        }
    }, [openSupplierModal]);
    

    const onReset = () => {
        setSupplier_name('');
        setBrand('');
        setPayment_type('');
        setLocation('');
        setAddress('');
        setContact_type('');
        setContact_nos('');
        setEmail('');
        setWhatsapp_no('');
        setDescription('');
        setComments('');
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if(!supplier_name){
            setSupplierNameErr(true);
            return;
        }
        
        let supplier_json = {supplier_name, brand, payment_type, location, 
            address, contact_type, contact_nos, email, whatsapp_no, description, comments};
        const do_update = (action === 'Update');
        if(do_update) {
            supplier_json = {supplier_name, brand, payment_type, location, address,
                 contact_type, contact_nos, email, whatsapp_no, description, comments, 
                 'updated_by': user_name, 'supplier_id': selected_supplier['supplier_id']};
        }else{
            supplier_json['created_by'] = user_name; 
        }

        const res = add_update_supplier(supplier_json);
        res.then(data => {
            // console.log('***add res: ',data);
            setAct_supplier_res(data);
            if(data.status === 'success'){
                const supplier_res = fetch_supplier_list();
                supplier_res.then(suppliers => setSupplier_list(suppliers));
                toggleSupplierModal();
            }            
            setAct_message(data);
        });
    }

    return (        
            <Modal open={openSupplierModal} onClose={toggleSupplierModal} 
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}  >
                <Fade in={openSupplierModal}>
                    <div className={classes.paper}>
                        <ModalHeader header={action + ' Supplier'} toggleModal={toggleSupplierModal}/>

                        <Stack  component="form"  onSubmit={onSubmit}  spacing={2}  noValidate  autoComplete="off"  >
                            <TextField value={supplier_name} onChange={e=>{setSupplier_name(e.target.value);setSupplierNameErr(false);}}  error={supplierNameErr} label="Name" fullWidth variant="outlined" required className={classes.field}  size="small"/>
                            
                            <TextField value={brand} onChange={e=>{setBrand(e.target.value);}}  label="Brand" fullWidth variant="outlined" className={classes.field}  size="small"/>
                            <TextField value={payment_type} onChange={e=>{setPayment_type(e.target.value);}}  label="Payment Type" fullWidth variant="outlined" className={classes.field}  size="small"/>
                            <TextField value={location} onChange={e=>{setLocation(e.target.value);}}  label="Location" fullWidth variant="outlined" className={classes.field}  size="small"/>
                            <TextField value={address} onChange={e=>{setAddress(e.target.value);}}  label="Address" fullWidth variant="outlined" className={classes.field}  size="small"/>
                            <TextField value={contact_type} onChange={e=>{setContact_type(e.target.value);}}  label="Contact Type" fullWidth variant="outlined" className={classes.field}  size="small"/>
                            <TextField value={contact_nos} onChange={e=>{setContact_nos(e.target.value);}} label="Contact Nos" fullWidth variant="outlined" className={classes.field}  size="small"/>
 
                            <TextField value={email} onChange={e=>{setEmail(e.target.value);}}  label="Email" fullWidth variant="outlined" className={classes.field}  size="small"/>
                            <TextField value={whatsapp_no} onChange={e=>{setWhatsapp_no(e.target.value);}} label="Whatsapp_no" fullWidth variant="outlined" className={classes.field}  size="small"/>
                            
                            <TextField value={description} onChange={e=>{setDescription(e.target.value);}} label="Description" multiline rows={3} fullWidth variant="outlined" className={classes.field} size="small"/>
                            <TextField value={comments} onChange={e=>{setComments(e.target.value);}} label="Comments" multiline rows={3} fullWidth variant="outlined" className={classes.field} size="small"/> 

                            <Stack direction='row' spacing={1}>
                                <Button type="submit" variant="contained" color="primary" size="small">{action}</Button>
                                {(action === 'Add New') && <Button type="reset" variant="contained" size="small" className={classes.btn}>Reset</Button>}
                                {(action === 'Update') && <Button onClick={toggleSupplierModal} variant="contained" size="small" className={classes.btn}>Cancel</Button>}
                            </Stack>
                        </Stack>
                        <SnakbarComp />
                    </div>
                </Fade>
            </Modal>
    )
}

export default SupplierEntry;

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      width: '70%',
    },
    field:{
        marginBottom: theme.spacing(2)
    },
    btn: {marginLeft: theme.spacing(1)}
  }));
