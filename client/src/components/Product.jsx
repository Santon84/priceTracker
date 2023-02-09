import './Product.scss'
import React from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    
  },
 
};

const labels = ['1.03.23', '2.03.23', '3.03.23', '4.03.23', '5.03.23', '6.03.23', '7.03.23'];

export const data = {
  labels,
  datasets: [
    {
      label: 'История цен',
      data: [1399, 1399, 2499, 4399,2000, 1200,1200],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      pointBorderColor: 'rgba(255, 99, 132, 0.5)',
      tension: 0.4,
      fill: true,
    },
    
  ],
};

export default function Product({product}) {

 

  return (
    <div className="product">
      <div className="product__left">
        <div className="image">
          <img alt={product.name} src={product.image}></img>
        </div>


      </div>
      <div className="product__right">
        <a href={product.offers.url}><h2 className="product__title">{product.name}</h2></a>
        <p className="product__descr">{product.description.substring(0,100)}</p>
        <p className="product__price">{product.offers.price} {product.offers.priceCurrency}</p>
        <div className="data-conteiner">
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  )
}
