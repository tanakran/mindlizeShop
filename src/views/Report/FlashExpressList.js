import React, { Component }  from "react";

// core components
import { 
  Col, 
  Row, 
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Table,} from 'reactstrap';

import MaterialTable from "material-table";

import {connect} from 'react-redux';
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { updateSale,deleteSale } from '../../store/actions/saleAction';

import firebase from '../../database';
import firebaseS from "firebase";
import FileUploader from "react-firebase-file-uploader";


import { isEmpty,mapDataToState } from "../../functions/myFunction";
import ShowDate from "../../functions/ShowDate";


 const weightFactor = {
  weightFactor:(91.5),
  this_length:(27),
  width:(22),
  heightFactor:(0.8),
 }

class FlashExpressList extends Component {

  constructor(prop){
    super(prop);
    this.state={
      dataDetail:[],

      tableList: this.setTable(prop.sale),

    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      dataDetail:[],
      tableList: this.setTable(nextProps.sale),
    });
  }

  setTable(data){
    const data_list = mapDataToState(data);
    const { customer } = this.props;
    let result = [];
    data_list.map((item)=>{
      const cus_id = item.cus_id;
      const detail = item.detail;
      let totalWeight = 0;
      detail.map((ditem)=>{
        totalWeight+=parseFloat(ditem.amount)
      });

      let heightVar = (totalWeight/0.5)*weightFactor.heightFactor;
      if(heightVar>30){
        heightVar=30;
      }

      /*if(customer[cus_id].fb_name=="Meena Rujirakamote"){
        if(item.lot_name=="Lot 2"){
          console.log(totalWeight+"/"+0.5+")*"+weightFactor.weightFactor);
          console.log(detail);
        }
        

      }*/

      result.push({
        lot_name:item.lot_name,
        cus_name:customer[cus_id].cus_name,
        fb_name:customer[cus_id].fb_name,
        address:customer[cus_id].address,
        post_code:customer[cus_id].post_code,
        cus_tel:customer[cus_id].cus_tel,
        weight:parseFloat(((totalWeight/0.5)*weightFactor.weightFactor)/1000).toFixed(2),
        this_length:weightFactor.this_length,
        width:weightFactor.width,
        height:parseFloat(heightVar).toFixed(2),
        Tel2:" ",
        item_type:" ",
        FI:"N",
        VI:"N",
        DV:"0",
        SS:"N",
      })
    })
    return result
  }


  render() {


    const columns = [ //-------------- ชุดคำสั่ง กำหนด โครงสร้างของตาราง
      {
        title: "Lot",
        field: "lot_name",
        render: rowData => <div>{rowData.lot_name}</div>
      },
      {
        title: "Name",
        field: "cus_name",
      render: rowData => <div>{rowData.cus_name}({rowData.fb_name})</div>
      },
      {
        title: "Address",
        field: "address",
        render: rowData => <div>{rowData.address}</div>
      },
      {
        title: "Post Code",
        field: "post_code",
        render: rowData => <div>{rowData.post_code}</div>
      },
      {
        title: "Tel",
        field: "cus_tel",
        render: rowData => <div>{rowData.cus_tel}</div>
      },

      
      {
        title: "Tel2",
        field: "Tel2",
        render: rowData => <div>{rowData.Tel2}</div>
      },
      {
        title: "item_type",
        field: "item_type",
        render: rowData => <div>{rowData.item_type}</div>
      },
      {
        title: "FI",
        field: "FI",
        render: rowData => <div>{rowData.FI}</div>
      },
      {
        title: "VI",
        field: "VI",
        render: rowData => <div>{rowData.VI}</div>
      },
      {
        title: "DV",
        field: "DV",
        render: rowData => <div>{rowData.DV}</div>
      },
      {
        title: "SS",
        field: "SS",
        render: rowData => <div>{rowData.SS}</div>
      },

      
      {
        title: "weight",
        field: "weight",
        render: rowData => <div>{rowData.weight}</div>
      },
      {
        title: "length",
        field: "this_length",
        render: rowData => <div>{rowData.this_length}</div>
      },
      {
        title: "width",
        field: "width",
        render: rowData => <div>{rowData.width}</div>
      },
      {
        title: "height",
        field: "height",
        render: rowData => <div>{rowData.height}</div>
      },


    ];
    
    const data = this.state.tableList; 


    const options={
      actionsColumnIndex: -1,
      exportButton: true,
      grouping: true,
      search: true,
      pageSizeOptions:[10,30,50,100]
    };



    return (
      <div className="animated fadeIn">

        <Row>
          <Col xs="12" md="12">
                <MaterialTable
                  title={"Flash Express Shipping"}
                  columns={columns}
                  data={data}
                  options={options}
                />

          </Col>
        </Row>


      </div>
  
    );
  }
}

const mapStateToProps = (state) =>{
  return{
    sale:state.firestore.ordered.sale,
    saleWithID:state.firestore.data.sale,

    productWithIndexID:state.firestore.data.product,

    customer:state.firestore.data.customer,

    lot:state.firestore.ordered.lot,
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    updateSale: (data) => dispatch(updateSale(data)),
    deleteSale: (data) => dispatch(deleteSale(data)),
  }
}
//export default (Home)
export default compose(
  connect(mapStateToProps,mapDispatchToProps),
  firestoreConnect([
    {
      collection:'product',
      where: [['is_del', '==', false]],
    },
    {
        collection:'customer',
        where: [['is_del', '==', false]],
    },
    {
      collection:'sale',
      orderBy:[['sale_date','desc'],['is_pay','asc']]
    }
  ])
)(FlashExpressList)

