import { getTotalPot } from '../../lib/auctionUtils';
import useAsyncReference from '../../lib/useAsyncReference';

const TotalPot = ({ bids = [] }) => {
  const asyncBids = useAsyncReference(bids, true);
  const totalPotAmount = getTotalPot(asyncBids.current);

  return (
    <div className='mb-5 rounded-lg card card-compact bg-base-200'>
      <div className='card-body'>
        <h3 className='text-lg font-medium'>
          <span className='mr-2 text-sm'>Total Pot:</span>
          <span className='text-success'>
            ${Number.parseFloat(totalPotAmount).toFixed(2)}
          </span>
        </h3>
      </div>
    </div>
  );
};

export default TotalPot;
