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


CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` text NOT NULL,
  `pass` text NOT NULL,
  PRIMARY KEY (`id`)
)
