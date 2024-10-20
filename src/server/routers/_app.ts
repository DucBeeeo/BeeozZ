import { t } from '../trpc'; 
import { employeeRouter } from './post'; 

export const appRouter = t.router({

    employee: employeeRouter, 
});

export type AppRouter = typeof appRouter;
