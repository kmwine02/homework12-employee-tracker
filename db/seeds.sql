INSERT INTO departments (name)
VALUES ("Marketing"),
("Technology"),
("Finance"),
("Fundraising"),
("Service Delivery");

INSERT INTO roles (title, salary, department_id)
VALUES ("Media Advertising", 60000, 1),
("Software Engineer", 100000, 2),
("Product Owner", 110000, 2),
("UX Designer", 90000, 2),
("Market Analyst", 75000, 3),
("Investment Analyst", 104000, 3),
("PDG Rep", 93000, 4),
("Fundraiser", 107000, 4),
("Phone Rep", 56000, 5),
("Support Rep", 82000, 5);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("John", "Doe", 4),
("Steven", "Hendricks", 3),
("Julia", "Jacobs", 6),
("Michael", "Michaud", 10),
("Alex", "Lane", 2),
("Catherine", "Hamilton", 4),
("Jerid", "Hayden", 7),
("Jeremiah", "Reid", 5),
("Richard", "Walker", 2);