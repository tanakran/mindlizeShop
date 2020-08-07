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
import { updateSalePre,deleteSalePre } from '../../store/actions/salePreAction';

import firebase from '../../database';
import firebaseS from "firebase";
import FileUploader from "react-firebase-file-uploader";


import { isEmpty,mapDataToState } from "../../functions/myFunction";
import ShowDate from "../../functions//ShowDate";




class Salelist extends Component {

  constructor(prop){
    super(prop);
    this.state={
      dataDetail:[],

      tableList: mapDataToState(prop.sale),

      modalADD: false,
    }
    this.toggleModalADD = this.toggleModalADD.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      dataDetail:[],
      tableList: mapDataToState(nextProps.sale),
    });
  }



  toggleModalADD(id) { 
    if(this.state.modalADD==false){
      this.setState({
        dataDetail:this.props.saleWithID[id],
        modalADD: !this.state.modalADD,
      });
    }else{
      this.setState({
        modalADD: !this.state.modalADD,
      });
    }
    
    
  }


  updateStatusToDB(id){
    let data = {
      is_pay:true
    }
    this.props.updateSalePre({data:data,id:id})
  }

  deleteDB(id){
    let data = {
      is_pay:false
    }
    this.props.deleteSalePre({data:data,id:id})
  }
  


  render() {
    const { dataDetail } = this.state
    const { productWithIndexID,customer} = this.props;

    let showBilDetail=[];
    let showBilTotal=[];
    let showBilStatus=<b style={{color:"red"}}>รอโอน</b>
    let showBilHeader="ใบแจ้งยอด"

    const columns = [ //-------------- ชุดคำสั่ง กำหนด โครงสร้างของตาราง
      {
        title: "Lot",
        field: "lot_name",
        render: rowData => <div>{rowData.lot_name}</div>
      },
      {
        title: "Facebook",
        field: "fb_name",
        render: rowData => <div>{customer[rowData.cus_id].fb_name}</div>
      },
      {
        title: "วันที่สั่ง",
        field: "sale_date",
        render: rowData => <div>{ShowDate(rowData.sale_date)}</div>
      },
      {
        title: "ยอดรวม (บาท)",
        field: "bilNetTotal",
        render: rowData => <div>{rowData.bilNetTotal}</div>
      },
      {
        title: "หมายเหตุ",
        field: "bilRemark",
        render: rowData => <div>{rowData.bilRemark}</div>
      },
      {
        title: "สถานะ",
        field: "is_pay",
        render: rowData => {
          if(rowData.is_pay==true){
            return <b style={{color:"green"}}>ชำระเงินแล้ว</b>
          }else{
            return <b style={{color:"red"}}>รอโอน</b>
          }
        }
      },


    ];
    
    const data = this.state.tableList; 

    const actions = [ 
      {
        icon: 'description',
        tooltip: 'Receipt',
        onClick: (event, rowData) => this.toggleModalADD(rowData.id) 
      },
      rowData=>{
        if(rowData.is_pay==false){
          return {
            icon: 'done',
            tooltip: 'Payed',
            onClick: (event, rowData) => {if(window.confirm('ต้องการเปลี่ยนสถานะ?')){this.updateStatusToDB(rowData.id)};}
          }
        }
      },
      rowData=>{
        if(rowData.is_pay==false){
          return {
            icon: 'delete',
            tooltip: 'Delete',
            onClick: (event, rowData) => {if(window.confirm('ต้องการลบข้อมูลนี้?')){this.deleteDB(rowData.id)};}
          }
        }
      },
    ];

    const options={
      actionsColumnIndex: -1,
      exportButton: true,
      grouping: true,
      search: true,
      pageSizeOptions:[10,30,50,100]
    };

    if(!isEmpty(dataDetail)){
      const detail = dataDetail.detail;

      const productShowData = this.props.productWithIndexID;

      let total_amount = 0;

      for (let i = 0; i < detail.length; i++) {
        total_amount+=parseFloat(detail[i].amount)
        showBilDetail.push(
          <tr>
            <td>{(i+1)}</td>
            <td><img src={productShowData[detail[i].id].pd_pic || "https://via.placeholder.com/200x150"} alt="Uploaded Images" width="25"/></td>
            <td>{productShowData[detail[i].id].pd_code}</td>
            <td>{productShowData[detail[i].id].pd_name}</td>
            <td className="text-right">{detail[i].pd_price}</td>
            <td className="text-center">{detail[i].amount}</td>
            <td className="text-right" style={{color:"green"}}>{detail[i].total}</td>
          </tr>
        );
      }

      showBilTotal.push(
        <tr>
          <td colSpan="5" className="text-right">รวม</td>
          <td className="text-center">{total_amount} เมตร</td>
          <td className="text-right">{dataDetail.bilTotal}</td>
        </tr>
      );

      if(dataDetail.bil_discount>0){
        showBilTotal.push(
          <tr>
            <td colSpan="6" className="text-right">หัก ส่วนลด</td>
            <td className="text-right" style={{color:"red"}}>{dataDetail.bil_discount}</td>
          </tr>
        );
      }


      if(dataDetail.transpotationCost>0){
        showBilTotal.push(
          <tr>
            <td colSpan="6" className="text-right">บวก ค่าขนส่ง</td>
            <td className="text-right" style={{color:"green"}}>{dataDetail.transpotationCost}</td>
          </tr>
        );
      }

      if(dataDetail.is_pay==true){
        showBilStatus=<b style={{color:"green"}}>ชำระเงินแล้ว</b>
        showBilHeader="ใบเสร็จรับเงิน"
        
      }

      

    }

    return (
      <div className="animated fadeIn">

        <Row>
          <Col xs="12" md="12">
                <MaterialTable
                  title={"รายการสรุปยอด (Pre-Order)"}
                  columns={columns}
                  data={data}
                  options={options}
                  actions={actions}
                />

          </Col>
        </Row>



        <Modal isOpen={this.state.modalADD} toggle={this.toggleModalADD}
                       className={'modal-lg modal-success ' + this.props.className}>
                  <ModalHeader toggle={this.toggleModalADD}>{showBilHeader}</ModalHeader>
                  <Form>
                  <ModalBody style={{paddingLeft:"10%",paddingRight:"10%",fontSize:"120%"}}>
                    <Row>
                      <Col xs="12" className="text-center">
                        <br/>
                      </Col>
                      <Col xs="12" className="text-center">
                        <h3><u>{showBilHeader}</u></h3>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs="12" >
                        <b>MindLize Shop</b>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs="5" >
                        ที่อยู่ 167/32 หมู่ที่ 7 ต.สุเทพ		
                        อ.เมือง จ.เชียงใหม่ 50200		
                      </Col>

                      <Col xs="7"  className="text-right">
                        <Row>
                          <Col xs="12" className="text-right">
                            <b>โทรศัพท์ : </b> 087-5686932	
                          </Col>
                        </Row>

                        <Row>
                          <Col xs="12" className="text-right">
                            <b>LINE : </b> @885ujqrl	
                          </Col>
                        </Row>

                        <Row>
                          <Col xs="12" className="text-right">
                            <b>Facebook: : </b> www.facebook.com/MindLize
                          </Col>
                        </Row>


                      </Col>
                    </Row>



                    <Row>
                      <Col xs="12" >
                        <b>วันที่ : </b> {ShowDate(dataDetail.sale_date,"Date")}
                      </Col>
                    </Row>

                    <Row>
                      <Col xs="6" >
                        <b>FB ลูกค้า : </b> {dataDetail.fb_name}
                      </Col>
                      <Col xs="6" className="text-right">
                        <b>สถานะการชำระเงิน : </b> {showBilStatus}
                      </Col>
                    </Row>

                    <Row>
                      <Col xs="12" className="text-right">
                        <b>หมายเหตุ : </b> {dataDetail.bilRemark || "ไม่ระบุ"}
                      </Col>
                    </Row>

    

                    <Row className="mt-3">
                      <Col xs="12" >
                        <Table striped>
                          <thead style={{fontSize:"80%"}}>
                            <tr>
                              <th>#</th>
                              <th>รูป</th>
                              <th>รหัสสินค้า</th>
                              <th>ชื่อสินค้า</th>
                              <th className="text-right">ราคา/หน่วย</th>
                              <th>ความยาว (เมตร)</th>
                              <th className="text-right">ราคารวม</th>
                            </tr>
                          </thead>
                          <tbody style={{fontSize:"70%"}}>
                            {showBilDetail}
                          </tbody>
                          <tfoot>
                            {showBilTotal}
                            <tr>
                              <th colSpan="6" className="text-right">รวมทั้งสิ้น</th>
                              <th className="text-right">{dataDetail.bilNetTotal} บาท</th>
                            </tr>
                          </tfoot>
                        </Table>
                      </Col>
                    </Row>


                  </ModalBody>

                  </Form>
                </Modal>
      
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
    updateSalePre: (data) => dispatch(updateSalePre(data)),
    deleteSalePre: (data) => dispatch(deleteSalePre(data)),
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
)(Salelist)

