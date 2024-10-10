import React, { useState } from 'react';

const Switch = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div
      className={`${
        enabled ? 'bg-blue-600' : 'bg-gray-300'
      } relative inline-flex h-6 w-11 items-center rounded-full`}
      onClick={() => setEnabled(!enabled)}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform bg-white rounded-full transition`}
      />
    </div>
  );
};

export default Switch;