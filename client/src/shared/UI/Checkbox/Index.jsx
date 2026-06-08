import { forwardRef } from 'react';
import cssmodule from "./Index.module.css";

const Checkbox = forwardRef(({ label, className = "", ...props }, ref) => {
    return (
        <label className={cssmodule.label}>
            { label }
            <input className={ `${ cssmodule.checkbox } ${ className }` } type={ props.type || "checkbox"} ref={ ref } {...props}></input>
        </label>
    )
});

export default Checkbox;