import { compareName } from '@/lib/sheets/compare-name';

const participantFullATest = {
  email: 'a@test.com',
  name: 'a Test',
  isHalfShare: false
}

const participantFullBTest = {
  email: 'b@test.com',
  name: 'B test',
  isHalfShare: false
}

const participantFullTBest = {
  email: 'b@test.com',
  name: 'T Best',
  isHalfShare: false
}

const participantPartATest = {
  email: 'a@test.com',
  name: 'A Test',
  isHalfShare: true
}

const participantPartBTest = {
  email: 'b@test.com',
  name: 'b Test',
  isHalfShare: true
}

// verify ordering by half/full share, then alphabetically by first name

test('compare first name, full participation', () => {
  expect(compareName(participantFullATest, participantFullBTest)).toBe(-1);
});

test('compare last name, full participation', () => {
  expect(compareName(participantFullBTest, participantFullTBest)).toBe(-1);
});

test('compare full and half participation', () => {
  expect(compareName(participantFullBTest, participantPartATest)).toBe(-1);
});

test('compare half participation', () => {
  expect(compareName(participantPartBTest, participantPartATest)).toBe(1);
});