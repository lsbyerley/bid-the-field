import { useState } from 'react';
import BidModal from '../BidModal';
import { BasketballBidCard, GolfBidCard } from './types';
import type {
  PlayerWithHighBid,
  Bid,
  Player,
} from '@/lib/auctionUtils/auctionUtils';
import type { BasketballBidCardArgs } from './types/Basketball';
import type { GolfBidCardArgs } from './types/Golf';

interface BidCardArgs {
  sport: string;
  player: PlayerWithHighBid;
  biddingDisabled: boolean;
  disableTheField: boolean;
  onSubmitBid: Function;
}

const FIELD_PLAYER_ID = '999999';

const BID_CARD_VARIANTS = {
  golf: (props: GolfBidCardArgs) => <GolfBidCard {...props} />,
  basketball: (props: BasketballBidCardArgs) => (
    <BasketballBidCard {...props} />
  ),
};

const BidCard = ({
  sport,
  player,
  //bids = [],
  biddingDisabled = false,
  disableTheField = false,
  onSubmitBid = () => {},
}: BidCardArgs) => {
  // const asyncBids = useAsyncReference(bids, true);
  // const highestBid = getPlayerHighestBid(asyncBids.current, player.id);
  // const highestBid = player.highestBid || {};
  const [isOpen, setIsOpen] = useState(false);
  const BidCardComponent = BID_CARD_VARIANTS[sport];

  const openBidModal = () => {
    setIsOpen(true);
  };

  const submitTenPercentBid = (player: Player, highestBid: Bid) => {
    const tenPercentIncrease = (
      highestBid.amount * 0.1 +
      highestBid.amount
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
    disableTheField &&
    !player.highestBid?.amount &&
    player?.id !== FIELD_PLAYER_ID;

  const disableTheFieldPlayer =
    !disableTheField && player?.id === FIELD_PLAYER_ID;

  return (
    <li
      key={player.id}
      data-player-id={player.id}
      className='col-span-1 rounded-lg shadow bg-base-100'
      data-sport={sport}
    >
      <BidCardComponent
        isOpen={isOpen}
        player={player}
        highestBid={player.highestBid}
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
        highestBid={player.highestBid}
      />
    </li>
  );
};

export default BidCard;
