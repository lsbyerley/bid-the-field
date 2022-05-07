import { useAppContext } from '../../../AppContext';
import useAsyncReference from '../../../lib/useAsyncReference';

const RulesPayoutsCard = ({ auction }) => {
  const asyncAuction = useAsyncReference(auction, true);
  const { setModalOpen, setModalContent } = useAppContext();

  const openRulesModal = () => {
    setModalContent(asyncAuction.current.rules);
    setModalOpen(true);
  };

  const openPayoutsModal = () => {
    setModalContent(asyncAuction.current.payouts);
    setModalOpen(true);
  };
  return (
    <div className='rounded-lg card compact bg-base-200 '>
      <div className='justify-center card-body'>
        {asyncAuction.current.rules && (
          <button
            className='btn btn-ghost btn-sm'
            onClick={() => openRulesModal()}
          >
            Rules
          </button>
        )}
        {asyncAuction.current.payouts && (
          <button
            className='btn btn-ghost btn-sm'
            onClick={() => openPayoutsModal()}
          >
            Payouts
          </button>
        )}
      </div>
    </div>
  );
};

export default RulesPayoutsCard;
