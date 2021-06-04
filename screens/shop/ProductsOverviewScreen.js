import React from 'react';
import {FlatList, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cartAction';

const ProductsOverviewScreen = props => {
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    return (
    <FlatList
    data={products}
    keyExtractor={item => item.id}
    renderItem={itemData => (
        <ProductItem
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price}
            onViewDetail={() => {
                props.navigation.navigate('ProductDetail', {
                    productId: itemData.item.id,
                    productTitle: itemData.item.title 
                });
            }}
            onAddToCart={() => {
                dispatch(cartActions.addToCart(itemData.item));
            }}
        />
    )} 
    />
    );
};

ProductsOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'All Products'
    }
}

export default ProductsOverviewScreen;