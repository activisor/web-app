/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react';
import { decode, isNodeJs } from '@/lib/base64-convert';

export default function ResultPage() {
    const sheetResult = isNodeJs()? '' : (new URLSearchParams(window.location.search)).get('data') as string;
    const data = decode(sheetResult);
    const previewUrl = `https://docs.google.com/spreadsheets/d/${data.sheetId}/preview`;
    const key = data.key;
    // console.log(`key: ${key}, sheetId: ${data.sheetId}`);

    return (
        <main>
            <div>ResultPage</div>
            <div>
                <iframe src={previewUrl} css={{
                    width: '100%',
                    height: '100vh',
                    border: 'none',
                }}></iframe>
            </div>
        </main>
    );
}