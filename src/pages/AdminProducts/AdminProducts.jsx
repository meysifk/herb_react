import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_URL } from '../../helper';
import { AddModal } from './ModalAddProduct/ModalAddProduct';
import {
  Card,
  Container,
  Grid,
  CardHeader,
  CardMedia,
  Typography,
  Divider,
  CardContent,
} from '@material-ui/core';
import Avatar from '@mui/material/Avatar';

import styled from 'styled-components';

const Button = styled.button`
  min-width: 100px;
  padding: 16px 32px;
  border-radius: 4px;
  border: none;
  background: #8ccfcd;
  color: #fff;
  cursor: pointer;
`;

const Admin = () => {
  const [productFetch, setProductFetch] = useState({
    productDataList: [],
    pagination: 1,
    maximumPage: 0,
    dataPerPage: 6,
  });

  const [editProduct, setEditProduct] = useState({
    editId: 0,
    editProductName: '',
    editProductDesc: '',
    editProductStock: null,
    editProductNetto: null,
    editProductNettoTotal: null,
    editProductUnit: null,
    editProductPricePerUnit: null,
    editProductPricePerStock: null,
    editProductBrand: '',
    editProductCategory: '',
  });

  const [addImage, setAddImage] = useState({
    addFile: '',
    addFileName: '',
  });

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal((prev) => !prev);
  };

  const fetchProducts = () => {
    Axios.get(`${API_URL}/products/get`)
      .then((res) => {
        setProductFetch({
          ...productFetch,
          productDataList: res.data,
          maximumPage: Math.ceil(res.data.length / productFetch.dataPerPage),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const refreshPage = () => {
    fetchProducts();
  };

  const editProducts = (editData) => {
    setEditProduct({
      ...editProduct,
      editId: editData.product_id,
      editProductName: editData.product_name,
      editProductDesc: editData.product_desc,
      editProductStock: editData.stock,
      editProductNetto: editData.netto,
      editProductNettoTotal: editData.netto_total,
      editProductUnit: editData.unit,
      editProductPricePerUnit: editData.price_per_unit,
      editProductPricePerStock: editData.price_per_stock,
      editProductBrand: editData.brand_id,
      editProductCategory: editData.category_id,
    });
  };

  const cancelEdit = () => {
    setEditProduct({ ...editProduct, editId: 0 });
  };

  const saveBtnHandler = () => {
    if (addImage.addFile) {
      let formData = new FormData();

      formData.append('file', addImage.addFile);

      formData.append(
        'data',
        JSON.stringify({
          product_name: editProduct.editProductName,
          product_desc: editProduct.editProductDesc,
          stock: editProduct.editProductStock,
          netto: editProduct.editProductNetto,
          netto_total: editProduct.editProductNettoTotal,
          unit: editProduct.editProductUnit,
          price_per_unit: editProduct.editProductPricePerUnit,
          price_per_stock: editProduct.editProductPricePerStock,
          brand_id: editProduct.editProductBrand,
          category_id: editProduct.editProductCategory,
        })
      );

      Axios.patch(`${API_URL}/products/update/${editProduct.editId}`, formData)
        .then((res) => {
          alert(res.data.message);
          fetchProducts();
          cancelEdit();
        })
        .catch(() => {
          alert(`Terjadi Kesalahan`);
        });
    } else if (!addImage.addFile) {
      Axios.patch(`${API_URL}/products/update/${editProduct.editId}`, {
        product_name: editProduct.editProductName,
        product_desc: editProduct.editProductDesc,
        product_img: productFetch.productDataList.product_img,
        stock: editProduct.editProductStock,
        netto: editProduct.editProductNetto,
        netto_total: editProduct.editProductNettoTotal,
        unit: editProduct.editProductUnit,
        price_per_unit: editProduct.editProductPricePerUnit,
        price_per_stock: editProduct.editProductPricePerStock,
        brand_id: editProduct.editProductBrand,
        category_id: editProduct.editProductCategory,
      })
        .then((res) => {
          alert(res.data.message);
          fetchProducts();
          cancelEdit();
        })
        .catch(() => {
          alert(`Terjadi Kesalahan`);
        });
    }
  };

  const deleteBtnHandler = (deleteId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this products?`
    );
    if (confirmDelete) {
      Axios.delete(`${API_URL}/products/delete/${deleteId}`)
        .then(() => {
          fetchProducts();
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      alert(`Cancelled to delete product.`);
    }
  };

  const btnAddImage = (e) => {
    if (e.target.files[0]) {
      setAddImage({
        ...addImage,
        addFileName: e.target.files[0].name,
        addFile: e.target.files[0],
      });

      let preview = document.getElementById('imgpreview');
      preview.src = URL.createObjectURL(e.target.files[0]);
    }
  };

  // render products
  const renderProducts = () => {
    const productPagination =
      (productFetch.pagination - 1) * productFetch.dataPerPage;

    let rawData = [...productFetch.productDataList];

    const itemPerPage = rawData.slice(
      productPagination,
      productPagination + productFetch.dataPerPage
    );

    return itemPerPage.map((product) => {
      if (product.product_id === editProduct.editId) {
        return (
          <div>
            <div className="m-4">
              <Card>
                <div className="modal-header">
                  <h2>Product No: {product.product_id}</h2>
                </div>
                <div className="modal-body">
                  <div>
                    <div>
                      <img id="imgpreview" alt="" width="100%" />
                    </div>
                    <label for="img" className="text-xl-left">
                      Add image
                    </label>
                    <input
                      onChange={btnAddImage}
                      type="file"
                      className="form-control"
                      id="img"
                    />
                  </div>
                  <div>
                    <label for="productname" className="text-xl-left">
                      Product Name
                    </label>
                    <input
                      value={editProduct.editProductName}
                      onChange={inputHandler}
                      type="text"
                      className="form-control"
                      name="editProductName"
                    />
                  </div>
                  <div>
                    <label for="productdescription" className="text-xl-left">
                      Product Description
                    </label>
                    <textarea
                      value={editProduct.editProductDesc}
                      onChange={inputHandler}
                      type="text"
                      className="form-control"
                      name="editProductDesc"
                    />
                  </div>
                  <div>
                    <label for="productstock" className="text-xl-left">
                      Product Stock
                    </label>
                    <input
                      value={editProduct.editProductStock}
                      onChange={inputHandler}
                      type="number"
                      className="form-control"
                      name="editProductStock"
                    />
                  </div>
                  <div>
                    <label for="productnetto" className="text-xl-left">
                      Product Netto
                    </label>
                    <input
                      value={editProduct.editProductNetto}
                      onChange={inputHandler}
                      type="number"
                      className="form-control"
                      name="editProductNetto"
                    />
                  </div>
                  <div>
                    <label for="productnettototal" className="text-xl-left">
                      Product Netto Total
                    </label>
                    <input
                      value={editProduct.editProductNettoTotal}
                      onChange={inputHandler}
                      type="number"
                      className="form-control"
                      name="editProductNettoTotal"
                    />
                  </div>
                  <div>
                    <label for="productunit" className="text-xl-left">
                      Product Unit
                    </label>
                    <select
                      value={editProduct.editProductUnit}
                      onChange={inputHandler}
                      type="text"
                      className="form-control"
                      name="editProductUnit"
                    >
                      <option value="ml">ml</option>
                      <option value="mg">mg</option>
                      <option value="tablet">tablet</option>
                      <option value="kaplet">kaplet</option>
                    </select>
                  </div>
                  <div>
                    <label for="productpriceperunit" className="text-xl-left">
                      Price Per Unit
                    </label>
                    <input
                      value={editProduct.editProductPricePerUnit}
                      onChange={inputHandler}
                      type="number"
                      className="form-control"
                      name="editProductPricePerUnit"
                    />
                  </div>
                  <div>
                    <label for="productpriceperstock" className="text-xl-left">
                      Product Price Per Stock
                    </label>
                    <input
                      value={editProduct.editProductPricePerStock}
                      onChange={inputHandler}
                      type="number"
                      className="form-control"
                      name="editProductPricePerStock"
                    />
                  </div>
                  <div>
                    <label for="productbrand" className="text-xl-left">
                      Product Brand
                    </label>
                    <select
                      value={editProduct.editProductBrand}
                      onChange={inputHandler}
                      type="number"
                      className="form-control"
                      name="editProductBrand"
                    >
                      <option value="1">Kalbe Farma</option>
                      <option value="2">Sanbe Farma</option>
                      <option value="3">Dexa Medica</option>
                      <option value="4">Pharos Indonesia</option>
                      <option value="5">Kimia Farma</option>
                      <option value="6">Biofarma</option>
                      <option value="7">Novartis</option>
                      <option value="8">PT. Sido Muncul Tbk.</option>
                      <option value="9">Blackmores Limited</option>
                      <option value="10">H&H Group</option>
                    </select>
                  </div>
                  <div>
                    <label for="productcategory" className="text-xl-left">
                      Product Category
                    </label>
                    <select
                      value={editProduct.editProductCategory}
                      onChange={inputHandler}
                      type="number"
                      className="form-control"
                      name="editProductCategory"
                    >
                      <option value="1">Antibiotics</option>
                      <option value="2">Antibacterials</option>
                      <option value="3">Antacids</option>
                      <option value="4">Antidepressants</option>
                      <option value="5">Antiarrhythmics</option>
                      <option value="6">Suplement</option>
                      <option value="7">Anti-Inflammatories</option>
                      <option value="8">Antipyretics</option>
                      <option value="9">Paracetamol</option>
                      <option value="10">Immunosuppressives</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    onClick={saveBtnHandler}
                    className="btn btn-secondary"
                  >
                    Save
                  </button>
                  <button onClick={cancelEdit} className="btn btn-danger">
                    Cancel
                  </button>
                </div>
              </Card>
            </div>
          </div>
        );
      }
      return (
        <Card
          className="col-4"
          style={{
            width: '100%',
            maxWidth: '700px',
            maxHeight: '100%',
            margin: '20px',
            display: 'block',
          }}
        >
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: 'red'[500] }} aria-label="index">
                {product.product_id}
              </Avatar>
            }
            title={<h6>{product.product_name}</h6>}
            color="inherit"
          />
          <Divider color="textSecondary" />
          <CardMedia
            style={{ maxHeight: '200px', maxWidth: '200px' }}
            component="img"
            height="100%"
            image={API_URL + product.product_img}
            alt=""
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              <strong>Description: </strong>
              {product.product_desc}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Available Stock: </strong>
              {product.stock}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Netto: </strong>
              {product.netto}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Netto Total: </strong>
              {product.netto_total}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Unit: </strong>
              {product.unit}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Price Per Unit: </strong>
              Rp.{product.price_per_unit}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Price Per Stock: </strong>
              Rp.{product.price_per_stock}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Brands: </strong>
              {product.products_brands}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Category: </strong>
              {product.products_category}
            </Typography>
          </CardContent>
          <Divider color="textSecondary" />
          <CardContent disable spacing className="d-flex flex-row-reverse">
            <button
              className="btn btn-danger mx-2"
              onClick={() => deleteBtnHandler(product.product_id)}
            >
              Delete
            </button>
            <button
              type="button"
              className="btn btn-secondary mx-2"
              data-toggle="modal"
              data-target="#editModal"
              onClick={() => editProducts(product)}
            >
              Edit
            </button>
          </CardContent>
        </Card>
      );
    });
  };

  const nextHandler = () => {
    if (productFetch.pagination < productFetch.maximumPage) {
      setProductFetch({
        ...productFetch,
        pagination: productFetch.pagination + 1,
      });
    }
  };

  const prevHandler = () => {
    if (productFetch.pagination > 1) {
      setProductFetch({
        ...productFetch,
        pagination: productFetch.pagination - 1,
      });
    }
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div>
        <Container gutterBottom align="center" className="my-3">
          <Grid spacing={2} container justifyContent="center">
            <h3 className="mx-4 my-3">Manage Products</h3>
            <button onClick={refreshPage}>
              <img
                src="https://img.icons8.com/ios-glyphs/30/000000/refresh--v2.png"
                alt=""
              />
            </button>
          </Grid>
          <div>
            <Button onClick={openModal}>Add New Product</Button>
          </div>
          <div>
            <AddModal showModal={showModal} setShowModal={setShowModal} />
          </div>
        </Container>
        <div
          style={{
            display: 'flex',
          }}
        >
          <Grid container justifyContent="center" spacing={4}>
            {renderProducts()}
          </Grid>
        </div>
        <div>
          <div className="mt-4">
            <div className="d-flex flex-row justify-content-center align-items-center mx-4">
              <button
                disabled={productFetch.pagination === 1}
                onClick={() => prevHandler()}
                className="btn btn-dark mx-2"
              >
                {'<'}
              </button>
              <div className="text-center mx-2">
                Page {productFetch.pagination} of {productFetch.maximumPage}
              </div>
              <button
                disabled={productFetch.pagination === productFetch.maximumPage}
                onClick={() => nextHandler()}
                className="btn btn-dark mx-2"
              >
                {'>'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Admin;
