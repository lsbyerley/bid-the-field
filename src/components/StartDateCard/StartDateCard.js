import { CalendarIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';
import useAsyncReference from '@/lib/useAsyncReference';

const StartDateCard = ({ auction, auctionStarted }) => {
  const asyncAuction = useAsyncReference(auction, true);

  return (
    <div className='rounded-lg card compact bg-base-100'>
      <div className='justify-center card-body'>
        {!auctionStarted && (
          <div className='absolute badge badge-warning badge-outline top-5 right-5'>
            Not Started
          </div>
        )}
        <div className='flex items-center'>
          <div className='flex-shrink-0'>
            <CalendarIcon
              className='w-6 h-6 text-gray-400'
              aria-hidden='true'
            />
          </div>
          <div className='flex-1 w-0 ml-5'>
            <dl>
              <dt className='text-sm font-medium truncate'>Start Date</dt>
              <dd>
                <div className='font-medium '>
                  {format(
                    new Date(asyncAuction.current.start_date),
                    'LLL d, h:mm aaa'
                  )}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartDateCard;
