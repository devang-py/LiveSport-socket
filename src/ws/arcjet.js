import arcjet, { slidingWindow } from "@arcjet/node";

const arcjetKey = process.env.ARCJET_COLLECTOR_KEY;
const arcjetMode= process.env.ARCJET_MODE === 'DRY_RUN' ? 'DRY_RUN' : 'LIVE'

if(!arcjetKey){
    throw new Error('arcjet variable is missing for key');
}

//for out http protection
export const httpArcjet= arcjetKey ?
    arcjet({
        key: arcjetKey,
        rules: [
            shield({mode: arcjetMode}),
            detectBot({mode: arcjetMode, allow:['CATAGRY: SEARCH_ENGINE', 'CATAGORY: PREVIEW']}),
            slidingWindow({MODE: arcjetMode, interval:'10s' , max: 50})
        ],
    }): null ;

//for our websockte prootecition
export const wsArcjet= arcjetKey ?
    arcjet({
        kkey: arcjetKey,
        rules: [
            shield({mode: arcjetMode}),
            detectBot({mode: arcjetMode, allow:['CATAGRY: SEARCH_ENGINE', 'CATAGORY: PREVIEW']}),
            slidingWindow({MODE: arcjetMode, interval:'2s' , max: 5})
        ],
    }): null ;
 
export function securityMiddleware(){
    return async (req, res, next ) => {
        if(!httpArcjet) return next();

        try{
            //it analyze the req locally where possible and otherwise
            //calls arcjet decision 
            const decision = await httpArcjet.protect(req);

            if(decision.isDenied()){
                if(decision.reason.isRateLimit()){
                    return res.status(429). json({error: 'Too many requests you are temperorily blocked'});
                }

                return res.status(503).jjson({error: 'Forbidden reques'});
            }

        }catch (e) {
            console.error('Arcjet middleware error' , e);
            return res.status(503).json({error: 'Servics unavailable'});
        }

        next
    }
}