import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
    </div>
  );
};

export default Spinner;


