import './App.scss';
import Product from './components/Product';
import { getProduct, getProducts } from './services/getData';

import { useEffect, useState } from 'react';

import {db} from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import dayjs from 'dayjs';



const BASE_URL = {ozon: 'https://www.ozon.ru/api/composer-api.bx/page/json/v2?url='}


function App() {
  const [url, setUrl] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!url?.length) { return };
    
    fetch(BASE_URL.ozon+url)
    .then(response => {
      if (response.status === 200) {
      //console.log(response);
      return response.json();
      }
    })
    .then(json => {
      console.log(JSON.parse(json.seo.script[0].innerHTML));
      const newProduct = JSON.parse(json.seo.script[0].innerHTML);
      console.log(newProduct);
      saveProduct(newProduct);
      //setNewProduct({...JSON.parse(json.seo.script[0].innerHTML)});
    
    });

  },[url])
  
  // useEffect(() => {
  //   if (!products.length) return;
  //   console.log(products);
  //   localStorage.setItem('products', JSON.stringify(products));
    
  // },[products]);

  useEffect(() => {
    console.log('App');
    getProducts().then(res => {
      console.log(res);
      setProducts(res);
     } )
    
  },[]);


  async function saveProduct(product) {

      const collectionRef = collection(db,'products');
      const productId = await addDoc(collectionRef, {
          name:product.name,
          descr:product.description.substring(0,200) || '',
          image:product.image || '',
          startPrice: parseInt(product.offers.price) || 0,
          url: product.offers.url || '',
          creationDate: dayjs(Date()).format('YYYY-MM-DD HH:mm:ss')
      });
      getProduct(productId.id).then(res => setProducts(prev => {
        console.log(res);
        return [...prev, {...res, id:productId.id}]
      })
      )
 

  
  }

  function handleClick() {
   
      setUrl(prompt('Введите Url на товар', null))
  
  }
  async function handleAddDataClick() {

    const collectionRef = collection(db,'products', '1C0ZORAMuwF1F2pDad02', 'history');
      await addDoc(collectionRef, {
          date: '03-02-2023',
          price: 1300
      });
      await addDoc(collectionRef, {
          date: '04-02-2023',
          price: 1500
      });
      await addDoc(collectionRef, {
          date: '05-02-2023',
          price: 1700
      });
      await addDoc(collectionRef, {
          date: '06-02-2023',
          price: 1500
      });
      await addDoc(collectionRef, {
          date: '07-02-2023',
          price: 1100
      });


  }
  return (
    <div className="App">
      
      <main>
        <button className='add-product-btn' type='button' onClick={handleClick}>Добавить товар</button>
        {/* <button className='add-product-btn' type='button' onClick={handleAddDataClick}>Добавить данных</button> */}
        {products?.map((item,index) => <Product key={index} product={item}/>)}
      </main>


    </div>
  );
}

export default App;
