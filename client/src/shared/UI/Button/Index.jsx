import { forwardRef } from 'react';
import cssmodule from "./Index.module.css";

const Button = forwardRef(({ children, className = "", ...props }, ref) => {

  const elemClasses = `${ cssmodule.button } ${ props.disabled ? cssmodule.disabled : "" } ${ className }`;

  return (
    <button className={ elemClasses } ref={ref} {...props}>
        { children }
    </button>
  );
});

export default Button;