# ********************************
# * Project : malini-py
# * File :  products_repository.py
# * Created by Malancha at 23/10/2021
# ********************************

import traceback

import pandas as pd

from src.config.db_config import db_engine
from src.config.log_config import log
from src.constants.app_const import *

def product_list(input={}):
    log.info('find product_list....')
    engine = db_engine()
    sql = f''' SELECT cast(product_id as varchar) id, cast(product_id as varchar) product_id, product_name, 
                product_type, quality, description, comments, created_on, created_by, updated_on, updated_by, deleted
                FROM {DB_SCHEMA}.products where deleted = 'N' 
                order by product_type, product_name '''
    df = pd.read_sql(con=engine, sql=sql)
    log.info(f'product_list no of rows selected : {df.shape[0]}')
    rs_json = df.to_json(orient="records")
    return rs_json

def add_product(input_json):
    log.info(f'add_product....{input_json}')
    product_name = input_json['product_name']
    msg = f'''Product [{product_name}] added !!! '''
    msg_json = {}
    try:
        df = pd.DataFrame([input_json])
        engine = db_engine()
        df.to_sql('products', con=engine, schema=DB_SCHEMA, if_exists='append', index=False)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to add product [{product_name}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json


def update_product(input_json):
    product_id = input_json['product_id']
    product_name = input_json['product_name']
    log.info(f'update_product for product_id: {product_id}')
    sql = f''' UPDATE {DB_SCHEMA}.products set product_name = '{product_name}', 
                product_type= '{input_json['product_type']}', quality= '{input_json['quality']}', 
               description = '{input_json['description']}',comments= '{input_json['comments']}',
                updated_by = '{input_json['updated_by']}', updated_on = now() 
                where product_id = '{product_id}' '''
    msg = f'''products detail for product_name [{product_name}] updated !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to updated products [{product_name}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json


def delete_product(input_json):
    product_id = input_json['product_id']
    product_name = input_json['product_name']
    log.info(f'delete_product for product_id: {product_id}')
    sql = f''' UPDATE {DB_SCHEMA}.products set deleted= 'Y', comments= '{input_json['comments']}',
     updated_by = '{input_json['updated_by']}', updated_on = now() 
     where product_id = '{product_id}' '''
    msg = f'''products detail for product_name [{product_name}] deleted !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to delete product [{product_name}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json
