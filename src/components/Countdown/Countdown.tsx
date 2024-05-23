import { useCountdown } from 'rooks';
import { secondsToHours, secondsToMinutes } from 'date-fns';

import type { CountdownProps } from '@/types';

const Countdown = ({
  auction,
  auctionStarted,
  setAuctionStarted = () => {},
  // auctionOver,
  setAuctionOver = () => {},
}: CountdownProps) => {
  const startTime = new Date(auction.start_date);
  const endTime = new Date(auction.end_date);

  const timeToUse = !auctionStarted ? startTime : endTime;
  const funcToCallOnEnd = !auctionStarted ? setAuctionStarted : setAuctionOver;

  const seconds = useCountdown(timeToUse, {
    interval: 1000,
    onEnd: () => funcToCallOnEnd(true),
  });

  const hours = secondsToHours(seconds);
  const minutes = secondsToMinutes(seconds);

  const getHoursText = (hours: number) => {
    const hourText = hours > 1 ? 'hours' : 'hour';

    return (
      <span className='text-info'>
        ~{hours} {hourText}
      </span>
    );
  };

  const getMinutesText = (minutes: number) => {
    const minutesText = minutes > 1 ? 'minutes' : 'minute';
    return (
      <span className='text-success'>
        ~{minutes} {minutesText}
      </span>
    );
  };

  const getSecondsText = (seconds: number) => {
    const secondsText = seconds > 1 ? 'seconds' : 'second';
    return (
      <span className='text-warning'>
        {seconds === 0 && <>No time</>}
        {seconds > 0 && (
          <>
            {seconds} {secondsText}
          </>
        )}
      </span>
    );
  };

  /*if (!auctionStarted) {
    return (
      <div className='rounded-lg card card-compact bg-base-200'>
        <div className='items-center justify-center card-body'>
          <h3 className='text-lg font-medium '>
            <span className='text-info'>not started</span>
          </h3>
        </div>
      </div>
    );
  }*/

  return (
    <div className='rounded-lg card card-compact bg-base-100'>
      <div className='items-center justify-center card-body'>
        <h3 className='text-lg font-medium '>
          {hours >= 1 && getHoursText(hours)}
          {minutes <= 59 && minutes >= 2 && getMinutesText(minutes)}
          {seconds <= 119 && getSecondsText(seconds)}
          {!auctionStarted && (
            <span className='text-sm'>&nbsp;until start</span>
          )}
          {auctionStarted && <span className='text-sm'>&nbsp;remaining</span>}
        </h3>
      </div>
    </div>
  );
};

export default Countdown;
