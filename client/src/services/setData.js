import { db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';


export async function deleteProduct (id) {

    return await deleteDoc(doc(db,'products', id));
   
  }