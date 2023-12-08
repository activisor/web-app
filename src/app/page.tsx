/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react'


export default function Home() {

    return (
        <main css={{
            display: 'flex',
            justifyContent: 'center',
            minHeight: '100vh',
            minWidth: '100vw',
            /* breakpoint for large screen overrides, 1280px wide */
            '@media(min-width: 1248px)': {
                marginTop: 16
            }
        }}>
            <div>
                <h1 css={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    '@media(max-width: 1247px)': {
                        marginTop: 8
                    }
                }}>Activisor</h1>
            </div>
        </main>
    );
}
