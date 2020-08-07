import React, { Component } from 'react';

import {
  Col,
  Row,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';

import {connect} from 'react-redux';
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';

import { scaleBand } from '@devexpress/dx-chart-core';
import { ArgumentScale, Stack ,Animation,ValueScale } from '@devexpress/dx-react-chart';
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  LineSeries,
  Legend,
  Tooltip,
  ZoomAndPan,
} from '@devexpress/dx-react-chart-material-ui';

import { EventTracker, HoverState } from '@devexpress/dx-react-chart';

import { isEmpty,mapDataToState } from "../../functions/myFunction";
import ShowDate from "../../functions/ShowDate";


const iniFactor = 1.0;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    const lot = mapDataToState(props.lot);
    const sale = mapDataToState(props.sale);
    
    this.setSaleFromDate_LineChartData(sale)
    this.state = {
      lot: lot,
      sale:sale,
      saleChartData:this.setSaleFromLot_BarChartData(lot,sale),
      saleLineChartData:this.setSaleFromDate_LineChartData(sale),
    };
  }

  componentWillReceiveProps(nextProps){
    
    const lot = mapDataToState(nextProps.lot);
    const sale = mapDataToState(nextProps.sale);
    
    this.setState({
      lot: lot,
      sale:sale,
      saleChartData:this.setSaleFromLot_BarChartData(lot,sale),
      saleLineChartData:this.setSaleFromDate_LineChartData(sale),
    });
  }

  setSaleFromLot_BarChartData(lot,sale){

    let chartData = [];

    lot.map((lotItem)=>{
      
      let saleProductList=[];

      let lotLenght=0;
      let lotDetailLenght=0;

      let lotSale=0;
      let lotDiscount=0;
      let lotTransport=0;

      let lotPayed=0;
      let lotAmountPayed=0;
      let lotNotPay=0;
      let lotAmountNotPay=0;


      sale.map((saleItem)=>{
        

        if(lotItem.id==saleItem.lot_id){
            lotSale+=parseFloat(saleItem.bilNetTotal*iniFactor);
            lotDiscount+=parseFloat(saleItem.bil_discount*iniFactor);
            lotTransport+=parseFloat(saleItem.transpotationCost*iniFactor);


            if(saleItem.is_pay==true){
              lotPayed++;
              lotAmountPayed+=parseFloat(saleItem.bilNetTotal*iniFactor);
            }else{
              lotNotPay++;
              lotAmountNotPay+=parseFloat(saleItem.bilNetTotal*iniFactor);
            }

            const {detail} = saleItem;
            for (let i = 0; i < detail.length; i++) {
                if(isEmpty(saleProductList[detail[i]['id']])){

                    lotDetailLenght++;


                    lotLenght+=parseFloat(detail[i]['amount']);

                    saleProductList[detail[i]['id']]={
                      pd_id:detail[i]['id'],
                  };

                  
                }else{

                    lotLenght+=parseFloat(detail[i]['amount']);


                }
            }
        }
      })

      chartData.push({
        lot_name:lotItem.lot_name,
        lotLenght:lotLenght,
        lotDetailLenght:lotDetailLenght,

        lotSale:lotSale,
        lotDiscount:lotDiscount,
        lotTransport:lotTransport,

        lotPayed:lotPayed,
        lotAmountPayed:lotAmountPayed,
        lotNotPay:lotNotPay,
        lotAmountNotPay:lotAmountNotPay,
      })
      
    })
    
    return chartData
  }

  setSaleFromDate_LineChartData(sale){
    let focusDate="";
    let chartData = [];
    let i = -1;
    sale.map((saleItem)=>{
      let thisDate = ShowDate(saleItem.sale_date,"date");
      let totalPayedVal = 0;
      let totalNotPayVal = 0;
      if(saleItem.is_pay==true){
        totalPayedVal=saleItem.bilTotal*iniFactor;
      }else{
        totalNotPayVal=saleItem.bilTotal*iniFactor;
      }

      if(focusDate!=thisDate){
        focusDate=thisDate;
        i++;
        chartData.push({
          saleDate:focusDate,
          totalSale:parseFloat(saleItem.bilTotal*iniFactor),
          totalDiscount:parseFloat(saleItem.bil_discount*iniFactor),
          totalCustomer:1,
          totalPayed:totalPayedVal*iniFactor,
          totalNotPay:totalNotPayVal*iniFactor,
        })
      }else{
        let {totalSale,totalDiscount,totalCustomer,totalPayed,totalNotPay} = chartData[i];

        totalSale+=parseFloat(saleItem.bilTotal*iniFactor);
        totalDiscount+=parseFloat(saleItem.bil_discount*iniFactor);
        totalCustomer++;
        totalPayed+=parseFloat(totalPayedVal*iniFactor);
        totalNotPay+=parseFloat(totalNotPayVal*iniFactor);

        chartData[i].totalSale=totalSale;
        chartData[i].totalDiscount=totalDiscount;
        chartData[i].totalCustomer=totalCustomer;
        chartData[i].totalPayed=totalPayed;
        chartData[i].totalNotPay=totalNotPay;
      }
    })

    
    return chartData;
  }

  render() {
    const { saleChartData,saleLineChartData } = this.state;
    console.log(saleLineChartData)
    return (
      <div>
        <Row>
          <Col xs="6">

            <Card>
              <CardHeader>ยอดขายรวม</CardHeader>

              <CardBody>
                <Chart
                  data={saleChartData}
                >
                  <ArgumentScale factory={scaleBand} />
                  <ArgumentAxis />
                  <ValueAxis />

                  <BarSeries
                    valueField="lotSale"
                    argumentField="lot_name"
                    name="ยอดขาย"
                  />
                  <BarSeries
                    valueField="lotAmountPayed"
                    argumentField="lot_name"
                    name="จ่าย"
                  />
                  <BarSeries
                    valueField="lotAmountNotPay"
                    argumentField="lot_name"
                    name="ค้างจ่าย"
                  />
                  <Stack />
                  <Animation />
                  <Legend />

                  <EventTracker />
                  <Tooltip />
                </Chart>
              </CardBody>
            </Card>

          </Col>

          <Col xs="6">

            <Card>
              <CardHeader>ยอดรายวัน</CardHeader>

              <CardBody>
                <Chart
                  data={saleLineChartData}
                >
                  <ValueScale name="sale" />
                  <ValueScale name="amount" />

                  <ArgumentScale factory={scaleBand} />
                  <ArgumentAxis />

                  <ValueAxis scaleName="sale" showGrid={false} showLine showTicks />
                  <ValueAxis scaleName="amount" position="right" showGrid={false} showLine showTicks />

                  
                  <BarSeries
                    valueField="totalCustomer"
                    argumentField="saleDate"
                    name="ผู้ซื้อ(ราย)"
                    scaleName="amount"
                  />
                  <LineSeries
                    valueField="totalSale"
                    argumentField="saleDate"
                    name="ยอดขาย"
                    scaleName="sale"
                  />
                  <LineSeries
                    valueField="totalPayed"
                    argumentField="saleDate"
                    name="ยอดจ่าย"
                    scaleName="sale"
                  />
                  <LineSeries
                    valueField="totalNotPay"
                    argumentField="saleDate"
                    name="ยอดค้างจ่าย"
                    scaleName="sale"
                  />


                  <ZoomAndPan
                              interactionWithArguments="both"
                            />

                  <Stack />
                  <Animation />
                  <Legend />

                  <EventTracker />
                  <Tooltip />
                </Chart>
              </CardBody>
            </Card>

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

    lot:state.firestore.ordered.lot,
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
  }
}

export default compose(
  connect(mapStateToProps,mapDispatchToProps),
  firestoreConnect([
    {
      collection:'product',
      where: [['is_del', '==', false]],
    },
    {
      collection:'sale',
      orderBy:['sale_date','asc']
    },
    {
      collection:'lot',
      orderBy:['lot_close_date','asc']
    }
  ])
)(Dashboard)
