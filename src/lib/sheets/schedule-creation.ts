/**
 * interface for schedule creation
 */
import ScheduleData from '../schedule-data';
import ScheduleResult from './schedule-result';

interface ScheduleCreation {
    create: (scheduleData: ScheduleData) => ScheduleResult;
}

export default ScheduleCreation;