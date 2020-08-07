import React, { Component,useState }  from "react";

// core components
import { 
  Col, 
  Row, 
  Card,
  CardHeader,
  CardBody,
  Table,
  Input,
  Button,
  ButtonGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form, } from 'reactstrap';

import MaterialTable from "material-table";

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';


import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';


import {connect} from 'react-redux';
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { addSale,checkOldBil } from '../../store/actions/saleAction';

import ProductCard from '../../components/Card/ProductCard';

import Notify from "../../library/Notify";

import { 
    isEmpty,
    getIndex
 } from "../../functions/myFunction";
import ShowDate from "../../functions/ShowDate";


const col_inti={
    searchText:"",
    totalPage:1,
    currentPage:1,
    itemPerPage:12,
    dataToDB:[],
    modalADD: false,
}

const initData={
    BilData:{
      bil_id:"",
      lot_id:"",
      lot_name:"",
      lot_close_date:"",
      customerSelected:{},
      bilTotal:0,
      bil_discount:0,
      bilNetTotal:0,
      transpotationCost:0,
      bilRemark:"",

    },
    cartData:[],
}

const transpot_far_code={
  77180:50,
  71240:50,
  20120:50,
  23170:50,
  50260:50,
  50310:50,
  50350:50,
  58130:50,
  18000:50,
  55130:50,
  55160:50,
  55220:50,
  58110:50,
  58120:50,
  58130:50,
  58140:50,
  58150:50,
  63150:50,
  67130:50,
  67160:50,
  67170:50,
  67260:50,
  81150:50,
  82150:50,
  82160:50,
  84280:50,
  84360:50,
  96180:50,
  96130:50,
  96150:50,
  96210:50,
  96120:50,
  96140:50,
  96190:50,
  96130:50,
  96000:50,
  96160:50,
  96220:50,
  96110:50,
  96170:50,
  94000:50,
  94180:50,
  94120:50,
  94120:50,
  94220:50,
  94230:50,
  94140:50,
  94130:50,
  94160:50,
  94150:50,
  94110:50,
  94170:50,
  95110:50,
  95000:50,
  95120:50,
  95150:50,
  95130:50,
  95120:50,
  95140:50,

};


class Sale extends Component {

  constructor(prop){
    super(prop);
    const product = this.mapProductToState(prop.product);
    this.state={
        ...initData,
        ...col_inti,
        product:product,
        productOri:product,
        totalPage:(product.length/col_inti.itemPerPage).toFixed(0),
        customer:this.mapDataToState(prop.customer),
        lot:this.mapDataToState(prop.lot),
    }
    this.toggleModalADD = this.toggleModalADD.bind(this);


  }

  componentWillReceiveProps(nextProps){
    const product = this.mapProductToState(nextProps.product);

    if(isEmpty(this.state.BilData.lot_id)){
      this.setState({
        ...initData,
        ...col_inti,
        product: product,
        productOri:product,
        totalPage:(product.length/col_inti.itemPerPage).toFixed(0),
        customer:this.mapDataToState(nextProps.customer),
        lot:this.mapDataToState(nextProps.lot),
        cartData:[],
      });
    }else{
      this.setState({
        product: product,
        productOri:product,
        totalPage:(product.length/col_inti.itemPerPage).toFixed(0),
        customer:this.mapDataToState(nextProps.customer),
        lot:this.mapDataToState(nextProps.lot),
    });
    }

    
  }

  mapDataToState(data){
    let result=[];
    if(data){
      data.map(item=>{
        result.push({...item})
      })
      return result
    }else{
      return result
    }
  }

  mapProductToState(data){
    let result=[];
    if(data){
      data.map(item=>{
        if(item.pd_in_stock>0){
          result.push({...item})
        }
        
      })
      return result
    }else{
      return result
    }
  }

  toggleModalADD() { 
    this.setState({
      modalADD: !this.state.modalADD,
    });
    
  }


