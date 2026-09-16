CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    age INT,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

output of DESCRIBE users; :

'id','int','NO','PRI',NULL,'auto_increment'
'name','varchar(100)','NO','',NULL,''
'email','varchar(255)','NO','UNI',NULL,''
'age','int','YES','',NULL,''
'active','tinyint(1)','NO','','1',''


##ERROR GIVEN WHEN MISSING VALUE:

ERROR 1364 (HY000): Field 'name' doesn't have a default value

Database constraints are preferable to checking only in the API because they guarantee data integrity regardless of which application, script, or user is attempting to write to the database.