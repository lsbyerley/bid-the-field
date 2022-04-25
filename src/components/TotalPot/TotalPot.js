import { getTotalPot } from '../../util/auctionUtils';
import useAsyncReference from '../../util/useAsyncReference';

const TotalPot = ({ bids = [] }) => {
  const asyncBids = useAsyncReference(bids, true);
  const totalPotAmount = getTotalPot(asyncBids);

  return (
    <div className='mb-5 card card-compact bg-base-200'>
      <div className='card-body'>
        <div className='card-title'>Total Pot ${totalPotAmount}</div>
      </div>
    </div>
  );
};

export default TotalPot;
