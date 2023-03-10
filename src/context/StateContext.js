import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import product from 'sanity_ecommerce/schemas/product'

const Context = createContext()

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQuantities, setTotalQuantities] = useState(0)
    const [qty, setQty] = useState(1)

    let foundProduct
    let index

    const incQty = () => {
        setQty((prevQty) => ++prevQty)
    }

    const onRemove = (product) => {
            setTotalPrice((prevTotalPrice) => (prevTotalPrice - product.price * product.quantity))
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - product.quantity)
            index = cartItems.findIndex((item) => item._id === product._id)
            let newCartItems = cartItems
            newCartItems.splice(index, 1)
            setCartItems([...newCartItems])

    }

    const onAdd = ( product, quantity ) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id)
        setTotalPrice((prevTotalPrice) => (prevTotalPrice + product.price * quantity))
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity)
        
        if(checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) {return {
                    ...cartProduct, quantity: cartProduct.quantity + quantity
                } }else {
                    return cartProduct
                }
            })
        
        setCartItems(updatedCartItems)
        } else {
            product.quantity = quantity
            setCartItems([...cartItems, { ...product }])
        }
        toast.success(`${qty} ${product.name} added to the cart.`)
    }

    
    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((product) => product._id === id)
        const newCartItems = cartItems.slice()     

        if(value === 'inc') {
            newCartItems[index] =  {...foundProduct, quantity: foundProduct.quantity + 1}
            setCartItems(newCartItems)
            setTotalPrice((prevTotalPrice) => (prevTotalPrice + foundProduct.price ))
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1)
        } else if(value === 'dec') {
            if (foundProduct.quantity > 1){
                newCartItems[index] =  {...foundProduct, quantity: foundProduct.quantity - 1}
                setCartItems(newCartItems)
                setTotalPrice((prevTotalPrice) => (prevTotalPrice - foundProduct.price ))
                setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1)
            }

        }
    }

    const decQty = () => {
        
        setQty((prevQty) =>{
            if(prevQty < 2) return 1
            return --prevQty
        })
    }

    return (
        <Context.Provider
            value={{
                showCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                setQty,
                onAdd,
                setShowCart,
                toggleCartItemQuantity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities,
            }}
        >{children}</Context.Provider>
    )
}

export const useStateContext = () => useContext(Context)