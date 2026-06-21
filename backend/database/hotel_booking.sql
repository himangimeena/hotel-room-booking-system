CREATE DATABASE hotel_booking;
USE hotel_booking;

-- Users table (customers and admins)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE
);
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status ENUM('booked', 'cancelled') DEFAULT 'booked',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);
INSERT INTO rooms (room_number, room_type, price, description) VALUES
('101', 'Single Room', 1500, 'Cozy single room with garden view'),
('102', 'Double Room', 2500, 'Spacious double room with city view'),
('103', 'Deluxe Suite', 4500, 'Luxurious suite with premium amenities'),
('104', 'Ocean View', 6000, 'Stunning ocean view room'),
('105', 'Presidential Suite', 12000, 'Our finest suite with panoramic views');
SELECT id, email FROM users;