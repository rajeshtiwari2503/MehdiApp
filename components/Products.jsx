import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import http_request from "../http_request";
import ProductList from './ProductList';
  

const Products = () => {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState("");

  useEffect(() => {
    getAllProducts();
    getAllCategories();
    getAllBrands();
  }, [refresh]);

  const getAllProducts = async () => {
    let response = await http_request.get("/getAllProduct");
    let { data } = response;
    setProducts(data);
  };

  const getAllCategories = async () => {
    let response = await http_request.get("/getAllProductCategory");
    let { data } = response;
    setCategories(data);
  };

  const getAllBrands = async () => {
    let response = await http_request.get("/getAllBrand");
    let { data } = response;
    setBrands(data);
  };

  const data = products?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data);
  };

  return (
    <View style={styles.container}>
      
        <ScrollView>
          <ProductList categories={categories} brands={brands} data={data} RefreshData={RefreshData} />
        </ScrollView>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
        // padding: 10,
        backgroundColor: '#fff',
        marginTop:5,
         marginBottom:5,
        borderRadius:30
  },
});

export default Products;
