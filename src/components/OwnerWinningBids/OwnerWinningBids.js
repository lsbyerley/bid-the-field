import { getOwnerWinningBids, getPlayerFromBid } from '@/lib/auctionUtils';
import useAsyncReference from '@/lib/useAsyncReference';

const OwnerWinningBids = ({ bids = [], user = {}, players = [] }) => {
  const asyncBids = useAsyncReference(bids, true);
  const winningBids = getOwnerWinningBids(asyncBids.current, user?.id);
  const totalBidAmount = winningBids.reduce(
    (previousValue, currentValue) => previousValue + currentValue.amount,
    0
  );

  return (
    <div className='rounded-lg md:row-span-3 card card-compact bg-base-100'>
      <div className='card-body'>
        <div>
          <div className='flex justify-between pb-2 mb-4 text-lg font-medium border-b'>
            <span className='mr-2 truncate text-info'>Your Winning Bids</span>
            <span className='text-success'>
              ${Number.parseFloat(totalBidAmount).toFixed(2)}
            </span>
          </div>

          <dl className='mt-2 overflow-y-scroll divide-y max-h-72'>
            {winningBids.map((bid) => {
              const player = getPlayerFromBid(players, bid.player_id);
              return (
                <div
                  key={bid.id}
                  className='flex justify-between py-3 text-sm font-medium'
                >
                  <dt className=''>
                    {player?.full_name ||
                      player?.short_name ||
                      `na:${bid.player_id}`}
                  </dt>
                  <dd className=''>
                    ${Number.parseFloat(bid.amount).toFixed(2)}
                  </dd>
                </div>
              );
            })}
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
