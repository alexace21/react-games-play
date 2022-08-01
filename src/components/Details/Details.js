import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { GameContex } from '../../context/GameContext';

import * as gameService from '../../services/gameService';
import * as commentService from '../../services/commentService';

const Details = () => {
    const { addComment, fetchGameDetails, selectGame, deleteGame } = useContext(GameContex);
    const { gameId } = useParams();
    const navigate = useNavigate();
    const currentGame = selectGame(gameId);

    useEffect(() => {
        (async () => {
            const gameDetails = await gameService.getOne(gameId);
            console.log(gameDetails);
            const gameComments = await commentService.getByGameId(gameId);

            fetchGameDetails(gameId, {...gameDetails, comments: gameComments.map(x => `${x.user.email}: ${x.text}`)});
        })();
    }, [])

    const addCommentHandler = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const comment = formData.get('comment');
        // TODO VALIDATION!!

        commentService.create(gameId, comment)
            .then(result => {
                console.log(result);
                addComment(gameId, comment)
            })
    };

    const gameDeleteHandler = () => {
        // TODO confirmation if user is certain they would like to delete

        const confirmation = confirm('Are you sure you would like to delete this game?');

        if(confirmation) {
            gameService.remove(gameId)
                .then(() => {
                    deleteGame(gameId);
                    navigate('/catalog');
                })
        }
    };

    return (
        <section id="game-details">
            <h1>Game Details</h1>
            <div className="info-section">
                <div className="game-header">
                    <img className="game-img" src={currentGame.imageUrl} />
                    <h1>{currentGame.title}</h1>
                    <span className="levels">MaxLevel: {currentGame.maxLevel}</span>
                    <p className="type">{currentGame.category}</p>
                </div>
                <p className="text">
                    {currentGame.summary}
                </p>
                {/* Bonus ( for Guests and Users ) */}
                <div className="details-comments">
                    <h2>Comments:</h2>
                    <ul>
                        {currentGame.comments?.map(x =>
                            <li key={x} className="comment">
                                <p>{x}</p>
                            </li>
                        )}

                        {!currentGame.comments &&
                            <p className="no-comment">No comments.</p>
                        }
                    </ul>
                    {/* Display paragraph: If there are no games in the database */}
                </div>
                {/* Edit/Delete buttons ( Only for creator of this game )  */}
                <div className="buttons">
                    <a href="/edit" className="button">
                        Edit
                    </a>
                    <button onClick={gameDeleteHandler} className="button">
                        Delete
                    </button>
                </div>
            </div>
            {/* Bonus */}
            {/* Add Comment ( Only for logged-in users, which is not creators of the current game ) */}
            <article className="create-comment">
                <label>Add new comment:</label>
                <form className="form" onSubmit={addCommentHandler}>

                    <textarea
                        name="comment"
                        placeholder="Comment......"
                    />
                    <input
                        className="btn submit"
                        type="submit"
                        value="Add Comment"
                    />
                </form>
            </article>
        </section>
    )
};

export default Details;