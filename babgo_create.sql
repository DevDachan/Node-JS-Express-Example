use bapgo;
/*
DROP TABLE room;
CREATE TABLE room (
	room_id VARCHAR(20) primary KEY,
    room_name VARCHAR(20),
    people_limit INT,
    admin_id VARCHAR(20)
);

DROP TABLE user_room;
CREATE TABLE user_room(
	user_id varchar(20),
    room_id varchar(20),
    state varchar(20),
    primary key(user_id,room_id)
);

DROP TABLE time_table;
CREATE TABLE time_table (
	user_id VARCHAR(20),
    day VARCHAR(20),
    time VARCHAR(20),
    title VARCHAR(20),
    state VARCHAR(20),
    PRIMARY KEY(user_id,day,time)
);

DROP TABLE user;
CREATE TABLE user(
	id varchar(20) PRIMARY KEY,
    password varchar(20),
    name varchar(20)
);

DROP TABLE babgo;
CREATE TABLE babgo(
	room_id VARCHAR(20),
    day VARCHAR(20),
    time VARCHAR(20),
    PRIMARY KEY(room_id, day, time)    
);
DROP TABLE kick_list;
CREATE TABLE kick_list(
	room_id VARCHAR(20),
	user_id VARCHAR(20)
);
DROP TABLE day_list;
CREATE TABLE day_list(
	day VARCHAR(20),
    day_index int
);
INSERT INTO day_list VALUE("월", 1);
INSERT INTO day_list VALUE("화", 2);
INSERT INTO day_list VALUE("수", 3);
INSERT INTO day_list VALUE("목", 4);
INSERT INTO day_list VALUE("금", 5);
INSERT INTO day_list VALUE("토", 6);
INSERT INTO day_list VALUE("일", 7);

*/



select * from room;
select * from time_table;
select * from user;
select * from user_room;
select * from babgo;
select * from day_list;
/*

*/
