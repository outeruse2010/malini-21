import React, {useState, useEffect} from 'react';
import { makeStyles } from '@mui/styles';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import ModalHeader from '../utils/ModalHeader';

import {TextField, Button}  from '@mui/material';

import {useRecoilState} from 'recoil';

import {product_list_atom, add_update_product, fetch_product_list,act_product_list_atom} from './product_api';
import SnakbarComp, {message_atom} from '../utils/SnakbarComp';

import {login_atom} from '../login/login_api';
import {useRecoilValue} from 'recoil';


const ProductEntry = ({selected_product, openProductModal, toggleProductModal}) => {
    const classes = useStyles();
    const login_data = useRecoilValue(login_atom);
    const user_name = login_data.user_name;
    const action = selected_product ? 'Update' : 'Add New';
	
	    //Global State
    const [product_list, setProduct_list] = useRecoilState(product_list_atom);
    const [act_product_res, setAct_product_res] = useRecoilState(act_product_list_atom);
    const [act_message, setAct_message] = useRecoilState(message_atom);

    //Component State
    const [product_name, setProduct_name] = useState('');
    const [product_type, setProduct_type] = useState('');
    const [quality, setQuality] = useState('');
    const [description, setDescription] = useState('');
    const [comments, setComments] = useState('');

    const [productNameErr, setProductNameErr] = useState(false);

    useEffect(()=> {
        onReset(); 
        if(selected_product){
            setProduct_name(selected_product.product_name);
            setProduct_type(selected_product.product_type);
            setQuality(selected_product.quality);
            setDescription(selected_product.description);
            setComments(selected_product.comments);
        }
    }, [openProductModal]);
    

    const onReset = () => {
        setProduct_name('');
        setProduct_type('');
        setQuality('');
        setDescription('');
        setComments('');
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if(!product_name){
            setProductNameErr(true);
            return;
        }
        
        let product_json = {product_name, product_type, quality, description};
        const do_update = (action === 'Update');
        if(do_update) {
            product_json = {product_name, product_type, quality, description, 
                 'updated_by': user_name, 'product_id': selected_product['product_id']};
        }else{
            product_json['created_by'] = user_name; 
        }

        const res = add_update_product(product_json);
        res.then(data => {
            // console.log('***add res: ',data);
            setAct_product_res(data);
            if(data.status === 'success'){
                const product_res = fetch_product_list();
                product_res.then(products => setProduct_list(products));
                toggleProductModal();
            }            
            setAct_message(data);
        });
    }

    return (        
            <Modal open={openProductModal} onClose={toggleProductModal} 
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}  >
                <Fade in={openProductModal}>
                    <div className={classes.paper}>
                        <ModalHeader header={action + ' Supplier'} toggleModal={toggleProductModal}/>

                        <Stack  component="form"  onSubmit={onSubmit}  spacing={2}  noValidate  autoComplete="off"  >
                            <TextField value={product_name} onChange={e=>{setProduct_name(e.target.value);setProductNameErr(false);}}  error={productNameErr} label="Name" fullWidth variant="outlined" required className={classes.field}  size="small"/>
                            
                            <TextField value={product_type} onChange={e=>{setProduct_type(e.target.value);}}  label="Product Type" fullWidth variant="outlined" className={classes.field}  size="small"/>
                            <TextField value={quality} onChange={e=>{setQuality(e.target.value);}}  label="Quality" fullWidth variant="outlined" className={classes.field}  size="small"/>
                            
                            <TextField value={description} onChange={e=>{setDescription(e.target.value);}} label="Description" multiline rows={3} fullWidth variant="outlined" className={classes.field} size="small"/>
                            
                            <Stack direction='row' spacing={1}>
                                <Button type="submit" variant="contained" color="primary" size="small">{action}</Button>
                                {(action === 'Add New') && <Button type="reset" variant="contained" size="small" className={classes.btn}>Reset</Button>}
                                {(action === 'Update') && <Button onClick={toggleProductModal} variant="contained" size="small" className={classes.btn}>Cancel</Button>}
                            </Stack>
                        </Stack>
                        <SnakbarComp />
                    </div>
                </Fade>
            </Modal>
    )
}

export default ProductEntry;

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
