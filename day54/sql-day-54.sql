CREATE TABLE "KHACH_HANG" (
  "MaKH" varchar(20) PRIMARY KEY,
  "TenKH" varchar(50) NOT NULL,
  "DiaChi" text,
  "SoDT" varchar(15),
  "created_at" timestamptz,
  "updated_at" timestamptz
);

CREATE TABLE "PHONG" (
  "MaPhong" varchar(20) PRIMARY KEY,
  "LoaiPhong" varchar(50) NOT NULL,
  "SoKhachToiDa" int NOT NULL,
  "GiaPhong" float NOT NULL,
  "MoTa" text,
  "created_at" timestamptz,
  "updated_at" timestamptz
);

CREATE TABLE "DAT_PHONG" (
  "MaDatPhong" varchar(20) PRIMARY KEY,
  "MaPhong" varchar(20),
  "MaKH" varchar(20),
  "NgayDat" date,
  "GioBatDau" timetz,
  "GioKetThuc" timetz,
  "TienDatCoc" float NOT NULL,
  "GhiChu" text,
  "TrangThaiDat" varchar(20),
  "created_at" timestamptz,
  "updated_at" timestamptz
);

CREATE TABLE "DICH_VU_DI_KEM" (
  "MaDV" varchar(20) PRIMARY KEY,
  "TenDV" varchar(50) NOT NULL,
  "DonViTinh" varchar(20),
  "DonGia" float NOT NULL,
  "created_at" timestamptz,
  "updated_at" timestamptz
);

CREATE TABLE "CHI_TIET_SU_DUNG_DV" (
  "MaDatPhong" varchar(20),
  "MaDV" varchar(20),
  "SoLuong" int,
  "created_at" timestamptz,
  "updated_at" timestamptz
  PRIMARY KEY ("MaDatPhong", "MaDV")
);

ALTER TABLE "DAT_PHONG" ADD FOREIGN KEY ("MaKH") REFERENCES "KHACH_HANG" ("MaKH");

ALTER TABLE "DAT_PHONG" ADD FOREIGN KEY ("MaPhong") REFERENCES "PHONG" ("MaPhong");

ALTER TABLE "CHI_TIET_SU_DUNG_DV"
ADD CONSTRAINT "FK_CHI_TIET_DAT_PHONG" FOREIGN KEY ("MaDatPhong") REFERENCES "DAT_PHONG" ("MaDatPhong");

ALTER TABLE "CHI_TIET_SU_DUNG_DV" ADD FOREIGN KEY ("MaDV") REFERENCES "DICH_VU_DI_KEM" ("MaDV");



INSERT INTO "PHONG"("MaPhong", "LoaiPhong", "SoKhachToiDa", "GiaPhong")
VALUES  ('P0001', 'loai 1', 20, 60000),
		('P0002', 'loai 2', 25, 80000),
		('P0003', 'loai 3', 15, 50000),
		('P0004', 'loai 4', 20, 50000)
;
		
INSERT INTO "KHACH_HANG"("MaKH", "TenKH", "DiaChi", "SoDT")
VALUES  ('KH0001', 'nguyen van a', 'hoa xuan', '1111111111'),
		('KH0002', 'nguyen van b', 'hoa hai', '1111111112'),
		('KH0003', 'nguyen van c', 'cam le', '11111111113'),
		('KH0004', 'nguyen van d', 'Hoa xuan', '1111111114')
;

INSERT INTO "DICH_VU_DI_KEM"("MaDV", "TenDV", "DonViTinh", "DonGia")
VALUES  ('DV001', 'beer', 'ion', 10000),
		('DV002', 'nuoc ngot', 'ion', 8000),
		('DV003', 'trai cay', 'dia', 35000),
		('DV004', 'khan uot', 'cai', 2000)		
;

INSERT INTO "DAT_PHONG"("MaDatPhong", "MaPhong", "MaKH", "NgayDat", "GioBatDau", "GioKetThuc", "TienDatCoc", "TrangThaiDat")
VALUES	('DP0001', 'P0001', 'KH0002', TO_DATE('26/03/2018','DD/MM/YYYY'), '11:00', '13:30', 100000 , 'da dat'),
		('DP0002', 'P0001', 'KH0003', TO_DATE('27/03/2018','DD/MM/YYYY'), '17:15', '19:15', 50000 , 'da huy'),
		('DP0003', 'P0002', 'KH0002', TO_DATE('26/03/2018','DD/MM/YYYY'), '20:30', '22:15', 100000 , 'da dat'),
		('DP0004', 'P0003', 'KH0001', TO_DATE('01/04/2018','DD/MM/YYYY'), '19:30', '21:15', 200000 , 'da dat')
;

INSERT INTO "CHI_TIET_SU_DUNG_DV"("MaDatPhong", "MaDV", "SoLuong")
VALUES ('DP0001', 'DV001', 20),
	   ('DP0001', 'DV003', 3),
	   ('DP0001', 'DV002', 10),
	   ('DP0002', 'DV002', 10),
	   ('DP0002', 'DV003', 1),
	   ('DP0003', 'DV003', 2),
	   ('DP0003', 'DV004', 10)
;

--Bai 1;
SELECT
    dp."MaDatPhong",
    dp."MaPhong",
    p."LoaiPhong",
    p."GiaPhong" AS GiaPhong,
    kh."TenKH",
    dp."NgayDat",
    p."GiaPhong" * EXTRACT(EPOCH FROM (dp."GioKetThuc" - dp."GioBatDau")) / 3600 AS TongTienHat, 
    COALESCE(SUM(dv."DonGia" * COALESCE(ct."SoLuong", 0)), 0) AS TongTienSuDungDichVu,
    p."GiaPhong" * EXTRACT(EPOCH FROM(dp."GioKetThuc" - dp."GioBatDau")) / 3600 + COALESCE(SUM(dv."DonGia" * COALESCE(ct."SoLuong", 0)), 0) AS TongTienThanhToan
FROM "DAT_PHONG" dp
JOIN "PHONG" p ON dp."MaPhong" = p."MaPhong"
JOIN "KHACH_HANG" kh ON dp."MaKH" = kh."MaKH"
LEFT JOIN "CHI_TIET_SU_DUNG_DICH_VU" ct ON dp."MaDatPhong" = ct."MaDatPhong"
LEFT JOIN "DICH_VU_DI_KEM" dv ON ct."MaDV" = dv."MaDV"
GROUP BY dp."MaDatPhong", dp."MaPhong", p."LoaiPhong", p."GiaPhong", kh."TenKH", dp."NgayDat";

--Bài 2;
SELECT 
    kh."MaKH", 
    kh."TenKH", 
    kh."DiaChi", 
    kh."SoDT"
FROM "KHACH_HANG" kh
JOIN "DAT_PHONG" dp ON kh."MaKH" = dp."MaKH"
WHERE kh."DiaChi" = 'Hoa Xuan';

--Bài 3;
SELECT 
    p."MaPhong", 
    p."LoaiPhong", 
    p."SoKhachToiDa", 
    p."GiaPhong" AS GiaPhong, 
    COUNT(dp."MaDatPhong") AS SoLanDat
FROM "PHONG" p
JOIN "DAT_PHONG" dp ON p."MaPhong" = dp."MaPhong"
WHERE dp."TrangThaiDat" = 'Da dat'
GROUP BY p."MaPhong", p."LoaiPhong", p."SoKhachToiDa", p."GiaPhong"
HAVING COUNT(dp."MaDatPhong") > 2;