import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = (ingredientName) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName
    }
};

export const removeIngredient = (ingredientName) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName
    };
};

export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients
    };
};

export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.SET_INGREDIENTS_FAILED
    };
};

export const initIngredients = () => {
    return dispatch => {
                axios.get('/ingredients.json')
            .then(res => {
                dispatch(setIngredients(res.data));
            })
            .catch(error => {
                dispatch(fetchIngredientsFailed());
            })
    };
};