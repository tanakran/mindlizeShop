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
  Table,
  Card,
  CardText,
  InputGroup,
  Input} from 'reactstrap';

import MaterialTable from "material-table";


import {CopyToClipboard} from 'react-copy-to-clipboard';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import {connect} from 'react-redux';
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { updateSale } from '../../store/actions/saleAction';

import firebase from '../../database';
import firebaseS from "firebase";
import FileUploader from "react-firebase-file-uploader";


import { isEmpty,mapDataToState } from "../../functions/myFunction";
import ShowDate from "../../functions//ShowDate";
import Notify from "../../library/Notify";


const initCol={
  selected_lot_name:"",
  totalList:"",
  totalLenght:"",
  totalDetail:"",

  totalSale:"",
  totalDiscount:"",
  totalTransport:"",

  totalPayed:"",
  totalAmountPayed:"",
  totalNotPay:"",
  totalAmountNotPay:"",
}


class LotList extends Component {

  constructor(prop){
    super(prop);
    this.state={
        dataDetail:[],
        addressList:[],
        dataTable:[],

        tableList: mapDataToState(prop.sale),

        lot: mapDataToState(prop.lot),

        modalADD: false,

        modalList: false,

        modalAddressList: false,

        selLot_id:"",

        ...initCol,
    }

    this.toggleModalADD = this.toggleModalADD.bind(this);
    this.toggleModalList = this.toggleModalList.bind(this);
    this.toggleModalAddressList = this.toggleModalAddressList.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({
        dataDetail:[],
        dataTable:[],
        tableList: mapDataToState(nextProps.sale),

        lot: mapDataToState(nextProps.lot),

        selLot_id:"",

        ...initCol,
    });
  }



  toggleModalADD(data) { 
    if(this.state.modalADD==false){
      this.setState({
        dataDetail:this.setDataDetail(data),
        modalADD: !this.state.modalADD,
      });
    }else{
      this.setState({
        modalADD: !this.state.modalADD,
      });
    }
    
    
  }

  toggleModalList() { 
    this.setState({
      modalList: !this.state.modalList,
    });
}

  toggleModalAddressList() { 

    if(this.state.modalAddressList==false){
      this.setState({
        addressList:this.setAddressList(),
        modalAddressList: !this.state.modalAddressList,
      });
    }else{
      this.setState({
        modalAddressList: !this.state.modalAddressList,
      });
    }
    
    
  }

  setAddressList(){
    const lot_id = this.state.selLot_id;
    const { tableList } = this.state;

    const { customer } = this.props;

    let data = [];
    tableList.map(item=>{
      if(item.lot_id==lot_id){

        data.push(
          <div>
          <Row>
            <Col xs="12" style={{fontSize:"small"}}>{customer[item.cus_id].cus_name}</Col>
          </Row>

          <Row>
            <Col xs="12" style={{fontSize:"small"}}>({customer[item.cus_id].fb_name})</Col>
          </Row>

          <Row>
            <Col xs="12" style={{fontSize:"small"}}>{customer[item.cus_id].address}</Col>
          </Row>

          <Row>
            <Col xs="4" style={{fontSize:"small"}}>{customer[item.cus_id].cus_tel}</Col>
            <Col xs="8"></Col>
          </Row>

          <Row>
            <Col xs="4"><br/><br/>......<br/><br/></Col>
            <Col xs="8"></Col>
          </Row>
          </div>
        )
      }
    });

    return data;
  }

  setDataDetail(data){

    const { saleDetail } = data
    
    let tbDetail = saleDetail.map((item,i)=>{
        let status = <b className="text-success">จ่ายแล้ว</b>;
        if(item.is_pay==false){
            status = <b className="text-danger">ค้างจ่าย</b>;
        }
        return(
            <tr>
                <td>{(i+1)}</td>
                <td>{item.fb_name}</td>
                <td>{item.amount}</td>
                <td>{status}</td>
            </tr>
        )
  });

    return(
        <div>
            <Row>
                <Col xs="3" className="text-right">
                    <h3>รูปสินค้า : </h3>
                </Col>
                <Col xs="9">
                    <img src={data.pd_pic || "https://via.placeholder.com/200x150"} alt="Uploaded Images" width="200"/>
                </Col>

                <Col xs="3" className="text-right mt-2">
                    <h3>Code : </h3>
                </Col>
                <Col xs="9" className="mt-2">
                    <h3>{data.pd_code}</h3>
                </Col>
            </Row>

            <Row>
                <Col xs="12">
                    <hr/>
                </Col>
            </Row>

            <Row>
                <Col xs="12">
                    <Table striped>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Facebook</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {tbDetail}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    )
  }

