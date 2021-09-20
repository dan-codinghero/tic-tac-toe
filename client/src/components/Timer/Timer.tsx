import React, { FC, Fragment } from 'react';
import useTimer, { TimerProps } from './hooks/useTimer';

type TimerComponentProps = TimerProps & {
    render: (time: number, cancelTimer: () => void) => any;
};
const Timer: FC<TimerComponentProps> = (timerProps) => {
    const { time, cancelTimer } = useTimer(timerProps);
    return <Fragment>{timerProps.render(time, cancelTimer)}</Fragment>;
};

export default Timer;
