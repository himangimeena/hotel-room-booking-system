CREATE DATABASE hotel_booking;
USE hotel_booking;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SHOW TABLES;
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SHOW TABLES;
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    room_id INT,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status ENUM('booked','cancelled') DEFAULT 'booked',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);
INSERT INTO users (name,email,password,role)
VALUES (
    'Admin',
    'admin@gmail.com',
    'admin123',
    'admin'
);
INSERT INTO rooms (
    room_number,
    room_type,
    price,
    description
)
VALUES (
    '101',
    'Single',
    1500,
    'Single room with AC'
);
INSERT INTO rooms (
    room_number,
    room_type,
    price,
    description
)
VALUES (
    '102',
    'Double',
    2500,
    'Double room with AC'
);
SELECT * FROM users;

SELECT COUNT(*) FROM rooms;
INSERT INTO rooms (
    room_number,
    room_type,
    price,
    description
)
VALUES (
    '101',
    'Single',
    1500,
    'Single room with AC'
);
Select * from rooms;
INSERT INTO rooms (
    room_number,
    room_type,
    price,
    description
)
VALUES (
    '102',
    'Double',
    2500,
    'Double room with AC'
);
Select * from rooms;
Select * from users;
INSERT INTO users (name,email,password,role)
VALUES (
    'Admin',
    'admin@gmail.com',
    'admin123',
    'admin'
);
Select * from users;