import Button from '../../../shared/UI/Button/Index';
import modulecss from './Default.module.css';

const Default = ({
    title = "Уведомление",
    text = "Нет содержимого для отображения",
    onClose
}) => {
    return (
        <>
            <h2>{title}</h2>
            <p>{text}</p>

            <Button onClick={onClose} className = { modulecss["close-btn"] }>
                Закрыть
            </Button>
        </>
    );
};

export default Default;