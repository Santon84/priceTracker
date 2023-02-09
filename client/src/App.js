import './App.scss';
import Product from './components/Product';
import { useEffect, useState } from 'react';

const BASE_URL = {ozon: 'https://www.ozon.ru/api/composer-api.bx/page/json/v2?url='}


function App() {
  const [url, setUrl] = useState(null);
  const [products, setProducts] = useState([]);


  useEffect(() => {
    if (!url?.length) { return };
    fetch(BASE_URL.ozon+url)
    .then(response => response.json())
    .then(json => {
      console.log(JSON.parse(json.seo.script[0].innerHTML));
      setProducts(prev => [...prev, JSON.parse(json.seo.script[0].innerHTML)]);
    
    });

  },[url])
  
  useEffect(() => {
    if (!products.length) return;
    console.log(products);
    localStorage.setItem('products', JSON.stringify(products));
    
  },[products]);

  useEffect(() => {
    console.log(localStorage.getItem('products'))
    setProducts(JSON.parse(localStorage.getItem('products')));
  },[]);


  function handleClick() {
   
      setUrl(prompt('Введите Url на товар', null))
  
  }

  return (
    <div className="App">
      
      <main>
        {products?.map((item,index) => <Product key={index} product={item}/>)}
    <button className='add-product-btn' type='button' onClick={handleClick}>Добавить товар</button>
      </main>


    </div>
  );
}

export default App;
