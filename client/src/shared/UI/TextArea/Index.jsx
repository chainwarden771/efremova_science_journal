import { forwardRef } from 'react';
import cssmodule from "./Index.module.css";

const Textarea = forwardRef(({ value, className = "", maxLength=700, ...props }, ref) => {
  return (
    <textarea
      className={ `${ cssmodule.textarea } ${ className }` }
      ref={ref} {...props}
      value={value}
      maxLength={ maxLength }>
    </textarea>
  );
});

export default Textarea;