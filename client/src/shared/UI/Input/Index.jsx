import { forwardRef } from 'react';
import cssmodule from './Index.module.css';

const Input = forwardRef(({ value, className = '', maxLength = 45, ...props }, ref) => {
  return (
    <input
      className={`${cssmodule.input} ${className}`}
      maxLength={maxLength}
      ref={ref}
      {...props}
      value={value}
    />
  );
});

export default Input;
