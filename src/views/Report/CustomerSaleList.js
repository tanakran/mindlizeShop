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
  FormGroup,
  Label,
  Input,
  FormText,} from 'reactstrap';

import MaterialTable from "material-table";

import {connect} from 'react-redux';
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';



class CustomerSaleList extends Component {

  constructor(prop){
    super(prop);
    this.state={

      tableList: this.mapDataToState(prop.customer),
      modalADD: false,
    }
    this.toggleModalADD = this.toggleModalADD.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      tableList: this.mapDataToState(nextProps.customer),
    });
  }

  toggleModalADD() { 
    this.setState({
      modalADD: !this.state.modalADD,
    });
    
  }


  mapDataToState(data){
    const { sale} = this.props;
    let result=[];
    if(data){
      data.map(item=>{
        let rs = this.calTotalSale(item.id,sale);
        let lotto = (rs.totalBuy/200);
        if(lotto<1 && lotto!=0){
          lotto=1;
        }
        if(lotto!=0){
          result.push({
            ...item,
            totalLot:rs.totalLot,
            totalBuy:rs.totalBuy,
            lotto:~~lotto,
          })
        }
        
      })
      
      return result
    }else{
      return result
    }
  }

  calTotalSale(cus_id,sale_data){
    if(sale_data){
      let thisLot = "";
      let totalBuy = 0;
      let totalLot = "";
      sale_data.map(item=>{
        if(cus_id==item.cus_id){
          if(thisLot!=item.lot_name){
            thisLot=item.lot_name;
            totalLot+=thisLot+" / ";
          }
          totalBuy+=parseFloat(item.bilNetTotal)
        }
      })
      return {totalLot:totalLot,totalBuy:totalBuy}
    }else{
      return [];
    }
    
  }

  render() {

    const columns = [ //-------------- ชุดคำสั่ง กำหนด โครงสร้างของตาราง

      {
        title: "Facebook",
        field: "fb_name",
        render: rowData => <div><a href={rowData.fb_link} target="_blank">{rowData.fb_name}</a></div>
      },
      {
        title: "Lot",
        field: "totalLot",
        render: rowData => <div>{rowData.totalLot}</div>
      },
      {
        title: "ยอดซื้อรวม",
        field: "totalBuy",
        render: rowData => <div>{rowData.totalBuy}</div>
      },
      {
        title: "จำนวนสิทธิ์",
        field: "lotto",
        render: rowData => <div>{rowData.lotto}</div>
      },


    ];
    
    const data = this.state.tableList; //------------------- เป็นการ ดึงค่าจาก state ลงมาเก็บไว้ใน ตัวแปร data เพื่อ เอามาแสดงในตารางต่อไป

    const options={ //----------------------- ใช้ กำหนด option ให้่ตาราง อยากตกแต่ง ค้นข้อมูล material-table ดู มี อะไรให้ใช้เยอะมาก
      actionsColumnIndex: -1,
      exportButton: true,
      grouping: true,
      search: true,
      pageSizeOptions:[10,30,50,100,250]
    };

    return (
      <div className="animated fadeIn">

<Row>
          <Col xs="12" md="12">
          <Button color="success" onClick={this.toggleModalADD} className="mb-4 " size="lg">พิมพ์สลาก</Button>
          <Modal isOpen={this.state.modalADD} toggle={this.toggleModalADD}
                       className={'modal-lg modal-success ' + this.props.className}>
                  <ModalHeader toggle={this.toggleModalADD}>รายชื่อจับรางวัล</ModalHeader>
                  <Form>
                  <ModalBody>

                 
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={this.toggleModalADD}>ยกเลิก</Button>
                  </ModalFooter>
                  </Form>
                </Modal>         
          </Col>
        </Row>


        <Row>
          <Col xs="12" md="12">
                <MaterialTable
                  title={"ยอดซื้อรายคน"}
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
    customer:state.firestore.ordered.customer,
    sale:state.firestore.ordered.sale,

    test:state.firestore.ordered.lot,
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
  }
}
//export default (Home)
export default compose(
  connect(mapStateToProps,mapDispatchToProps),
  firestoreConnect([
    {
      collection:'customer',
      where: [['is_del', '==', false]],
      orderBy:[['fb_name','asc']]
    },
    {
      collection:'sale',
      orderBy:[['sale_date','asc']]
    },
    {
      collection:'lot',
      orderBy:[['lot_close_date','asc']]
    },
  ])
)(CustomerSaleList)