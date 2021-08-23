# ********************************
# * Project : due_detail
# * File :  cus_area_service.py
# * Created by Malancha at 28/7/2021
# ********************************

from graphene import ObjectType, List, Schema, String, DateTime

from src.module.customer.repository.cus_area_repository import *


class CusArea(ObjectType):
    area_id = String()
    area_name = String()
    description = String()
    created_on = DateTime()
    created_by = String()
    updated_on = DateTime()
    updated_by = String()
    deleted = String()


class CusAreaQuery(ObjectType):
    cusAreas = List(CusArea)

    def resolve_cusAreas(root, info):
        df = customer_areas()
        json = df.to_dict(orient='records')
        return json


def cus_area_schema():
    schema = Schema(query=CusAreaQuery, auto_camelcase=False)
    # print(f'******sch: {schema}')
    return schema

    # cusArea(areaId, areaName, description, updatedOn, updatedBy)
    # {areaId, areaName, description, updatedOn, updatedBy}
    # test_query = '''
    # query test_query{
    # cusArea
    # {areaId, areaName, description, updatedOn, updatedBy}
    #   }
    # '''
    # result = schema.execute(test_query)
    # print(f'''result: {result}''')

# cus_area_schema()
