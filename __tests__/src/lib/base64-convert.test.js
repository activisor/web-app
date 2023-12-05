import { EmailExtract } from '@/lib/email-extract';
import { Participant } from '@/lib/participant';
import { encode, decode } from '@/lib/base64-convert';

const emailExtract = {
  participants: [
    {
      name: 'Art Test',
      email: 'art@test.com',
      id: 1
    },
    {
      name: 'Betty Test',
      email: 'betty@test.com',
      id: 2
    },
  ],
  sender: {
    name: 'Sender',
    email: 'sender@test.com',
  },
  subject: 'Test Subject',
};

test('encodes and decodes email extract', () => {
  const encoded = encode(emailExtract);
  console.log(`encoded: ${encoded}`);

  const decoded = decode(encoded);
  expect(decoded).toEqual(emailExtract);
});
