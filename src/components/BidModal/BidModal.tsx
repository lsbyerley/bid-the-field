import { useState, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { round } from '../../lib/auctionUtils';
import isEmpty from 'just-is-empty';
import type { Player, BidWithProfile } from '@/lib/auctionUtils/auctionUtils';

const MIN_BID = 1;
const MAX_BID_AMOUNT = 500;
const MIN_TO_OUTBID = 1.99;

interface FormData {
  bidAmount: string | number;
}

interface BidModalArgs {
  isOpen: boolean;
  setIsOpen: Function;
  onSubmit: Function;
  player: Player;
  highestBid: BidWithProfile;
}

const BidModal = ({
  isOpen = false,
  setIsOpen = (open: boolean) => {},
  onSubmit = (bidAmount: number, playerId: string) => {},
  player,
  highestBid = null,
}: BidModalArgs) => {
  let bidInputRef = useRef(null);
  const [formInput, updateFormInput] = useState({
    bidAmount: '',
  });
  const closeModal = () => {
    setIsOpen(false);
  };

  const submitBid = async (formInput: FormData) => {
    const { bidAmount } = formInput;
    if (isEmpty(bidAmount) || isNaN(Number(bidAmount))) {
      alert('Valid bid amount required');
      return;
    }

    const numBid = Number(bidAmount);

    // Round the bid amount to the nearest tenth decimal
    const formattedBidAmount = round(numBid, 2);
    const highBid = highestBid?.amount ? Number(highestBid.amount) : null;

    if (formattedBidAmount <= 0) {
      alert(`Bid must be higher than $0`);
      return;
    }
    if (formattedBidAmount < MIN_BID) {
      alert(`Minimum bid of $${MIN_BID} required.`);
      return;
    }
    if (!highBid && formattedBidAmount > MAX_BID_AMOUNT) {
      alert(
        `A bid is capped at $${MAX_BID_AMOUNT} until the highest bid exceeds $${MAX_BID_AMOUNT}.`
      );
      return;
    }
    if (highBid && formattedBidAmount - highBid > MAX_BID_AMOUNT) {
      alert(`Bid cannot exceed $${MAX_BID_AMOUNT}.`);
      return;
    }
    if (highBid && formattedBidAmount <= highBid) {
      alert(`Bid must be higher than $${highBid}.`);
      return;
    }
    if (highBid && formattedBidAmount - highBid <= MIN_TO_OUTBID) {
      alert(
        `Bid must be atleast $${MIN_TO_OUTBID + 0.01} higher than $${highBid}.`
      );
      return;
    }
    onSubmit(formattedBidAmount, player.id);
    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-10 overflow-y-auto'
        initialFocus={bidInputRef}
        onClose={() => closeModal()}
        open={isOpen}
      >
        <div className='modal modal-open'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-black/30' />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div className='modal-box'>
              <button
                className='absolute btn btn-sm btn-circle right-2 top-2'
                onClick={() => closeModal()}
              >
                ✕
              </button>
              <Dialog.Title
                as='h3'
                className='mt-5 text-lg font-medium leading-6'
              >
                Bid for {player?.first_name} {player?.last_name}
              </Dialog.Title>
              <div className='mt-2'>
                <div>
                  <label
                    htmlFor='bidAmount'
                    className='block mb-2 text-sm font-medium'
                  >
                    Enter Bid more than ${highestBid?.amount || 0}
                  </label>
                  <div className='relative mt-1 rounded-md shadow-sm'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                      <span className='text-gray-500 sm:text-sm'>$</span>
                    </div>
                    <input
                      ref={bidInputRef}
                      type='text'
                      name='bidAmount'
                      id='bidAmount'
                      className='w-full pr-12 input pl-7'
                      placeholder='0.00'
                      aria-describedby='bidAmount-currency'
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          bidAmount: e.target.value,
                        })
                      }
                    />
                    <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                      <span
                        className='text-gray-500 sm:text-sm'
                        id='bidAmount-currency'
                      >
                        USD
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='justify-center modal-action'>
                <button
                  type='button'
                  className='btn'
                  onClick={() => submitBid(formInput)}
                >
                  Place Bid
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BidModal;
