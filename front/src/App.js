import React, { Component } from 'react';
import { Row } from 'antd';
import './App.css';

export default class SignIn extends Component {

  componentDidMount = () => {
    document.title = "上传图像";
  }

  render() {
    return (
      <div className="SignIn-body">
        <p style={{ textAlign: 'center', fontFamily: 'Microsoft YaHei', fontSize: '18px', paddingTop: "50px"  }}>上传图像</p>
        <Row type="flex" justify="center">
          <img src={'http://119.23.210.52:4002/pic.jpg'} style={{ height: "500px", marginTop: "30px" }} alt="toppic" />
        </Row>
        <p style={{ textAlign: 'center', fontFamily: 'Microsoft YaHei', fontSize: '12px', marginTop: "50px"  }}>@杭州钛比科技有限公司</p>
      </div>
    )
  }
}
