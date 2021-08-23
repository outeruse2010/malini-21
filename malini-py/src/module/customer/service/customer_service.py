# ********************************
# * Project : due_detail
# * File :  customer_service.py
# * Created by Malancha at 29/7/2021
# ********************************

from graphene import ObjectType, List, Schema, String, DateTime

from src.module.customer.repository.customer_repository import *


class Customer(ObjectType):
    cus_id = String()
    cus_sr = String()
    first_name = String()
    mid_name = String()
    last_name = String()
    address = String()
    area_id = String()
    email = String()
    phone = String()
    comments = String()
    created_on = DateTime()
    created_by = String()
    updated_on = DateTime()
    updated_by = String()
    deleted = String()


class CustomerQuery(ObjectType):
    customers = List(Customer)

    def resolve_customers(root, info):
        df = customers()
        json = df.to_dict(orient='records')
        return json


def cus_area_schema():
    schema = Schema(query=CustomerQuery, auto_camelcase=False)
    # print(f'******sch: {schema}')
    return schema
