import { CalendarIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import useAsyncReference from '@/lib/useAsyncReference';

const EndDateCard = ({ auction, auctionOver }) => {
  const asyncAuction = useAsyncReference(auction, true);

  return (
    <div className='rounded-lg card compact bg-base-100'>
      <div className='relative justify-center card-body'>
        {auctionOver && (
          <div className='absolute badge badge-error badge-outline top-5 right-5'>
            Bidding Over
          </div>
        )}
        {!auctionOver && (
          <div className='absolute badge badge-success badge-outline top-5 right-5'>
            In Progress
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
              <dt className='text-sm font-medium truncate'>End Date</dt>
              <dd>
                <div className='font-medium '>
                  {format(
                    new Date(asyncAuction.current.end_date),
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

export default EndDateCard;
