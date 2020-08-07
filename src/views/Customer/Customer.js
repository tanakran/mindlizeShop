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
import { addCustomer,updateCustomer,deleteCustomer } from '../../store/actions/customerAction';


const col_inti={
  cus_id:"",
  fb_link:"",
  fb_name:"",
  cus_name:"",
  address:"",
  cus_tel:"",
  post_code:"",
}


class Customer extends Component {

  constructor(prop){
    super(prop);
    this.state={
      ...col_inti,

      tableList: this.mapDataToState(prop.customer),

      modalADD: false,
      modalEdit: false,
    }
    this.toggleModalADD = this.toggleModalADD.bind(this);
    this.toggleModalEdit = this.toggleModalEdit.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      tableList: this.mapDataToState(nextProps.customer),
    });
  }


  mapDataToState(data){
    let result=[];
    if(data){
      data.map(item=>{
        result.push({...item})
      })
      console.log(result)
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
    this.setState({
      [e.target.name]: e.target.value
    });
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
    })

    this.toggleModalEdit();
  }

  addDatabase(){ 
    const data = {
      fb_link:this.state.fb_link,
      fb_name:this.state.fb_name,         
      cus_name:this.state.cus_name,
      address:this.state.address,
      cus_tel:this.state.cus_tel,
      post_code:this.state.post_code,
      updateDate:new Date(),
      is_del:false
    }
    this.props.addCustomer({data:data});
    this.clearFormData();
    this.toggleModalADD();
  }

  updateDatabase(){
    if(this.state.id!=""){ 
      const data = {
        fb_link:this.state.fb_link,
        fb_name:this.state.fb_name,         
        cus_name:this.state.cus_name,
        address:this.state.address,
        cus_tel:this.state.cus_tel,
        post_code:this.state.post_code,
        updateDate:new Date(),
      }
      this.props.updateCustomer({data:data,id:this.state.id});
      this.clearFormData();
      this.toggleModalEdit(); 
      
    }else{

    }
    
  }

  delDataBase(id){
    const data = {
        is_del:true
      }
      this.props.deleteCustomer({data:data,id:id})
  }

  render() {

    const columns = [ //-------------- ชุดคำสั่ง กำหนด โครงสร้างของตาราง

      {
        title: "Facebook",
        field: "fb_name",
        render: rowData => <div><a href={rowData.fb_link} target="_blank">{rowData.fb_name}</a></div>
      },
      {
        title: "ชื่อ-สกุล",
        field: "cus_name",
        render: rowData => <div>{rowData.cus_name}</div>
      },
      {
        title: "เบอร์โทร",
        field: "cus_tel",
        render: rowData => <div>{rowData.cus_tel}</div>
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
    };

    return (
      <div className="animated fadeIn">

        <Row>
          <Col xs="12" md="12">
          <Button color="success" onClick={this.toggleModalADD} className="mb-4 " size="lg">เพิ่มลูกค้า</Button>
          <Modal isOpen={this.state.modalADD} toggle={this.toggleModalADD}
                       className={'modal-lg modal-success ' + this.props.className}>
                  <ModalHeader toggle={this.toggleModalADD}>เพิ่มข้อมูลลูกค้า</ModalHeader>
                  <Form>
                  <ModalBody>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Link Facebook</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="fb_link" onChange={this.updateInput} value={this.state.fb_link} placeholder="ใส่ Facebook link ของลูกค้า" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Facebook Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="fb_name" onChange={this.updateInput} value={this.state.fb_name} placeholder="ชื่อ Profile ของลูกค้า" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">ชื่อ-นามสกุล</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="cus_name" onChange={this.updateInput} value={this.state.cus_name} placeholder="ชื่อ-สกุล" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">ที่อยู่</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="textarea" id="text-input" name="address" onChange={this.updateInput} value={this.state.address} placeholder="" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">รหัสไปรษณีย์</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="post_code" onChange={this.updateInput} value={this.state.post_code} placeholder="" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">เบอร์โทร</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="cus_tel" onChange={this.updateInput} value={this.state.cus_tel} placeholder="ไม่ต้องใส่ -" />
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
                  <ModalHeader toggle={this.toggleModalEdit}>แก้ไขข้อมูลลูกค้า</ModalHeader>
                  <Form>
                  <ModalBody>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Link Facebook</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="fb_link" onChange={this.updateInput} value={this.state.fb_link} placeholder="ใส่ Facebook link ของลูกค้า" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Facebook Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="fb_name" onChange={this.updateInput} value={this.state.fb_name} placeholder="ชื่อ Profile ของลูกค้า" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">ชื่อ-นามสกุล</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="cus_name" onChange={this.updateInput} value={this.state.cus_name} placeholder="ชื่อ-สกุล" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">ที่อยู่</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="textarea" id="text-input" name="address" onChange={this.updateInput} value={this.state.address} placeholder="" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">รหัสไปรษณีย์</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="post_code" onChange={this.updateInput} value={this.state.post_code} placeholder="" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">เบอร์โทร</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="cus_tel" onChange={this.updateInput} value={this.state.cus_tel} placeholder="ไม่ต้องใส่ -" />
                    </Col>
                  </FormGroup>



                  </ModalBody>
                  <ModalFooter>
                    <Button color="success" onClick={() => {if(window.confirm('ยืนยันการบันทึกข้อมูล?')){this.updateDatabase()};}}>บันทึก</Button>{' '}
                    <Button color="secondary" onClick={this.toggleModalADD}>ยกเลิก</Button>
                  </ModalFooter>
                  </Form>
                </Modal>         
          </Col>
        </Row>


        <Row>
          <Col xs="12" md="12">
                <MaterialTable
                  title={"รายชื่อลูกค้า"}
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
    customer:state.firestore.ordered.customer,
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    addCustomer: (data) => dispatch(addCustomer(data)),
    updateCustomer: (data) => dispatch(updateCustomer(data)),
    deleteCustomer: (data) => dispatch(deleteCustomer(data)),
  }
}
//export default (Home)
export default compose(
  connect(mapStateToProps,mapDispatchToProps),
  firestoreConnect([
    {
      collection:'customer',
      where: [['is_del', '==', false]],
    }
  ])
)(Customer)