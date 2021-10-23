import {atom} from 'recoil';
import { call_rest_api } from './../utils/api_utils';

export const user_atom = atom({key: "user_atom", default: []});
export const act_user_atom = atom({key: "act_user_atom", default: {} });

export const role_atom = atom({key: "role_atom", default: []});

export const fetch_users =  (input = {}) => {
    return call_rest_api('fetch_users', input);
};

export const fetch_roles =  (input = {}) => {
    return call_rest_api('fetch_roles', input);
};

export const add_update_user_detail =  (input = {}) => {
    const api = input['usr_id'] ? 'update_user': 'add_user';
    return call_rest_api(api, input);
};

