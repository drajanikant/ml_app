-- MySQL dump 10.13  Distrib 8.0.12, for macos10.13 (x86_64)
--
-- Host: localhost    Database: ml_face_detection
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `goodies`
--

DROP TABLE IF EXISTS `goodies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `goodies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `goodie_name` varchar(45) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goodies`
--

LOCK TABLES `goodies` WRITE;
/*!40000 ALTER TABLE `goodies` DISABLE KEYS */;
INSERT INTO `goodies` VALUES (1,'Pen',10),(2,'Mouse Pad',10),(3,'Mug',10),(4,'Key ring',10),(5,'Calender',10);
/*!40000 ALTER TABLE `goodies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(45) DEFAULT NULL,
  `user_email` varchar(200) DEFAULT NULL,
  `user_mobile` varchar(45) DEFAULT NULL,
  `user_designation` varchar(45) DEFAULT NULL,
  `user_organization` varchar(45) DEFAULT NULL,
  `tell_me` varchar(500) DEFAULT NULL,
  `goodies_status` varchar(45) DEFAULT NULL,
  `goodies_name` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`),
  UNIQUE KEY `user_email_UNIQUE` (`user_email`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'abhinish','abhinish@prodevans.com','987654322','Technical Consultent','Prodevans Technologies LLP',NULL,NULL,NULL),(2,'Amit','amit.kanaka@prodevans.com','987654322','Technical Consultent','Prodevans Technologies LLP',NULL,NULL,NULL),(4,'Rajanikant','rajanikant@prodevans.com','987654322','Technical Consultent','Prodevans Technologies LLP',NULL,'no','Mouse pad'),(5,'Anand','anand@prodevans.com','987654322','Technical Consultent','Prodevans Technologies LLP',NULL,NULL,NULL),(6,'Ayan','ayan.das@prodevans.com','987654322','Technical Consultent','Prodevans Technologies LLP',NULL,NULL,NULL),(7,'Deepak','dipankar@prodevans.com','987654322','Technical Consultent','Prodevans Technologies LLP',NULL,NULL,NULL),(8,'srini','srinivas.r@prodevans.com','987654322','Technical Consultent','Prodevans Technologies LLP',NULL,NULL,NULL),(9,'harish','harish@prodevans.com','987654322','Technical Consultent','Prodevans Technologies LLP',NULL,NULL,NULL),(11,'james sundeep','james.sundeep@prodevans.com','876543456','Technical Consultent','Prodevans Technologies LLP',NULL,NULL,NULL),(12,'Karthik Shripathi','karthik@prodevans.com','987656789','Technical Consultent','Prodevans Technologies LLP',NULL,NULL,NULL),(13,'katapa','pawan.kumar@prodevans.com','987655678','Technical Consultent','Prodevans Technologies LLP',NULL,NULL,NULL),(24,'nagendrababu','nagendra@gmail.com','8456321789','Technical Consultent','Prodevans Technologies LLp',NULL,NULL,NULL),(25,'prince','prince@prodevans.com','7895461234','Technical Consultent','Prodevans Technologies LLp',NULL,NULL,NULL),(26,'Rajanigandha Khot','rajanigandha@prodevans.com','7855462394','Technical Consultent','Prodevans Technologies LLp',NULL,NULL,NULL),(27,'Rajanikant Devmore ','rajanikant.d@prodevans.com','8456123794','Technical Consultent','Prodevans Technologies LLp',NULL,NULL,NULL),(28,'Siddappa','siddappa@prodevans.com','9845632781','Technical Consultent','Prodevans Technologies LLp',NULL,NULL,NULL),(29,'SOHAIL AKHTAR','sohail@prodevans.com','7894562587','Technical Consultent','Prodevans Technologies LLp',NULL,NULL,NULL),(30,'sowjanya','sowjanya@prodevans.com','9856423741','Technical Consultent','Prodevans Technologies LLp',NULL,NULL,NULL),(31,'sowmya','sowmya@prodevans.com','7845612384','Technical Consultent','Prodevans Technologies LLp',NULL,NULL,NULL),(32,'Sulthana.N','sulthana@prodevans.com','8456278954','Technical Consultent','Prodevans Technologies LLp',NULL,NULL,NULL),(33,'Vamsi','vamsi@prodevans.com','9458426624','Technical Consultent','Prodevans Technologies LLp',NULL,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-09-29 17:25:56
