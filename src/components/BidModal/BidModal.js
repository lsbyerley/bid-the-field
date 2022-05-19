import { useState, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const BidModal = ({
  isOpen = false,
  setIsOpen = () => {},
  onSubmit = () => {},
  player = null,
  highestBid = null,
}) => {
  let bidInputRef = useRef(null);
  const [formInput, updateFormInput] = useState({
    bidAmount: '',
  });
  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const submitBid = async () => {
    const { bidAmount } = formInput;
    if (!bidAmount || isNaN(Number(bidAmount))) {
      alert('Valid bid amount required');
      return;
    }
    if (Number(bidAmount) <= 0) {
      alert(`Bid must be higher than $0`);
      return;
    }
    if (Number(bidAmount) <= 0.24) {
      alert(`Minimum bid of $0.25 required`);
      return;
    }
    if (Number(bidAmount) >= 1001) {
      alert(`Bid cannot exceed $1000`);
      return;
    }
    if (highestBid?.amount && Number(bidAmount) <= Number(highestBid.amount)) {
      alert(`Bid must be higher than $${highestBid.amount}`);
      return;
    }
    onSubmit(bidAmount, player.id);
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
                <button type='button' className='btn' onClick={submitBid}>
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
