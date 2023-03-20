import { ScaleIcon } from '@heroicons/react/24/outline';
import useAsyncReference from '@/lib/useAsyncReference';

import type { AuctionCardArgs } from '@/types';

const AuctionCard = ({ auction }: AuctionCardArgs) => {
  const asyncAuction = useAsyncReference(auction, true);

  return (
    <div className='rounded-lg card compact bg-base-100'>
      <div className='justify-center card-body'>
        <div className='flex items-center'>
          <div className='flex-shrink-0'>
            <ScaleIcon className='w-6 h-6 text-gray-400' aria-hidden='true' />
          </div>
          <div className='flex-1 w-0 ml-5'>
            <dl>
              <dt className='text-sm font-medium truncate'>Auction</dt>
              <dd>
                <div className='font-medium'>{asyncAuction.current.name}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