  updateInput = e => {  
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  clearFormData(){
    this.setState({
      ...col_inti,
    });
  }


  getProductData(data){
    let { cartData } = this.state;
    if(!isEmpty(cartData)){
        let result = cartData.filter((chkData)=>{
            return chkData.id.search(data.id) != -1;
        });
        if(isEmpty(result)){
            cartData.push({
                ...data,
                amount:this.checkStock(data,(1))
            })
            
        }else{
          let index = getIndex(result[0].id,cartData,"id");
          if(index!=-1){
            let amount=parseFloat(cartData[index].amount);
            cartData[index].amount=this.checkStock(data,(amount+1));
          }
        }
    }else{
        cartData.push({
            ...data,
            amount:this.checkStock(data,(1))
        })
    }
    
    this.setState({
        cartData:cartData,
        BilData:{
          ...this.state.BilData,
          ...this.autoCalTranspotCost(this.state.BilData,cartData),
          ...this.calBil(this.state.BilData,cartData)
        },
    })
    
  }

  checkStock(pdata,amount,is_noti){
    const instock = Number.parseFloat(pdata.pd_in_stock);
    let newAmount = Number.parseFloat(amount);

    let str = amount.toString();
    if(str.charAt(str.length - 1)!="."){
      if(!isEmpty(amount)){

        if(instock>=newAmount){
          if(isEmpty(is_noti)){
            Notify("เพิ่ม "+pdata.pd_name+"("+pdata.pd_code+") ลงในตะกร้า "+newAmount+" หน่วย")
          }
          return newAmount;
        }else{
          Notify("สินค้า"+pdata.pd_name+"("+pdata.pd_code+") คงเหลือ "+instock+" หน่วย ไม่สามารถสั่งซื้อเกินได้","warning")
          return instock;
        }
      }else{
        return amount;
      }
    }else{
      return amount
    }
    
    
  }

  getSearchText = (text) =>{
    let lowText = text.toLowerCase();
    let product = this.state.productOri, result=[];
    result = product.filter((data)=>{
        return data.pd_code.toLowerCase().search(lowText) != -1;
    });

    if(result.length==0){
      result = product.filter((data)=>{
        return data.pd_name.toLowerCase().search(lowText) != -1;
      });
    }
    this.setState({
      totalPage:(result.length/col_inti.itemPerPage).toFixed(0),
      currentPage:1,
      itemPerPage:12,
      product:result,
      searchText:text
    })
  }

  setBilData = (data) => {

    this.setState({
      BilData:{
        ...data,
        //...this.autoCalTranspotCost(data,this.state.cartData),
        ...this.calBil(data,this.state.cartData),
      }
    });
  }

  setNewCart = (data) =>{
    let newData = [];
    data.map(item=>{
      newData.push({
        ...item,
        amount:this.checkStock(item,item.amount)
      })
    })
    this.setState({
      cartData:newData,
      BilData:{
        ...this.state.BilData,
        ...this.autoCalTranspotCost(this.state.BilData,newData),
        ...this.calBil(this.state.BilData,newData),
        
      },
    })
  }

  autoCalTranspotCost(BilData,cart){
    if(!isEmpty(BilData.customerSelected.post_code) && !isEmpty(cart)){
      const postcode = BilData.customerSelected.post_code;
      let remarkText="";
      let total_amount = 0;
      cart.map((item)=>{
        total_amount+=parseFloat(item.amount)
      })

      let post_far_cost = transpot_far_code[postcode];
      if(isEmpty(post_far_cost)){
        post_far_cost=0;
      }else{
        remarkText="**พื้นที่ห่างไกล +50 บาท";
      }

      let transport_cost = 0;

      if(total_amount<=5){
        transport_cost=35+post_far_cost;
      }else if(total_amount<=10){
        transport_cost=40+post_far_cost;
      }else if(total_amount<=20){
        transport_cost=45+post_far_cost;
      }else if(total_amount<=30){
        transport_cost=50+post_far_cost;
      }else if(total_amount<=40){
        transport_cost=55+post_far_cost;
      }else if(total_amount<=50){
        transport_cost=60+post_far_cost;
      }else if(total_amount<=60){
        transport_cost=65+post_far_cost;
      }else{
        transport_cost=200+post_far_cost;
        remarkText="**เกิน 60 เมตรขึ้นไป กรุณาคำนวนเอง";
      }


      const result = {
        ...BilData,
        transpotationCost:transport_cost,
        bilRemark:remarkText
      }

      return result;
    }else{
      return [];
    }
  }

  calBil(bildata,cartdata){
    let total=0;
    let discount = parseFloat(bildata.bil_discount);
    let transpotationCost = parseFloat(bildata.transpotationCost);
    let totalNet=0;

    let cart_subtotal_arr = cartdata.map((value)=>{
      try {
        return (value.amount*value.pd_price_stock)
      } catch (error) {
        Notify("จำนวนสินค้าไม่ถูกต้อง","error")
        return (value.amount*value.pd_price_stock)
      }
    })

    
    for(let i = 0; i < cart_subtotal_arr.length; i++){
      total+=parseFloat(cart_subtotal_arr[i]);
    } 

    totalNet=(total+transpotationCost)-discount;

    const newBil={
      bilTotal:total,
      bilNetTotal:totalNet,
    }

    return newBil;

  }

  clearData = () =>{
    Notify("ล้างข้อมูลการสั่งซื้อ","success")
    this.setState({
      BilData:{
        bil_id:"",
        lot_id:"",
        lot_name:"",
        lot_close_date:"",
        customerSelected:{},
        bilTotal:0,
        bil_discount:0,
        bilNetTotal:0,
        transpotationCost:0,
        bilRemark:"",
  
      },
      cartData:[],
    })
  }

  checkoutCart = () =>{
    let { BilData,cartData} = this.state;
      BilData={
        ...this.state.BilData,
        ...this.autoCalTranspotCost(this.state.BilData,cartData),
        ...this.calBil(this.state.BilData,cartData),
      }

    if(!isEmpty(BilData.customerSelected)){

        if(BilData.bilNetTotal>0){

          if(BilData.bil_discount>=0){
    
            if(BilData.transpotationCost>=0){
              let bil_detial=[];
              for (let i = 0; i < cartData.length; i++) {
                let total = (cartData[i].pd_price_stock*cartData[i].amount);
                  if(total>0){
                    bil_detial.push({
                      id:cartData[i].id,
                      pd_cost:cartData[i].pd_cost,
                      pd_price_stock:cartData[i].pd_price_stock,
                      amount:cartData[i].amount,
                      total:total,
                    })
                  }
                
              }

              const dataToDB={
                bil_code:ShowDate(new Date(),"date_to_code"),
                cus_id:BilData.customerSelected.id,
                fb_name:BilData.customerSelected.fb_name,
                bilTotal:BilData.bilTotal,
                bil_discount:BilData.bil_discount,
                bilNetTotal:BilData.bilNetTotal,
                transpotationCost:BilData.transpotationCost,
                bilRemark:BilData.bilRemark,
                detail:bil_detial,
                sale_date: new Date(),
                is_pay:false
              }
 
              //this.props.addSale({data:dataToDB})
              this.setState({dataToDB:dataToDB})
              this.toggleModalADD()

    
            }else{
              Notify("ค่าขนส่งไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง","error")
            }
    
          }else{
            Notify("ส่วนลดไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง","error")
          }
    
        }else{
          Notify("ยอดรวมไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง","error")
        }
    }else{
      Notify("กรุณาเลือกลูกค้าก่อนทำรายการ","error")
    }
  }

  clickHomePage(){
    Notify("หน้าแรก")
    this.setState({
      currentPage:1
    });
  }

  clickNextPage(){
    let {totalPage,currentPage,itemPerPage } = this.state;
    let newCurrentPage = currentPage+1;
    if(newCurrentPage<=totalPage){
      this.setState({
        currentPage:newCurrentPage
      });
    }else{
      Notify("หน้าสุดท้าย")
    }
    
  }

  clickPrePage(){
    let {totalPage,currentPage,itemPerPage } = this.state;
    let newCurrentPage = currentPage-1;
    if(newCurrentPage>0){
      this.setState({
        currentPage:newCurrentPage
      });
    }else{
      Notify("หน้าแรก")
    }
  }
  

  addDatabase(){
    this.props.addSale({data:this.state.dataToDB});
    this.clearData();
    this.toggleModalADD();
  }




  render() {
    const { product,lot,customer,searchText,cartData,BilData,totalPage,currentPage,itemPerPage,dataToDB } = this.state;

    let showData=[];
    let searchTextShow = (<h4><u>สินค้าทั้งหมด</u></h4>);
    let showTotal = "";

    let showBilDetail=[];
    let showBilTotal=[];


    if(!isEmpty(product)){
        const self = this;
        /*showData = product.map(function(item){
            return (<Col xs="3" md="3" className="mb-3">
                    <a onClick={()=>self.getProductData(item)}><ProductCard propData={item}/></a>
                </Col>);
        })*/

        let startItem=(currentPage-1)*itemPerPage;
        let lastItem=(currentPage)*itemPerPage;

        if(currentPage==totalPage){
          lastItem=product.length;
        }

        if(product.length<itemPerPage){
          lastItem=product.length;
        }
        for(let i = startItem;i<lastItem;i++){
          showData.push(<Col xs="3" md="3" className="mb-3">
              <a onClick={()=>self.getProductData(product[i])}><ProductCard propData={product[i]}/></a>
          </Col>)
        }


      showTotal="สินค้าทั้งหมด "+product.length+" รายการ"
    }else{
      showData=(<div className="col-12 text-center">
        <h4>ไม่พบสินค้า</h4>
      </div>)

      showTotal="สินค้าทั้งหมด 0 รายการ"
    }

    if(!isEmpty(searchText)){
      searchTextShow = (<h4><u><a onClick={this.getShowAll}>สินค้าทั้งหมด</a></u> / ค้นหา : <u>{searchText}</u></h4>);
    }


    if(!isEmpty(dataToDB)){
      const detail = dataToDB.detail;

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
            <td className="text-right">{detail[i].pd_price_stock}</td>
            <td className="text-center">{detail[i].amount}</td>
            <td className="text-right" style={{color:"green"}}>{detail[i].total}</td>
          </tr>
        );
      }

      showBilTotal.push(
        <tr>
          <td colSpan="5" className="text-right">รวม</td>
          <td className="text-center">{total_amount} เมตร</td>
          <td className="text-right">{dataToDB.bilTotal}</td>
        </tr>
      );

      if(dataToDB.bil_discount>0){
        showBilTotal.push(
          <tr>
            <td colSpan="6" className="text-right">หัก ส่วนลด</td>
            <td className="text-right" style={{color:"red"}}>{dataToDB.bil_discount}</td>
          </tr>
        );
      }


      if(dataToDB.transpotationCost>0){
        showBilTotal.push(
          <tr>
            <td colSpan="6" className="text-right">บวก ค่าขนส่ง</td>
            <td className="text-right" style={{color:"green"}}>{dataToDB.transpotationCost}</td>
          </tr>
        );
      }

      

    }
    

