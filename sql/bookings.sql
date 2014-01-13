--
-- Databas: `bookcal`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `bookings`
--

--- Create table query
CREATE TABLE IF NOT EXISTS bookings(
day VARCHAR( 10 ) ,
time VARCHAR( 5 ) ,
description VARCHAR( 100 ) ,
PRIMARY KEY ( DAY , TIME )
)

--- Insert query
INSERT INTO bookings VALUES
('2014-01-11', '09:20', 'noll nio tjugo'),
('2014-01-11', '09:30', 'noll nio tjugo'),
('2014-01-11', '10:30', 'tio tjugo'),
('2014-01-11', '11:30', 'elva tjugo');