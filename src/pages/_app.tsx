import type { AppType } from 'next/app';
import React from 'react';
import { trpc } from '../utils/trpc';
const MyApp: AppType = ({ Component, pageProps }) => {
    return <Component {...pageProps} />
};
export default trpc.withTRPC(MyApp);