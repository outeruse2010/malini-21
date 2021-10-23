import React, {useState, useEffect} from 'react';
import Snackbar from '@mui/material/Snackbar';
import {Alert, AlertTitle} from '@mui/material';
import {atom, useRecoilState, useRecoilValue} from 'recoil';

export const message_atom = atom({key: 'message_atom', default: {} });

const SnakbarComp = () => {
    const [open, setOpen] = useState(false);
    const res = useRecoilValue(message_atom);
    const [act_message, setAct_message] = useRecoilState(message_atom);
    let message = '', severity = null;
    if(res){
        message = res.message;
        severity = res.status;
    }

    useEffect(() => {
         const show = message ? true : false;
         setOpen(show);
    }, [message]);

    const handleClose = () => {
        setAct_message({});
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={10000} onClose={handleClose} anchorOrigin={{ vertical:'top', horizontal:'right' }}>
            <Alert onClose={handleClose} severity={severity}>
            <AlertTitle>{severity}</AlertTitle>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default SnakbarComp;
