import { Router } from "express";
import { desc } from "drizzle-orm";
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches.js";
import db from "../db/db.js";
import { getMatchStatus } from "../utils/match-status.js";
import { matches } from '../db/schema.js';

const matchRoute = Router();

matchRoute.get('/', async (req, res) => {
    const parsed = listMatchesQuerySchema.safeParse(req.query);
    //---max limit for matches
    const MAX_LIMIT = 60;
    //---check success form parsed which we get in json from query
    if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid Payload', details: parsed.error.issues });
    }
    //---limit for matches
    const LIMIT = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);
    try {
        const data = await db
            .select()
            .from(matches)
            .orderBy(desc(matches.createdAt))
            .limit(LIMIT);

        res.status(200).json({ data });

    } catch (e) {
        res.status(500).json({ error: 'Failed To Fetch Data' });
    }
});

matchRoute.post('/', async (req, res) => {
    // validating , and below creating the match in DB
    const parsed = createMatchSchema.safeParse(req.body);

    // if parsing fails
    if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid Payload', details: parsed.error.issues });
    }

    const { startTime, endTime, homeScore, awayScore } = parsed.data;

    try {
        const [event] = await db.insert(matches).values({
            ...parsed.data,
            startTime: new Date(parsed.data.startTime),
            endTime: new Date(parsed.data.endTime),
            homeScore: homeScore ?? 0,
            awayScore: awayScore ?? 0,
            status: getMatchStatus(startTime, endTime)
        }).returning();

        res.status(201).json({ data: event });

        if(res.app.locals.broadcastMatchCreated){
            console.log(res.app.locals.broadcastMatchCreated);
            res.app.locals.broadcastMatchCreated(event);
        }
    } catch (e) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export { matchRoute };
export default matchRoute;

