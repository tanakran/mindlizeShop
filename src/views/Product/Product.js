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
import { addProduct,updateProduct,deleteProduct } from '../../store/actions/productAction';

import firebase from '../../database';
import firebaseS from "firebase";
import FileUploader from "react-firebase-file-uploader";

import { isEmpty } from "../../functions/myFunction";
import ShowDate from "../../library/ShowDate";


const col_inti={
  pd_code:"",
  pd_link:"",
  pd_name:"",
  pd_pic:"",
  pd_cost:"",
  pd_price:"",

  pd_price_stock:"",
  pd_in_stock:0,

  pd_remark:"",


  username: "",
  avatar: "",
  isUploading: false,
  progress: 0,
  avatarURL: "",
}


const dataPrice = {
  A:{cost:80,price:120,price2:140},
  B:{cost:200,price:260,price2:180},
}


class Product extends Component {

  constructor(prop){
    super(prop);
    this.state={
      ...col_inti,

      tableList: this.mapDataToState(prop.product),

      modalADD: false,
      modalEdit: false,
    }
    this.toggleModalADD = this.toggleModalADD.bind(this);
    this.toggleModalEdit = this.toggleModalEdit.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      tableList: this.mapDataToState(nextProps.product),
    });
  }


  handleChangeUsername = event => this.setState({ username: event.target.value });
  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = progress => this.setState({ progress });
  handleUploadError = error => { this.setState({ isUploading: false }); console.error(error); };

  handleUploadSuccess = filename => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });
    firebase
      .storage()
      .ref("product")
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ avatarURL: url }));
  };

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

  toggleModalADD() { 
    this.clearFormData();
    this.setState({
      modalADD: !this.state.modalADD,
    });
    
  }
  
  toggleModalEdit(){
    this.setState({
      modalEdit: !this.state.modalEdit,
    });
  }

  updateInput = e => {  
    if(e.target.name=="pd_code"){
      const st_string = e.target.value.charAt(0).toUpperCase();

      if(st_string=="A"){
        this.setState({
          [e.target.name]: e.target.value,
          pd_cost:dataPrice.A.cost,
          pd_price:dataPrice.A.price,
          pd_price_stock:dataPrice.A.price2,
        });
      }else if(st_string == "B"){
        this.setState({
          [e.target.name]: e.target.value,
          pd_cost:dataPrice.B.cost,
          pd_price:dataPrice.B.price,
          pd_price_stock:dataPrice.B.price2,
        });
      }else{
        this.setState({
          [e.target.name]: e.target.value,
          pd_cost:0,
          pd_price:0,
          pd_price_stock:0,
        });
      }
      

    }else{
      this.setState({
        [e.target.name]: e.target.value
      });
    }

  }

  clearFormData(){
    this.setState({
      ...col_inti,
    });
  }

  getDataByID(id) {
    const data = this.state.tableList;

    let data_find = data.find((element) => {
      return element.id === id;
    })

    this.setState({
      ...data_find,
      avatarURL:data_find.pd_pic
    })

    this.toggleModalEdit();
  }

  addDatabase(){ 
    const data = {
      pd_code:this.state.pd_code,
      pd_link:this.state.pd_link,
      pd_name:this.state.pd_name,
      pd_pic:this.state.avatarURL,
      pd_cost:this.state.pd_cost,
      pd_price:this.state.pd_price,
      pd_price_stock:this.state.pd_price_stock,
      pd_in_stock:this.state.pd_in_stock,
      pd_remark:this.state.pd_remark,
      updateDate:new Date(),
      is_del:false
    }
    this.props.addProduct({data:data});
    this.clearFormData();
    this.toggleModalADD();
  }

  updateDatabase(){
    if(this.state.id!=""){ 
      let imageURL = this.state.avatarURL;
      if(imageURL == ""){
        imageURL = this.state.pd_pic;
      }
      
      const data = {
        pd_code:this.state.pd_code,
        pd_link:this.state.pd_link,
        pd_name:this.state.pd_name,
        pd_pic:imageURL,
        pd_cost:this.state.pd_cost,
        pd_price:this.state.pd_price,
        pd_price_stock:this.state.pd_price_stock,
        pd_in_stock:this.state.pd_in_stock,
        pd_remark:this.state.pd_remark,
        updateDate:new Date(),
      }
      this.props.updateProduct({data:data,id:this.state.id});
      this.clearFormData();
      this.toggleModalEdit(); 
      
    }else{

    }
    
  }

  delDataBase(id){
    const data = {
        is_del:true
      }
      this.props.deleteProduct({data:data,id:id})
  }

  render() {

    const columns = [ //-------------- ชุดคำสั่ง กำหนด โครงสร้างของตาราง
      {
        title: "รูป",
        field: "pd_pic",
        render: rowData => <div><img src={rowData.pd_pic || "https://via.placeholder.com/200x150"} alt="Uploaded Images" width="200"/></div>
      },
      {
        title: "code",
        field: "pd_code",
        render: rowData => <div>{rowData.pd_code}</div>
      },
      {
        title: "ชื่อสินค้า",
        field: "pd_name",
        render: rowData => <div><a href={rowData.pd_link} target="_blank">{rowData.pd_name}</a></div>
      },
      {
        title: "ต้นทุน",
        field: "pd_cost",
        render: rowData => <div>{rowData.pd_cost}</div>
      },
      {
        title: "ราคา (Pre)",
        field: "pd_price",
        render: rowData => <div>{rowData.pd_price}</div>
      },
      {
        title: "ราคา (พร้อมส่ง)",
        field: "pd_price_stock",
        render: rowData => <div>{rowData.pd_price_stock}</div>
      },
      {
        title: "จำนวนคงคลัง",
        field: "pd_in_stock",
        render: rowData => {
          if(rowData.pd_in_stock>0){
            return <div className="text-success"><b><u>{rowData.pd_in_stock}</u></b></div>
          }else{
            return <div className="text-danger"><b><u>{rowData.pd_in_stock}</u></b></div>
          }
        }
      },
      {
        title: "หมายเหตุ",
        field: "pd_remark",
        render: rowData => <div>{rowData.pd_remark}</div>
      },
      {
        title: "Link to Buy",
        field: "pd_link",
        render: rowData => {
          if(!isEmpty(rowData.pd_link)){
            return(<a href={rowData.pd_link} target="_bank">Link</a>)
          }else{
            return(<b className="text-danger">NoLink</b>)
          }
        }
      },


    ];
    
    const data = this.state.tableList; //------------------- เป็นการ ดึงค่าจาก state ลงมาเก็บไว้ใน ตัวแปร data เพื่อ เอามาแสดงในตารางต่อไป

    const actions = [ //----------------- กำหนดปุ่ม action ที่อยู่ ด้านหลังตาราง
      {
        icon: 'create',
        tooltip: 'Edit',
        onClick: (event, rowData) => this.getDataByID(rowData.id) //----------------------- ปุ่ม edit มีการ ส่ง id ให้ ฟังก์ชั่น getDataByID
      },
      {
        icon: 'delete',
        tooltip: 'Delete',
        onClick: (event, rowData) => {if(window.confirm('ต้องการลบข้อมูลนี้ ใช่หรอไม่?')){this.delDataBase(rowData.id)};} //----------------------- ปุ่ม ลบ มีการ ส่ง id ให้ ฟังก์ชั่น delDataBase
      }
    ];

    const options={ //----------------------- ใช้ กำหนด option ให้่ตาราง อยากตกแต่ง ค้นข้อมูล material-table ดู มี อะไรให้ใช้เยอะมาก
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
            
          <Button color="success" onClick={this.toggleModalADD} className="mb-4 " size="lg">เพิ่มสินค้า</Button>
          <Modal isOpen={this.state.modalADD} toggle={this.toggleModalADD}
                       className={'modal-lg modal-success ' + this.props.className}>
                  <ModalHeader toggle={this.toggleModalADD}>เพิ่มข้อมูลสินค้า</ModalHeader>
                  <Form>
                  <ModalBody>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">รหัสสินค้า</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="pd_code" onChange={this.updateInput} value={this.state.pd_code} placeholder="รหัสสินค้าเช่น A01 ห้ามซ้ำกัน" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">ชื่อสินค้า</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="pd_name" onChange={this.updateInput} value={this.state.pd_name} placeholder="กรอกชื่อสินค้า" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Link สั่งซื้ัอ</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="pd_link" onChange={this.updateInput} value={this.state.pd_link} placeholder="Link สำหรับไปหน้าสินค้า" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">ต้นทุนเบื้องต้น</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="pd_cost" onChange={this.updateInput} value={this.state.pd_cost} placeholder="ต้นทุนโดยประมาณ" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">ราคา (Pre)</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="pd_price" onChange={this.updateInput} value={this.state.pd_price} placeholder="ราคาขายให้ลูกค้า Pre Oreder" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">ราคา (พร้อมส่ง)</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="pd_price_stock" onChange={this.updateInput} value={this.state.pd_price_stock} placeholder="ราคาขายให้ลูกค้าพร้อมส่ง" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">จำนวนคงคลัง</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="pd_in_stock" onChange={this.updateInput} value={this.state.pd_in_stock} placeholder="สินค้าพร้อมส่งในสต๊อก" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">หมายเหตุ</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="pd_remark" onChange={this.updateInput} value={this.state.pd_remark} placeholder="" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">รูปสินค้า</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <FileUploader accept="image/*" name="avatar" filename={this.state.pd_code || ShowDate(new Date())} storageRef={firebaseS.storage().ref("product")} onUploadStart={this.handleUploadStart} onUploadError={this.handleUploadError} onUploadSuccess={this.handleUploadSuccess} onProgress={this.handleProgress} />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">  </Col>
                    <Col xs="12" md="9">
                      {this.state.isUploading && <p><progress value={this.state.progress} max="100" className="progress" /></p>}
                      <img src={this.state.avatarURL || "https://via.placeholder.com/400x300"} alt="Uploaded Images" height="300" width="400"/>
                    </Col>
                  </FormGroup>


                  </ModalBody>
                  <ModalFooter>
                    <Button color="success" onClick={() => {if(window.confirm('ยืนยันการบันทึกข้อมูล?')){this.addDatabase()};}}>บันทึก</Button>{' '}
                    <Button color="secondary" onClick={this.toggleModalADD}>ยกเลิก</Button>
                  </ModalFooter>
                  </Form>
                </Modal>

                <Modal isOpen={this.state.modalEdit} toggle={this.toggleModalEdit}
                       className={'modal-lg modal-warning ' + this.props.className}>
                  <ModalHeader toggle={this.toggleModalEdit}>แก้ไขข้อมูลสินค้า</ModalHeader>
                  <Form>
                  <ModalBody>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">รหัสสินค้า</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="pd_code" onChange={this.updateInput} value={this.state.pd_code} placeholder="รหัสสินค้าเช่น A01 ห้ามซ้ำกัน" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">ชื่อสินค้า</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="pd_name" onChange={this.updateInput} value={this.state.pd_name} placeholder="กรอกชื่อสินค้า" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Link สั่งซื้ัอ</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="pd_link" onChange={this.updateInput} value={this.state.pd_link} placeholder="Link สำหรับไปหน้าสินค้า" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">ต้นทุนเบื้องต้น</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="pd_cost" onChange={this.updateInput} value={this.state.pd_cost} placeholder="ต้นทุนโดยประมาณ" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">ราคา (Pre)</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="pd_price" onChange={this.updateInput} value={this.state.pd_price} placeholder="ราคาขายให้ลูกค้า Pre Oreder" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">ราคา (พร้อมส่ง)</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="pd_price_stock" onChange={this.updateInput} value={this.state.pd_price_stock} placeholder="ราคาขายให้ลูกค้าพร้อมส่ง" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">จำนวนคงคลัง</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="pd_in_stock" onChange={this.updateInput} value={this.state.pd_in_stock} placeholder="สินค้าพร้อมส่งในสต๊อก" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">หมายเหตุ</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="pd_remark" onChange={this.updateInput} value={this.state.pd_remark} placeholder="" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">รูปสินค้า</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <FileUploader accept="image/*" name="avatar" filename={this.state.pd_code || ShowDate(new Date())} storageRef={firebaseS.storage().ref("product")} onUploadStart={this.handleUploadStart} onUploadError={this.handleUploadError} onUploadSuccess={this.handleUploadSuccess} onProgress={this.handleProgress} />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">  </Col>
                    <Col xs="12" md="9">
                      {this.state.isUploading && <p><progress value={this.state.progress} max="100" className="progress" /></p>}
                      <img src={this.state.avatarURL || "https://via.placeholder.com/400x300"} alt="Uploaded Images" height="300" width="400"/>
                    </Col>
                  </FormGroup>




                  </ModalBody>
                  <ModalFooter>
                    <Button color="success" onClick={() => {if(window.confirm('ยืนยันการบันทึกข้อมูล?')){this.updateDatabase()};}}>บันทึก</Button>{' '}
                    <Button color="secondary" onClick={this.toggleModalEdit}>ยกเลิก</Button>
                  </ModalFooter>
                  </Form>
                </Modal>         
          </Col>
        </Row>


        <Row>
          <Col xs="12" md="12">
                <MaterialTable
                  title={"รายการสินค้า"}
                  columns={columns}
                  data={data}
                  options={options}
                  actions={actions}
                />

          </Col>
        </Row>
      
      </div>
  
    );
  }
}

const mapStateToProps = (state) =>{
  return{
    product:state.firestore.ordered.product,
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    addProduct: (data) => dispatch(addProduct(data)),
    updateProduct: (data) => dispatch(updateProduct(data)),
    deleteProduct: (data) => dispatch(deleteProduct(data)),
  }
}
//export default (Home)
export default compose(
  connect(mapStateToProps,mapDispatchToProps),
  firestoreConnect([
    {
      collection:'product',
      where: [['is_del', '==', false]],
    }
  ])
)(Product)

