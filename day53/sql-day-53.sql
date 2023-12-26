-- Tạo database;
CREATE DATABASE "database_02_LuuAnhQuan"
    WITH
    OWNER = anhquan
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	

-- Tạo bảng customers	
CREATE TABLE public.customers
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    name character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(15),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT phone_unique UNIQUE (phone)
        INCLUDE(phone)
);

-- Tạo bảng products
CREATE TABLE public.products
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    "name " character varying(255) NOT NULL,
    code character varying(100) NOT NULL,
    price real NOT NULL,
    quantity integer NOT NULL DEFAULT 0,
    total real NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT code_product_unique UNIQUE (code)
        INCLUDE(code)
);

-- Tạo bảng orders
CREATE TABLE public.orders
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    customer_id integer,
    total_products integer,
    total_price real,
    status boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT orders_customer_id_foreign FOREIGN KEY (customer_id)
        REFERENCES public.customers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

-- Tạo bảng orders_detail
CREATE TABLE public.orders_detail
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    product_id integer,
    order_id integer,
    quantity integer NOT NULL,
    amount integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT order_detail_order_id_foreign FOREIGN KEY (order_id)
        REFERENCES public.orders (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT order_detail_product_id_foreign FOREIGN KEY (product_id)
        REFERENCES public.products (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS public.orders_detail
    OWNER to anhquan;


ALTER TABLE IF EXISTS public.orders
    OWNER to anhquan;

ALTER TABLE IF EXISTS public.products
    OWNER to anhquan;

ALTER TABLE IF EXISTS public.customers
    OWNER to anhquan;