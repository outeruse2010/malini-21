# ********************************
# * Project : malini-py
# * File :  suppliers_repository.py
# * Created by Malancha at 23/10/2021
# ********************************

import traceback

import pandas as pd

from src.config.db_config import db_engine
from src.config.log_config import log
from src.constants.app_const import *

def supplier_list(input={}):
    log.info('find supplier_list....')
    engine = db_engine()
    sql = f''' SELECT cast(supplier_id as varchar) id, cast(supplier_id as varchar) supplier_id, supplier_name, 
                brand, payment_type, location, address, contact_type, contact_nos, email, whatsapp_no, description, 
                comments, created_on, created_by, updated_on, updated_by, deleted
                FROM {DB_SCHEMA}.suppliers where deleted = 'N' 
                order by supplier_name '''
    df = pd.read_sql(con=engine, sql=sql)
    log.info(f'supplier_list no of rows selected : {df.shape[0]}')
    rs_json = df.to_json(orient="records")
    return rs_json

def add_supplier(input_json):
    log.info(f'add_supplier....{input_json}')
    supplier_name = input_json['supplier_name']
    msg = f'''supplier [{supplier_name}] added !!! '''
    msg_json = {}
    try:
        df = pd.DataFrame([input_json])
        engine = db_engine()
        df.to_sql('suppliers', con=engine, schema=DB_SCHEMA, if_exists='append', index=False)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to add supplier [{supplier_name}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json


def update_supplier(input_json):
    supplier_id = input_json['supplier_id']
    supplier_name = input_json['supplier_name']
    log.info(f'update_supplier for supplier_id: {supplier_id}')
    sql = f''' UPDATE {DB_SCHEMA}.suppliers set supplier_name = '{supplier_name}', 
                brand= '{input_json['brand']}', payment_type= '{input_json['payment_type']}', 
                location= '{input_json['location']}', address= '{input_json['address']}',
                contact_type= '{input_json['contact_type']}', contact_nos= '{input_json['contact_nos']}', 
                email= '{input_json['email']}', whatsapp_no= '{input_json['whatsapp_no']}',                
                description = '{input_json['description']}', comments= '{input_json['comments']}',
                updated_by = '{input_json['updated_by']}', updated_on = now() 
                where supplier_id = '{supplier_id}' '''
    msg = f'''suppliers detail for supplier_name [{supplier_name}] updated !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to updated suppliers [{supplier_name}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json


def delete_supplier(input_json):
    supplier_id = input_json['supplier_id']
    supplier_name = input_json['supplier_name']
    log.info(f'delete_supplier for supplier_id: {supplier_id}')
    sql = f''' UPDATE {DB_SCHEMA}.suppliers set deleted= 'Y', comments= '{input_json['comments']}',
                updated_by = '{input_json['updated_by']}', updated_on = now() 
                where supplier_id = '{supplier_id}' '''
    msg = f'''suppliers detail for supplier_name [{supplier_name}] deleted !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to delete supplier [{supplier_name}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json
