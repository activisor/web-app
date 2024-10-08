import { encode, decode } from '@/lib/base64-convert';

const emailExtract /*: EmailExtract */ = {
  participants: [
    {
      name: 'Art Test',
      email: 'art@test.com',
//
      isSender: true,
    },
    {
      name: 'Betty Test',
      email: 'betty@test.com',
//      id: 2
    },
  ],
  sender: {
    name: 'Sender',
    email: 'sender@test.com',
    isSender: true,
  },
  subject: 'Test Subject',
};

test('encodes and decodes EmailExtract', () => {
  const encoded = encode(emailExtract);
  console.log(`encoded: ${encoded}`);

  const decoded = decode(encoded);
  expect(decoded).toEqual(emailExtract);
});

test('encodes and decodes EmailExtract', () => {
  const encoded = encode(emailExtract);
  console.log(`encoded: ${encoded}`);

  const decoded = decode(encoded);
  expect(decoded).toEqual(emailExtract);
});

test('decode empty string', () => {
  const decoded = decode('');
  expect(decoded).toEqual('');
});
