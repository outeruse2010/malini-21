# ********************************
# * Project : malini-py
# * File :  customer_repository.py
# * Created by Malancha at 28/7/2021
# ********************************

import pandas as pd
import traceback

from src.config.db_config import db_engine
from src.config.log_config import log
from src.constants.app_const import *


def customers():
    log.info('find customers....')
    engine = db_engine()
    sql = f''' SELECT cast(cus_id as varchar) id, cast(cus_id as varchar) cus_id, 
                cus_sr, first_name, mid_name, last_name,concat(first_name,' ', mid_name,' ', last_name) full_name ,address, 
                cast(area_id as varchar) area_id, email, phone, 
               comments, created_on, created_by, updated_on, updated_by, deleted
               FROM {DB_SCHEMA}.customer where deleted = 'N' '''
    df = pd.read_sql(con=engine, sql=sql)
    log.info(f'customers no of rows and columns selected : {df.shape}')
    return df

def fetch_customer_dues(input={}):
    log.info('fetch_customer_dues....')
    sql = f''' SELECT cast(c.cus_id as varchar) id, cast(c.cus_id as varchar) cus_id, 
            c.cus_sr, c.first_name, c.mid_name, c.last_name,concat(c.first_name,' ', c.mid_name,' ', c.last_name) full_name ,c.address, 
            cast(c.area_id as varchar) area_id, c.email, c.phone, 
            c.comments, c.created_on, c.created_by, c.updated_on, c.updated_by, c.deleted, 
            d.total_mkt_amount, d.total_credit_amt, d.total_due, a.area_name
            FROM {DB_SCHEMA}.cus_area a join {DB_SCHEMA}.customer c on  a.area_id = c.area_id 
            LEFT JOIN 
            (SELECT cus_id, sum(mkt_amount) total_mkt_amount, sum(credit_amt) total_credit_amt, (sum(mkt_amount) - sum(credit_amt)) total_due
            FROM {DB_SCHEMA}.cus_due where deleted = 'N' group by cus_id ) d
            ON c.cus_id = d.cus_id and c.deleted = 'N' '''
    engine = db_engine()
    df = pd.read_sql(con=engine, sql=sql)
    log.info(f'customers no of rows and columns selected : {df.shape}')
    rs_json = df.to_json(orient="records")
    return rs_json


def add_customer(cus_json):
    log.info(f'add_customer....{cus_json}')
    cus_sr = cus_json['cus_sr']
    first_name = cus_json['first_name']
    msg = f'''Customer [{first_name}] with Serial [{cus_sr}] added !!! '''
    status = ERROR
    msg_json = {}
    try:
        mkt_amount = cus_json['mkt_amount']
        engine = db_engine()
        with engine.begin() as con:
            df = pd.DataFrame([cus_json])
            cus_df = df[['cus_sr', 'first_name', 'mid_name', 'last_name', 'address', 'area_id', 'email', 'phone', 'comments',
                 'created_by']]
            cus_df.to_sql('customer', con=con, schema=DB_SCHEMA, if_exists='append', index=False)
            log.info(f'''customer [#{cus_sr}, {first_name}] inserted !!!''')
            if float(mkt_amount) > 0:
                sql = f'''select cus_id from {DB_SCHEMA}.customer where cus_sr = '{cus_sr}' '''
                cus_id_df = pd.read_sql_query(sql=sql, con=con)
                due_df = df[['mkt_amount', 'area_id', 'comments', 'created_by']]
                due_df['cus_id'] = cus_id_df['cus_id']
                due_df.to_sql('cus_due', con=con, schema=DB_SCHEMA, if_exists='append', index=False)
                log.info(f'''customer [#{cus_sr}, {first_name}] due amount: [{mkt_amount}] inserted !!!''')
            status = SUCCESS
            log.info(f'''customer data insert committed !!!''')
    except Exception as ex:
        msg = f'''Failed to add customer [{first_name}] with Serial [{cus_sr}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json['status'] = status
    msg_json["message"] = msg
    return msg_json


def update_customer(customer_json):
    cus_id = customer_json['cus_id']
    cus_sr = customer_json['cus_sr']
    first_name = customer_json['first_name']
    log.info(f'update_customer for cus_id: {cus_id}')
    sql = f''' UPDATE {DB_SCHEMA}.customer set cus_sr = '{cus_sr}', first_name = '{first_name}', 
               mid_name = '{customer_json['mid_name']}',last_name = '{customer_json['last_name']}', 
               address = '{customer_json['address']}',area_id = '{customer_json['area_id']}', 
               email = '{customer_json['email']}',phone = '{customer_json['phone']}', 
               comments = '{customer_json['comments']}', updated_by = '{customer_json['updated_by']}',
               updated_on = now() where cus_id = '{cus_id}' '''
    msg = f'''Customer [{first_name}] with Serial [{cus_sr}] updated !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to update customer [{first_name}] with Serial [{cus_sr}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json



def delete_customer(customer_json):
    cus_id = customer_json['cus_id']
    cus_sr = customer_json['cus_sr']
    first_name = customer_json['first_name']
    log.info(f'delete_customer for cus_id: {cus_id}')
    sql = f''' UPDATE {DB_SCHEMA}.customer set deleted='Y', updated_by = '{customer_json['updated_by']}',
               updated_on = now() where cus_id = '{cus_id}' '''
    msg = f'''Customer [#{cus_sr}, {first_name}] deleted !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to delete customer [#{cus_sr}, {first_name}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json

# customer_json = {'cus_sr':'1','first_name':'John','last_name':'Hanks','address':'Kolkata','area_id':'ee336349-3b85-4712-942a-add0142a23e3'
#     ,'email':'abc@xyz.com','created_by':'Auto'}
# add_customer(customer_json)
# customers()
