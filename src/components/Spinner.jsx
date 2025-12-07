import React from 'react'

function Spinner() {
  return (
    <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
  </div>
  )
}

export default Spinner