  searchWithLotID = (id) =>{
    const { tableList } = this.state;
    const { productWithIndexID , customer } = this.props;
    let dataTable=[];
    let saleProductList=[];

    let lot_name="";
    let lotList=0;
    let lotLenght=0;
    let lotDetailLenght=0;

    let lotSale=0;
    let lotDiscount=0;
    let lotTransport=0;

    let lotPayed=0;
    let lotAmountPayed=0;
    let lotNotPay=0;
    let lotAmountNotPay=0;

    tableList.map(item=>{
        if(item.lot_id==id){
          lot_name=item.lot_name;

          lotList++;

          lotSale+=parseFloat(item.bilNetTotal);
          lotDiscount+=parseFloat(item.bil_discount);
          lotTransport+=parseFloat(item.transpotationCost);

          if(item.is_pay==true){
            lotPayed++;
            lotAmountPayed+=parseFloat(item.bilNetTotal);
          }else{
            lotNotPay++;
            lotAmountNotPay+=parseFloat(item.bilNetTotal);
          }

            const {detail} = item;
            for (let i = 0; i < detail.length; i++) {
                if(isEmpty(saleProductList[detail[i]['id']])){

                    lotDetailLenght++;


                    let saleDetail=[];
                    const cus_id=item.cus_id;

                    let totalOrder = parseFloat(detail[i]['amount']);

                    saleDetail.push({
                        cus_id:cus_id,
                        fb_name:customer[cus_id].fb_name,
                        is_pay:item.is_pay,
                        amount:parseFloat(detail[i]['amount']),
                    });

                    lotLenght+=parseFloat(detail[i]['amount']);

                    saleProductList[detail[i]['id']]={
                        pd_id:detail[i]['id'],
                        lot_name:item.lot_name,
                        pd_code:productWithIndexID[detail[i]['id']].pd_code,
                        pd_link:productWithIndexID[detail[i]['id']].pd_link,
                        pd_name:productWithIndexID[detail[i]['id']].pd_name,
                        pd_pic:productWithIndexID[detail[i]['id']].pd_pic,
                        totalOrder:totalOrder,
                        saleDetail:saleDetail,
                    };
                }else{
                    let saleDetail=saleProductList[detail[i]['id']].saleDetail;
                    const cus_id=item.cus_id;

                    let totalOrder = parseFloat(saleProductList[detail[i]['id']].totalOrder);

                    totalOrder+=parseFloat(detail[i]['amount']);


                    saleDetail.push({
                        cus_id:cus_id,
                        fb_name:customer[cus_id].fb_name,
                        is_pay:item.is_pay,
                        amount:parseFloat(detail[i]['amount']),
                    });

                    lotLenght+=parseFloat(detail[i]['amount']);


                    saleProductList[detail[i]['id']].saleDetail=saleDetail;
                    saleProductList[detail[i]['id']].totalOrder=totalOrder;

                }
            }
        }
        
    });

    Object.keys(saleProductList).map((item, i)=>{
        dataTable.push(saleProductList[item])
    })

    this.setState({
        selLot_id:id,


        dataTable:dataTable,

        selected_lot_name:lot_name,
        totalList:lotList,
        totalLenght:lotLenght,
        totalDetail:lotDetailLenght,


        totalSale:lotSale,
        totalDiscount:lotDiscount,
        totalTransport:lotTransport,

        totalPayed:lotPayed,
        totalAmountPayed:lotAmountPayed,
        totalNotPay:lotNotPay,
        totalAmountNotPay:lotAmountNotPay,
    });
  }

  getPayAmount(data,payType){

    const { saleDetail } = data
    let totalPayed=0;
    let totalNotPay=0;
    saleDetail.map((item,i)=>{

        if(item.is_pay==false){
          totalNotPay+=parseFloat(item.amount);
        }else{
          totalPayed+=parseFloat(item.amount);
        }
    });

    if(payType==true){
      return totalPayed;
    }else{
      return totalNotPay;
    }
  }







