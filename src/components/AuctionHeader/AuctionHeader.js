import useAsyncReference from '@/lib/useAsyncReference';
import NameCard from '@/components/NameCard/NameCard';
import StartDateCard from '@/components/StartDateCard/StartDateCard';
import EndDateCard from '@/components/EndDateCard/EndDateCard';
import RulesPayoutsCard from '@/components/RulesPayoutsCard/RulesPayoutsCard';

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
