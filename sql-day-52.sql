-- DAY 52 FULLSTACK K1
-- Thêm trường description trước trường detail với kiểu dữ liệu và ràng buộc sau: TEXT, NULL

-- Add the column without specifying its position
ALTER TABLE courses ADD COLUMN description TEXT;

-- Set the position of the new column after the 'price' column
ALTER TABLE courses ALTER COLUMN description SET POSITION AFTER price;

-- Đổi tên trường detail thành content và ràng buộc chuyển thành NOT NULL
ALTER TABLE courses RENAME COLUMN detail TO content;
ALTER TABLE courses ALTER COLUMN description SET NOT NULL;

-- Thêm 3 giảng viên vào bảng teacher, mỗi giảng viên thêm 3 khóa học
INSERT INTO teacher(name, bio, created_at, updated_at)
VALUES ('Teacher 1', 'Bio Teacher 1', NOW(), NOW());

INSERT INTO teacher(name, bio, created_at, updated_at)
VALUES ('Teacher 2', 'Bio Teacher 2', NOW(), NOW());

INSERT INTO teacher(name, bio, created_at, updated_at)
VALUES ('Teacher 3', 'Bio Teacher 3', NOW(), NOW());

INSERT INTO courses(name, price, description, content, teacher_id, active, created_at, updated_at)
VALUES ('Course 1', 10000, 'This is description of course 1', 'This is content of course 1', 1, 0, NOW(), NOW());

INSERT INTO courses(name, price, description, content, teacher_id, active, created_at, updated_at)
VALUES ('Course 2', 20000, 'This is description of course 2', 'This is content of course 2', 1, 1, NOW(), NOW());

INSERT INTO courses(name, price, description, content, teacher_id, active, created_at, updated_at)
VALUES ('Course 3', 30000, 'This is description of course 3', 'This is content of course 3', 1, 0, NOW(), NOW());

INSERT INTO courses(name, price, description, content, teacher_id, active, created_at, updated_at)
VALUES ('Course 4', 40000, 'This is description of course 4', 'This is content of course 4', 2, 1, NOW(), NOW());

INSERT INTO courses(name, price, description, content, teacher_id, active, created_at, updated_at)
VALUES ('Course 5', 50000, 'This is description of course 5', 'This is content of course 5', 2, 0, NOW(), NOW());

INSERT INTO courses(name, price, description, content, teacher_id, active, created_at, updated_at)
VALUES ('Course 6', 60000, 'This is description of course 6', 'This is content of course 6', 2, 1, NOW(), NOW());

INSERT INTO courses(name, price, description, content, teacher_id, active, created_at, updated_at)
VALUES ('Course 7', 70000, 'This is description of course 7', 'This is content of course 7', 3, 1, NOW(), NOW());

INSERT INTO courses(name, price, description, content, teacher_id, active, created_at, updated_at)
VALUES ('Course 8', 80000, 'This is description of course 8', 'This is content of course 8', 3, 0, NOW(), NOW());

INSERT INTO courses(name, price, description, content, teacher_id, active, created_at, updated_at)
VALUES ('Course 9', 90000, 'This is description of course 9', 'This is content of course 9', 3, 1, NOW(), NOW());

-- Sửa tên và giá từng khóa học thành tên mới và giá mới (Tên khóa học, giá khóa học các khóa học không được giống nhau)
UPDATE courses SET name='Course 1 Update', price=10001, updated_at=NOW() WHERE id = 1;
UPDATE courses SET name='Course 2 Update', price=20001, updated_at=NOW() WHERE id = 2;
UPDATE courses SET name='Course 3 Update', price=30001, updated_at=NOW() WHERE id = 3;
UPDATE courses SET name='Course 4 Update', price=40001, updated_at=NOW() WHERE id = 4;
UPDATE courses SET name='Course 5 Update', price=50001, updated_at=NOW() WHERE id = 5;
UPDATE courses SET name='Course 6 Update', price=60001, updated_at=NOW() WHERE id = 6;
UPDATE courses SET name='Course 7 Update', price=70001, updated_at=NOW() WHERE id = 7;
UPDATE courses SET name='Course 8 Update', price=80001, updated_at=NOW() WHERE id = 8;
UPDATE courses SET name='Course 9 Update', price=90001, updated_at=NOW() WHERE id = 9;

-- Sửa lại bio của từng giảng viên (Bio từng giảng viên không được giống nhau)
UPDATE teacher SET bio='Bio Teacher 1 Update', updated_at=NOW() WHERE id = 1;
UPDATE teacher SET bio='Bio Teacher 2 Update', updated_at=NOW() WHERE id = 2;
UPDATE teacher SET bio='Bio Teacher 3 Update', updated_at=NOW() WHERE id = 3;

-- Hiển thị danh sách giảng viên, danh sách khóa học
SELECT * FROM teacher;
SELECT * FROM courses;

