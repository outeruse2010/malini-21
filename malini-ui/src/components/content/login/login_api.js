import {atom} from 'recoil';
import {post_request} from '../../content/utils/api_utils';

export const login_atom = atom({key: 'login_atom', default:{} });

export const do_login = async (input = {}) => {
    const req = post_request('login', input);
    const res = await fetch(req);
    const data = res.json();
    // console.log('****cookies: ',res.cookies());  
    return data;
};