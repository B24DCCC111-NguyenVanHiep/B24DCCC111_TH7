import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Card } from 'antd';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface TaskCalendarProps {
  events: Array<{
    title: string;
    start: Date;
    end: Date;
    resource: unknown;
  }>;
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ events }) => (
  <Card>
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </Card>
);

export default TaskCalendar;
