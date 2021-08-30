import Cookies from 'js-cookie';

/*******************Example ************************* */

// Example POST method implementation:
async function postData(url = '', data = {}) {
    
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  
  // postData('https://example.com/answer', { answer: 42 })
  //   .then(data => {
  //     console.log(data); // JSON data parsed by `data.json()` call
  //   });


/********************************************* */


export const api_url = (url) => ("http://127.0.0.1:5000/"+url); 

export const post_request = (url, json_input = {}, in_req = false) =>{
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if(! in_req){
      const get_value = (prop) =>  Cookies.get(prop) ?  Cookies.get(prop) : '';
      json_input['log_in_code'] = get_value('log_in_code');
      json_input['user_id'] = get_value('user_id');
      json_input['user_name'] = get_value('user_name');
    }
   
    const api = api_url(url);

    const postRequest = new Request(api, {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            cache: 'default',
            credentials: 'same-origin',
            body:  JSON.stringify(json_input)
        });
    return postRequest;
}

export const call_rest_api = async (api, input={},  in_req = false) => {
    try{
      const req = post_request(api, input,in_req);
      const res = await fetch(req);
      const data = res.json();
      return data;
  }catch(err){
      let msg = 'Failed To call backend api [ '+api+' ]. Please check server !!!';
      console.error('Error :: ', msg);
      return {"status": "error", "message": msg, "statusCode":500};
  }
};

export const fetch_graphql_post = (url, query) => {
    const api = api_url(url);
    let response = {};

        fetch(api, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        query: query
                    })
                } ).then(res => res.json)
                .then(data=> {console.log('****data: ',data); response = data;})
                .catch(err => console.log(err));
    return response;

}


