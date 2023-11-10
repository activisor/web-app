/**
 * DTO for schedule creation parameters
 */
import Participant from './participant';
import Frequency from './frequency';

interface ScheduleData {
    scheduleName: string;
    participants: Participant[];
    startDate: Date;
    endDate: Date;
    groupSize: number;
    frequency: Frequency;
}

export default ScheduleData;
