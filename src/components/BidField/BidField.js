import useAsyncReference from '@/lib/useAsyncReference';
import BidRow from '@/components/BidRow';

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

  return (
    <>
      {playersData && playersData.length > 0 && (
        <ul
          role='list'
          className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4'
        >
          {playersData.map((p) => {
            return (
              <BidRow
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
      )}
    </>
  );
};

export default BidField;
