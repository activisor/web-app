/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { mq } from '@/lib/media-queries';

const logoButtonStyle = css({
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});


const LogoButton: React.FC = () => {
    return (
        <div css={{
            padding: 16,
            [mq.md]: {
                padding: 24,
            },
            [mq.xl]: {
                padding: 32,
            }
        }}>
            <a href="/"><img src="/ShortLogo_Transparent.png" width={100} height={45}  alt="Activisor" /></a>
        </div>
    );
};

export default LogoButton;