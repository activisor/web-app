/** @jsxImportSource @emotion/react */

import mixpanel, { OverridedMixpanel } from 'mixpanel-browser';
import { usePathname, useSearchParams } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect } from 'react';

//the current version of the mixpanel types does not include the track_pageview method. Let's add it
declare module "mixpanel-browser" {
    interface Mixpanel {
        track_pageview(properties?: Dict): void;
    }
}

const mixPanelKey = process.env.MIXPANEL_TOKEN || "47533c2a055ae8ca7d7823306b45d459";
mixpanel.init(mixPanelKey, { debug: process.env.NODE_ENV === "development" });

const MixPanelContext = createContext<OverridedMixpanel | undefined>(undefined);

type Props = {
    children: ReactNode;
};

const MixPanelProvider = ({ children }: Props) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        mixpanel?.track_pageview();
    }, [pathname, searchParams]);

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

export { MixPanelProvider, useMixPanel };
