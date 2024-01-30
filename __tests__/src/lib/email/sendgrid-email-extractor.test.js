import { SendGridEmailExtractor } from '@/lib/email/sendgrid-email-extractor';

const schedulerDomain = 'mail.example.com';
const schedulerEmail = `scheduler@${schedulerDomain}`;
const sut = new SendGridEmailExtractor(schedulerDomain);

test('should extract sender with name and email correctly', () => {
  const mockFormData = new FormData();
  mockFormData.append('from', ' First Last <test@example.com> ');

  const result = sut.extract(mockFormData);

  expect(result.sender).toEqual({ email: 'test@example.com', name: 'First Last', isSender: true });
});

test('sender shouuld be in participants list', () => {
  const mockFormData = new FormData();
  mockFormData.append('from', ' First Last <test@example.com> ');

  const result = sut.extract(mockFormData);

  expect(result.participants).toEqual([
    { email: 'test@example.com', name: 'First Last', isSender: true  },
  ]);
});

test('should extract sender with only email correctly', () => {
  const mockFormData = new FormData();
  mockFormData.append('from', ' test@example.com ');

  const result = sut.extract(mockFormData);

  expect(result.sender).toEqual({ email: 'test@example.com', name: '', isSender: true  });
});

test('should extract subject', () => {
  const mockFormData = new FormData();
  mockFormData.append('from', 'test@example.com');
  mockFormData.append('subject', ' Test Subject ');

  const result = sut.extract(mockFormData);

  expect(result.subject).toBe('Test Subject');
});

test('should extract CC participants, excluding scheduler email', () => {
  const mockFormData = new FormData();
  mockFormData.append('from', 'test@example.com');
  mockFormData.append('cc', `First CC <cc1@example.com>, cc2@example.com, Scheduler <${schedulerEmail}>`);

  const result = sut.extract(mockFormData);
  expect(result.participants.length).toEqual(3);
  expect(result.participants[1]).toEqual({ email: 'cc1@example.com', name: 'First Cc' });
  expect(result.participants[2]).toEqual({ email: 'cc2@example.com', name: '' });
});

test('should extract To participants, excluding scheduler email', () => {
  const mockFormData = new FormData();
  mockFormData.append('from', 'test@example.com');
  mockFormData.append('to', `Scheduler <${schedulerEmail}>, ${schedulerEmail}, Second To <to@example.com>`);
  const result = sut.extract(mockFormData);

  expect(result.participants.length).toEqual(2);
  expect(result.participants[1]).toEqual({ email: 'to@example.com', name: 'Second To' });
});

test('should extract participants from forwarded text, excluding scheduler email', () => {
  const sender = 'Sender <sender@example.com>';
  const participant2 = 'Participant 2 <p2@example.com>';
  const participant3 = 'Participant 3 <p3@example.com>';
  const participant4_1 = 'Participant 4 <';
  const participant4_2 = 'p4@example.com>';
  const participant5 = 'p5@example.com';

  const mockFormData = new FormData();
  mockFormData.append('from', sender);
  mockFormData.append('text', `
  forwarding comment.

---------- Forwarded message ---------
From: ${participant2}
Date: Fri, Dec 1, 2023 at 8:52 AM
Subject: test forward subject
To: ${participant3}, ${participant4_1}
${participant4_2}, ${schedulerEmail}
Cc: ${participant5}
text body
  `);

  const result = sut.extract(mockFormData);

  expect(result.participants.length).toEqual(5);
  expect(result.participants[1]).toEqual({ email: 'p2@example.com', name: 'Participant 2' });
  expect(result.participants[2]).toEqual({ email: 'p3@example.com', name: 'Participant 3' });
  expect(result.participants[3]).toEqual({ email: 'p4@example.com', name: 'Participant 4' });
  expect(result.participants[4]).toEqual({ email: 'p5@example.com', name: '' });
});

test('should extract participants from text body', () => {
  const sender = 'Sender <sender@example.com>';
  const participant2 = 'p2@example.com';
  const participant3 = 'p3@example.com';
  const participant4 = 'p4@example.com';
  const participant5 = 'Participant 5 <p5@example.com>';

  const mockFormData = new FormData();
  mockFormData.append('from', sender);
  mockFormData.append('text', `
${participant2}
${participant3}, ${participant4}


---------- Forwarded message ---------
From: ${participant5}
Date: Fri, Dec 1, 2023 at 8:52 AM
Subject: test forward subject
To: ${schedulerEmail}
forwarded text body
  `);

  const result = sut.extract(mockFormData);

  expect(result.participants.length).toEqual(5);
  expect(result.participants[1]).toEqual({ email: 'p2@example.com', name: '' });
  expect(result.participants[2]).toEqual({ email: 'p3@example.com', name: '' });
  expect(result.participants[3]).toEqual({ email: 'p4@example.com', name: '' });
  expect(result.participants[4]).toEqual({ email: 'p5@example.com', name: 'Participant 5' })
});

test('should remove duplicate participants', () => {
  const mockFormData = new FormData();
  const sender = 'Sender <sender@example.com>';
  const participant2 = 'Participant 2 <p2@example.com>';

  mockFormData.append('from', sender);
  mockFormData.append('subject', 'Test Subject');
  mockFormData.append('cc', `${sender}, ${participant2}`);
  mockFormData.append('to', `${schedulerEmail}, ${participant2}`);
  mockFormData.append('text', `
From: ${sender}
To: ${participant2}
  `);

  const result = sut.extract(mockFormData);

  // sender, participant 2
  expect(result.participants.length).toEqual(2);
});
