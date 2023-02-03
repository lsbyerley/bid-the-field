import { useMemo } from 'react';
import useAsyncReference from '@/lib/useAsyncReference';
import BidCard from '@/components/BidCard';
import { sortPlayersByHighestBid } from '@/lib/auctionUtils';

const BidField = ({
  sport,
  playersData = [],
  bids = [],
  biddingDisabled = false,
  disableTheField = false,
  onSubmitBid = () => {},
}) => {
  const asyncBids = useAsyncReference(bids, true);

  // TODO: sort players data by highest bid
  const sortedPlayersByBid = useMemo(
    () => sortPlayersByHighestBid(playersData, asyncBids.current),
    [asyncBids.current]
  );

  return (
    <>
      <ul
        role='list'
        className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4'
      >
        {sortedPlayersByBid.map((p) => {
          return (
            <BidCard
              sport={sport}
              key={p.id}
              player={p}
              bids={asyncBids.current}
              biddingDisabled={biddingDisabled}
              disableTheField={disableTheField}
              onSubmitBid={onSubmitBid}
            />
          );
        })}
      </ul>
    </>
  );
};

export default BidField;
