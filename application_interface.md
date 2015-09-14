# 接口文档

## 一、约定

### 1、服务端数据返回格式

>####1.  整体格式：
>> { msg : 错误描述， code : 约定的状态码， data : 返回数据 }

>####2.  状态码约定：
>>*  200 : 操作成功  
>>*  401 : 操作失败
>>*  403 : 数据不存在
>>*  404 : 接口不存在
>>*  405 : 权限不足
>>*  500 : 服务器错误

>####3.  错误描述：
>>* 当code != 200时，取msg作为参考错误提示，需要时展示给用户

## 二、接口

### 1、login

>####1.  登录 
>>*  method : post
>>*  url : /api/site/login
>>*  param : { email: 账号， password: 密码 }
>>*  data : { authority: 权限(1-4) }

>####2.  登出
>>*  method : get
>>*  url : /api/site/logout

### 2、account

>####1.  账号唯一性检测
>>*  method : post
>>*  url : /api/site/account/verify
>>*  param : { email: email }

>####2.  密码正确性检测
>>*  method : post
>>*  url : /api/site/account/modify-psw/verify
>>*  param : { password: password }

>####3.  修改密码
>>*  method : post
>>*  url : /api/site/modify-psw
>>*  param : { oldPassword: 旧密码，password: 新密码，confirmPassword: 新密码  }

>####4.  账号列表
>>*  method : get
>>*  url : /api/site/account/
>>*  data : { 
        name: 姓名，email: 邮箱，id: ID，
        as_report_admin：[ { name: reportName，id: reportId }... ]，
        as_report_viewer：[ { name: reportName，id: reportId }... ] 
    }

>####5.  创建账号
>>*  method : post
>>*  url : /api/site/account/
>>*  param : {   }

>####6.  已存账号信息
>>*  method : get
>>*  url : /api/site/account/'accountId'
>>*  data : {   }

>####7.  编辑账号
>>*  method : post
>>*  url : /api/site/account/'accountId'
>>*  param : {   }

>####8.  删除账号
>>*  method : delete
>>*  url : /api/site/account/'accountId'
>>*  param : { id: accountId }

### 3、application

>####1.  app列表
>>*  method : get
>>*  url : /api/site/app/
>>*  data : { 
        name: 名字，id: ID，
        users_admin：[ { name: 姓名，email: 邮箱，id: ID }... ]，
        users_viewer：[ { name: 姓名，email: 邮箱，id: ID }... ] 
    }

>####2.  创建app
>>*  method : post
>>*  url : /api/site/app/
>>*  param : {   }

>####3.  已存app信息
>>*  method : get
>>*  url : /api/site/app/'appId'
>>*  data : {   }

>####4.  编辑app
>>*  method : post
>>*  url : /api/site/app/'appId'
>>*  param : {   }

>####5.  删除app
>>*  method : delete
>>*  url : /api/site/app/'appId'
>>*  param : { id: appId }

>####6.  创建app所需的select字段列表

### 4、system log

>####1.  日志列表
>>*  method : get
>>*  url : /api/site/systemLog/
>>*  data : { 
        time: 时间戳，operation: 描述，ip: IP，
        account：[ { name: 姓名，email: 邮箱，id: ID }... ] 
    }

### 5、report

>####1.  report列表
>>*  method : get
>>*  url : /api/site/report/
>>*  data : { 
        app: { name: appName，id: appID}，
        reports: [ { name: 名字，id: ID }... ] 
    }
        
>####2.  创建report
>>*  method : post
>>*  url : /api/site/report/
>>*  param : {   }

>####3.  已存report信息
>>*  method : get
>>*  url : /api/site/report/'reportId'
>>*  data : {   }

>####4.  编辑report
>>*  method : post
>>*  url : /api/site/report/'reportId'
>>*  param : {   }

>####5.  删除report
>>*  method : delete
>>*  url : /api/site/report/'reportId'
>>*  param : { id: reportId }

>####6.  创建report所需的select字段列表

### 4、shortcut

>####1.  get收藏列表
>>*  method : get
>>*  url : /api/site/shortcut/
>>*  data : [ { 
        app: { name: appName，id: appID}，
        reports: [ { name: reportName，id: reportId}... ] 
    }... ]
    
>####2.  收藏report
>>*  method : post
>>*  url : /api/site/shortcut/
>>*  param : { id: reportId }

