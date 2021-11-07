# ********************************
# * Project : malini-py
# * File :  product_buy_repository.py
# * Created by Malancha at 24/10/2021
# ********************************

import traceback

import pandas as pd

from src.config.db_config import db_engine
from src.config.log_config import log
from src.constants.app_const import *

def product_buy_list(input={}):
    log.info('find product_buy_list....')
    engine = db_engine()
    sql = f''' SELECT cast(pb.product_buy_id as varchar) id, cast(pb.product_buy_id as varchar) product_buy_id, 
                cast(pb.product_id as varchar) product_id, cast(pb.supplier_id as varchar) supplier_id, 
                pb.bill_no, pb.bill_amount, pb.bill_date, pb."comments", pb.created_on, pb.created_by, pb.updated_on, 
                pb.updated_by, pb.deleted, p.product_name, p.product_type, s.supplier_name
                FROM {DB_SCHEMA}.product_buy pb, {DB_SCHEMA}.products p, {DB_SCHEMA}.suppliers s 
				where pb.product_id = p.product_id and pb.supplier_id = s.supplier_id and pb.deleted = 'N' 
                order by pb.bill_date desc '''
    df = pd.read_sql(con=engine, sql=sql)
    log.info(f'product_buy_list no of rows selected : {df.shape[0]}')
    rs_json = df.to_json(orient="records")
    return rs_json

def add_product_buy(input_json):
    log.info(f'add_product_buy....{input_json}')
    msg = f'''product_buy added !!! '''
    msg_json = {}
    try:
        df = pd.DataFrame([input_json])
        engine = db_engine()
        with engine.begin() as con:
            df.to_sql('product_buy', con=con, schema=DB_SCHEMA, if_exists='append', index=False)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to add product_buy !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json


def update_product_buy(input_json):
    product_buy_id = input_json['product_buy_id']
    log.info(f'update_product_buy for product_buy_id: {product_buy_id}')
    sql = f''' UPDATE {DB_SCHEMA}.product_buy set product_id= '{input_json['product_id']}',
                supplier_id= '{input_json['supplier_id']}', bill_no= '{input_json['bill_no']}',
                bill_amount= '{input_json['bill_amount']}', bill_date= '{input_json['bill_date']}',
                comments= '{input_json['comments']}', bill_date= '{input_json['bill_date']}',
                updated_by = '{input_json['updated_by']}', updated_on = now() 
                where product_buy_id = '{product_buy_id}' '''
    msg = f'''product_buy detail for product_buy_id [{product_buy_id}] updated !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to update product_buy for product_buy_id [{product_buy_id}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json


def delete_product_buy(input_json):
    product_buy_id = input_json['product_buy_id']
    log.info(f'delete_product_buy for product_buy_id: {product_buy_id}')
    buy_sql = f''' UPDATE {DB_SCHEMA}.product_buy set deleted= 'Y', comments= '{input_json['comments']}',
     updated_by = '{input_json['updated_by']}', updated_on = now() 
     where product_buy_id = '{product_buy_id}' '''

    msg = f'''product_buy detail for product_buy_id [{product_buy_id}] deleted !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(buy_sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to delete for product_buy_id [{product_buy_id}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json
