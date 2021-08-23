import {atom} from 'recoil';
import {post_request} from '../utils/api_utils';

export const cus_due_atom = atom({key: "cus_due_atom", default: []});
export const act_cus_due_atom = atom({key: "act_cus_due_atom", default: {} });

export const fetch_customer_dues = async (input = {}) => {
    const req = post_request('fetch_customer_dues', input);
    const res = await fetch(req);
    const data = res.json();    
    return data;
};

export const add_update_cus_due = async (cus_due_json) => {
    const api = cus_due_json['cus_due_id'] ? 'update_customer_due' : 'add_customer_due';
    const req = post_request(api, cus_due_json);
    const res = await fetch(req);
    const data = res.json();   
    return data;
}

export const delete_cus_due = async (cus_due_json) => {
    const api = 'remove_customer_due';
    const req = post_request(api, cus_due_json);
    const res = await fetch(req);
    const data = res.json();   
    return data;
}