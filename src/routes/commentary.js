import { Router } from 'express';
import { matchIdParamSchema } from '../validation/matches.js';
import { createCommentarySchema } from '../validation/commentary.js';
import db from '../db/db.js';
import { commentary } from '../db/schema.js';

export const commentaryRoute = Router({ mergeParams: true });

commentaryRoute.get('/', (req, res) => {
    res.status(200).json({ message: 'commentary List' });
});

commentaryRoute.post('/', async (req, res) => {
    const parsedParams = matchIdParamSchema.safeParse(req.params);
        //first check if the matchid is even valid
    if (!parsedParams.success) {
        return res.status(400).json({ error: 'Invalid match ID', details: parsedParams.error.issues });
    }
    //----next validating the payload
    const parsedBody = createCommentarySchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({ error: 'Invalid payload', details: parsedBody.error.issues });
    }
    //--- now try to insert in db
    try {
        const [result] = await db.insert(commentary).values({
            matchId: parsedParams.data.id,
            ...parsedBody.data,
        }).returning();

        if(res.app.locals.broadcastCommentary) {
            res.app.locals.broadcastCommentary(result.matchId, result);
        }

        res.status(201).json({ data: result });
    } catch (e) {
        console.error('Failed to insert commentary:', e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
