/** @jsxImportSource @emotion/react */
'use client'

import LogRocket from 'logrocket';
import mixpanel, { OverridedMixpanel } from 'mixpanel-browser';
import { usePathname, useSearchParams } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { publicRuntimeConfig } from '@/lib/app-constants';

//the current version of the mixpanel types does not include the track_pageview method. Let's add it
declare module "mixpanel-browser" {
    interface Mixpanel {
        track_pageview(properties?: Dict): void;
    }
}

const mixPanelKey = publicRuntimeConfig.MIXPANEL_TOKEN;
mixpanel.init(mixPanelKey, { debug: process.env.NODE_ENV === "development" });

const MixPanelContext = createContext<OverridedMixpanel | undefined>(undefined);

type Props = {
    children: ReactNode;
};

const AnalyticsProvider = ({ children }: Props) => {
    // const pathname = usePathname();
    const searchParams = useSearchParams();
    const source = searchParams.get('source')?? '';

    useEffect(() => {
        if (typeof window !== 'undefined') {
            LogRocket.init(`2hrurg/${publicRuntimeConfig.LOGROCKET_PROJECT}`);
        }

        mixpanel?.track_pageview({
            'source': source,
        });
    }, [source]);

    return (
        <MixPanelContext.Provider value={mixpanel}>
            {children}
        </MixPanelContext.Provider>
    );
};

function useMixPanel() {
    const context = useContext(MixPanelContext);
    if (context === undefined) {
        throw new Error("MixPanelContext must be used within a MixpanelProvider");
    }

    return context;
}

export { AnalyticsProvider, useMixPanel };
