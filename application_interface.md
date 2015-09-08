# 接口文档

## 一、约定

### 1、服务端数据返回格式

>####1.  整体格式：
>> { msg : 错误描述， code : 约定的状态码， data : 返回数据 }

>####2.  状态码约定：
>>*  200 : 操作成功  
>>*  401 : 操作失败
>>*  404 : 不存在
>>*  405 : 权限不足
>>*  500 : 服务器错误

>####3.  错误描述：
>>* 当code != 200时，取msg作为参考错误提示，需要时展示给用户

## 二、接口

### 1、account

>####1.  登录 
>>*  url : /api/site/login
>>*  param : { email : 账号， passowrd : 密码 }

>####2.  登出
>>*  url : /api/site/logout
>>*  param : null

>####3.  修改密码
>>*  url : /api/site/modify-psw
>>*  param : { oldPassowrd : 旧密码，passowrd : 新密码， confirmPassword : 新密码  }

>####4.  账号列表

>####5.  删除列表

>####6.  创建账号

>####7.  编辑账号


### 2、application

>####1.  app列表
>>* url : /api/app/view

>####2.  删除app
>>* url : /api/app/delete

>####3.  创建app

>####4.  编辑app

### 3、system log

>####1.  日志列表

### 4、report

>####1.  report列表

>####2.  删除report

>####3.  创建report

>####4.  编辑report

>####5.  收藏report

