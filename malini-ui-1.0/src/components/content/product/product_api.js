import {atom} from 'recoil';
import {call_rest_api} from '../utils/api_utils';

export const product_list_atom = atom({key: "product_list_atom", default: []});
export const act_product_list_atom = atom({key: "act_product_list_atom", default: {} });

export const fetch_product_list = (input = {}) => {
    return call_rest_api('fetch_product_list', input);
};

export const add_update_product = (input) => {
    const api = input['product_id'] ? 'update_existing_product' : 'add_new_product';
    return call_rest_api(api, input);
}

export const delete_product = (input) => {
    const api = 'remove_product';
    return call_rest_api(api, input);
}
