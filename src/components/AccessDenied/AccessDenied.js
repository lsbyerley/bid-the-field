import Link from 'next/link';
import { ExclamationCircleIcon } from '@heroicons/react/outline';

const AccessDenied = () => {
  return (
    <div className='max-w-2xl pt-8 pb-24 mx-auto sm:pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
      <div className='shadow-lg alert'>
        <div>
          <ExclamationCircleIcon
            className='flex-shrink-0 w-6 h-6 stroke-info'
            aria-hidden='true'
          />
          <span>Access denied. You must signin to view this page</span>
        </div>
        <div className='flex-none'>
          <Link href='/auth/signin'>
            <a className='btn btn-sm'>Signin</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
