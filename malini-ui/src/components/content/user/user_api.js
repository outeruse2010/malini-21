import {atom} from 'recoil';
import { call_rest_api } from './../utils/api_utils';

export const user_atom = atom({key: "user_atom", default: []});
export const act_user_atom = atom({key: "act_user_atom", default: {} });

export const fetch_users = async (input = {}) => {
    return call_rest_api('fetch_users', input);
};

export const fetch_roles = async (input = {}) => {
    return call_rest_api('fetch_roles', input);
};
