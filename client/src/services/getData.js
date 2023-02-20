
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';



export const getProducts = async() => {
    const todoCollection = collection(db, 'products');
    
    const toDoSnapshot = await getDocs(todoCollection);
    const products = toDoSnapshot.docs.map(doc => {
        return ({...doc.data(),id: doc.id})
    } );
    return products;
    
}

export const getProductPriceHistory = async(productId) => {
    const todoCollection = collection(db, 'products', productId, 'history');
    
    const toDoSnapshot = await getDocs(todoCollection);
    const products = toDoSnapshot.docs.map(doc => {
        
        return doc.data();
    } );
    return products;
    
}


export const getProduct = async(productId) => {
    

    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
    return docSnap.data();
    }
    
    
}