    return (
      <div className="animated fadeIn">
          

          <Row>
            <Col xs="12" md="4">

                <Row>
                    <Col xs="6" md="12">
                        <BilCard propsData={{data:customer,lot:lot,BilData:BilData,cart:cartData}} resultData={this.setBilData} clearData={this.clearData} checkoutCart={this.checkoutCart}/>
                    </Col>

                    <Col xs="6" md="12">
                        <TableOfSale propsData={{cart:cartData}} setNewCart={this.setNewCart} />
                    </Col>
                </Row>
                

            </Col>

            <Col xs="12" md="8">
                <Row>
                    <Col xs="12" md="12">
                        <CustomizedInputBase  clickSend={this.getSearchText} />
                    </Col>
                </Row>


                <Row>
                    <Col xs="12" md="12" className="mb-2">
                    <hr/>
                    </Col>

                    <Col xs="6">
                      <ButtonGroup size="sm">
                        <Button color="danger" onClick={()=>this.clickPrePage()}>previous</Button>
                        <Button color="primary" onClick={()=>this.clickHomePage()}>Page {currentPage+" / "+totalPage}</Button>
                        <Button color="success" onClick={()=>this.clickNextPage()}>Next</Button>
                      </ButtonGroup>
                    </Col>

                    <Col xs="6" className="text-right">
                      {showTotal}
                      
                    </Col>
                </Row>

                <Row className="mt-2">
                    {showData}
                </Row>
            </Col>

          </Row>







          <Modal isOpen={this.state.modalADD} toggle={this.toggleModalADD}
                       className={'modal-lg modal-success ' + this.props.className}>
                  <ModalHeader toggle={this.toggleModalADD}>ใบแจ้งยอด</ModalHeader>
                  <Form>
                  <ModalBody style={{paddingLeft:"10%",paddingRight:"10%",fontSize:"120%"}}>
                    <Row>
                      <Col xs="12" className="text-center">
                        <br/>
                      </Col>
                      <Col xs="12" className="text-center">
                        <h3><u>ใบแจ้งยอด</u></h3>
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
                        <b>วันที่ : </b> {ShowDate(new Date(),"Date")}
                      </Col>
                    </Row>

                    <Row>
                      <Col xs="6" >
                        <b>FB ลูกค้า : </b> {this.state.dataToDB.fb_name}
                      </Col>
                      <Col xs="6" className="text-right">
                        <b>สถานะการชำระเงิน : </b> <b style={{color:"red"}}>รอโอน</b>
                      </Col>
                    </Row>

                    

                    <Row>
                      <Col xs="12" className="text-right">
                        <b>หมายเหตุ : </b> {this.state.dataToDB.bilRemark || "ไม่ระบุ"}
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
                              <th className="text-right">{dataToDB.bilNetTotal} บาท</th>
                            </tr>
                          </tfoot>
                        </Table>
                      </Col>
                    </Row>


                  </ModalBody>
                  <ModalFooter>
                    <Button color="success" onClick={() => {if(window.confirm('ยืนยันการบันทึกข้อมูล?')){this.addDatabase()};}}>บันทึก</Button>{' '}
                    <Button color="secondary" onClick={this.toggleModalADD}>ยกเลิก</Button>
                  </ModalFooter>
                  </Form>
                </Modal>

          

      
      </div>
  
    );
  }
}

