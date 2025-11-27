import React from 'react';

const Page = ({children}) => {
  return (
    <div className="text-primary-50 font-poppins font-normal overflow-x-hidden min-h-screen bg-primary-200">
        {children}
    </div>
  )
}

export default Page