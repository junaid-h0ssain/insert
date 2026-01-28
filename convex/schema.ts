import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
    projects: defineTable({
        name: v.string(),
        // description: v.string().isOptional(),
        // createdAt: v.date(),
        ownerID: v.string(),
        importStatus: v.optional(
            v.union(
                v.literal("in_progress"),
                v.literal("completed"),
                v.literal("failed"),
            )
        ),
    }).index("byOwner", ["ownerID"]),
});
