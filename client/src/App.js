import './App.scss';
import Product from './components/Product';
import { getProduct, getProducts } from './services/getData';

import { useEffect, useState } from 'react';

import {db} from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import dayjs from 'dayjs';
import Modal from './components/modal/Modal';



const BASE_URL = {ozon: 'https://www.ozon.ru/api/composer-api.bx/page/json/v2?url='}


function App() {
  const [url, setUrl] = useState(null);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (!url?.length) { return };
    if (!~url.indexOf("ozon.ru")) { 
      alert('Введите ссылку на товар с Ozon.ru');
      return 
    };
    console.log('starting fetch url');
    console.log(process.env.REACT_APP_RAPIDAPI_KEY);
    fetch('https://scrapeninja.p.rapidapi.com/scrape', {
    method: 'POST',
    headers: 
    {
    "Content-Type": "application/json",
    "x-rapidapi-host": "scrapeninja.p.rapidapi.com",
    "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
    },
    body: JSON.stringify(       {
    "url": BASE_URL.ozon+url,
    "headers": [
        "authority: www.ozon.ru",
        "accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language: ru,en;q=0.9,la;q=0.8,de;q=0.7,bg;q=0.6,ro;q=0.5",
        "cache-control: max-age=0",
        "cookie: __Secure-ab-group=88; __exponea_etc__=0a1c1b6c-976d-4462-a528-053017ff5eda; __Secure-user-id=1890743; _ym_uid=160568448081609658; __Secure-ext_xcid=94365fa92f14fb8940d865ea3c4eed94; _ym_d=1653919003; isBuyer=1; cnt_of_orders=41; _tt_enable_cookie=1; _ttp=04bc1ce7-e28c-4839-9a8e-d93cdfac2b6e; _ga=GA1.1.1511715129.1659972473; tmr_lvid=ac34c8be12b1be6ced9976dba7ec4a7a; tmr_lvidTS=1605684475651; _gcl_au=1.1.1964935414.1671787668; AREA_ID=2; xcid=08c989ca41b01b8ceb384e3e0b62ca09; _ga_JNVTMNXQ6F=GS1.1.1676573068.60.0.1676573068.60.0.0; tmr_detect=1\\%\\7C1676573069826; __Secure-access-token=3.1890743.tTJEqRY3T-6UJgjuu439BQ.88.l8cMBQAAAABhYJknAhteFqN3ZWKrNzkxNjU4ODE3MjIAgJCg.20181002090947.20230217161217.F1TZC4_8-OOSQtdaIQXNtnHYVvlSvXERjijXYLW_Ukw; __Secure-refresh-token=3.1890743.tTJEqRY3T-6UJgjuu439BQ.88.l8cMBQAAAABhYJknAhteFqN3ZWKrNzkxNjU4ODE3MjIAgJCg.20181002090947.20230217161217.qPLpAFR3FeUNh5aV2vauBu9b1r4Knt7zXgu3KbLXKQE; __cf_bm=FThhVeaKooLmnE4AlakUWO6SWFBswjcW9.CF1d8Hdkw-1676643137-0-AaGxXMpExHJzlkgpRAynu3xKofRWA1ivj64tHOL+i3oP1iNkcMf/gdqlxkYzmEByP8yk7S8fPb2BLRQ19v6geiU=",
        "sec-ch-ua: \\\"Not?A_Brand\\\";v=\\\"8\\\", \\\"Chromium\\\";v=\\\"108\\\", \\\"Yandex\\\";v=\\\"23\\\"",
        "sec-ch-ua-mobile: ?0",
        "sec-ch-ua-platform: \\\"Windows\\\"",
        "sec-fetch-dest: document",
        "sec-fetch-mode: navigate",
        "sec-fetch-site: none",
        "sec-fetch-user: ?1",
        "upgrade-insecure-requests: 1",
        "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 YaBrowser/23.1.2.987 Yowser/2.5 Safari/537.36"
       ]
       })

    })
      .then(response => {
      if (response.status === 200) {
      console.log(response);
      return response.json();
      }
    })
    .then(json => {
        return JSON.parse(json.body);
    })
    .then(json => {
      console.log(JSON.parse(json?.seo.script[0].innerHTML));
      const newProduct = JSON.parse(json?.seo.script[0].innerHTML);
      console.log(newProduct);
      saveProduct(newProduct);
      
    })
    .catch(err => console.log(err))
    .finally(setUrl(null));

  },[url])
  

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
      setShowModal(true);
      //setUrl(prompt('Введите Url на товар с OZON', ''))
  
  }
  
  return (
    <div className="App">
      
      <main>
        <button className='button add-product-btn' type='button' onClick={handleClick}>Добавить товар</button>
        {/* <button className='add-product-btn' type='button' onClick={handleAddDataClick}>Добавить данных</button> */}
        {products?.map((item,index) => <Product key={index} setProducts={setProducts} product={item}/>)}
        {showModal && <Modal setShowModal={setShowModal} setUrl={setUrl}/>}      
      </main>


    </div>
  );
}

export default App;
