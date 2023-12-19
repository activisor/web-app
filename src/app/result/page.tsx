/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { decode } from '@/lib/base64-convert';

// editable URL: `https://docs.google.com/spreadsheets/d/${spreadsheet.data.spreadsheetId}/edit?usp=sharing`;

export default function ResultPage() {
    const [previewUrl, setPreviewUrl] = useState('');
    const [key, setKey] = useState('');

    useEffect(() => {
        const sheetResult = (new URLSearchParams(window.location.search)).get('data') as string;
        const data = decode(sheetResult);
        setPreviewUrl(`https://docs.google.com/spreadsheets/d/${data.sheetId}/preview`);
        setKey(data.key);

        const sheetFrame = document.querySelector('iframe');
        if (sheetFrame && sheetFrame.contentWindow) {
            sheetFrame.width = sheetFrame.contentWindow.document.body.scrollWidth + 'px';
            sheetFrame.height = sheetFrame.contentWindow.document.body.scrollHeight + 'px';
        }
    }, []);

    return (
        <main>
            <div>ResultPage</div>
            <div>
                <iframe src={previewUrl} css={{
                    border: 'none',
                }}></iframe>
            </div>
        </main>
    );
}