import React, { Component,useState }  from "react";

// core components
import { 
  Col, 
  Row, 
  Button,
  ButtonGroup, } from 'reactstrap';



import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';




import {connect} from 'react-redux';
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';

import ProductCard from '../../components/Card/ProductCatalogCard';

import Notify from "../../library/Notify";

import { 
    isEmpty,
 } from "../../functions/myFunction";


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


class Catalog extends Component {

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
  




  render() {
    const { product,lot,customer,searchText,cartData,BilData,totalPage,currentPage,itemPerPage,dataToDB } = this.state;

    let showData=[];
    let searchTextShow = (<h4><u>สินค้าทั้งหมด</u></h4>);
    let showTotal = "";

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
              <ProductCard propData={product[i]}/>
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


    

    return (
      <div className="animated fadeIn">
          

          <Row>
            <Col xs="12" md="12">
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
  ])
)(Catalog)
























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

