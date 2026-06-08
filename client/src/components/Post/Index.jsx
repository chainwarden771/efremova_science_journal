import './Index.css';
import Button from '../../shared/UI/Button/Index';
import ProfileIcon from "../../assets/icons/profile-icon.svg";
import RateIcon from "../../assets/icons/rate-icon.svg";
import { useNavigate } from 'react-router-dom';

const Post = (
    { headline,
        description,
        imageURL,
        rating,
        postID,
        publisherFullname,
        publishDate
    } ) => {

    const navigate = useNavigate();

    return (
        <div className="post-item element-decoration--panel">
            <div className='post-item__publisher-spine'>
                <div className='publisher-area'>
                    <img alt="profile icon" src={ ProfileIcon }></img>
                    <span>{ publisherFullname }</span>
                </div>
                <span className='post-item__publish-date'>
                    {new Date(publishDate).toLocaleString('ru-RU')}
                </span>
            </div>
            <section>
                <div className="post-hat">
                    <h1 className="h-header h1-header post-item__post-header">
                        { headline }
                    </h1>
                    <img alt="post image" src={ imageURL }></img>
                </div>
                <p className="description-text">{ description }</p>
            </section>
            <div className='post-item__footer'>
                <div className='post-item__rating'>
                    <div className='post-item__rating-shadow'></div>
                    {
                        Array.from( {
                            length: Math.max(0, Number(rating) || 0)
                        }).map( (_, indx) => {
                            return <img alt="rating" src={ RateIcon } key={ indx }></img>
                        })
                    }
                </div>
                <Button
                    className="post-item__read-full"
                    onClick={ () => navigate(`/read/${postID}`) }
                >Читать полностью</Button>
            </div>
        </div>
    )
}

export default Post;