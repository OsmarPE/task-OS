CREATE TABLE `project_members` (
	`project_id` varchar(36) NOT NULL,
	`clerk_user_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_members_project_id_clerk_user_id_pk` PRIMARY KEY(`project_id`,`clerk_user_id`)
);
--> statement-breakpoint
CREATE TABLE `task_assignees` (
	`task_id` varchar(36) NOT NULL,
	`clerk_user_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `task_assignees_task_id_clerk_user_id_pk` PRIMARY KEY(`task_id`,`clerk_user_id`)
);
--> statement-breakpoint
CREATE TABLE `task_dependencies` (
	`task_id` varchar(36) NOT NULL,
	`depends_on_task_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `task_dependencies_task_id_depends_on_task_id_pk` PRIMARY KEY(`task_id`,`depends_on_task_id`)
);
--> statement-breakpoint
ALTER TABLE `project_members` ADD CONSTRAINT `project_members_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `task_assignees` ADD CONSTRAINT `task_assignees_task_id_tasks_id_fk` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `task_dependencies` ADD CONSTRAINT `task_dependencies_task_id_tasks_id_fk` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `task_dependencies` ADD CONSTRAINT `task_dependencies_depends_on_task_id_tasks_id_fk` FOREIGN KEY (`depends_on_task_id`) REFERENCES `tasks`(`id`) ON DELETE cascade ON UPDATE no action;