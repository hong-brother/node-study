// index.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hi! This is my first express server');
});

app.listen('8001', () => {
    console.log(`
        #############################################
        🛡️ Server listening on port: 8001 🛡️
        #############################################  
    `);
})
