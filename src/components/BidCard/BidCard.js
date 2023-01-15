import { useState } from 'react';
import { getPlayerHighestBid } from '@/lib/auctionUtils';
import useAsyncReference from '@/lib/useAsyncReference';
import BidModal from '../BidModal';
import { BasketballBidCard, GolfBidCard } from './types';

const FIELD_PLAYER_ID = '999999';

const BID_CARD_VARIANTS = {
  golf: (props) => <GolfBidCard {...props} />,
  basketball: (props) => <BasketballBidCard {...props} />,
};

const BidRow = ({
  sport,
  player = {},
  bids = [],
  biddingDisabled = false,
  disableTheField = false,
  onSubmitBid = () => {},
}) => {
  const asyncBids = useAsyncReference(bids, true);
  const highestBid = getPlayerHighestBid(asyncBids.current, player.id);
  const [isOpen, setIsOpen] = useState(false);
  const BidCardComponent = BID_CARD_VARIANTS[sport];

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
    <li
      key={player.id}
      className='col-span-1 rounded-lg shadow bg-base-100'
      data-sport={sport}
    >
      <BidCardComponent
        isOpen={isOpen}
        player={player}
        highestBid={highestBid}
        biddingDisabled={biddingDisabled}
        openBidModal={openBidModal}
        submitTenPercentBid={submitTenPercentBid}
        isPartOfField={isPartOfField}
        disableTheFieldPlayer={disableTheFieldPlayer}
      />
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
