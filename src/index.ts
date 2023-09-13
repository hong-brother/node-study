// index.ts
import express, {Request, Response, NextFunction} from 'express';
import {main} from "./mysql-test";
import {redisMain} from "./redis-test";

const app = express();

app.get('/mysql-test', (req: Request, res: Response, next: NextFunction) => {
    //
    main(1);
    res.send('Test mysql test');
});

app.get('/redis-test', (req: Request, res: Response, next: NextFunction) => {
    //
    redisMain(1);
    res.send('Test redis test');
});

app.listen('8001', () => {
    console.log(`
        #############################################
        🛡️ Server listening on port: 8001 🛡️
        #############################################  
    `);
});

// main(5);
// redisMain(5);
