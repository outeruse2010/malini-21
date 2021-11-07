# ********************************
# * Project : malini-py
# * File :  supplier_payment_repository.py
# * Created by Malancha at 30/10/2021
# ********************************

import traceback

import pandas as pd

from src.config.db_config import db_engine
from src.config.log_config import log
from src.constants.app_const import *



def supplier_payment_list(input={}):
    log.info('find supplier_payment_list....')
    engine = db_engine()
    sql = f''' SELECT cast(p.payment_id as varchar) id, cast(p.payment_id as varchar) payment_id, cast(p.supplier_id as varchar) supplier_id, 
               s.supplier_name,  p.bill_no, p.paid_amount, 
               p.payment_date, p.paid_by, p.payment_type, p."comments", 
               p.created_on, p.created_by, p.updated_on, p.updated_by, p.deleted
               FROM {DB_SCHEMA}.supplier_payment p, malini_schema.suppliers s 
               WHERE p.supplier_id = s.supplier_id ORDER BY p.payment_date desc'''

    df = pd.read_sql(con=engine, sql=sql)
    log.info(f'supplier_payment_list no of rows selected : {df.shape[0]}')
    rs_json = df.to_json(orient="records")
    return rs_json

def add_supplier_payment(input_json):
    log.info(f'add_supplier_payment....{input_json}')
    paid_amount = input_json['paid_amount']
    msg = f'''supplier_payment amount [{paid_amount}] added !!! '''
    msg_json = {}
    try:
        df = pd.DataFrame([input_json])
        engine = db_engine()
        df.to_sql('supplier_payments', con=engine, schema=DB_SCHEMA, if_exists='append', index=False)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to add supplier_payment amount [{paid_amount}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json


def update_supplier_payment(input_json):
    payment_id = input_json['payment_id']
    log.info(f'update_supplier_payment for payment_id: {payment_id}')
    sql = f''' UPDATE {DB_SCHEMA}.supplier_payments set supplier_id='{input_json['supplier_id']}', 
                bill_no='{input_json['bill_no']}', paid_amount='{input_json['paid_amount']}', 
                payment_date='{input_json['payment_date']}', paid_by='{input_json['paid_by']}', 
                payment_type='{input_json['payment_type']}', comments='{input_json['comments']}', 
                updated_by = '{input_json['updated_by']}', updated_on = now() 
                where payment_id = '{payment_id}' '''

    msg = f'''supplier_payments detail updated !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to updated supplier_payments detail !!! '''
        log.error(f'Exception in update_supplier_payment for payment_id: {payment_id}')
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json


def delete_supplier_payment(input_json):
    payment_id = input_json['payment_id']
    log.info(f'delete_supplier_payment for payment_id: {payment_id}')
    sql = f''' UPDATE {DB_SCHEMA}.supplier_payments set deleted= 'Y', comments= '{input_json['comments']}',
                updated_by = '{input_json['updated_by']}', updated_on = now() 
                where payment_id = '{payment_id}' '''
    msg = f'''supplier_payments detail deleted !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to delete supplier_payment !!! '''
        log.error(f'Exception in delete_supplier_payment for payment_id: {payment_id}')
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json
