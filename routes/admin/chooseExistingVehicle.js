var mysql = require('mysql');
var ejs = require('ejs');
var title = 'Choose Existing Vehicle';


var poolH = mysql.createPool({
                             connectionLimit : 100, //important
                             host     : 'localhost',
                             user     : 'Xig514',
                             password : 'some_pass',
                             database : 'Hunsicker',
                             debug    :  false
                             

                             });

exports.show=function (request,response)
{
    //console.log(11111);
    response.writeHead(301,
                       {Location: 'http://localhost:9000/inputSelection'}
                       );
    response.end();
    //response.redirect('http:/localhost:9000/inputSelection');
}


exports.handle_Input=function (req,res)
{
    //console.log('1111111');
    if(req.params.id!=undefined){
    var ContactID= req.params.id;
    }
    
    var ContactName =req.query.ContactName;
    var dataForShowing1=new Array();
    var CompanyID = req.query.CompanyID;
    console.log(CompanyID+ " =  CompanyID");
    
        poolH.getConnection(function(err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            var countVehicle=0;
                            var VIN;
                            var VehicleID;
                            var queryClause2 = "Select x.count as countVehicle , VIN as VIN, VehicleID as vid, UnitNumber as un, VehicleMake as vmake, VehicleModel as vmodel, VehicleYear as vy From Vehicle , (select count(*) as count FROM Vehicle Where CompanyID =" + connection.escape(CompanyID) +") as x where Vehicle.CompanyID =" + connection.escape(CompanyID) +" Order by VIN ";
                           // console.log(queryClause2);
                            connection.query(queryClause2,function(err,rows,fields){
                                             
                                             connection.release();
                                             if(!err)
                                             {
                                             if(rows[0]!=null&&rows[0].countVehicle!=undefined){
                                             countVehicle = rows[0].countVehicle;
                                             VIN = new Array(countVehicle);
                                             VehicleID = new Array(countVehicle);
                                             for(var i =0; i <countVehicle ; i++)
                                             {
                                             if (rows[i]!=null && rows[i].vid!= undefined)
                                             {
                                             
                                             
                                             dataForShowing1[i]=new Array(6);
                                             VehicleID[i]=rows[i].vid;
                                             VIN[i]=rows[i].VIN;
                                             //console.log("CompanyName " + i +"  =  " + rows[i].cn)
                                            // console.log("CompanyID " + i +"  =  " + rows[i].ci)
                                             //console.log("");
                                             dataForShowing1[i][0]=rows[i].VIN;
                                             
                                             dataForShowing1[i][1]=rows[i].vid;
                                             dataForShowing1[i][2]=rows[i].un;
                                             dataForShowing1[i][3]=rows[i].vmake;
                                             dataForShowing1[i][4]=rows[i].vmodel;
                                             dataForShowing1[i][5]=rows[i].vy;

                                             
                                             }
                                             
                                             else{console.log("no Vehicle records");
                                             
                                             
                                             }
                                             
                                             }
                                            // console.log('CompanyCount = ' + countCompanyID);
                                             //;console.log(CompanyID);
                                             res.render('chooseExistingVehicle', {h1:'Select Vehicle',use:{username:'Administrator'},title:'The result of all Vehicle',VehicleCount:countVehicle,VehicleID:VehicleID,VIN:VIN,ContactID: ContactID,dataForShowingE:dataForShowing1,username:ContactName,CompanyID:CompanyID});
                                             }
                                             else{
                                             //Jump tp add new vehicle because there is no vehicle records here.
                                             }
                                             }
                                             
                                             else{
                                             console.log('error in Select Vehicle Info!');
                                             
                                             res.render('errorPage', {usernameE: 'administrator',h1:'Error in Select Vehicle Infomation',title:"Error in Select VehicleInfo",errorMessage :'Error in Select Vehicle Info!'});
                                             return;
                                             }
                                             
                           
                                             
                                       

                            
                                             
                                             });
                            });
    
}

/*
 poolH.getConnection(function(err,connection){
 if (err) {
 connection.release();
 response.json({"code" : 100, "status" : "Error in connection database"});
 return;
 }
 //queryDPFID='Select DPFID from DPFDOC WHERE DPFID like "%'+req.query.key+'%;"'
 queryDPFID='SELECT DPFID from DPFDOC where DPFID like "%'+request.query.key+'%"'
 connection.query(queryDPFID,function(err,rows){
 connection.release();
 if(!err)
 {
 var data=[];
 for(i=0;i<rows.length;i++)
 {
 data.push(rows[i].DPFID);
 
 }
 console.log(data);
 response.end(JSON.stringify(data));
 
 }
 else
 {
 console.log('error in select dpfid');
 response.render('errorPage',{title:'Select DPFID ', h1:'Select DPFID', errorMessage:'ERROR IN DPF!', usernameE:'adminBob'});//???why
 }
 })
 });
 

*/