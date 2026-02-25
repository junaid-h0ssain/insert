import {v} from "convex/values";
import {mutation, query} from "./_generated/server";
import {verifyAuth} from "./auth";

export const create = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);

        const projectId = await ctx.db.insert("projects", {
            name: args.name,
            ownerID: identity.subject,
            updatedAt: Date.now(),
        });

        return projectId;
    },
});

export const getPartial = query({
    args: {
        limit: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);

        return await ctx.db
            .query("projects")
            .withIndex("byOwner", (q) => q.eq("ownerID", identity.subject))
            .order("desc")
            .take(args.limit);
    },
});

export const get = query({
    args: {},
    handler: async (ctx) => {
        const identity = await verifyAuth(ctx);

        return await ctx.db
            .query("projects")
            .withIndex("byOwner", (q) => q.eq("ownerID", identity.subject))
            .order("desc")
            .collect();
    },
});

export const getById = query({
    args: {
        id: v.id("projects"),
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);
        const project = await ctx.db.get(args.id);

        if (!project || project.ownerID !== identity.subject) {
            return null;
        }

        return project;
    },
});

export const rename = mutation({
    args: {
        id: v.id("projects"),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);
        const project = await ctx.db.get(args.id);

        if (!project || project.ownerID !== identity.subject) {
            throw new Error("Project not found");
        }

        await ctx.db.patch(args.id, {
            name: args.name,
            updatedAt: Date.now(),
        });
    },
});

export const updateSettings = mutation({
    args: {
        id: v.id("projects"),
        settings: v.object({
            installCommand: v.optional(v.string()),
            devCommand: v.optional(v.string()),
        }),
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);
        const project = await ctx.db.get(args.id);

        if (!project || project.ownerID !== identity.subject) {
            throw new Error("Project not found");
        }

        await ctx.db.patch(args.id, {
            settings: args.settings,
            updatedAt: Date.now(),
        });
    },
});