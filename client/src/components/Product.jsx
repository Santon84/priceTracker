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


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);






export default function Product({product}) {
  const [prices] = useState([1399, 1399, 2499, 2399,2000, 1200,1200])
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

  return (
    <div className="product">
      <div className="product__left">
        <div className="image">
          <img alt={product.name} src={product.image}></img>
        </div>


      </div>
      <div className="product__right">
        <a href={product?.url}><h2 className="product__title">{product?.name}</h2></a>
        <p className="product__descr">{product?.descr?.substring(0,100)}</p>
        <p className="product__price">{product?.startPrice} ₽</p>
        <div className="data-conteiner">
          {priceHistory?.length ? <Line options={options} data={data} /> : null}
        </div>
      </div>
    </div>
  )
}
