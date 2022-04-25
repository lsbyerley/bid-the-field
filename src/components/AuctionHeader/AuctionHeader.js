import { ScaleIcon, CalendarIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';
import useAsyncReference from '../../util/useAsyncReference';
import { useAppContext } from '../../AppContext';

const AuctionHeader = ({ auction, auctionOver }) => {
  const asyncAuction = useAsyncReference(auction, true);
  const { setModalOpen, setModalContent } = useAppContext();

  const openRulesModal = () => {
    setModalContent(auction.rules);
    setModalOpen(true);
  };

  const openPayoutsModal = () => {
    setModalContent(auction.payouts);
    setModalOpen(true);
  };

  return (
    <div className='grid max-w-6xl grid-cols-1 gap-5 px-2 mx-auto mt-8 lg:max-w-7xl sm:grid-cols-2 lg:grid-cols-4'>
      <div className='card compact bg-base-200'>
        <div className='justify-center card-body'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <ScaleIcon className='w-6 h-6 text-gray-400' aria-hidden='true' />
            </div>
            <div className='flex-1 w-0 ml-5'>
              <dl>
                <dt className='text-sm font-medium truncate'>Auction</dt>
                <dd>
                  <div className='font-medium'>{asyncAuction.current.name}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <div className='card compact bg-base-200'>
        <div className='justify-center card-body'>
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
      <div className='card compact bg-base-200'>
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
      <div className='card compact bg-base-200'>
        <div className='justify-center card-body'>
          {auction.rules && (
            <button
              className='btn btn-ghost btn-sm'
              onClick={() => openRulesModal()}
            >
              Rules
            </button>
          )}
          {auction.payouts && (
            <button
              className='btn btn-ghost btn-sm'
              onClick={() => openPayoutsModal()}
            >
              Payouts
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionHeader;
