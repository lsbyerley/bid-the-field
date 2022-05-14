import useAsyncReference from '@/lib/useAsyncReference';
import NameCard from '@/components/Auction/NameCard/NameCard';
import StartDateCard from '@/components/Auction/StartDateCard/StartDateCard';
import EndDateCard from '@/components/Auction/EndDateCard/EndDateCard';
import RulesPayoutsCard from '@/components/Auction/RulesPayoutsCard/RulesPayoutsCard';

const AuctionHeader = ({ auction, auctionOver }) => {
  const asyncAuction = useAsyncReference(auction, true);

  return (
    <>
      <NameCard auction={asyncAuction.current} />
      <EndDateCard auction={asyncAuction.current} auctionOver={auctionOver} />
      <StartDateCard auction={asyncAuction.current} />
      <RulesPayoutsCard auction={asyncAuction.current} />
    </>
  );
};

export default AuctionHeader;
