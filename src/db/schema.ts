import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  int,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const priorities = mysqlTable("priorities", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});

export const projects = mysqlTable("projects", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tasks = mysqlTable("tasks", {
  id: varchar("id", { length: 36 }).primaryKey(),
  taskName: varchar("task_name", { length: 255 }).notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  priorityId: int("priority_id")
    .notNull()
    .references(() => priorities.id),
  projectId: varchar("project_id", { length: 36 })
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  dueDate: date("due_date", { mode: "date" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const projectMembers = mysqlTable(
  "project_members",
  {
    projectId: varchar("project_id", { length: 36 })
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.projectId, table.clerkUserId] })],
);

export const taskAssignees = mysqlTable(
  "task_assignees",
  {
    taskId: varchar("task_id", { length: 36 })
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.taskId, table.clerkUserId] })],
);

export const taskDependencies = mysqlTable(
  "task_dependencies",
  {
    taskId: varchar("task_id", { length: 36 })
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    dependsOnTaskId: varchar("depends_on_task_id", { length: 36 })
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.taskId, table.dependsOnTaskId] })],
);

export const projectsRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
  members: many(projectMembers),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  priority: one(priorities, {
    fields: [tasks.priorityId],
    references: [priorities.id],
  }),
  assignees: many(taskAssignees),
  dependencies: many(taskDependencies, { relationName: "dependencies" }),
  dependents: many(taskDependencies, { relationName: "dependents" }),
}));

export const taskAssigneesRelations = relations(taskAssignees, ({ one }) => ({
  task: one(tasks, {
    fields: [taskAssignees.taskId],
    references: [tasks.id],
  }),
}));

export const taskDependenciesRelations = relations(taskDependencies, ({ one }) => ({
  task: one(tasks, {
    fields: [taskDependencies.taskId],
    references: [tasks.id],
    relationName: "dependencies",
  }),
  dependsOnTask: one(tasks, {
    fields: [taskDependencies.dependsOnTaskId],
    references: [tasks.id],
    relationName: "dependents",
  }),
}));
