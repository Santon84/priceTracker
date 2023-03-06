import './Product.scss'
import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useEffect } from 'react';
import { getProductPriceHistory } from '../services/getData';
import dayjs from 'dayjs';
import { deleteProduct } from '../services/setData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);






export default function Product({product , setProducts}) {
  
  const [priceHistory,  setPriceHistory] = useState([]);

  const labels = priceHistory.map(item => item.date);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      
    },
    scales: {
      y: {
        min: Math.min(...priceHistory.map(item => item.price)) - 200,
        max: Math.max(...priceHistory.map(item => item.price)) + 200
      }
    }
  };
  const data = {
    labels,
    datasets: [
      {
        label: 'История цен',
        data: priceHistory.map(item => item.price),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointBorderColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4,

      },
      
    ],
  };
/** 
 * 
 *
 */
  useEffect(() => {

    getProductPriceHistory(product.id).then(res => {
      if (!res.length) return;
      //console.log(res.date);
      console.log(res.sort((a, b) => {
        return dayjs(a.date) - dayjs(b.date)
      }));
      setPriceHistory(res);
    })
  },[product.id]) 


  async function handleDeleteClick(){

    if (window.confirm('Точно удалить товар?')) {
      await deleteProduct(product.id);
      setProducts(prev => prev.filter(item => item.id !== product.id));
    }
  }

  return (
    <div className="product">
      <div className="product__left">
        <div className="product__image">
          <img alt={product.name} src={product.image}></img>
        </div>
        <button onClick={handleDeleteClick}className='product__button_delete button'>Удалить</button>

      </div>
      <div className="product__right">
        <a className='product__link' href={product?.url}><h2 className="product__title">{product?.name}</h2></a>
        <p className="product__descr">{product?.descr?.substring(0,100)}</p>
        <p className="product__price">Стартовая цена: <span>{product?.startPrice} ₽</span></p>
        <p className="product__price">Желаемая цена: <span>{product?.targetPrice} ₽</span></p>
        <div className="data-conteiner">
          {priceHistory?.length ? <Line options={options} data={data} /> : null}
        </div>
      </div>
      
    </div>
  )
}
