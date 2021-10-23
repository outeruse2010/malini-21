import React, {useState, useEffect} from 'react';
import { makeStyles } from '@mui/styles';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Fade from '@mui/material/Fade';
import AddIcon from '@mui/icons-material/Add';

import {TextField, Button}  from '@mui/material';

import {useRecoilState} from 'recoil';

import {cus_area_atom, fetch_customer_areas,customer_atom,act_customer_atom, add_update_customer, fetch_customers} from './customer_api';
import SnakbarComp, {message_atom} from '../utils/SnakbarComp';

import {login_atom} from '../login/login_api';
import {useRecoilValue} from 'recoil';
import AutoCompleteComp from '../utils/AutoCompleteComp';
import Grid from '@mui/material/Grid';
import CustomerAreaEntry from './CustomerAreaEntry';
import ModalHeader from '../utils/ModalHeader';
import moment from 'moment';



const CustomerEntry = ({selected_customer, openCustomerModal, toggleCustomerModal}) => {
    const classes = useStyles();
    const [cus_area_list, setCus_area_list] = useRecoilState(cus_area_atom);
    const login_data = useRecoilValue(login_atom);
    const user_name = login_data.user_name;
    let cus_areas = useRecoilValue(cus_area_atom);
    

    const action = selected_customer ? 'Update' : 'Add New';
    const [cus_id, setCus_id] = useState('');
    const [cus_sr, setCus_sr] = useState('');
    const [first_name, setFirst_name] = useState('');
    const [mid_name, setMid_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [address, setAddress] = useState('');
    const [area_id, setArea_id] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [comments, setComments] = useState('');
    const [mkt_amount, setMkt_amount] = useState('');
    const [mkt_pay_date, setMkt_pay_date] = useState(null);

    const [openAreaModal, setOpenAreaModal] = useState(false);

    const [cus_srErr, setCus_srErr] = useState(null);
    const [first_nameErr, setFirst_nameErr] = useState(false);
    const [addressErr, setAddressErr] = useState(false);
    const [area_idErr, setArea_idErr] = useState(false);
    const [mktPayDateErr, setMktPayDateErr] = useState(false); 

    const [customer_list, setCustomer_list] = useRecoilState(customer_atom);
    const [act_customer_res, setAct_customer_res] = useRecoilState(act_customer_atom);
    const [act_message, setAct_message] = useRecoilState(message_atom);

    useEffect(()=>{
        if(cus_areas.length == 0){
            const cus_area_res = fetch_customer_areas();
            cus_area_res.then(cus_areas => setCus_area_list(cus_areas));
        }}, []);

    useEffect(()=> {
        const empty_value = (v) => v || '';
        onReset(); 
        if(selected_customer){
            setCus_id(selected_customer.cus_id);
            setCus_sr(selected_customer.cus_sr);
            setFirst_name(selected_customer.first_name);
            setMid_name(empty_value(selected_customer.mid_name));
            setLast_name(empty_value(selected_customer.last_name));
            setAddress(selected_customer.address);
            setArea_id(selected_customer.area_id);
            setEmail(empty_value(selected_customer.email));
            setPhone(empty_value(selected_customer.phone));
            setComments(empty_value(selected_customer.comments));
            setMkt_amount(selected_customer.mkt_amount || 0);
            let dt = selected_customer['mkt_pay_date'];
            if(dt){
                let val = moment(dt).format('YYYY-MM-DD');
                setMkt_pay_date(val);
            }
        }
    }, [openCustomerModal]);
 
    const onReset = () => {
        setCus_sr('');
        setFirst_name('');
        setMid_name('');
        setLast_name('');
        setAddress('');
        setArea_id('');
        setEmail('');
        setPhone('');
        setComments('');
        setMkt_amount('');
        setMkt_pay_date(null);
        setMktPayDateErr(false);
    }

    const onAreaChange = (selected_area_id) => {
        setArea_id(selected_area_id);
        setArea_idErr(false);
    };

    const toggleAreaModal = () => {        
        setOpenAreaModal(!openAreaModal);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        let do_update = (action === 'Update');
        
        if(!cus_sr){ 
            setCus_srErr(true); return; 
        }else if(cus_sr && !do_update){
            let filtered_rows = customer_list.filter((r)=> (r['cus_sr'] === cus_sr));
            if(filtered_rows && filtered_rows.length>0){
                setCus_srErr('Serial No. ['+cus_sr+']  already exists.');
                 return; 
            }
        }
        
        if(!first_name){ setFirst_nameErr(true); return; }
        if(!address){ setAddressErr(true); return; }
        if(!area_id){ setArea_idErr(true); return; }
        if(!do_update && !mkt_pay_date){  setMktPayDateErr(true); return; }
        
        let customer_json = { 'cus_sr':cus_sr, 'first_name':first_name, 'mid_name':mid_name, 'last_name':last_name, 
                            'address':address , 'area_id':area_id , 'email':email, 'phone':phone , 'mkt_pay_date':mkt_pay_date,
                            'comments':comments ,'mkt_amount': mkt_amount || 0, 'cus_id':cus_id };
        
        
        if(do_update){
            customer_json['updated_by'] = user_name;
        }else{
            customer_json['created_by'] = user_name;
        }
        
        const res = add_update_customer(customer_json);
        res.then(data => {
            setAct_customer_res(data);
            if(data.status === 'success'){
                const customer_res = fetch_customers();
                customer_res.then(customers => setCustomer_list(customers));
                toggleCustomerModal();
            }            
            setAct_message(data);
        });
    }

    return (        
            <Modal open={openCustomerModal} onClose={toggleCustomerModal} 
                className={classes.modal} >
                <Fade in={openCustomerModal}>
                    <div className={classes.paper}>
                        <ModalHeader header={action + ' Customer'} toggleModal={toggleCustomerModal}/>

                        <Stack  component="form"  onSubmit={onSubmit}  spacing={2}  noValidate  autoComplete="off" width={500}>                        
                            <TextField value={cus_sr} onChange={e=>{setCus_sr(e.target.value);setCus_srErr(null);}} error={(cus_srErr)} helperText={cus_srErr} label="Serial No." fullWidth variant="outlined" required className={classes.field} size="small"/>
                            <TextField value={first_name} onChange={e=>{setFirst_name(e.target.value);setFirst_nameErr(false);}} error={first_nameErr} label="First Name" fullWidth variant="outlined" required className={classes.field} size="small"/>
                            <TextField value={mid_name} onChange={e=>setMid_name(e.target.value)} label="Middle Name" fullWidth variant="outlined" className={classes.field} size="small"/>
                            <TextField value={last_name} onChange={e=>setLast_name(e.target.value)} label="Last Name" fullWidth variant="outlined" className={classes.field} size="small"/>
                            <TextField value={address} onChange={e=>{setAddress(e.target.value);setAddressErr(false);}} error={addressErr} label="Address" fullWidth variant="outlined" required className={classes.field} size="small"/>
                            <Grid container spacing={1}>
                                <Grid item xs={9}>
                                    <AutoCompleteComp label='Area Name' value_list={cus_areas} label_field={'area_name'} value_field={'area_id'} value={area_id} onComboValueChange = {onAreaChange} required={true} error={area_idErr}/>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button onClick={toggleAreaModal} color="primary" size='small' className={classes.area_btn} startIcon={<AddIcon />}>Add New Area</Button>
                                </Grid>
                            </Grid>
                            <TextField value={phone} onChange={e=>setPhone(e.target.value)} label="Phone" fullWidth variant="outlined" className={classes.field} size="small"/>
                            <TextField type='email' value={email} onChange={e=>setEmail(e.target.value)} label="Email" fullWidth variant="outlined" className={classes.field} size="small"/>
                            
                            {(action==='Add New') &&
                            <>
                            <TextField type='number' value={mkt_amount} onChange={e=>setMkt_amount(e.target.value)} label="Due Amount" fullWidth variant="outlined" className={classes.field} size="small"/>
                             <TextField type="date"  value={mkt_pay_date} onChange={(e) =>{ setMkt_pay_date(e.target.value); setMktPayDateErr(false);} } required 
                           label="Marketing/Payment Date (dd/mm/yyyy)" variant="outlined" className={classes.field} fullWidth  InputLabelProps={{ shrink: true, }} size="small"  error={mktPayDateErr}/>
                                </>
                                }

                            <TextField value={comments} onChange={e=>setComments(e.target.value)} label="Comments" fullWidth variant="outlined" className={classes.field} multiline rows={2} size="small"/>
                          
                             <Stack direction='row' spacing={1}>
                                    <Button type="submit" variant="contained" color="primary" size="small">{action}</Button>
                                    {(action === 'Add New') && <Button type="reset" variant="contained" size="small" className={classes.btn}>Reset</Button>}
                                    {(action === 'Update') && <Button onClick={toggleCustomerModal} variant="contained" size="small" className={classes.btn}>Cancel</Button>}
                            </Stack>
                        </Stack>
                        <CustomerAreaEntry openAreaModal={openAreaModal} toggleAreaModal={toggleAreaModal} />
                        <SnakbarComp />
                    </div>
                </Fade>
            </Modal>
    )
}

export default CustomerEntry;

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


