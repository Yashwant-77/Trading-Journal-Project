import React, { useState, useEffect , useRef } from 'react';
import TradeForm from '../components/TradeForm';
import TradeCard from '../components/TradeCard';
import API from '../api';
import Header from '../components/Header';

export default function AddTrade() {
 
  const [loading, setLoading] = useState(false);

  

  


  const formRef = useRef();

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header  />
      
      <div className="bg-[#121212] max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
      


        <TradeForm  />
    
      </div>
    </div>
  );
}