const mapStateToProps = (state) =>{
  return{
    product:state.firestore.ordered.product,
    productWithIndexID:state.firestore.data.product,
    customer:state.firestore.ordered.customer,


    oldSaleData:state.sale.oldSaleData,
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    addSale: (data) => dispatch(addSale(data)),
    checkOldBil: (data) => dispatch(checkOldBil(data)),
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
  ])
)(Sale)
























const useStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }));
  
  
  const CustomizedInputBase = (props) => {
    const classes = useStyles();
  
    const [searchText,setSearchText] = useState("")
  
    const onSendMessage = () =>{
      props.clickSend(searchText)
      clearText()
    }
  
    const handleKeyPress = (event) => {
      if(event.key === 'Enter'){
        props.clickSend(searchText)
        clearText()
      }
    }
    
    const clearText = () =>{
      setSearchText("")
    }

    const updateInput = e =>{
        setSearchText(e.target.value)
        props.clickSend(e.target.value)
    }
    
  
    return (
        <Paper className={classes.root}>
            <IconButton className={classes.iconButton} aria-label="menu">
            ค้นหาสินค้า 
            </IconButton>
            <InputBase
            className={classes.input}
            placeholder="Search..."
            fullWidth
            onChange={e => updateInput(e)}
            onKeyPress={handleKeyPress}
            value={searchText}
            />
            <IconButton onClick={onSendMessage} className={classes.iconButton} aria-label="search">
            <SearchIcon  fontSize="large" />
            </IconButton>
        </Paper>
    );
  }















  const BilCard = (props) => {
    const { data,lot,BilData,cart } = props.propsData;

    let total_amount = 0;
    cart.map((item)=>{
      total_amount+=parseFloat(item.amount)
    })

    const classes = useStyles();

    if(isEmpty(props.propsData.BilData.customerSelected)){
      BilData.customerSelected=[];
    }

    

    let customerText="";
  
    const handleKeyPress = (event) => {
      if(event.key === 'Enter'){
        console.log(event.target.name)
        console.log("เพิ่มลูกค้า")
      }
    }

    const handleSetCustomerData = (value) =>{
      let newBilData = BilData;
        if(isEmpty(value)){
          newBilData.customerSelected={};
        }else{
          newBilData.customerSelected=value;
        }
        
        props.resultData(newBilData)
    }

    
    try {
      if(isEmpty(BilData.customerSelected.fb_name)){
        customerText = ("<กรุณาเลือกลูกค้า>")
      }else{
        customerText = (BilData.customerSelected.fb_name)
      }
    } catch (error) {
      customerText = ("<กรุณาเลือกลูกค้า>")
    }


    const updateInput = e =>{
      let name = e.target.name;
      let value = e.target.value;
      let newBilData = BilData;

      const result = {
        ...newBilData,
        [name]:value,
      }

      props.resultData(result)
    }

    
    
    
  
    return (
        <Card>
            <CardHeader className="text-white bg-danger">
                <h2>การขาย (พร้อมส่ง)</h2>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col xs="12">

                        <Autocomplete
                        onChange={(event, value) => handleSetCustomerData(value)}
                        id="highlights-demo"
                        options={data}
                        getOptionLabel={(option) => option.fb_name}
                        renderInput={(params) => (
                            <TextField {...params} name="textAuto" onKeyPress={handleKeyPress} label="เลือกลูกค้าลูกค้า" variant="outlined" margin="normal" fullWidth/>
                        )}
                        renderOption={(option, { inputValue }) => {
                            const matches = match(option.fb_name, inputValue);
                            const parts = parse(option.fb_name, matches);

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

                    </Col>

                </Row>

                <Row>
                    <Col xs="12" >
                      <hr/>
                    </Col>

                    <Col xs="4" >
                      <h4>ลูกค้า :</h4>
                    </Col>

                    <Col xs="8" className="text-right" >
                      <h4>{customerText}</h4>
                    </Col>

                    <Col xs="6" >
                      <h4>หมายเหตุ : </h4>
                    </Col>

                    <Col xs="6" className="text-right" >
                      <Input type="textarea" name="bilRemark" value={BilData.bilRemark}  onChange={(e)=>updateInput(e)}/>
                    </Col>

                    <Col xs="12" >
                      <hr/>
                    </Col>
                </Row>

                <Row>
                    <Col xs="4" >
                      <h4>ทั้งหมด :</h4>
                    </Col>

                    <Col xs="8" className="text-right text-primary" >
                      <h5>{total_amount} เมตร</h5>
                    </Col>

                    
                </Row>

                <Row>
                    <Col xs="4" >
                      <h4>รวม :</h4>
                    </Col>

                    <Col xs="8" className="text-right" >
                      <h5>{BilData.bilTotal} บาท</h5>
                    </Col>

                    
                </Row>

                <Row>
                    <Col xs="6" >
                      <h4>ส่วนลด : </h4>
                    </Col>

                    <Col xs="6" className="text-right" >
                      <Input type="text" name="bil_discount" className="text-right" style={{color:"red",fontSize:"large"}} value={BilData.bil_discount} onChange={(e)=>updateInput(e)}/>
                    </Col>
                </Row>



                <Row>
                    <Col xs="6" >
                      <h4>ค่าขนส่ง : </h4>
                    </Col>

                    <Col xs="6" className="text-right" >
                      <Input type="text" name="transpotationCost" className="text-right" style={{color:"green",fontSize:"large"}} value={BilData.transpotationCost} onChange={(e)=>updateInput(e)}/>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col xs="4" >
                      <h4>ยอดสุทธิ์ : </h4>
                    </Col>

                    <Col xs="8" className="text-right" >
                      <h3 style={{color:"green"}}><u>{BilData.bilNetTotal} บาท</u></h3>
                    </Col>
                </Row>


                <Row className="mt-3">
                    <Col xs="12" >
                      <Button color="primary" size="lg" block onClick={() => {props.checkoutCart()}}>บันทึกสรุปยอด</Button>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col xs="12" >
                      <Button color="secondary" size="lg" block onClick={(event, rowData) => {if(window.confirm('ยืนยันการล้างข้อมูล')){props.clearData()};}}>ล้างข้อมูล</Button>
                    </Col>
                </Row>


                

            </CardBody>
        </Card>
    );
  }



  const TableOfSale = (props) => {
    let { cart } =props.propsData; 
    const classes = useStyles();
    if(isEmpty(props.propsData.cart)){
      cart=[];
    }
  


    const updateInput = (e,id) =>{
      let new_cart=cart;
      let value=e.target.value;;
      let index = getIndex(id,new_cart,"id")
      if(index!=-1){
        let new_value=value;
        
        new_cart[index].amount=new_value;
        props.setNewCart(new_cart)

      }
    }
    
    const delCart = (id) =>{
      let new_cart=cart;
      let index = getIndex(id,new_cart,"id")
      if(index!=-1){
        Notify("ลบ "+new_cart[index].pd_name+"("+new_cart[index].pd_code+") ออกจากตะกร้า","error")
        new_cart.splice(index, 1);
        props.setNewCart(new_cart)

      }
    }

    const tableData = () =>{
      let rs = cart.map((v)=>{
        let total = parseFloat(v.amount)*parseFloat(v.pd_price_stock)
        return (
          <tr>
            <td><b><u>{v.pd_code}</u></b></td>
            <td><Input type="text" value={v.amount} style={{width:"80%"}} onChange={(e)=>updateInput(e,v.id)}/></td>
            <td>{v.pd_price_stock}</td>
            <td><b>{total}</b></td>
            <td>
              <Button outline  size="sm" color="white" onClick={()=>delCart(v.id)}>
                <span class="material-icons">
                  close
                </span>
              </Button>
              
            </td>
          </tr>
        )
      })

      return  rs
    }
    
  
    return (
        <Card className="text-white bg-danger text-center">
              <CardBody>
                <blockquote className="card-bodyquote">
                  <h4>รายการสั่งซื้อ</h4>
                    <Table borderless className="text-white">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>จำนวน</th>
                                <th>ราคา</th>
                                <th>รวม</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData() || "กรุณาเลือกสินค้า่"}
                        </tbody>
                    </Table>
                </blockquote>
              </CardBody>
        </Card>
    );
  }


