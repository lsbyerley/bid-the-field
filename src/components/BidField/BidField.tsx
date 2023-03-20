import { useMemo } from 'react';
import useAsyncReference from '@/lib/useAsyncReference';
import BidCard from '@/components/BidCard';
import { sortPlayersByHighestBid } from '@/lib/auctionUtils';

import type { BidFieldArgs, PlayerWithHighBid } from '@/types';

const BidField = ({
  sport,
  playersData = [],
  bids = [],
  biddingDisabled = false,
  disableTheField = false,
  onSubmitBid = () => {},
}: BidFieldArgs) => {
  const asyncBids = useAsyncReference(bids, true);

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
        {sortedPlayersByBid.map((p: PlayerWithHighBid) => {
          return (
            <BidCard
              sport={sport}
              key={p.id}
              player={p}
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
