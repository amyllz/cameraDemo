import React, { Component } from 'react';
import { Row, Upload, message, Button, Icon } from 'antd';
import './App.css';

export default class SignIn extends Component {

  componentDidMount = () => {
    document.title = "上传图像";
  }

  

  render() {
    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
      <div className="SignIn-body">
        <p style={{ textAlign: 'center', fontFamily: 'Microsoft YaHei', fontSize: '18px', paddingTop: "50px" }}>上传图像</p>
        <Row type="flex" justify="center">
          <img src={'http://119.23.210.52:4002/pic.jpg'} style={{ height: "500px", marginTop: "30px" }} alt="toppic" />
        </Row>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> Click to Upload
          </Button>
        </Upload>
        <p style={{ textAlign: 'center', fontFamily: 'Microsoft YaHei', fontSize: '12px', marginTop: "50px" }}>@杭州钛比科技有限公司</p>
      </div>
    )
  }
}
