import { SendGridEmailExtractor } from '@/lib/email/sendgrid-email-extractor';

test('should extract sender with name and email correctly', () => {
  const sut = new SendGridEmailExtractor();
  const mockFormData = new FormData();
  mockFormData.append('from', ' FIRST middle NAME-LAST <test@example.com> ');

  const result = sut.extract(mockFormData);

  expect(result.sender).toEqual({ email: 'test@example.com', name: 'First Middle Name-Last' });
});

test('should extract sender with only email correctly', () => {
  const sut = new SendGridEmailExtractor();
  const mockFormData = new FormData();
  mockFormData.append('from', ' test@example.com ');

  const result = sut.extract(mockFormData);

  expect(result.sender).toEqual({ email: 'test@example.com', name: '' });
});

test('should extract subject', () => {
  const sut = new SendGridEmailExtractor();
  const mockFormData = new FormData();
  mockFormData.append('subject', ' Test Subject ');

  const result = sut.extract(mockFormData);

  expect(result.subject).toBe('Test Subject');
});

test('should extract cc', () => {
  const sut = new SendGridEmailExtractor();
  const mockFormData = new FormData();
  mockFormData.append('from', 'test@example.com');
  mockFormData.append('cc', 'First CC <cc1@example.com>, cc2@example.com');

  const result = sut.extract(mockFormData);
  expect(result.participants).toEqual([
    { email: 'test@example.com', name: '' },
    { email: 'cc1@example.com', name: 'First Cc' },
    { email: 'cc2@example.com', name: '' },
  ]);
});

/*
test('should extract sender without name', () => {
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
