import { createContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import * as gameService from '../services/gameService';

export const GameContex = createContext();

const gameReducer = (state, action) => {
    console.log('old state: ', state);
    console.log('new state: ', action);

    switch (action.type) {
        case 'ADD_GAMES':
            return action.payload.map(x => ({ ...x, comments: [] })) // [...action.payload] || action.payload.slice()
        case 'ADD_GAME':
            return [...state, action.payload]
        case 'FETCH_GAME_DETAILS':
        case 'EDIT_GAME':
            return state.map(x => x._id === action.gameId ? action.payload : x)
        case 'REMOVE_GAME':
            return state.filter(x => x._id !== action.gameId);
        case 'ADD_COMMENT':
            return state.map(x => x._id === action.gameId ? { ...x, comments: [...x.comments, action.payload] } : x)
        default:
            return state;
    }
};

export const GameProvider = ({
    children
}) => {
    const [games, dispatch] = useReducer(gameReducer, []);
    const navigate = useNavigate();

    useEffect(() => {
        gameService.getAll()
            .then(result => {
                const action = {
                    type: 'ADD_GAMES',
                    payload: result,
                }
                dispatch(action);
            })
    }, []);

    const selectGame = (gameId) => {
        return games.find(x => x._id === gameId) || {}
    };

    const fetchGameDetails = (gameId, gameData) => {
        dispatch({
            type: 'FETCH_GAME_DETAILS',
            payload: gameData,
            gameId,
        })
    };

    // return new state with the same games however + the new game with its new comments
    const addComment = (gameId, comment) => {
        dispatch({
            type: 'ADD_COMMENT',
            payload: comment,
            gameId
        })
    };

    const addGameHandler = (gameData) => {
        dispatch({
            type: 'ADD_GAME',
            payload: gameData
        });

        navigate('/catalog')
    };

    const gameEdit = (gameId, gameData) => {
        dispatch({
            type: 'EDIT_GAME',
            payload: gameData,
            gameId
        });
    }

    const deleteGame = (gameId) => {
        dispatch({
            type: 'REMOVE_GAME',
            gameId,
        })
    }

    return (
        <GameContex.Provider value={{ games, addGameHandler, addComment, gameEdit, fetchGameDetails, selectGame, deleteGame }}>
            {children}
        </GameContex.Provider>
    );
};

