CREATE TABLE `conversations` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`public_id` varchar(12) NOT NULL,
	`title` varchar(255) NOT NULL,
	`user_id` int NOT NULL,
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`),
	CONSTRAINT `created_at_idx` UNIQUE(`created_at`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`private_id` varchar(12) NOT NULL,
	`public_id` varchar(12) NOT NULL,
	`email` varchar(319) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`email_verified_at` timestamp,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `email_idx` UNIQUE(`email`),
	CONSTRAINT `public_id_idx` UNIQUE(`public_id`)
);
