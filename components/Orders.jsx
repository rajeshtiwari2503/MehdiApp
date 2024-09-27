import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import http_request from "../http_request"
import OrderList from "../components/OrderList"


export default function Orders() {
    const [stocks, setStocks] = useState([])

    const [refresh, setRefresh] = useState("")

    useEffect(() => {
      getAllStocks()
     
    }, [refresh])
  
  
    const getAllStocks = async () => {
      let response = await http_request.get("/getAllStock")
      let { data } = response;
  
      setStocks (data)
    }
  
  
    const data = stocks?.map((item, index) => ({ ...item, i: index + 1}));

    const RefreshData = (data) => {
      setRefresh(data)
    }
  
  return (
    <View>
         <OrderList data={data}   RefreshData={RefreshData}/>
    </View>
  )
}