import React from 'react'

const Loader = () => {
  return (
    <div className="m-auto flex items-center justify-center bg-primary-100 rounded-2xl max-sm:size-20 sm:size-40 md:size-60 lg:size-80 mt-16">
        <div className = "max-sm:size-8 sm:size-12 md:size-20 max-sm:border-4 sm:border-8 border-white rounded-full border-t-transparent animate-spin">

        </div>
    </div>
  )
}

export default Loader