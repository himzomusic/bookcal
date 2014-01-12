--
-- Databas: `bookcal`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `bookings`
--

CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `day` text NOT NULL,
  `time` text NOT NULL,
  `desc` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumpning av Data i tabell `bookings`
--

INSERT INTO `bookings` (`id`, `day`, `time`, `desc`) VALUES
(1, '2014-01-11', '09:20', 'noll nio tjugo'),
(2, '2014-01-11', '09:20', 'noll nio tjugo'),
(3, '2014-01-11', '10:20', 'tio tjugo'),
(4, '2014-01-11', '11:20', 'elva tjugo');

--- SUGGESTED QUERIES

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