import { useEffect } from "react";
import styles from "./Index.module.css";

import Button from "../../shared/UI/Button/Index";

const Modal = ({
    isOpen,
    onClose,
    children
}) => {

    useEffect(() => {
        function handleEscape(event) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className={styles.backdrop}
            onClick={onClose}
        >
            <div
                className={ styles.modal }
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                >
                    ✕
                </button>

                {children}
            </div>
        </div>
    );
};

export default Modal;