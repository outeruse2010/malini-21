import React, {useState, useEffect} from 'react';
import { makeStyles } from '@mui/styles';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import ModalHeader from '../utils/ModalHeader';

import {TextField, Button}  from '@mui/material';

const DeleteDataComp = ({title, openDelModal, toggleDelModal, onDelete}) => {
    const classes = useStyles();
    
    const [comments, setComments] = useState('');
	const [commentsErr, setCommentsErr] = useState(false);


    const onSubmit = (e) => {
        e.preventDefault();
        if(!comments){
            setCommentsErr(true);
            return;
        }
        onDelete(comments);
    }

    return (        	
            <Modal open={openDelModal} onClose={toggleDelModal} 
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}  >
                <Fade in={openDelModal}>
                    <div className={classes.paper}>
                        <ModalHeader header={'Delete '+ title} toggleModal={toggleDelModal}/>

                        <Stack  component="form"  onSubmit={onSubmit}  spacing={2}  noValidate  autoComplete="off"  >
							<TextField value={comments} onChange={e=>{setComments(e.target.value);setCommentsErr(false);}} error={commentsErr} label="Reason to delete" multiline rows={3} fullWidth variant="outlined" className={classes.field} size="small"/> 
						
                            <Stack direction='row' spacing={1}>
                                <Button type="submit" variant="contained" color="error" size="small">Delete</Button>
                                <Button onClick={toggleDelModal} variant="contained" color="inherit" size="small" className={classes.btn}>Cancel</Button>
                            </Stack>
                        </Stack>
                    </div>
                </Fade>
            </Modal>
    )
}

export default DeleteDataComp;

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
      width: '40%'
    },

    btn: {marginLeft: theme.spacing(1)}
  }));
