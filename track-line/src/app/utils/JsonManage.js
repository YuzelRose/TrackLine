const LOCAL_STORAGE_KEY = 'trckln';
const LOCAL_STORAGE_KEY_REGISTER = 'trckln/register';
const LOCAL_STORAGE_KEY_KEEP = 'trckln/keep';

export const keepSession = ({ AuthUserEmail, AuthTok }) => {
    const sessionData = {
        Email: AuthUserEmail,
        Token: AuthTok,
        date: Date.now()
    };
    saveData({data: sessionData, key: LOCAL_STORAGE_KEY_KEEP})
};

export const registerData = ({ AuthPass, AuthTok }) => {
    const sessionData = {
        Pass: AuthPass,
        AuthUser: AuthTok
    };
    saveData({data: sessionData, key: LOCAL_STORAGE_KEY_REGISTER})
};

export const isSessionValid = () => {
    const data = getData(LOCAL_STORAGE_KEY_KEEP);
    
    if (!data || !data.date || data.token) {
        alert("Su sesion a caducado")
        deleteJSON(LOCAL_STORAGE_KEY_KEEP);
        return false;
    }
    if ((Date.now() - data.date) > (4 * 60 * 60 * 1000)) {
        alert(`Sesion caduca ${data.date}`)
        deleteJSON(LOCAL_STORAGE_KEY_KEEP);
        alert("Su sesion a caducado")
        return false;
    }
    data.date = Date.now();
    saveData({data: data, key: LOCAL_STORAGE_KEY_KEEP})
    return true;
};

// Función para guardar datos en el Local Storage
const saveData = ({data,key}) => {
    localStorage.setItem(key, JSON.stringify(data));
};
// Funcion para borrar datos
export const deleteJSON = (key) => {
    localStorage.removeItem(key); 
};

const getData = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

/*

export const initData = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, generateJSON());
}
// Función para obtener los datos del Local Storage




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
};*/
