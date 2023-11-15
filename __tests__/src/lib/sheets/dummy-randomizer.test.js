import { DummyRandomizer } from '@/lib/sheets/dummy-randomizer';

test('fills dummy schedule', () => {
  const periods = 2;
  const groupSize = 3;
  const participants = [
    {
      email: 'a@test.com',
      name: 'A Test',
    },
    {
      email: 'b@test.com',
      name: 'B Test',
    },
    {
      email: 'c@test.com',
      name: 'C Test',
    },
    {
      email: 'd@test.com',
      name: 'D Test',
    }
  ];
  const sut = new DummyRandomizer();
  const result = sut.randomize(periods, groupSize, participants);

  expect(result).not.toBeNull();
  expect(result.participants[2].email).toBe(participants[2].email);
  expect(result.participants[2].name).toBe(participants[2].name);
  expect(result.schedule.length).toBe(periods);
  expect(result.schedule[0].length).toBe(groupSize);
  expect(result.schedule[1][2].email).toBe(participants[2].email);
});