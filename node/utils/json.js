const LOCAL_STORAGE_KEY = 'trckln';
const LOCAL_STORAGE_KEY_KEEP = 'trckln/keep';

//Mantener session
export const keepSession = ({ AuthUserName, AuthMail }) => {
    const sessionData = {
        AuthUserName: AuthUserName,
        AuthMail: AuthMail,
        date: Date.now()
    };
    localStorage.setItem(LOCAL_STORAGE_KEY_KEEP, JSON.stringify(sessionData));
};

//comprobar sesion
export const isSessionValid = () => {
    const data = getData();
    
    if (!data?.date) {
        deleteJSON();
        return false;
    }

    if ((Date.now() - data.date) > 24 * 60 * 60 * 1000) {// 1 dia de tiempo valido
        deleteJSON();
        return false;
    }
    data.date = Date.now();
    saveData(data);
    return true;
};

// Función para obtener los datos del Local Storage
const getData = () => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : { cart: [], list: [] };
};

// Función para guardar datos en el Local Storage
const saveData = (data) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
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
