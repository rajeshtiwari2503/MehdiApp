import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import StockList from "./StockList"
import http_request from "../http_request"

export default function Stocks() {
    const [stocks, setStocks] = useState([])
    const [products, setProducts] = useState([])

    const [refresh, setRefresh] = useState("")

    useEffect(() => {
      getAllStocks()
      getAllProducts()
    }, [refresh])
  
  
    const getAllStocks = async () => {
      let response = await http_request.get("/getAllStock")
      let { data } = response;
  
      setStocks (data)
    }
    const getAllProducts = async () => {
      let response = await http_request.get("/getAllSparepart")
      let { data } = response;
  
      setProducts (data)
    }
  
    const data = stocks?.map((item, index) => ({ ...item, i: index + 1}));

    const RefreshData = (data) => {
      setRefresh(data)
    }
  
  return (
    <View>
         <StockList data={data} products={products} RefreshData={RefreshData}/>
    </View>
  )
}