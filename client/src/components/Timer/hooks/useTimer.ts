import { useCallback, useEffect, useRef, useState } from 'react';

export interface TimerProps {
    onEnd?: () => void;
    startValue: number;
    endValue?: number;
}

const useTimer = ({ startValue, endValue, onEnd }: TimerProps): { time: number; cancelTimer: () => void } => {
    const [time, setTime] = useState(startValue);
    const timerIdRef = useRef<number>();
    const onEndCallbackRef = useRef<() => void>();

    useEffect(() => {
        onEndCallbackRef.current = onEnd;
    }, [onEnd]);

    const cancelTimer = useCallback(() => {
        clearInterval(timerIdRef.current);
    }, []);

    useEffect(() => {
        if (startValue === endValue) return;

        timerIdRef.current = window.setInterval(() => {
            if (endValue === undefined || startValue < endValue) setTime((t) => t + 1);
            if (endValue !== undefined && startValue > endValue) setTime((t) => t - 1);
        }, 1000);

        const id = timerIdRef.current;
        return () => clearInterval(id);
    }, [startValue, endValue]);

    useEffect(() => {
        if (endValue !== undefined && time === endValue) {
            window.clearInterval(timerIdRef.current);
            onEndCallbackRef.current?.();
        }
    }, [time, endValue]);

    return { time, cancelTimer };
};

export default useTimer;
