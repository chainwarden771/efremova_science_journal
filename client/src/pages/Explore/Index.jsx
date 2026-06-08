import "./Index.css";

import { useNavigate } from 'react-router-dom';
import FilterIcon from "../../assets/icons/filter_alt.svg";

import Post from "../../components/Post/Index";
import Button from "../../shared/UI/Button/Index";
import Input from "../../shared/UI/Input/Index";

const Explore = () => {

    const navigate = useNavigate();
    const desc = `Задумывались ли вы когда-то о величии природы изолированной Австралии ? Астралия стала изолированным архипелагом, давшим начала многим видам, которые затем распространились по всему земному Шару.Примером такого вида может быть полевой крот, который устраивает ночью облаву на своих диких хищных сородичей...`;

    return  (
        <div className="explore-posts">

            <div className="filter-toolbar">
                <img className="filter-toolbar--icon" src={ FilterIcon }></img>
                <Input
                    type="date"
                    className="filter-toolbar__date input--filter"
                />
                <Input 
                    placeholder="Введите имя или название..."
                    className="filter-toolbar__search input--filter"
                />
            </div>

            <div className="publish-invoice-message element-decoration--panel">
                <section>
                    <h1 className="h-header h1-header post-invoice-header">Создайте свою публикацию</h1>
                    <p className="description-text">Для этого нажмите на "Опубликовать" ниже, дальше следуйте инструкции на странице публикации, привлеките внимание потенциального читателя броским заголовком</p>
                    <Button
                        onClick={ () => navigate("/publish")}
                        className="publish-invoice__button"
                    >Опубликовать</Button>
                </section>
            </div>

            <Post 
                headline = { "Природа Астралии" }
                description = { desc }
                imageURL = { "./assets/examples/post-image-example.jpg" }
                postID = { 1234 }
                publisherFullname = { "Иванов Иван Иванович" }
                publishDate = { 1780423445741 }
            />

            <Post
                headline = { "Природа Астралии" }
                description = { desc }
                imageURL = { "./assets/examples/post-image-example.jpg" }
                postID = { 1234 }
                publisherFullname = { "Иванов Иван Иванович" }
                publishDate = { 1780423445741 }
            />

            <Post 
                headline = { "Природа Астралии" }
                description = { desc }
                imageURL = { "./assets/examples/post-image-example.jpg" }
                postID = { 1234 }
                publisherFullname = { "Иванов Иван Иванович" }
                publishDate = { 1780423445741 }
            />

            <div className="explore-posts__pagination element-decoration--panel">
                <a href="#">← Назад</a>
                <span>Страница 22</span>
                <a href="#">Вперед →</a>
            </div>
        </div>
    )

}

export default Explore;