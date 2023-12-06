import { SendGridEmailSpamValidator } from '@/lib/email/sendgrid-email-spam-validator';

test('should return false if spam_score >= 5', async () => {
  const sut = new SendGridEmailSpamValidator();
  const mockFormData = new FormData();
  mockFormData.append('spam_score', '5.0');
  mockFormData.append('dkim', '{@test.com : pass}');
  mockFormData.append('SPF', 'pass');

  const result = sut.validate(mockFormData);

  expect(result).toBe(false);
});

test('should return false if dkim did not pass', async () => {
  const sut = new SendGridEmailSpamValidator();
  const mockFormData = new FormData();
  mockFormData.append('spam_score', '4.9');
  mockFormData.append('dkim', '{@test.com : fail}');
  mockFormData.append('SPF', 'pass');

  const result = sut.validate(mockFormData);

  expect(result).toBe(false);
});


test('should return false if SPF did not pass', async () => {
  const sut = new SendGridEmailSpamValidator();
  const mockFormData = new FormData();
  mockFormData.append('spam_score', '4.9');
  mockFormData.append('dkim', '{@test.com : pass}');
  mockFormData.append('SPF', 'fail');

  const result = sut.validate(mockFormData);

  expect(result).toBe(false);
});

test('should return true if all fields pass', async () => {
  const sut = new SendGridEmailSpamValidator();
  const mockFormData = new FormData();
  mockFormData.append('spam_score', '4.9');
  mockFormData.append('dkim', '{@test.com : pass}');
  mockFormData.append('SPF', 'pass');

  const result = sut.validate(mockFormData);

  expect(result).toBe(true);
});
