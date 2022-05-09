import { getAuctionResults, getPlayerFromBid } from '../../../lib/auctionUtils';

const Results = ({ bids = [], players = [] }) => {
  const auctionResults = getAuctionResults(bids);

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
      {Object.keys(auctionResults).map((owner) => {
        const ownerResults = auctionResults[owner];
        const totalBidAmount = ownerResults.reduce(
          (total, bid) => total + bid.amount,
          0
        );
        return (
          <div
            key={owner}
            className='rounded-lg md:row-span-3 card card-compact bg-base-200'
          >
            <div className='card-body'>
              <div>
                <div className='flex justify-between pb-2 mb-4 text-lg font-medium border-b'>
                  <span className='mr-2 text-lg truncate text-info'>
                    {owner}
                  </span>
                  <span className='text-success'>
                    ${Number.parseFloat(totalBidAmount).toFixed(2)}
                  </span>
                </div>
                <dl className='mt-2 divide-y'>
                  {ownerResults.map((bid) => (
                    <div
                      key={bid.id}
                      className='flex justify-between py-3 text-sm font-medium'
                    >
                      <dt className=''>
                        {getPlayerFromBid(players, bid.player_id)}
                      </dt>
                      <dd className=''>
                        ${Number.parseFloat(bid.amount).toFixed(2)}
                      </dd>
                    </div>
                  ))}
                  {!ownerResults ||
                    (!ownerResults?.length && (
                      <div className='px-2 py-3'>
                        <dt className=''>no winning bids</dt>
                      </div>
                    ))}
                </dl>
              </div>
            </div>
          </div>
        );
      })}
      {!Object.keys(auctionResults)?.length && (
        <div className='shadow-lg alert'>
          <div>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='flex-shrink-0 w-6 h-6 stroke-current'
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
            <span>No auction results! code: 89</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
