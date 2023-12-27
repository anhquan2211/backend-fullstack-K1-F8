-- Tạo database;
CREATE DATABASE "database_02_LuuAnhQuan"
    WITH
    OWNER = anhquan
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
-- Tạo bảng users quản lý người dùng.
CREATE TABLE public.users
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    name character varying(100) NOT NULL,
    phone character varying(15) NOT NULL,
    email character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT phone_email_unique UNIQUE (phone, email)
        INCLUDE(phone, email)
);

-- Tạo bảng orders chứa data tất cả đơn hàng của user
CREATE TABLE public.orders
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    user_id integer,
    status character varying NOT NULL,
	total_amount integer NOT NULL,
	total_price real NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT order_user_id FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

-- Tạo bảng customers để lưu thông tin của người dùng khi đã đặt hàng thành công, tránh trường hợp xoá user.
CREATE TABLE public.customers
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    order_id integer,
    name character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    phone character varying(15) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT customers_email_phone_unique UNIQUE (email, phone)
        INCLUDE(email, phone),
    CONSTRAINT customers_order_id_foreign FOREIGN KEY (order_id)
        REFERENCES public.orders (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

-- Tạo bảng products quản lý sản phẩm
CREATE TABLE public.products
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    name character varying(100) NOT NULL,
    code character varying(50) NOT NULL,
    price real NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Tạo bảng order_detail chứa chi tiết 1 đơn hàng của user
CREATE TABLE public.order_detail
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    order_id integer,
    product_id integer,
    name character varying(100) NOT NULL,
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

-- Tạo bảng product_order_detail chứa dữ liệu sản phẩm khi đặt hàng thành công tránh trường hợp xoá product hoặc thay đổi giá của 1 product.
CREATE TABLE public.product_order_detail
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    order_detail_id integer,
    name character varying(100) NOT NULL,
    code character varying(50) NOT NULL,
    price real NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT product_order_detail_order_detail_id_foreign FOREIGN KEY (order_detail_id)
        REFERENCES public.order_detail (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

-- Thêm data vào bảng users
INSERT INTO users(name, phone, email)
VALUES('user 1', '0978039745', 'user1@gmail.com');

INSERT INTO users(name, phone, email)
VALUES('user 2', '0978039746', 'user2@gmail.com');

INSERT INTO users(name, phone, email)
VALUES('user 3', '0978039747', 'user3@gmail.com');

-- Thêm data vào bảng products
INSERT INTO products(name, code, price)
VALUES('product 1', '0001', 10000);

INSERT INTO products(name, code, price)
VALUES('product 2', '0002', 20000);

INSERT INTO products(name, code, price)
VALUES('product 3', '0003', 30000);

INSERT INTO products(name, code, price)
VALUES('product 4', '0004', 40000);

INSERT INTO products(name, code, price)
VALUES('product 5', '0005', 50000);

INSERT INTO products(name, code, price)
VALUES('product 6', '0006', 60000);

INSERT INTO products(name, code, price)
VALUES('product 7', '0007', 70000);

INSERT INTO products(name, code, price)
VALUES('product 8', '0008', 80000);

-- Thêm data vào bảng orders
INSERT INTO orders(user_id, total_price, status)
VALUES(1, 30000 ,'Đã thanh toán');

INSERT INTO orders(user_id, total_price, status)
VALUES(2, 40000 ,'Đang giao hàng');

-- Thêm data vào bảng customers
INSERT INTO customers(order_id, name, email)
VALUES(1, 'user 1', 'user1@gmail.com');

-- Thêm data vào bảng order_detail
INSERT INTO order_detail(order_id, product_id, name, amount)
VALUES(1, 1, 'product 1', 6);

INSERT INTO order_detail(order_id, product_id, name, amount)
VALUES(1, 2, 'product 2', 7);

INSERT INTO order_detail(order_id, product_id, name, amount)
VALUES(1, 3, 'product 3', 10);

-- Thêm data vào bảng product_order_detail
INSERT INTO product_order_detail(order_detail_id, name, code, price)
VALUES(1, 'product 1', '0001', '10000');

INSERT INTO product_order_detail(order_detail_id, name, code, price)
VALUES(2, 'product 2', '0002', '20000');

INSERT INTO product_order_detail(order_detail_id, name, code, price)
VALUES(3, 'product 3', '0003', '30000');

-- Xem danh sách đơn hàng
SELECT 
    customers.name AS "Tên khách hàng",
    customers.email AS "Email khách hàng",
    customers.phone AS "Số điện thoại khách hàng",
    SUM(orders.total_amount) AS "Tổng số lượng sản phẩm",
    SUM(orders.total_price) AS "Tổng tiền đơn hàng",
    orders.status AS "Trạng thái đơn hàng",
    orders.created_at AS "Thời gian đặt hàng"
FROM orders
JOIN customers ON orders.id = customers.order_id
JOIN order_detail ON orders.id = order_detail.order_id
JOIN products ON order_detail.product_id = products.id
GROUP BY orders.id, customers.name, customers.email, customers.phone, orders.status, orders.created_at;

--
SELECT
    customers.name AS "Tên khách hàng",
    customers.email AS "Email khách hàng",
    customers.phone AS "Số điện thoại khách hàng",
    products.name AS "Tên sản phẩm",
    products.code AS "Mã sản phẩm",
    products.price AS "Giá",
    order_detail.amount AS "Số lượng",
    (products.price * order_detail.amount) AS "Tổng tiền",
    orders.status AS "Trạng thái đơn hàng",
    orders.created_at AS "Thời gian tạo đơn hàng",
    orders.updated_at AS "Thời gian cập nhật cuối cùng"
FROM
    public.orders 
JOIN
    public.customers ON orders.id = customers.order_id
JOIN
    public.order_detail ON orders.id = order_detail.order_id
JOIN
    public.products ON order_detail.product_id = products.id;


--
ALTER TABLE IF EXISTS public.product_order_detail
    OWNER to anhquan;

ALTER TABLE IF EXISTS public.order_detail
    OWNER to anhquan;

ALTER TABLE IF EXISTS public.products
    OWNER to anhquan;

ALTER TABLE IF EXISTS public.customers
    OWNER to anhquan;

ALTER TABLE IF EXISTS public.orders
    OWNER to anhquan;

ALTER TABLE IF EXISTS public.users
    OWNER to anhquan;
