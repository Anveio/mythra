ALTER TABLE `conversations` MODIFY COLUMN `public_id` varchar(6) NOT NULL;--> statement-breakpoint
ALTER TABLE `conversations` MODIFY COLUMN `title` varchar(255);--> statement-breakpoint
ALTER TABLE `conversations` ADD `private_id` varchar(31) NOT NULL;