CREATE TABLE `priorities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	CONSTRAINT `priorities_id` PRIMARY KEY(`id`),
	CONSTRAINT `priorities_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`clerk_user_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` varchar(36) NOT NULL,
	`task_name` varchar(255) NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`priority_id` int NOT NULL,
	`project_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_priority_id_priorities_id_fk` FOREIGN KEY (`priority_id`) REFERENCES `priorities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;