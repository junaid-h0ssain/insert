import { v } from "convex/values";
import  { mutation, query } from "./_generated/server";
import { ar } from "date-fns/locale";

export const create = mutation({
    args: {
        name: v.string(),
        
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        await ctx.db.insert("projects", {
            name: args.name,
            ownerID: identity.subject,
        });
    },
})

export const get = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        
        if (!identity) {
            throw new Error("Not authenticated");
        }
        return await ctx.db.query("projects")
        .withIndex("byOwner", (q) => q.eq("ownerID", identity.subject))
        .collect();
    },
})