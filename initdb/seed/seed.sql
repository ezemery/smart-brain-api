BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, joined) VALUES ('Emmanuel', 'ezechukwu1995@gmail.com',5,'2019-01-01'); 
INSERT INTO login (hash, email) VALUES ('$2a$10$0m86eR313lbuh6mtbKG4COpndBF4QzPal76SHxa6O8hqXiEbTATmG', 'ezechukwu1995@gmail.com');

COMMIT;