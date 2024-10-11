/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react'
import LogoButton from '@/components/logo-button';
import { mq } from '@/lib/media-queries';

export default function Privacy() {
    return (
        <main>
            <div css={{
                padding: 16,
                [mq.md]: {
                    padding: 24,
                },
                [mq.xl]: {
                    padding: 32,
                },
                h2: {
                    marginBottom: 16,
                    marginTop: 24
                },
                h3: {
                    marginBottom: 16,
                    marginTop: 16,
                    marginLeft: 16
                },
                p: {
                    marginLeft: 8
                },
                /* breakpoint for large screen overrides, 1280px wide */
                '@media(min-width: 1248px)': {
                    h2: {
                        marginTop: 32
                    },
                    p: {
                        marginLeft: 16
                    }
                }
            }}>
                <LogoButton />
                <h1>Privacy Policy for Activisor</h1>
                <p css={{ fontStyle: 'italic' }}>Last Updated: December 1, 2023</p>
                <h2>1. Introduction</h2>
                <p>
                    Thank you for choosing Activisor. This Privacy Policy is intended to inform you about how we collect, use, and disclose personal information when you use our web service and the choices you have associated with that information.
                </p>

                <h2>2. Information We Collect</h2>
                <h3>a. Google OAuth2 Authorization:</h3>
                <p>
                    To provide our services, we use Google OAuth2 for user authentication and authorization. When you log in using Google OAuth2, we collect the basic profile information provided by Google, including but not limited to your name, email address, and profile picture.
                </p>
                <h3>b. Google Sheets Schedule Creation:</h3>
                <p>
                    In order to create a Google Sheets schedule for you, we may access and store basic information related to the schedule, such as the title and other metadata associated with the schedule.
                </p>

                <h2>3. How We Use Your Information</h2>
                <h3>a. User Authentication:</h3>
                <p>We use the information collected through Google OAuth2 (Login with Google) for user authentication, allowing you to securely access and use our services.</p>
                <h3>b. Google Sheets Spreadsheet Creation and Management:</h3>
                <p>The information collected during the Google OAuth2 authorization process is used to create and manage your Google Sheets schedule on your behalf.</p>
                <h3>c. Service Improvement:</h3>
                <p>We may analyze usage patterns and trends to improve our services, troubleshoot issues, and enhance user experience.</p>

                <h2>4. Information Sharing and Disclosure</h2>
                <h3>a. Third-Party Service Providers:</h3>
                <p>
                    We may share your information with third-party service providers who assist us in providing and improving our services. These providers are bound by confidentiality obligations and are prohibited from using your information for any purpose other than to provide services on our behalf.
                </p>
                <h3>b. Legal Compliance:</h3>
                <p>We may disclose your information if required by law, court order, or governmental authority.</p>

                <h2>5. Your Choices</h2>
                <h3>a. Account Information:</h3>
                <p>Because you logged in with Google, you can review and update your account information, including removing Activisor&apos;s access, through your Google Account Management.</p>
                <h3>b. Data Access and Deletion:</h3>
                <p>We do not store your personal information on our servers. You may contact us at help@activisor.com regarding the personal information we collected in order to create your schedule.</p>

                <h2>6. Security</h2>
                <p>
                    We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>

                <h2>7. Changes to This Privacy Policy</h2>
                <p>
                    We may update this Privacy Policy to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page.
                </p>

                <h2>8. Contact Us</h2>
                <p>
                    If you have any questions or concerns about this Privacy Policy, please contact us at help@activisor.com
                </p>
                <p>Thank you for using Activisor!</p>
            </div>
        </main>
    );
}