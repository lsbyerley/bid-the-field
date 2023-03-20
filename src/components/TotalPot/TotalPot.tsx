import { getTotalPot } from '@/lib/auctionUtils';
import useAsyncReference from '@/lib/useAsyncReference';

import { TotalPotArgs } from '@/types';

const TotalPot = ({ bids = [] }: TotalPotArgs) => {
  const asyncBids = useAsyncReference(bids, true);
  const totalPotAmount = getTotalPot(asyncBids.current);

  return (
    <div className='rounded-lg card card-compact bg-base-100'>
      <div className='items-center justify-center card-body'>
        <h3 className='text-lg font-medium'>
          <span className='mr-2 text-sm'>Total Pot:</span>
          <span className='text-success'>${totalPotAmount.toFixed(2)}</span>
        </h3>
      </div>
    </div>
  );
};

export default TotalPot;
