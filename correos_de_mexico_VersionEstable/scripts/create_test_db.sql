CREATE ROLE root WITH LOGIN PASSWORD 'admin123';
CREATE DATABASE "correos_de_mexicoTest" OWNER root;
GRANT ALL PRIVILEGES ON DATABASE "correos_de_mexicoTest" TO root;
