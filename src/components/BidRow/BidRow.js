import { useState } from 'react';
import { CashIcon } from '@heroicons/react/outline';
import { getPlayerHighestBid } from '../../lib/auctionUtils';
import useAsyncReference from '../../lib/useAsyncReference';
import BidModal from '../BidModal';

const BidRow = ({
  player = {},
  bids = [],
  biddingDisabled = false,
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
    onSubmitBid(tenPercentIncrease, player.id);
  };

  return (
    <li key={player.id} className='col-span-1 rounded-lg shadow bg-base-200'>
      <div className='flex md:block'>
        <div className='flex items-center justify-between w-full p-3 space-x-6'>
          <div className='flex-1 truncate'>
            <div className='flex items-center space-x-3'>
              <span className='flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full'>
                ${highestBid?.amount || 0}
              </span>
              <h3 className='font-medium truncate'>{player.short_name}</h3>
            </div>
            <p className='mt-4 text-xs truncate'>{highestBid?.owner || '-'}</p>
          </div>
        </div>
        <div className='block p-3 md:flex md:justify-around md:items-center'>
          <button
            disabled={biddingDisabled || isOpen}
            onClick={() => openBidModal()}
            className='w-full btn btn-xs btn-ghost md:w-auto'
          >
            <CashIcon className='w-5 h-5 ' aria-hidden='true' />
            <span className='ml-1'>Bid</span>
          </button>
          <button
            disabled={biddingDisabled || isOpen || !highestBid?.amount}
            onClick={() => submitTenPercentBid(player, highestBid)}
            className='w-full btn btn-xs btn-ghost md:w-auto'
          >
            <span className='ml-1'>Bid 10%</span>
          </button>
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
