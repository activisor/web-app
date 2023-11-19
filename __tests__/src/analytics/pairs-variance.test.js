/**
 * variance calc check
 * ref: https://docs.google.com/spreadsheets/d/1fH2lu_BvphQsTrUn5HnrlTTmG-gGmjgqG-9ian1BqEg/edit#gid=0
 */

import { variance, pairsVariance } from '@/analytics/pairs-variance';

test('zero variance', () => {
  const values = [ 1,1,1,1,1,1,1,1,1,1,1 ];
  const result = variance(values);
  expect(result).toBe(0);
});

test('variance', () => {
  const values = [ 1,2,3,4,5,6,7,8,9 ];
  const result = variance(values);
  expect(result).toBeCloseTo(6.667, 2);
});

test('verify zero pair variance', () => {
  const periods = 4;
  const groupSize = 3;

  const memberA =    {
      email: 'a@test.com',
      name: 'A Test',
      total: 3,
    };

  const memberB = {
    email: 'b@test.com',
    name: 'B Test',
    total: 3,
  };

  const memberC =     {
    email: 'c@test.com',
    name: 'C Test',
    total: 3,
  };

  const memberD = {
    email: 'd@test.com',
    name: 'D Test',
    total: 3,
  };

  const participants = [
    memberA,
    memberB,
    memberC,
    memberD,
  ];

  const schedule = [
    [memberA, memberB, memberC],
    [memberB, memberC, memberD],
    [memberA, memberC, memberD],
    [memberA, memberB, memberD],
  ]

  const participantMatrix = {
    participants,
    schedule,
  };

  const result = pairsVariance(participantMatrix);
  expect(result).toBeCloseTo(0.0, 2);
});