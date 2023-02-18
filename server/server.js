const axios = require('axios');
var i = 0;
var cron = require('node-cron');
const { getProductsList, getProductPrice } = require('./api/getData');
const { savePrice } = require('./api/setData');
const fetch = require("node-fetch");




const targetTags =  {
  ozon : {baseUrl: 'https://www.ozon.ru/api/composer-api.bx/page/json/v2?url=', name: '', price: '' },
}



async function getList() {
  let productList = await getProductsList().then(res => res);

 

  





  
  for (let product of productList) {
    
    let productPrice = 0;
    await getProductPrice(targetTags.ozon.baseUrl + product.url).then(res => {
      productPrice = res;
      console.log('ProductPrice - ', productPrice);
    }).catch(err => console.log(err));
    if (productPrice === 0) return;

    await savePrice(product.id, productPrice).then(console.log('price added to database')).catch(err => console.log(err))
    
  }
}

var task = cron.schedule('* 7 * * *', () =>  {
  console.log('Day ' + i);
  try {
    getList();
  }
  catch(err) {
    console.log('Problems with getting data from Firestore');
    console.log(err);
  }
  i++;
});
console.log('server started');

task.start();