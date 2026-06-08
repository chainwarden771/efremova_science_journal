import { useState } from "react";
import ModalContext from "./ModalContext";
import Modal from "../../components/Modal/Index";
import DefaultModal from "../../components/Modal/Templates/Default";

export default function ModalProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [modalData, setModalData] = useState({
        title: "",
        text: ""
    });

    function showModal(data) {
        setModalData(data);
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <ModalContext.Provider
            value={{
                isOpen,
                showModal,
                closeModal,
                modalData
            }}
        >
            {children}

            <Modal
                isOpen={isOpen}
                onClose={closeModal}
            >
                <DefaultModal
                    title={modalData.title}
                    text={modalData.text}
                    onClose={closeModal}
                />
            </Modal>
        </ModalContext.Provider>
    );
}