  render() {
    const { lot,
      dataTable,

      selected_lot_name,
      totalLenght,
      totalList,
      totalDetail,

      totalSale,
      totalDiscount,
      totalTransport,

      totalPayed,
      totalAmountPayed,
      totalNotPay,
      totalAmountNotPay,

    } = this.state

    let infoText ={
      lotName:"",
      totalList:"",
      totalLenght:"",
      totalDetail:"",
    }

    let moneyText ={
      totalSale:"",
      totalDiscount:"",
      totalTransport:"",
    }

    let payText = {
      totalPayed:"",
      totalAmountPayed:"",
      textDevine:"",
      totalNotPay:"",
      totalAmountNotPay:"",
    }

    let listToBuyBTN="";


    const columns = [ //-------------- ชุดคำสั่ง กำหนด โครงสร้างของตาราง
      {
        title: "รูป",
        field: "pd_pic",
        render: rowData => <div><img src={rowData.pd_pic || "https://via.placeholder.com/200x150"} alt="Uploaded Images" width="200"/></div>
      },
      {
        title: "Lot",
        field: "lot_name",
        render: rowData => <div>{rowData.lot_name}</div>
      },
      {
        title: "Code",
        field: "pd_code",
        render: rowData => <div>{rowData.pd_code}</div>
      },
      {
        title: "ชื่อสินค้า",
        field: "pd_name",
        render: rowData => <div>{rowData.pd_name}</div>
      },
      {
        title: "จ่ายแล้ว",
        field: "is_pay",
        render: rowData => <div><span className="text-success"><b>{this.getPayAmount(rowData,true)}</b></span></div>
      },
      {
        title: "ค้างจ่าย",
        field: "is_pay",
        render: rowData => <div><span className="text-danger"><b>{this.getPayAmount(rowData,false)}</b></span></div>
      },
      {
        title: "รวม(เมตร) (จน. สั่งซื้อ)",
        field: "totalOrder",
        render: rowData => <div>{rowData.totalOrder } <b className="text-danger"><u>({(rowData.totalOrder*2)})</u></b></div>
      },
      {
        title: "Check",
        field: "totalOrder",
        render: rowData => <div><Input type="checkbox" name="chk"></Input></div>
      },
      {
        title: "Link to Buy",
        field: "pd_link",
        render: rowData => {
          if(!isEmpty(rowData.pd_link)){
            return(
              <CopyToClipboard text={rowData.pd_link} onCopy={()=> Notify("Copy to clipboard.")}><Button  color="primary">Copy Link</Button></CopyToClipboard>)
          }else{
            return(<b className="text-danger">NoLink</b>)
          }
        }
      },
     

    ];

    
    const data = dataTable; 

    const actions = [ 
      {
        icon: 'description',
        tooltip: 'Receipt',
        onClick: (event, rowData) => this.toggleModalADD(rowData) 
      },
    ];

    const options={
      actionsColumnIndex: -1,
      exportButton: true,
      grouping: true,
      search: true,
      pageSizeOptions:[10,30,50,100]
    };

    if(!isEmpty(selected_lot_name)){

      infoText ={
        lotName:(
          <Col xs="12" className="text-right">
            <h2>
              
            <u>
              {selected_lot_name}
            </u></h2>
          </Col>
        ),
        totalList:(
          <Col xs="12" className="text-right">
            <h3>ลูกค้า
              &nbsp;&nbsp;
              {totalList}
              &nbsp;&nbsp;
              คน
            </h3>
          </Col>
        ),
        totalDetail:(
          <Col xs="12" className="text-right">
            <h3>
              ลายผ้า &nbsp;&nbsp;
              {totalDetail}
              &nbsp;&nbsp;
              ลาย
            </h3>
          </Col>
        ),
        totalLenght:(
          <Row className="pr-2">
            <Col xs="12" className="text-right">
              <h3>
                รวม &nbsp;&nbsp;
                {totalLenght}
                &nbsp;&nbsp;
                เมตร
              </h3>
            </Col>

            <Col xs="12" className="text-right">
              <h3><b>
                ยอดสั่ง รวม &nbsp;&nbsp;
                {(totalLenght*2)}
                &nbsp;&nbsp;
                เมตร
                </b></h3>
            </Col>
          </Row>
        ),
      }


      moneyText ={
        totalSale:(
          <Col xs="12" className="text-right">
            <h2>
              ยอดสุทธิ &nbsp;&nbsp;
              ฿{totalSale}

            </h2>
          </Col>
        ),
        totalDiscount:(
          <Col xs="12" className="text-right">
            <h3 style={{color:"red"}}>
              ส่วนลด &nbsp;&nbsp;
              ฿{totalDiscount}
            </h3>
          </Col>
        ),
        totalTransport:(
          <Col xs="12" className="text-right">
            <h3>
            ค่าขนส่ง &nbsp;&nbsp;
              ฿{totalTransport}
            </h3>
          </Col>
        ),
      }



      payText = {
        totalPayed:(
          <Col xs="12" className="text-right">
            <h4>
            จ่ายแล้ว &nbsp;&nbsp;
              {totalPayed}&nbsp;&nbsp;
            คน
            </h4>
          </Col>
        ),
        totalAmountPayed:(
          <Col xs="12" className="text-right">
            <h4>
            รวม &nbsp;&nbsp;
              ฿{totalAmountPayed}
            </h4>
          </Col>
        ),
        totalNotPay:(
          <Col xs="12" className="text-right">
            <h4>
            ค้างจ่าย &nbsp;&nbsp;
              {totalNotPay}&nbsp;&nbsp;
            คน
            </h4>
          </Col>
        ),
        totalAmountNotPay:(
          <Col xs="12" className="text-right">
            <h4>
            รวม &nbsp;&nbsp;
              ฿{totalAmountNotPay}
            </h4>
          </Col>
        ),

        textDevine:(
          <Col xs="12" className="text-right">
            <hr style={{borderColor:"white"}}/>
          </Col>
        ),
      }


      listToBuyBTN=(
        <Col xs="12" className="text-center">
          <Button color="warning" size="lg" block onClick={() => this.toggleModalList()}>
          <span class="material-icons">
            link
          </span>&nbsp;
            Link To Buy
          </Button>
        </Col>
      )

    }



    return (
      <div className="animated fadeIn">

        <Row className="mb-3">
            <Col xs="12" style={{paddingLeft:"5px"}}>
                <Card body outline color="primary">
                    <Autocomplete
                        onChange={(event, value) => this.searchWithLotID(value.id)}
                        id="highlights-demo"
                        options={lot}
                        getOptionLabel={(option) => option.lot_name}
                        renderInput={(params) => (
                            <TextField {...params} name="textAuto" label="เลือก Lot สั่งซื้อ" variant="outlined" margin="normal" fullWidth/>
                        )}
                        renderOption={(option, { inputValue }) => {
                            const matches = match(option.lot_name, inputValue);
                            const parts = parse(option.lot_name, matches);

                            return (
                            <div>
                                {parts.map((part, index) => (
                                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                                    {part.text}
                                </span>
                                ))}
                            </div>
                            );
                        }}
                        />
                    
                </Card>
                
            </Col>
        </Row>

        <Row>
          <Col xs="3">
            <Card body inverse color="primary">
              <CardText>
                <Row>
                  <Col xs="12"><h4>
                    <span class="material-icons">
                      info
                    </span>&nbsp;&nbsp;

                    <u> ข้อมูล
                  
                  </u></h4></Col>

                  {infoText.lotName}

                  {infoText.totalList}

                  
                  {infoText.totalDetail}

                  {infoText.totalLenght}
                  


                </Row>
              </CardText>
            </Card>
          </Col>

          <Col xs="3">
            <Card body inverse color="success">
              <CardText>
                <Row>
                  <Col xs="12"><h4><u>ยอดเงิน</u></h4></Col>

                  {moneyText.totalSale}

                  {moneyText.totalDiscount}

                  {moneyText.totalTransport}
                



                </Row>
              </CardText>
            </Card>
          </Col>


          <Col xs="3">
            <Card body inverse color="danger">
              <CardText>
                <Row>
                  <Col xs="12"><h4><u>การจ่ายเงิน</u></h4></Col>

                  {payText.totalPayed}

                  {payText.totalAmountPayed}

                  {payText.textDevine}

                  {payText.totalNotPay}

                  {payText.totalAmountNotPay}
                

                </Row>
              </CardText>
            </Card>
          </Col>

          <Col xs="3">
            <Card body >
              <CardText>
                <Row>
                  <Col xs="12"><h4><u>Print Data</u></h4></Col>

                    <Button onClick={()=>this.toggleModalAddressList()} color="success" block>Print Address</Button>

                </Row>
              </CardText>
            </Card>
          </Col>




          
        </Row>

        <Row>
          <Col xs="12" md="12">
                <MaterialTable
                  title={"รายการสรุปยอด"}
                  columns={columns}
                  data={data}
                  options={options}
                  actions={actions}
                />

          </Col>
        </Row>



        <Modal isOpen={this.state.modalADD} toggle={this.toggleModalADD}
                       className={'modal-lg modal-success ' + this.props.className}>
                  <ModalHeader toggle={this.toggleModalADD}>รายการสั่งซื้อ</ModalHeader>
                  <Form>
                  <ModalBody style={{paddingLeft:"10%",paddingRight:"10%",fontSize:"120%"}}>

                        {this.state.dataDetail}


                  </ModalBody>

                  </Form>
                </Modal>


        <Modal isOpen={this.state.modalAddressList} toggle={this.toggleModalAddressList}
                       className={'modal-lg modal-success ' + this.props.className}>
                  <ModalHeader toggle={this.toggleModalAddressList}>รายการที่อยู่</ModalHeader>
                  <Form>
                  <ModalBody style={{paddingLeft:"10%",paddingRight:"10%",fontSize:"120%"}}>

                        {this.state.addressList}


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
    updateSale: (data) => dispatch(updateSale(data)),
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
    },
    {
        collection:'lot',
        orderBy:['lot_close_date','desc']
    }
  ])
)(LotList)

