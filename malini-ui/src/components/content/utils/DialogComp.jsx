import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import {atom, useRecoilState, useRecoilValue} from 'recoil';

export const dialog_atom = atom({key: 'dialog_atom', default: {} });

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const DialogComp = ({show,onDialogClose}) => {
  
  const res = useRecoilValue(dialog_atom);
  const [dialog_message, setDialog_message] = useRecoilState(dialog_atom);

  let title = '', content = '';
    if(res){
        title = res.title;
        content = res.content;
    }

    const handleClose = (ans = 'N') => {
        if(ans === 'N'){
            setDialog_message({});
        }
        onDialogClose(ans); 
      };


    return (
        <Dialog
            open={show}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
            
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description"> {content} </DialogContentText>
            </DialogContent>
            
            <DialogActions>
            <Button onClick={()=>handleClose('Y')} color="primary">Yes</Button>
            <Button onClick={handleClose}>No</Button>
            </DialogActions>
            
        </Dialog>
    )
}

export default DialogComp;
