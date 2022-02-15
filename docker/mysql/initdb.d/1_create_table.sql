CREATE DATABASE demo;
USE demo;

GRANT ALL ON `demo`.* TO 'demo'@'%';
FLUSH PRIVILEGES;

CREATE TABLE user (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    login_id VARCHAR(255) NOT NULL,
    password VARCHAR(2000) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(11) NOT NULL,
    is_withdrawal BIT(1) NOT NULL DEFAULT false,

    PRIMARY KEY (id)
);

CREATE TABLE mall (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    owner bigint(20) NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT mall_user FOREIGN KEY (owner) REFERENCES user(id)
);
