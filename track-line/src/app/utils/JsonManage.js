const LOCAL_STORAGE_KEY = 'trckln';
const LOCAL_STORAGE_KEY_KEEP = 'trckln/keep';

export const keepSession = ({ AuthUserName, AuthUser }) => {
    const sessionData = {
        AuthUserName: AuthUserName,
        IsLogged: true,
        AuthUser: AuthUser
    };
    localStorage.setItem(LOCAL_STORAGE_KEY_KEEP, JSON.stringify(sessionData));
};

const generateJSON = () => {
    return `
    {
        "cart": [],
        "list": []
    }
    `;
}



// Limpiar el carrito de compras
export const clearCart = () => {
    const currentData = getData();
    currentData.cart = []; 
    saveData(currentData); 
};


export const initData = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, generateJSON());
}

// Función para obtener los datos del Local Storage
const getData = () => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : { cart: [], list: [] };
};

// Función para guardar datos en el Local Storage
const saveData = (data) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

// Función para agregar un item al cart
export const addToCart = (newItem, cant = 1) => {
    const currentData = getData();
    const existingItem = currentData.cart.find(item => item.ID === newItem);
    if (existingItem) {
        existingItem.cant += cant;
       alert("Cantidad aumentada");
    } else {
        currentData.cart.push({ "ID": newItem, "cant": cant });
        alert("Agregado al carrito");
    }
    saveData(currentData);
};


// Función para actualizar la cantidad de un item en el cart
export const updateCartItem = (id, amount) => {
    const currentData = getData();
    const item = currentData.cart.find(item => item.ID === id);
    if (item) {
        item.cant += amount;
        if (item.cant <= 0) {
            deleteCartItem(id);
        } else {
            saveData(currentData);
        }
    }
};

export const changeCartToList = (id) => {
    const currentData = getData();
    const existingItem = currentData.list.find(item => item.ID === id);
    if (!existingItem) {
        currentData.list.push({ "ID": id });
    }
    currentData.cart = currentData.cart.filter(item => item.ID !== id);
    alert("Movido a la lista");
    saveData(currentData);
}

// Función para eliminar un item del cart
export const deleteCartItem = (id) => {
    const currentData = getData();
    currentData.cart = currentData.cart.filter(item => item.ID !== id);
    alert("Eliminado del carrito");
    saveData(currentData);
};

// Función para agregar un item a la list
export const addToList = (newItem) => {
    const currentData = getData();
    const existingItem = currentData.list.find(item => item.ID === newItem);
    if (!existingItem) {
        currentData.list.push({ "ID": newItem });
        alert("Agregado a la lista");
        saveData(currentData);
    }
    
};

// Función para eliminar un item de la list
export const deleteListItem = (id) => {
    const currentData = getData();
    currentData.list = currentData.list.filter(item => item.ID !== id);
    alert("Eliminado de favoritos");
    saveData(currentData);
};

// Función para obtener items del cart y list
export const getCart = () => {
    return getData().cart;
};

export const getList = () => {
    return getData().list;
};

export const getListItemIds = () => {
    const currentData = getData(); 
    return currentData.list.map(item => item.ID); 
};

export const getCartItemIds = () => {
    const currentData = getData();
    return currentData.cart.map(item => item.ID); 
};

export const getCartItemCants = () => {
    const currentData = getData();
    return currentData.cart.reduce((acc, item) => {
        acc[item.ID] = item.cant;
        return acc;
    }, {});
 
};

export const deleteJSON = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY); 
    localStorage.removeItem(LOCAL_STORAGE_KEY_KEEP); 
};


export const generatePayPalJson = (cartItems, quantities, finalCost) => {
    const currency = 'MXN'; 
    const generateUniqueReferenceId = () => {
        return `ref-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    };
    if (cartItems.length === 0) {
        return null;  
    }
    const itemTotal = cartItems.reduce((total, item) => {
        const quantity = quantities[item._id] || 1; 
        return total + item.Costo * quantity;  
    }, 0);
    if (parseFloat(itemTotal.toFixed(2)) !== parseFloat(finalCost.toFixed(2))) {
        console.error('Los valores de item_total y finalCost no coinciden');
        return null;  
    }
    const paypalData = {
        intent: 'CAPTURE', 
        purchase_units: [
            {
                reference_id: generateUniqueReferenceId(),  
                amount: {
                    currency_code: currency,
                    value: finalCost.toFixed(2),  
                    breakdown: {
                        item_total: {
                            currency_code: currency,
                            value: itemTotal.toFixed(2) 
                        }
                    }
                },
                items: cartItems.map(item => {
                    const quantity = quantities[item._id];
                    return {
                        name: item.Nombre || 'Nombre no disponible', 
                        unit_amount: {
                            currency_code: currency,
                            value: item.Costo.toFixed(2)   
                        },
                        quantity: quantity
                    };
                })
            }
        ]
    };
    localStorage.setItem('paypalJson', JSON.stringify(paypalData));
    return paypalData;
};
