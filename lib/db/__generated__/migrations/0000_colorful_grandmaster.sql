CREATE TABLE `conversations` (
	`id` varchar(6) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`title` varchar(255),
	`user_id` varchar(31) NOT NULL,
	CONSTRAINT `created_at_idx` UNIQUE(`created_at`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` varchar(6) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`content` varchar(255) NOT NULL,
	`conversation_id` int NOT NULL,
	`user_id` int NOT NULL,
	CONSTRAINT `created_at_idx` UNIQUE(`created_at`),
	CONSTRAINT `conversation_id_idx` UNIQUE(`conversation_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(31) NOT NULL,
	`email` varchar(319) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `email_idx` UNIQUE(`email`)
);
