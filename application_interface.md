# 接口文档

## 一、约定

### 1、服务端数据返回格式

>####1.  整体格式：
>> { msg : 错误描述， code : 约定的状态码， data : 返回数据 }

>####2.  状态码约定：
>>*  200 : 操作成功  
>>*  401 : 授权验证错误
>>*  403 : 权限不足或数据不存在或操作失败
>>*  404 : 接口不存在
>>*  405 : 权限不足
>>*  500 : 服务器错误

>####3.  错误描述：
>>* 当code != 200时，取msg作为参考错误提示，需要时展示给用户

## 二、接口

### 1、login

>####1.  登录 
>>*  method : post
>>*  url : /site/login
>>*  param : { email: 账号， password: 密码 }
>>*  data : { authority: 权限(1-4) }

>####2.  登出
>>*  method : get
>>*  url : /site/logout

### 2、account

>####1.  账号唯一性检测
>>*  method : post
>>*  url :  /user/check-email
>>*  param : { username: 账号 }

>####2.  密码正确性检测
>>*  method : post
>>*  url : /site/modify-psw
>>*  param : { password: 密码 }

>####3.  修改密码
>>*  method : post
>>*  url : /modify-psw
>>*  param : { oldPassword: 旧密码，password: 新密码，confirmPassword: 新密码  }

>####4.  账号列表
>>*  method : get
>>*  url : /user/index
>>*  param : { 
         uid: 11
     }
>>*  data : [{ 
        nickname: 姓名，username: 邮箱，uid: ID，
        as_report_admin：[ { appname: appName，appid: appId }... ]，
        as_report_viewer：[ { appname: appName，appid: appId }... ] 
    }... ]

>####5.  创建账号
>>*  method : post
>>*  url : /user/create
>>*  param : { 
         username: 邮箱，nickname: 姓名，password: 密码，
         reportAdmin: [ appId... ]，
         reportViewer: [ appId... ]
     }

>####6.  获取账号信息
>>*  method : get
>>*  url : /user/index
>>*  param : { 
         uid : uid
     }
>>*  data : [{
        username: 邮箱，nickname: 姓名，uid: uid，
        reportAdmin: [{
            appid: appId,
            appname: appName
        }... ]，
        reportViewer: [{
            appid: appId,
            appname: appName
        }... ]
    }... ]

>####7.  编辑账号
>>*  method : post
>>*  url : /user/update
>>*  param : { 
         username: 邮箱，nickname: 姓名，password: 密码，uid: uid
         reportAdmin: [ appId... ]，
         reportViewer: [ appId... ]
     }

>####8.  删除账号
>>*  method : delete
>>*  url : /api/site/account/'accountId'
>>*  param : { id: accountId }

### 3、application

>####1.  app列表
>>*  method : get
>>*  url : /app/index
>>*  data : [{ 
        name: app名字，appid: appID，
        appadmin：[ { name: 姓名，email: 邮箱，id: ID }... ]，
        appuser：[ { name: 姓名，email: 邮箱，id: ID }... ] 
    }... ]

>####2.  创建app
>>*  method : post
>>*  url : /app/create
>>*  param : { 
        appname: app名字，
        admin_app_id: [ appId... ]，
        user_app_id: [ appId... ]，
        timezone: 时区
        proce: [ processor... ]
    }

>####3.  获取app信息
>>*  method : get
>>*  url : /api/site/app/'appId'
>>*  data : 

>####4.  编辑app
>>*  method : post
>>*  url : /app/update
>>*  param : { 
         appname: app名字，appid: appID，
         admin_app_id: [ appId... ]，
         user_app_id: [ appId... ]，
         timezone: 时区
         proce: [ processor... ]
     }

>####5.  删除app
>>*  method : delete
>>*  url : /api/site/app/'appId'
>>*  param : { id: appId }

>####6.  创建app所需的select字段列表

### 4、system log

>####1.  日志列表
>>*  method : get
>>*  url : /log/index
>>*  data : [{ 
        time: 时间戳，operation: 描述，ip: IP，
        account：[ { name: 姓名，email: 邮箱，id: ID }... ] 
    }... ]

### 5、report

>####1.  report列表
>>*  method : get
>>*  url : /report/view/
>>*  data : [{ 
        appname: appName，appid: appID，premission: 用户app权限
        reports: [ { report_name: 名字，id: ID }... ] 
    }... ]
        
>####2.  创建report
>>*  method : post
>>*  url : /report/update
>>*  param : { 
        id:reportId
     }

>####3.  获取report信息
>>*  method : get
>>*  url : /report/report-save
>>*  data : {   }

>####4.  编辑report
>>*  method : get
>>*  url : /report/update
>>*  param : {   }

>####5.  删除report
>>*  method : get
>>*  url : /report/del
>>*  param : { id: reportId }

>####6.  查看report
>>*  method : post
>>*  url :  /report/view-report
>>*  param : { id: reportId }

>####7.  复制report
>>*  method : post
>>*  url :  /report/duplicate
>>*  param : { id: reportId，name: report_name }

>####8.  report_name唯一性检测
>>*  method : post
>>*  url :  /report/check-report-name
>>*  param : { name: report_name }

>####8.  创建report所需的select字段列表

### 4、shortcut

>####1.  get收藏列表
>>*  method : get
>>*  url : /report/shortcut/
>>*  data : [ { 
        app: { name: appName，id: appID}，
        reports: [ { name: reportName，id: reportId}... ] 
    }... ]
    
>####2.  收藏report--添加
>>*  method : post
>>*  url : /report/favorite-add
>>*  param : { id: reportId }

>####3.  收藏report--删除
>>*  method : post
>>*  url : /report/favorite-del
>>*  param : { id: reportId }

