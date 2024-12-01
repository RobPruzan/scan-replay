// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
import { RRWebEvent } from "../../app/api/rrweb/route";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `scan-replay_${name}`);

export const sessionReplay = createTable("sessionReplay", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  events: text("events", { mode: "json" }).$type<RRWebEvent[]>().notNull(),
});
