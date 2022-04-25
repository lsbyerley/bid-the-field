import { getOwnerWinningBids, getPlayerFromBid } from '../../util/auctionUtils';
import useAsyncReference from '../../util/useAsyncReference';

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
    <div className='card card-compact bg-base-200'>
      <div className='card-body'>
        <div className='card-title'>Your Winning Bids ${totalBidAmount}</div>
        <ul role='list' className='divide-y divide-gray-200'>
          {winningBids.map((bid) => (
            <li key={bid.id} className='px-2 py-3'>
              <span>${bid.amount}</span>
              <span className='ml-4'>
                {getPlayerFromBid(playersData, bid.player_id)}
              </span>
            </li>
          ))}
          {!winningBids ||
            (!winningBids?.length && (
              <li className='px-2 py-3'>
                <span className='text-red-500'>no winning bids</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default OwnerWinningBids;
