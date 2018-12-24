import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
    state = {
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        // axios.get('/ingredients.json')
        //     .then(res => {
        //         this.setState({
        //             ingredients: res.data
        //         });
        //     })
        //     .catch(error => {
        //         this.setState({
        //             error: true
        //         })
        //     })
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(key => {
                return ingredients[key];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);

        this.setState({
            purchaseable: sum > 0
        });
    }

    purchaseHandler() {
        this.setState({
            purchasing: true
        });
    }

    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false
        })
    }

    purchaseContinueHandler = () => {
        const queryParams = [];

        for (let i in this.state.ingredients) {
            queryParams.push(`${encodeURIComponent(i)}=${encodeURIComponent(this.state.ingredients[i])}`);
        }
        queryParams.push(`price=${this.props.price}`)
        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search: `?${queryString}`
        })
    }

    render() {
        const disabledInfo = {
            ...this.props.ings
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;

        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

        if (this.props.ings) {
            orderSummary = <OrderSummary
                price={this.props.price}
                ingredients={this.props.ings}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />

            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={(ingredient) => this.props.onAddIngredient(ingredient)}
                        ingredientRemoved={(ingredient) => this.props.onRemoveIngredient(ingredient)}
                        disabled={disabledInfo}
                        purchaseable={!this.state.purchaseable}
                        ordered={this.purchaseHandler.bind(this)}
                        price={this.props.price} />
                </Aux>
            );
        }

        if (this.state.loading) {
            orderSummary = <Spinner />
        }

        return (
            <Aux>
                <Modal
                    show={this.state.purchasing}
                    modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => ({
    ings: state.ingredients,
    price: state.totalPrice
});

const mapDispatchToProps = dispatch => ({
    onAddIngredient: (ingredientName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName}),
    onRemoveIngredient: (ingredientName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName})
});

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));