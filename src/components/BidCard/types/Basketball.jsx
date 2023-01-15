import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

const BasketballBidCard = ({
  isOpen,
  player,
  highestBid,
  biddingDisabled,
  openBidModal,
  submitTenPercentBid,
  isPartOfField,
  disableTheFieldPlayer,
}) => {
  return (
    <div className='flex md:block'>
      <div className='flex items-center justify-between w-full p-3 space-x-6'>
        <div className='flex-1 truncate'>
          <div className='flex items-center space-x-3'>
            <span className='flex-shrink-0 inline-block px-2 py-0.5 text-base-100 text-sm font-medium bg-success rounded-full'>
              ${highestBid?.amount || 0}
            </span>
            <h3 className='font-medium truncate max-w-[12rem]'>
              ({player.seed})&nbsp;{player.short_name}
            </h3>
          </div>
          <p className='mt-4 text-xs truncate max-w-[14rem]'>
            {highestBid?.profile?.name ||
              highestBid?.profile?.email ||
              highestBid?.owner_id ||
              '-'}
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
              <CurrencyDollarIcon className='w-5 h-5 ' aria-hidden='true' />
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
  );
};

export default BasketballBidCard;
