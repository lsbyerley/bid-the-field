import { getOwnerWinningBids, getPlayerFromBid } from '../../util/auctionUtils';

const OwnerWinningBids = ({ bids = [], session = {}, playersData }) => {
  const winningBids = getOwnerWinningBids(bids, session?.user?.email);
  const totalBidAmount = winningBids.reduce(
    (previousValue, currentValue) => previousValue + currentValue.amount,
    0
  );

  return (
    <div className='card bg-base-200'>
      <div className='card-body'>
        <div className='card-title'>Your Winning Bids ${totalBidAmount}</div>
        <ul role='list' className='divide-y divide-gray-200'>
          {winningBids.map((bid) => (
            <li key={bid.id} className='px-6 py-4'>
              <span>${bid.amount}</span>
              <span className='ml-4'>
                {getPlayerFromBid(playersData, bid.player_id)}
              </span>
            </li>
          ))}
          {!winningBids ||
            (!winningBids?.length && (
              <li className='px-6 py-4'>
                <span className='text-red-500'>no winning bids</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default OwnerWinningBids;
