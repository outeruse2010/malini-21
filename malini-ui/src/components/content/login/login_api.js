import {atom} from 'recoil';
import {call_rest_api} from '../../content/utils/api_utils';

export const login_atom = atom({key: 'login_atom', default:{} });

export const do_login =  (input = {}) => {
   return call_rest_api('login', input);
};