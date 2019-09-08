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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Social Engineering'),(2,'Websecurity'),(3,'Authentication'),(4,'Sonstiges');
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
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (23,15,16,0),(24,42,1337,0),(25,43,44,0),(26,45,46,0),(27,47,48,0),(28,49,50,0),(29,51,52,0),(30,1007,1008,0),(31,25,26,0),(32,2,1,1),(33,33,2,0),(34,1,3,0),(35,75,76,0),(36,77,78,0),(37,77,77,0),(38,77,1,0),(39,77,50,0),(40,77,39,0),(41,1,NULL,0);
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,'Was ist eine geeignete Übersetzung für \'Social Engineering\'?',1),(2,'Welchen Email-Anhängen kann ich vertrauen?',1),(3,'Womit lässt sich der Zugang zu einem System effektiv regulieren?',1),(4,'Kann der Mensch ein Sicherheitsrisiko bei der Bedienung von Software sein?',1),(5,'Was ist XSS?',2),(6,'Was versteht man unter einer SQL Injection?',2),(7,'Für was steht DDOS?',2),(8,'Lohnt es sich Websecurity zu erforschen?',2),(9,'Was ist wichtig bei der Auswahl des Passworts, damit es ein hohes Maß an Sicherheit aufweißt?',3),(10,'Was ist 2FA?',3),(11,'Ist 2FA sinnvoll?',3),(12,'Ist Authentication auch im Internet notwendig?',3),(13,'Was tue ich wenn mir keine Frage mehr einfällt?',4),(14,'Ist diese Kategorie sinnvoll?',4),(15,'Hat es dem Programmierer Spaß gemacht sich diese sinnvollen Fragen auszudenken?',4),(16,'Ist dies deine Lieblingskategorie?',4);
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
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rounds`
--

LOCK TABLES `rounds` WRITE;
/*!40000 ALTER TABLE `rounds` DISABLE KEYS */;
INSERT INTO `rounds` VALUES (17,23,NULL,8,9,10,8,NULL,NULL,9,8,8),(18,24,NULL,9,10,8,9,9,8,9,11,7),(19,29,NULL,10,9,8,NULL,NULL,NULL,NULL,NULL,NULL),(20,30,NULL,8,10,9,7,11,9,NULL,NULL,NULL),(21,31,NULL,9,10,8,NULL,NULL,NULL,NULL,NULL,NULL),(22,32,NULL,8,10,9,7,11,9,7,11,9),(23,32,NULL,10,8,9,11,7,10,11,8,9),(24,32,NULL,8,10,9,7,12,9,7,12,10),(25,32,NULL,10,8,9,11,7,9,11,8,10),(26,32,NULL,9,10,8,9,11,7,9,11,7),(27,32,NULL,10,8,9,12,8,10,11,8,9),(28,33,NULL,8,10,9,7,12,9,7,12,9),(29,33,NULL,8,10,9,7,11,9,7,11,NULL),(30,34,NULL,9,10,8,10,12,8,9,11,7),(31,34,NULL,10,8,9,12,8,10,11,7,9),(32,34,NULL,10,8,9,11,7,9,12,8,10),(33,34,NULL,9,8,10,NULL,NULL,NULL,NULL,NULL,NULL),(34,25,NULL,9,10,8,10,11,7,9,12,7),(35,25,NULL,10,8,9,12,8,9,11,8,9),(36,25,NULL,10,9,8,NULL,NULL,NULL,11,10,NULL),(37,26,NULL,8,9,10,NULL,NULL,NULL,NULL,NULL,NULL),(38,35,'3',9,8,10,NULL,NULL,NULL,NULL,NULL,NULL),(39,36,'1',1,3,2,NULL,NULL,NULL,NULL,NULL,NULL);
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Andy',9000,'ptpt0yorvdo9o1ybifgu873yj6pxv5zu468_1'),(2,'NeuerLenny',4,'h34iyuki4s4c72k3z0eyufa2j9v4sfr9wh0_2'),(3,'Pascal',22,'4vw3c3yqge9k3ebr57cr41uuym5g8ukd694_3'),(25,'Nils',-5,'niv6k5gm4s3ngmqtsthulf4hvzkx15d5hyu_25'),(26,'Olli',1337,NULL),(33,'Karsten',1,'n8g5n2q3yaot17lxidxbj1t1skrv8ov7czs_33'),(41,'Harry Hirsch',17,'qhfk04h5rm4nkutcrxbu4uhqpjanafoq6e9_41'),(42,'Testuser1',27,'3t4k4ausw98d6ieawtpjkmuk4m6ccq0cdal_42'),(43,'Testuser2',27,'iwykxgiuacf6hj1r8f7q1u0qtectfvf9j78_43'),(44,'Testuser 3',1234,'mju1tudwac4sqgkxs5qrmeupdxq2jkpm7b5_44'),(45,'teset001',123,'yfh5f6vhod95ecz7nylcemnruqproo70vwu_45'),(46,'teset002',123,'mckedcmpctpraflj8meg0a6o3j94puyy4ul_46'),(47,'Test_010',20,'16uzsrtan1bj4f08z8zbiv2t57rbgra14dh_47'),(48,'Test_011',20,'bxmbr6y2g90ahcnxip3gisemwod4l658y8w_48'),(49,'Test_012',20,'smb21qh7frwv7o4n5ttq3cvc8k8ts0lrhyj_49'),(50,'Test_013',20,'2zojqxojszkwcwakjmhgxdv9w5cec0dhj83_50'),(51,'Test',123,NULL),(52,'Test',123,NULL),(53,'Test',123,NULL),(54,'Test',123,NULL),(55,'Test',123,NULL),(56,'Test',123,NULL),(57,'Test',123,NULL),(58,'Test',123,NULL),(59,'Test',123,NULL),(60,'Test',123,NULL),(61,'Test',123,NULL),(62,'Test',123,NULL),(63,'Test',123,NULL),(64,'Test',123,NULL),(65,'Test',123,NULL),(66,'Test',123,NULL),(67,'Test',123,NULL),(68,'Test',123,NULL),(69,'Test',123,NULL),(70,'Test',123,NULL),(71,'Test',123,NULL),(72,'Test',123,NULL),(73,'Test',123,NULL),(74,'Test073',123,NULL),(75,'Test075',123,'625c49min1dvmxwxee71xsb8iweymdn8usp_75'),(76,'Test076',123,'0hb1nvlxffuztebgq5w37x3j85mhmms1yg6_76'),(77,'Test077',123,'jych7sr4z3377k5tbczwbpwdzhkwouf4kv9_77'),(78,'Test078',123,'by8cokp0kldz8kk2ca94u8s7hrqfxywmsa7_78');
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

-- Dump completed on 2019-09-09  0:52:01
