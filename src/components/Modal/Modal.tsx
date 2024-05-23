import { Fragment, useRef } from 'react';
import { Dialog, Transition, TransitionChild } from '@headlessui/react';
import { useAppContext } from '@/AppContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Modal = () => {
  const { modalOpen, setModalOpen, modalContent, setModalContent } =
    useAppContext();

  const closeModal = () => {
    setModalOpen(false);
    // timeout to wait for modal transition to finish
    setTimeout(() => setModalContent(''), 500);
  };

  return (
    <Transition appear show={modalOpen} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-10 overflow-y-auto'
        onClose={() => closeModal()}
        open={modalOpen}
      >
        <div className='modal modal-open'>
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/30'  aria-hidden='true' />
          </TransitionChild>

          <TransitionChild
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
              <div className='mt-8 prose'>
                <ReactMarkdown
                  children={modalContent}
                  remarkPlugins={[remarkGfm]}
                />
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
