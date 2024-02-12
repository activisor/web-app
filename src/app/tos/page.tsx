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
                    marginTop: 16
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
                <h1>Terms of Service for Activisor</h1>
                <p css={{ fontStyle: 'italic' }}>Last Updated: December 1, 2023</p>
                <p>
                    By accessing and using Activisor, you agree to comply with and be bound by the following Terms of Service. If you do not agree with these terms, please do not use our services.
                </p>

                <h2>1. Acceptance of Terms</h2>
                <p>
                    a. By using Activisor, you agree to be bound by these Terms of Service, our Privacy Policy, and any other guidelines or rules posted on our website.
                </p>
                <p>
                    b. If you are using our services on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms of Service.
                </p>

                <h2>2. Description of Service</h2>
                <p>
                    Activisor provides a web-based service that utilizes Google OAuth2 for user authentication and authorization to create and manage Google Sheets on behalf of users.
                </p>

                <h2>3. User Accounts and Registration</h2>
                <p>
                    a. To access certain features of our service, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process.
                </p>
                <p>
                    b. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately if you become aware of any unauthorized use of your account.
                </p>

                <h2>4. Use of the Service</h2>
                <p>
                    a. You agree to use Activisor only for lawful purposes and in accordance with these Terms of Service and applicable laws and regulations.
                </p>
                <p>
                    b. You will not use our service to engage in any conduct that could harm the reputation of Activisor or interfere with the proper functioning of the service.
                </p>

                <h2>5. Intellectual Property Rights</h2>
                <p>
                    a. Activisor and its logo are trademarks owned by [Your Company Name]. All other trademarks, service marks, graphics, and logos used in connection with our service are the trademarks of their respective owners.
                </p>
                <p>
                    b. You retain ownership of any intellectual property rights in the content you create using our service.
                </p>

                <h2>6. Limitation of Liability</h2>
                <p>
                    a. Activisor is provided `&quot;`as is`&quot;` and `&quot;`as available`&quot;` without any warranties, expressed or implied.
                </p>
                <p>
                    b. In no event shall [Your Company Name] be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of Activisor.
                </p>

                <h2>7. Termination</h2>
                <p>
                    We reserve the right to suspend or terminate your access to Activisor at any time, with or without cause, and with or without notice.
                </p>

                <h2>8. Changes to Terms of Service</h2>
                <p>
                    We reserve the right to modify or replace these Terms of Service at any time. The most current version will always be available on our website.
                </p>

                <h2>9. Governing Law</h2>
                <p>
                    These Terms of Service shall be governed by and construed in accordance with the laws of the United States of America.
                </p>

                <h2>10. Contact Us</h2>
                <p>
                    If you have any questions or concerns about these Terms of Service, please contact us at help@activisor.com
                </p>
                <p>Thank you for using Activisor!</p>
            </div>
        </main>
    );
}