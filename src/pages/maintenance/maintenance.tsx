import { NextPage } from 'next';

const Maintenance: NextPage = () => {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
      <main
        className='min-h-full bg-top bg-cover sm:bg-top'
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75")',
        }}
      >
        <div className='px-4 py-16 mx-auto text-center max-w-7xl sm:px-6 sm:py-24 lg:px-8 lg:py-48'>
          <p className='text-sm font-semibold tracking-wide text-black text-opacity-50 uppercase'>
            Maintenance in progress
          </p>
          <h1 className='mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl'>
            Hey there! We're working on a few things.
          </h1>
          <p className='mt-2 text-lg font-medium text-black text-opacity-50'>
            Thank you for your support. Please check back soon.
          </p>
          <div className='mt-6'>
            <a
              href='https://google.com'
              className='inline-flex items-center px-4 py-2 text-sm font-medium text-black text-opacity-75 bg-white bg-opacity-75 border border-transparent rounded-md sm:bg-opacity-25 sm:hover:bg-opacity-50'
            >
              Go googling
            </a>
          </div>
        </div>
      </main>
    </>
  );
};

export default Maintenance;
