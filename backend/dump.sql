-- MySQL dump 10.17  Distrib 10.3.15-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: CYSECPROJECT
-- ------------------------------------------------------
-- Server version	10.3.15-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `CYSECPROJECT`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `cysecproject` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `CYSECPROJECT`;

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(512) NOT NULL,
  `questionID` int(11) NOT NULL,
  `isCorrect` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
INSERT INTO `answers` VALUES (1,'soziale Manipulation',1,1),(2,'angewandte Sozialwissenschaft',1,1),(3,'Sozialsimulation',1,0),(4,'Mechanische Menschen',1,0),(5,'pauschal gar keinen!',2,1),(6,'allen, die nicht auf .exe enden',2,0),(7,'allen',2,0),(8,'denen, die in der Email fehlerfreies Deutsch verwenden',2,0),(9,'Passwortkarten für die Türen',3,1),(10,'Ein Empfang der die Personen authentifiziert',3,1),(11,'Drehtüren',3,0),(12,'schlechte Musik in der Eingangshalle',3,0),(13,'Ja, ist er auch',4,1),(14,'Nein',4,0),(15,'Cross-Site-Scripting',5,1),(16,'Xylophone Social Science',5,0),(17,'Cascading Style Sheets',5,0),(18,'In eine SQL Anfrage weitere Befehle einzuschleußen',6,1),(19,'Den SQL Server zu überlasten',6,0),(20,'Den Programmierer des SQL Server mit einer Spritze zu betäuben',6,0),(21,'Denial of Service Attack',7,0),(22,'Destributed Denial of Service Attack',7,1),(23,'Digital Disguised Online Scam',7,0),(24,'Do Duo On Screw',7,0),(25,'Ja, sonst würden wir es ja tun',8,1),(26,'Nein, ich will keine Punkte für die Frage',8,0),(27,'Ich muss es mir einfach merken können',9,0),(28,'Es muss unglaublich lang sein',9,0),(29,'Viele unterschiedliche Zeichen in einem nicht logischen Muster',9,1),(30,'Es muss den Vornamen meines Haustiers beinhalten',9,0),(31,'Two Factor Authentication',10,1),(32,'To Few Authentication',10,0),(33,'Two Female Authentication',10,0),(34,'To Famous Authentication',10,0),(35,'Ja, es schützt oft vor breit angelegten \'Massenattacken\'',11,1),(36,'Ja, weil es Hackern erheblichen Mehraufwandt bereitet',11,1),(37,'Nein, es ist absolut nicht mehr Stand der Technik',11,0),(38,'Nur wenn man beide Faktoren immer zusammen aufbewahrt',11,0),(39,'Nein, das macht Google für mich',12,0),(40,'Ja, gerade dort',12,1),(41,'Ich frage was ich tue wenn mir keine Frage mehr einfällt!',13,1),(42,'Ich gebe auf',13,0),(43,'Ja, weil wir somit mehr Variation bekommen',14,1),(44,'Einfach nur ja',14,1),(45,'Ja, offensichtlich',15,1),(46,'Nein, sein Haustier hat sie sich ausgedacht',15,0),(47,'Ja!',16,1),(48,'Ja!',16,1),(49,'Ja!',16,1),(50,'Ja!',16,1);
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `requiredLevel` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Social Engineering',2),(2,'Websecurity',3),(3,'Authentication',3),(4,'Sonstiges(Currently fun/placeholder)',4);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID_1` int(11) DEFAULT NULL,
  `userID_2` int(11) DEFAULT NULL,
  `isFinished` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(1024) NOT NULL,
  `categoryID` int(11) NOT NULL,
  `requiredLevel` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `answerTime` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,'Was ist eine geeignete Übersetzung für \'Social Engineering\'?',1,3,1,10),(2,'Welchen Email-Anhängen kann ich vertrauen?',1,3,1,10),(3,'Womit lässt sich der Zugang zu einem System effektiv regulieren?',1,3,1,10),(4,'Kann der Mensch ein Sicherheitsrisiko bei der Bedienung von Software sein?',1,4,1,10),(5,'Was ist XSS?',2,3,1,10),(6,'Was versteht man unter einer SQL Injection?',2,3,1,10),(7,'Für was steht DDOS?',2,3,1,10),(8,'Lohnt es sich Websecurity zu erforschen?',2,4,1,10),(9,'Was ist wichtig bei der Auswahl des Passworts, damit es ein hohes Maß an Sicherheit aufweißt?',3,3,1,10),(10,'Was ist 2FA?',3,3,1,10),(11,'Ist 2FA sinnvoll?',3,3,1,10),(12,'Ist Authentication auch im Internet notwendig?',3,4,1,10),(13,'Was tue ich wenn mir keine Frage mehr einfällt?',4,4,1,10),(14,'Ist diese Kategorie sinnvoll?',4,4,1,10),(15,'Hat es dem Programmierer Spaß gemacht sich diese sinnvollen Fragen auszudenken?',4,4,1,10),(16,'Ist dies deine Lieblingskategorie?',4,4,1,10);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rounds`
--

DROP TABLE IF EXISTS `rounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rounds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gameID` int(11) NOT NULL,
  `category` varchar(256) DEFAULT NULL,
  `questionID_1` int(11) DEFAULT NULL,
  `questionID_2` int(11) DEFAULT NULL,
  `questionID_3` int(11) DEFAULT NULL,
  `answerID_1_1` int(11) DEFAULT NULL,
  `answerID_1_2` int(11) DEFAULT NULL,
  `answerID_1_3` int(11) DEFAULT NULL,
  `answerID_2_1` int(11) DEFAULT NULL,
  `answerID_2_2` int(11) DEFAULT NULL,
  `answerID_2_3` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rounds`
--

LOCK TABLES `rounds` WRITE;
/*!40000 ALTER TABLE `rounds` DISABLE KEYS */;
/*!40000 ALTER TABLE `rounds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `score` int(11) NOT NULL,
  `token` varchar(100) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin',9999999,'ot5lyety960667nnkt4x100waf5jys3sz2x_1',5),(2,'Andy',999,'2plqwewnhgjlprbouumrzrcvx15oi9lkx3v_2',4),(3,'Lenny',998,'gzjfneeyujbsxgg3pwc2rvm5169536qtb0h_3',4),(4,'Oli',1000,'ixt2ili8caxqyh79az24lqfxfl9se4wf8qd_4',3);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-09-09 13:14:11
