createdb -h localhost -p 5432 -U postgres malini_db
password: admin

create schema malini_schema;

--uuid-ossp module provides some handy functions that implement standard algorithms for generating UUIDs.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--drop TABLE malini_schema.user_list;

CREATE TABLE malini_schema.user_list(
   user_id uuid  DEFAULT uuid_generate_v4(),
   user_name text not null,
   user_pass text not null,
   created_on timestamp default now(),
   created_by text,
   updated_on timestamp,
   updated_by text,
   deleted char(1) default 'N',
   PRIMARY KEY(user_id),
   UNIQUE(user_name)
);

INSERT INTO malini_schema.user_list(user_name, user_pass, created_by) VALUES('Malini', 'malini',  'Auto');

--drop TABLE malini_schema.malini_roles;
CREATE TABLE malini_schema.malini_roles(
   role_name text not null,
   description text,
   created_on timestamp default now(),
   created_by text,
   updated_on timestamp,
   updated_by text,
   deleted char(1) default 'N',
   PRIMARY KEY(role_name)
);

delete from malini_schema.malini_roles;
INSERT INTO malini_schema.malini_roles (role_name, description,created_by) VALUES('view', 'user can only view','Auto');
INSERT INTO malini_schema.malini_roles (role_name, description,created_by) VALUES('update', 'user can update and view','Auto');


--drop TABLE malini_schema.user_role_map;
CREATE TABLE malini_schema.user_role_map(
   user_id uuid  not null,
   role_name text not null,
   comments text,
   created_on timestamp default now(),
   created_by text,
   updated_on timestamp,
   updated_by text,
   deleted char(1) default 'N',
   PRIMARY KEY(user_id,role_name)
);

INSERT INTO malini_schema.user_role_map (user_id, role_name, created_by)
VALUES((select user_id from malini_schema.user_list where user_name='Malini'), 'update', 'Auto');


--drop TABLE malini_schema.log_in_detail;
CREATE TABLE malini_schema.log_in_detail(
   user_id uuid  not null,
   log_in_time timestamp default now(),
   log_in_code uuid  DEFAULT uuid_generate_v4(),
   PRIMARY KEY(user_id)
);

--drop TABLE malini_schema.user_activity;
CREATE TABLE malini_schema.user_activity(
   user_id uuid,
   user_name text,
   activity_type text not null,
   activity_status text not null,
   activity_time timestamp default now(),
   host_name text,
   os_name text,
   comments text
);



--drop TABLE malini_schema.cus_area;

CREATE TABLE malini_schema.cus_area(
   area_id uuid  DEFAULT uuid_generate_v4(),
   area_name text not null,
   description text,
   created_on timestamp default now(),
   created_by text,
   updated_on timestamp,
   updated_by text,
   deleted char(1) default 'N',
   PRIMARY KEY(area_id),
   UNIQUE(area_name)
);


--drop TABLE malini_schema.customer;

CREATE TABLE malini_schema.customer(
   cus_id uuid  DEFAULT uuid_generate_v4(),
   cus_sr text not null,
   first_name text not null,
   mid_name text,
   last_name text not null,
   address text,
   area_id uuid,
   email text,
   phone text,
   comments text,
   created_on timestamp default now(),
   created_by text,
   updated_on timestamp,
   updated_by text,
   deleted char(1) default 'N',
   PRIMARY KEY(cus_id),
   UNIQUE(cus_sr, first_name, last_name)
);

--drop TABLE malini_schema.cus_due;

CREATE TABLE malini_schema.cus_due(
   cus_due_id uuid  DEFAULT uuid_generate_v4(),
   cus_id uuid not null,
   mkt_amount decimal DEFAULT 0,
   credit_amt decimal DEFAULT 0,
   mkt_pay_date date,
   area_id uuid,
   comments text,
   created_on timestamp default now(),
   created_by text,
   updated_on timestamp,
   updated_by text,
   deleted char(1) default 'N',
   PRIMARY KEY(cus_due_id)
);


--drop TABLE malini_schema.expense_type;

CREATE TABLE malini_schema.expense_type(
   expense_type_id uuid  DEFAULT uuid_generate_v4(),
   expense_name text,
   comments text,
   created_on timestamp default now(),
   created_by text,
   updated_on timestamp,
   updated_by text,
   deleted char(1) default 'N',
   PRIMARY KEY(expense_type_id)
);

--drop TABLE malini_schema.daily_sale_expense;

CREATE TABLE malini_schema.daily_sale_expense(
   sale_expense_id uuid  DEFAULT uuid_generate_v4(),
   expense_type_id uuid not null,
   cash_sale_amount decimal DEFAULT 0,
   expense_amt decimal DEFAULT 0,
   sale_expense_date date,
   comments text,
   created_on timestamp default now(),
   created_by text,
   updated_on timestamp,
   updated_by text,
   deleted char(1) default 'N',
   PRIMARY KEY(sale_expense_id)
);

