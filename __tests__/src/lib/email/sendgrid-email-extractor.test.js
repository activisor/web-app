import { SendGridEmailExtractor } from '@/lib/email/sendgrid-email-extractor';
import test from 'node:test';

const schedulerEmail = 'scheduler@example.com';
const sut = new SendGridEmailExtractor(schedulerEmail);

test('should extract sender with name and email correctly', () => {
  const mockFormData = new FormData();
  mockFormData.append('from', ' FIRST middle NAME-LAST <test@example.com> ');

  const result = sut.extract(mockFormData);

  expect(result.sender).toEqual({ email: 'test@example.com', name: 'First Middle Name-Last' });
});

test('should extract sender with only email correctly', () => {
  const mockFormData = new FormData();
  mockFormData.append('from', ' test@example.com ');

  const result = sut.extract(mockFormData);

  expect(result.sender).toEqual({ email: 'test@example.com', name: '' });
});

test('should extract subject', () => {
  const mockFormData = new FormData();
  mockFormData.append('subject', ' Test Subject ');

  const result = sut.extract(mockFormData);

  expect(result.subject).toBe('Test Subject');
});

test('should extract CC participants, excluding scheduler email', () => {
  const mockFormData = new FormData();
  mockFormData.append('from', 'test@example.com');
  mockFormData.append('cc', `First CC <cc1@example.com>, cc2@example.com, Scheduler <${schedulerEmail}>`);

  const result = sut.extract(mockFormData);
  expect(result.participants).toEqual([
    { email: 'test@example.com', name: '' },
    { email: 'cc1@example.com', name: 'First Cc' },
    { email: 'cc2@example.com', name: '' },
  ]);
});

test('should extract To participants, excluding scheduler email', () => {
  const mockFormData = new FormData();
  mockFormData.append('from', 'test@example.com');
  mockFormData.append('to', `Scheduler <${schedulerEmail}>, Second To <to@example.com>`);
  const result = sut.extract(mockFormData);
  expect(result.participants).toEqual([
    { email: 'test@example.com', name: '' },
    { email: 'to@example.com', name: 'Second To' },
  ]);
});

test('should extract participants from text, excluding scheduler email', () => {
  const sender = 'Sender <sender@example.com>';
  const participant2 = 'Participant 2 <p2@example.com>';
  const participant3 = 'Participant 3 <p3@example.com>';
  const participant4_1 = 'Participant 4 <';
  const participant4_2 = 'p4@example.com>';
  const particpant5 = 'p5@example.com';

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
Cc: ${particpant5}
text body
  `);

  const result = sut.extract(mockFormData);

  expect(result.participants).toEqual([
    { email: 'sender@example.com', name: 'Sender' },
    { email: 'p2@example.com', name: 'Participant 2' },
    { email: 'p3@example.com', name: 'Participant 3' },
    { email: 'p4@example.com', name: 'Participant 4' },
    { email: 'p5@example.com', name: '' },
  ]);
});
/*
test('should remove duplicate participants', () => {
  const sut = new SendGridEmailExtractor();
  const mockFormData = new FormData();
  mockFormData.append('from', 'test@example.com');
  mockFormData.append('subject', 'Test Subject');
  mockFormData.append('cc', 'cc1@example.com,cc2@example.com');
  mockFormData.append('to', 'to1@example.com,to2@example.com');

  const result = sut.extract(mockFormData);

  expect(result.sender.email).toEqual('test@example.com');
});

    it('should extract participants correctly', () => {
      const mockFormData = new FormData();
      mockFormData.append('from', 'TEST NAME <test@example.com>');
      mockFormData.append('fromname', 'Test Sender');
      mockFormData.append('subject', 'Test Subject');
      mockFormData.append('cc', 'cc1@example.com,cc2@example.com');
      mockFormData.append('to', 'to1@example.com,to2@example.com');

      const result = extractor.extract(mockFormData);

      expect(result.sender).toEqual({ email: 'test@example.com', name: 'Test Sender' });
      expect(result.subject).toBe('Test Subject');
      expect(result.participants).toEqual([
          { email: 'cc1@example.com', name: 'cc1@example.com' },
          { email: 'cc2@example.com', name: 'cc2@example.com' },
          { email: 'to1@example.com', name: 'to1@example.com' },
          { email: 'to2@example.com', name: 'to2@example.com' },
      ]);
  });*/
