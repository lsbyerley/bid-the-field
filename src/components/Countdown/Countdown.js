import { useCountdown } from 'rooks';
import { secondsToHours, secondsToMinutes } from 'date-fns';

const Countdown = ({ auction = {}, setAuctionOver = () => {} }) => {
  const endTime = new Date(auction.end_date);

  const seconds = useCountdown(endTime, {
    interval: 1000,
    // onDown: (time) => console.log('onDown', time),
    onEnd: () => setAuctionOver(true),
  });

  if (seconds === 0) {
    // return null;
  }

  const hours = secondsToHours(seconds);
  const minutes = secondsToMinutes(seconds);

  const getHoursText = (hours) => {
    const hourText = hours > 1 ? 'hours' : 'hour';

    return (
      <span className='text-info'>
        ~{hours} {hourText}
      </span>
    );
  };

  const getMinutesText = (minutes) => {
    const minutesText = minutes > 1 ? 'minutes' : 'minute';
    return (
      <span className='text-success'>
        ~{minutes} {minutesText}
      </span>
    );
  };

  const getSecondsText = (seconds) => {
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

  return (
    <div className='mb-5 rounded-lg card card-compact bg-base-200'>
      <div className='items-center justify-center card-body'>
        <h3 className='text-lg font-medium '>
          {hours >= 1 && getHoursText(hours)}
          {minutes <= 59 && minutes >= 2 && getMinutesText(minutes)}
          {seconds <= 119 && getSecondsText(seconds)}
          <span className='text-sm'>&nbsp;remaining</span>
        </h3>
      </div>
    </div>
  );
};

export default Countdown;
