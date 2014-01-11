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
