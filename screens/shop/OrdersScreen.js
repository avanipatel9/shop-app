import React, {useEffect, useState, useCallback} from 'react';
import { FlatList, Text, Platform, View, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/actions/ordersAction';

const OrderScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    const loadOrders = useCallback( async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(ordersActions.fetchOrders());
        } catch(err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError])

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadOrders);

        return () => {
            willFocusSub.remove();
        }
    }, [loadOrders]);

    useEffect(() => {
        loadOrders();
    }, [dispatch, loadOrders]);

    if(error) {
        return(
            <View style={styles.centered}>
                <Text>An error ocurred!</Text>
                <Button title="Try Again" onPress={loadOrders} color={Colors.primary} />
            </View>
        )
    }

    if(isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        );
    }

    return (
        <FlatList
            data={orders}
            renderItem={itemData => (
                <OrderItem
                    amount={itemData.item.totalAmount}
                    date={itemData.item.readableDate}
                    items={itemData.item.items}
                />
            )}
        />
    );
};

OrderScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
                title='Menu'
                iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress={() => {
                    navData.navigation.toggleDrawer();
                }}
            />
        </HeaderButtons>
    }
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default OrderScreen;