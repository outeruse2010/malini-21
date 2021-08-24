import {atom} from 'recoil';
import {call_rest_api} from '../utils/api_utils';

export const cus_area_atom = atom({key: "cus_area_atom", default: []});
export const act_cus_area_atom = atom({key: "act_cus_area_atom", default: {} });

export const fetch_customer_areas = (input = {}) => {
    return call_rest_api('fetch_customer_areas', input);
};

export const add_update_cus_area = (input) => {
    const api = input['area_id'] ? 'update_customer_area' : 'add_customer_area';
    return call_rest_api(api, input);
}

export const delete_cus_area = (input) => {
    const api = 'remove_customer_area';
    return call_rest_api(api, input);
}


/***************************************  CUSTOMER api  *****************************/

export const customer_atom = atom({key: "customer_atom", default: []});
export const act_customer_atom = atom({key: "act_customer_atom", default: {} });

export const fetch_customers =  (input = {}) => {
    const api = 'fetch_customers';
    return call_rest_api(api, input);
};

export const add_update_customer =  (input) => {
    const api = input['cus_id'] ? 'update_customer' : 'add_customer';
    return call_rest_api(api, input);
}

export const delete_customer = (input) => {
    const api = 'remove_customer';
    return call_rest_api(api, input);
}
