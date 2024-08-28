import { Randomizer } from '@/lib/sheets/randomizer';
import { pairsVariance } from '@/analytics/pairs-variance';

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

/**
 * criteria: randomization from event to event, variance in periodicity
 */
test('schedule - 8 periods, 4 participants, groups of 3', () => {
    console.log('schedule - 8 periods, 4 participants, groups of 3');
    const devarianceCoef = 0.01;
    const periods = 8;
    const groupSize = 3;

    const sut = new Randomizer(devarianceCoef);
    const result = sut.randomize(periods, groupSize, participants);
    console.log(JSON.stringify(result.participants));
    expect(result.participants.length).toBe(participants.length);

    for (let i = 0; i < result.schedule.length; i++) {
        const row = result.schedule[i];
        console.log(`row ${i}: ${row.map(p => p.name).join(', ')}`);
    }

    const variance = pairsVariance(result);
    console.log(`variance: ${variance}`);
});

test('schedule - 8 periods, 4 participants, 2 part time, groups of 3', () => {
    console.log('schedule - 8 periods, 4 participants, 2 part time, groups of 3');
    participants[0].isHalfShare = true;
    participants[1].isHalfShare = true;
    const devarianceCoef = 0.01;
    const periods = 8;
    const groupSize = 3;

    const sut = new Randomizer(devarianceCoef);
    const result = sut.randomize(periods, groupSize, participants);
    console.log(JSON.stringify(result.participants));
    expect(result.participants.length).toBe(participants.length);

    for (let i = 0; i < result.schedule.length; i++) {
        const row = result.schedule[i];
        console.log(`row ${i}: ${row.map(p => p.name).join(', ')}`);
    }

    const variance = pairsVariance(result);
    console.log(`variance: ${variance}`);
});

test('schedule - 5 periods, 4 participants, groups of 3', () => {
    console.log('schedule - 5 periods, 4 participants, groups of 3');
    const devarianceCoef = 0.01;
    const periods = 5;
    const groupSize = 3;

    const sut = new Randomizer(devarianceCoef);
    const result = sut.randomize(periods, groupSize, participants);
    console.log(JSON.stringify(result.participants));
    expect(result.participants.length).toBe(participants.length);

    for (let i = 0; i < result.schedule.length; i++) {
        const row = result.schedule[i];
        console.log(`row ${i}: ${row.map(p => p.name).join(', ')}`);
    }

    const variance = pairsVariance(result);
    console.log(`variance: ${variance}`);
});