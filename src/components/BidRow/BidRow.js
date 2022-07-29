import { useState } from 'react';
import { CashIcon } from '@heroicons/react/outline';
import { getPlayerHighestBid } from '@/lib/auctionUtils';
import useAsyncReference from '@/lib/useAsyncReference';
import BidModal from '../BidModal';

const FIELD_PLAYER_ID = '999999';

const BidRow = ({
  player = {},
  bids = [],
  biddingDisabled = false,
  disableTheField = false,
  onSubmitBid = () => {},
}) => {
  const asyncBids = useAsyncReference(bids, true);
  const highestBid = getPlayerHighestBid(asyncBids.current, player.id);
  const [isOpen, setIsOpen] = useState(false);

  const openBidModal = () => {
    setIsOpen(true);
  };

  const submitTenPercentBid = (player, highestBid) => {
    const tenPercentIncrease = parseFloat(
      highestBid.amount * 0.1 + highestBid.amount
    ).toFixed(2);
    // TODO: change confirm to modal?
    if (
      confirm(
        `You have chosen a 10% increase on the highest bid for ${player.short_name}. Confirm you want to bid $${tenPercentIncrease}?`
      )
    ) {
      onSubmitBid(tenPercentIncrease, player.id);
    }
  };

  const isPartOfField =
    disableTheField && !highestBid?.amount && player?.id !== FIELD_PLAYER_ID;

  const disableTheFieldPlayer =
    !disableTheField && player?.id === FIELD_PLAYER_ID;

  return (
    <li key={player.id} className='col-span-1 rounded-lg shadow bg-base-100'>
      <div className='flex md:block'>
        <div className='flex items-center justify-between w-full p-3 space-x-6'>
          <div className='flex-1 truncate'>
            <div className='flex items-center space-x-3'>
              <span className='flex-shrink-0 inline-block px-2 py-0.5 text-base-100 text-sm font-medium bg-success rounded-full'>
                ${highestBid?.amount || 0}
              </span>
              <h3 className='font-medium truncate max-w-[12rem]'>
                {player.full_name}
              </h3>
            </div>
            <p className='mt-4 text-xs truncate max-w-[14rem]'>
              {highestBid?.profile?.name || highestBid?.profile?.email || '-'}
            </p>
          </div>
        </div>
        <div className='block p-3 md:flex md:justify-around md:items-center'>
          {isPartOfField && (
            <div className='badge badge-warning badge-outline'>Field</div>
          )}
          {!isPartOfField && (
            <>
              <button
                disabled={biddingDisabled || isOpen || disableTheFieldPlayer}
                onClick={() => openBidModal()}
                className='w-full btn btn-xs btn-ghost md:w-auto'
              >
                <CashIcon className='w-5 h-5 ' aria-hidden='true' />
                <span className='ml-1'>Bid</span>
              </button>
              <button
                disabled={
                  biddingDisabled ||
                  disableTheFieldPlayer ||
                  isOpen ||
                  !highestBid?.amount ||
                  highestBid?.amount < 10
                }
                onClick={() => submitTenPercentBid(player, highestBid)}
                className='w-full btn btn-xs btn-ghost md:w-auto'
              >
                <span className='ml-1'>Bid 10%</span>
              </button>
            </>
          )}
        </div>
      </div>
      <BidModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={onSubmitBid}
        player={player}
        highestBid={highestBid}
      />
    </li>
  );
};

export default BidRow;
