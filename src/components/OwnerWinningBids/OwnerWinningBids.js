import { getOwnerWinningBids, getPlayerFromBid } from '../../lib/auctionUtils';
import useAsyncReference from '../../lib/useAsyncReference';

const OwnerWinningBids = ({ bids = [], session = {}, playersData }) => {
  const asyncBids = useAsyncReference(bids, true);
  const winningBids = getOwnerWinningBids(
    asyncBids.current,
    session?.user?.email
  );
  const totalBidAmount = winningBids.reduce(
    (previousValue, currentValue) => previousValue + currentValue.amount,
    0
  );

  return (
    <div className='rounded-lg card card-compact bg-base-200'>
      <div className='card-body'>
        <div>
          <h3 className='text-lg font-medium'>
            <span className='mr-2 text-sm'>Your Winning Bids:</span>
            <span className='text-success'>
              ${Number.parseFloat(totalBidAmount).toFixed(2)}
            </span>
          </h3>
          <dl className='mt-2 border-t border-b border-gray-200 divide-y divide-gray-200'>
            {winningBids.map((bid) => (
              <div
                key={bid.id}
                className='flex justify-between py-3 text-sm font-medium'
              >
                <dt className=''>
                  {getPlayerFromBid(playersData, bid.player_id)}
                </dt>
                <dd className=''>${bid.amount}</dd>
              </div>
            ))}
            {!winningBids ||
              (!winningBids?.length && (
                <div className='px-2 py-3'>
                  <dt className='text-warning'>no winning bids</dt>
                </div>
              ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default OwnerWinningBids;
