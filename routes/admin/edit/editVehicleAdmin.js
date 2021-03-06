var mysql = require('mysql');
var ejs = require('ejs');
var title = 'Choose Existing Vehicle';
var path = require('path');

var poolH = mysql.createPool({
                             connectionLimit : 100, //important
                             host     : 'localhost',
                             user     : 'Xig514',
                             password : 'some_pass',
                             database : 'Hunsicker',
                             debug    :  false
                             

                             });

exports.show=function (req,res,app,dirpath)
{
    var VIN = req.params.id;
    var CompanyID = req.query.CompanyID;
    var ContactID= req.query.ContactID;
    var ContactName=req.query.ContactName;
    var dataForShowing1=new Array();
    var message='';
    if(req.query.message!=undefined){
        message=req.query.message;
    }
    
    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        
                       
                        var VehicleID;
                        var queryClause2 = "Select  VIN as VIN, VehicleID as vid, UnitNumber as un, VehicleMake as vmake, VehicleModel as vmodel, VehicleYear as vy, CompanyID as ci FROM Vehicle where VIN="+connection.escape(VIN);
                        
                        connection.query(queryClause2,function(err,rows,fields){
                                         
                                         connection.release();
                                         if(!err)
                                         {
                                         if(rows[0]!=null&&rows[0].vid!=undefined){
                                         
                                         dataForShowing1=new Array(7);
                                         VehicleID=rows.vid;
                                         VIN=rows[0].VIN;
                                         //console.log("CompanyName " + i +"  =  " + rows[i].cn)
                                         // console.log("CompanyID " + i +"  =  " + rows[i].ci)
                                         //console.log("");
                                         dataForShowing1[0]=rows[0].VIN;
                                         
                                         dataForShowing1[1]=rows[0].vid;
                                         dataForShowing1[2]=rows[0].un;
                                         dataForShowing1[3]=rows[0].vmake;
                                         dataForShowing1[4]=rows[0].vmodel;
                                         dataForShowing1[5]=rows[0].vy;
                                         dataForShowing1[6] =rows[0].ci;
                                         //console.log(dataForShowing1);
                                         if(message==""){
                                         res.render('editVehicleAdmin', {h1:'Edit Vehicle',use:{username:'Administrator'},title:'The result of specific Vehicle',VehicleID:VehicleID,VIN:VIN,ContactID: ContactID,dataForShowingE:dataForShowing1,ContactName:ContactName,ContactName:ContactName,username:ContactName,CompanyID:CompanyID});
                                         app.set('views', path.join(dirpath, 'views'));
                                         
                                         }
                                         else{
                                         res.render('editVehicleAdmin', {h1:'Edit Vehicle',use:{username:'Administrator'},title:'The result of specific Vehicle',VehicleID:VehicleID,VIN:VIN,ContactID: ContactID,dataForShowingE:dataForShowing1,ContactName:ContactName,ContactName:ContactName,username:ContactName,CompanyID:CompanyID,errorMessage:message});
                                         app.set('views', path.join(dirpath, 'views'));
                                         }
                                         
                                         }
                                         
                                         
                                         else{console.log("no Vehicle records");
                                         //Jump to add vehicle page;
                                        app.set('views', path.join(dirpath, 'views'));
                                         res.redirect('/addNewVehicleAdmin/'+CompanyID+'?ContactID='+ContactID+'&ContactName=' +ContactName);
                                         
                                         }
                                         
                                         }
                                    
                                         
                                         
                                         else{
                                         console.log('error in Select Vehicle Info!');
                                        app.set('views', path.join(dirpath, 'views'));
                                         res.render('errorPage', {usernameE: 'administrator',h1:'Error in Select Vehicle Infomation',title:"Error in Select VehicleInfo",errorMessage :'Error in Select Vehicle Info!'});
                                         return;
                                         }
       
                                         
                                         });
                        });

}


exports.handle_Input=function (req,res)
{
    //console.log('1111111');
    var VIN = req.params.id;
    var ContactName =req.query.ContactName;
    var ContactID = req.query.ContactID;
    console.log(VIN);
    var newValue={};
    newValue['VIN']=req.body.VIN;
    newValue['UnitNumber']=req.body.UnitNumber;
    newValue['VehicleMake']=req.body.Make;
    newValue['VehicleModel']=req.body.Model;
    newValue['VehicleYear']=req.body.Year;
    newValue['CompanyID']=req.body.CompanyID;
    console.log(newValue);
    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        //queryClause = "Select ContactID As Solution From user_Contact;";
                        queryClause="Update Vehicle set ? Where VIN = "+connection.escape(VIN)+";";
                        connection.query(queryClause, newValue,function(err,rows){
                                         connection.release();
                                         if(!err)
                                         {
                                         res.redirect('/editVehicleAdmin/'+req.body.VIN+'?CompanyID='+req.body.CompanyID+'&ContactID='+ContactID+'&message=Successful');
                                         }
                                         else
                                         {
                                         console.log('error in Update Vehicle!');
                                         
                                         res.redirect('/editVehicleAdmin/'+VIN+'?CompanyID='+req.body.CompanyID+'&ContactID='+ContactID+'&message=Failed');
                                         return;
                                         
                                         
                                         }
                                         
                                         
                                         });
                        connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                        });

    
    
    
}


