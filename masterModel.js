/**
 * Master Model
 */
var x;
module.exports = {
  
  //Customer

  // verification of student
  
  get_student: function(connection,id, controllerCallback) {    
    var sql = " SELECT * from student_master WHERE studentID= '"+id+"' and status= 'Active' ";
    x=id;
    connection.query(sql, (err, result) => {     
      controllerCallback(err, result);      
    })     
  }, 

  // Sending the OTP to the students and inserting the generated OTPs into loginOTP table
   add_studentotp : function(connection,id,otp, controllerCallback) {    
     var sql = " INSERT INTO loginotp (studentid,otp,isActive,LoginAt) "  
             + " VALUES('"+id+"','"+otp+"','1',now()) ";    
      // console.log(sql);       
      connection.query(sql, (err, result) => {
       
        var sql = " SELECT contactNo from student_master WHERE studentID= '"+id+"' and status= 'Active' ";
        connection.query(sql, (err, resultStudent) => {     
          controllerCallback(err, otp, resultStudent);      
        })     
    
     })
        
   },
  
  // getting the OTPs from table and verifying with the OTP that is given by the student
   get_otp: function(connection,id,otp,controllerCallback) {    
    var sql = " SELECT otp from loginotp WHERE studentID= '"+id+"' and otp='"+otp+"' and IsActive= '1' ";
    connection.query(sql, (err, result) => {     
      controllerCallback(err, result);      
    })     
  },
  
  // updating the OTP status from 1 to 0 in the table
  update_otp: function(connection,id,otp, controllerCallback) {    
     var sql = " UPDATE loginotp SET IsActive='0' WHERE studentID='"+id+"'and otp='"+otp+"'";   
     connection.query(sql, (err, result) => {     
       controllerCallback(err, result);      
     })        
   },

   // getting the transaction history details data
  get_transaction: function(connection,id, controllerCallback) {    
    var sql = " SELECT tran_date AS Transaction_date,recepept_id AS Receipt_ID,paid_amount AS Paid_amount,tran_mode AS mode from transaction_master WHERE student_id='"+x+"' and is_synced= 'Y'; ";
    connection.query(sql, (err, result) => {     
    controllerCallback(err, result);      
    })     
  },
  
  // Getting the total amount of "Total commitment" module
  get_commitment: function(connection,id, controllerCallback) {    
    var sql = "SELECT DISTINCT(payable_amount) AS TOTAL_FEES from transaction_master WHERE student_id= '"+x+"' and is_synced= 'Y';";
    connection.query(sql, (err, result) => {     
    controllerCallback(err, result);      
    })   
  },

  // Getting the total amount of "Total payment" module
  get_paidAmount: function(connection,id, controllerCallback) {    
    var sql = "SELECT SUM(paid_amount) AS Total_Paid_Amount FROM transaction_master WHERE student_id='"+x+"' AND is_synced='Y' AND chec='Paid'; ";
    connection.query(sql, (err, result) => {     
    controllerCallback(err, result);      
    })     
  },

  // Getting the total amounts per invoices
  get_Total_invoice_amount: function (connection, id, controllerCallback) {
    var sql =
      "SELECT SUM(C.amount) Total_invoice_amount FROM student_master A INNER JOIN Invoice B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='"+x+"' AND B.`status`='1' AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1) GROUP BY D.component_name LIMIT 1";
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    });
  },

  // Getting the "view details" data of "previous due" module
  get_previous_details: function (connection, id, controllerCallback) {
    var sql =
 " SELECT B.invoice_no,B.payable_date,B.payable_date, D.component_name,C.amount,D.slno FROM student_master A"
 +" INNER JOIN Invoice B on A.studentID = B.studentid"
 +" INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id"
 +" INNER JOIN fees_components_master D on C.fees_components_master_id = D.id"
 +" INNER JOIN academic_session E on B.academic_session_id = E.id"
+" WHERE B.studentid='"+x+"' AND B.`status`='1' AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1 ) ORDER BY B.invoice_no"
    connection.query(sql, (err, result) => {

      sql = "SELECT DISTINCT E.session_name FROM student_master A INNER JOIN invoice  B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id  INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='"+x+"' AND B.`status`='1' AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1);";
      connection.query(sql, (err, result_session) => {
  
        controllerCallback(err, result,result_session);
      });


    });
  },

  // Getting the "view details" data of "upcoming due" module
  get_upcoming_details: function (connection, id, controllerCallback) {
    var sql =
 " SELECT B.invoice_no,B.payable_date,B.payable_date, D.component_name,C.amount,D.slno FROM student_master A"
 +" INNER JOIN Invoice B on A.studentID = B.studentid"
 +" INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id"
 +" INNER JOIN fees_components_master D on C.fees_components_master_id = D.id"
 +" INNER JOIN academic_session E on B.academic_session_id = E.id"
+" WHERE B.studentid='"+x+"' AND B.`status`='1' AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1 OFFSET 1) ORDER BY B.invoice_no;"
    connection.query(sql, (err, result) => {

      sql = "SELECT DISTINCT E.session_name FROM student_master A INNER JOIN invoice  B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id  INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='"+x+"' AND B.`status`='1' AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1);";
      connection.query(sql, (err, result_session) => {
  
        controllerCallback(err, result,result_session);
      });


    });
  },

  // Getting the "view details" data of "current due" module
  get_current_details: function (connection, id, controllerCallback) {
    var sql =
  " (SELECT E.session_name,B.invoice_no,B.payable_date, D.component_name,C.amount,D.slno FROM student_master A INNER JOIN Invoice B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='"+x+"' AND B.`status`='1' AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1 ) ORDER BY B.invoice_no)UNION (SELECT E.session_name,B.invoice_no,B.payable_date, D.component_name,C.amount,D.slno FROM student_master A INNER JOIN Invoice B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='"+x+"' AND B.`status`='1' AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='1' LIMIT 1 ) ORDER BY B.invoice_no);"
    connection.query(sql, (err, result) => {
  
      sql = "SELECT DISTINCT E.session_name FROM student_master A INNER JOIN invoice  B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id  INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='"+x+"' AND B.`status`='1';";
      connection.query(sql, (err, result_session) => {
  
        controllerCallback(err, result,result_session);
      });
  
  
    });
  },

  // Getting all the total amounts that are showing in the modules of the dashboard
  get_dashboard_details: function (connection, id, controllerCallback) {
    var sql =
      "SELECT SUM(C.amount) AS CURRENT_DUE FROM student_master A INNER JOIN Invoice B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='"+x+"' AND B.`status`='1'"
    connection.query(sql, (err, result) => {
      sql =
        "SELECT SUM(C.amount) AS PREVIOUS_DUE FROM student_master A INNER JOIN Invoice B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='"+x+"' AND B.`status`='1'AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1) LIMIT 5;"
      connection.query(sql, (err, result1) => {
        sql = "SELECT DISTINCT(payable_amount) AS TOTAL_COMMITMENT from transaction_master WHERE student_id= '"+x+"' and is_synced= 'Y'"
        
      connection.query(sql, (err, result2) => {
          sql = "SELECT SUM(paid_amount) AS TOTAL_PAID_AMOUNT FROM transaction_master WHERE student_id='"+x+"' AND is_synced='Y' AND chec='Paid'"
          connection.query(sql, (err, result3) => {
          sql = "SELECT SUM(C.amount) AS UPCOMING_DUE FROM student_master A INNER JOIN Invoice B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='" +
          id +
          "' AND B.`status`='1'AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1 OFFSET 1 ) LIMIT 5;"
          connection.query(sql, (err, result4) => {
        controllerCallback(err, result, result1, result2, result3, result4);
      });
    });
  });
});
});
},

  

  


  // edit_customer: function(post, controllerCallback) {    
  //   var sql = " UPDATE customers SET name='"+post.name+"',address ='"+post.address+"',phone='"+post.phone+"',email='"+post.email+"',discount_rate='"+post.discount_rate+"' WHERE id='"+post.id+"'";   
  //   dbObject.query(sql, (err, result) => {     
  //     controllerCallback(err, result);      
  //   })        
  // },

  // delete_customer: function(id, controllerCallback) {    
  //   var sql = "DELETE FROM  customers  WHERE id='"+id+"' ";            
  //   dbObject.query(sql, (err, result) => {     
  //     controllerCallback(err, result);      
  //   })        
  // },

  // list_customer: function(post, controllerCallback) {  

  //   var where = ''; 
  //   var orderBy ='';
  //   if(typeof post.search != 'undefined' && post.search.value != ''){
  //     where =" AND (name like '"+post.search.value+"%' )";
  //   } 

  //   var limit = " LIMIT "+ post.start +", "+post.length
  //   var sql = "SELECT * FROM customers WHERE 1=1 "+where

  //   if(typeof post.order[0].column != 'undefined' && post.order[0].column >= 0){
  //     orderBy = ' ORDER BY name '+post.order[0].dir
  //   }

  //   dbObject.query(sql+orderBy+limit, (err, result) => {          
  //     var sql_count = "SELECT count(id) as tot_record FROM customers WHERE 1=1 "+where
  //     dbObject.query(sql_count, (err, result_count) => {  
  //       controllerCallback(err, result,result_count[0].tot_record); 
  //     })       
  //   })    
  // }, 

  
  

  // //Item
  // add_item: function(post, controllerCallback) {
  //   if(typeof post.special === 'undefined' )  post.special = 0;
  //   if(typeof post.stock === 'undefined' )  post.stock = 0;
  //   if(typeof post.half === 'undefined' )  post.half = 0;
  //   if(typeof post.bartype === 'undefined' )  post.bartype = 0;
    
  //   var sql = " INSERT INTO item_master(name,itcode,rate,f_rate,mrp,grcode,bartype,tax_type,food_type,half,altcode,peg,stock,mltype,winetype,special) "
  //           + " VALUES('"+post.name+"','"+post.itcode+"',"+post.rate+","+post.f_rate+","+post.mrp+",'"+post.grcode+"',"+post.bartype+",'"+post.tax_type+"','"+post.food_type+"',"+post.half+",'"+post.altcode+"',"+post.peg+","+post.stock+",'"+post.mltype+"','"+post.winetype+"',"+post.special+") ";    
  //   //console.log('sql' ,sql);
  //   dbObject.query(sql, (err, result) => {     
  //     controllerCallback(err, result);      
  //   })
        
  // },

  // edit_item: function(post, controllerCallback) { 
  //   if(typeof post.special === 'undefined' )  post.special = 0;
  //   if(typeof post.stock === 'undefined' )  post.stock = 0;
  //   if(typeof post.half === 'undefined' )  post.half = 0;
  //   if(typeof post.bartype === 'undefined' )  post.bartype = 0;
    
  //  var sql = " UPDATE item_master SET name='"+post.name+"',rate ="+post.rate+",f_rate="+post.f_rate+",mrp="+post.mrp+",itcode='"+post.itcode+"',grcode="+post.grcode+",bartype="+post.bartype+",tax_type='"+post.tax_type+"',food_type='"+post.food_type+"',half="+post.half+",altcode='"+post.altcode+"',peg="+post.peg+",stock="+post.stock+",mltype='"+post.mltype+"',winetype='"+post.winetype+"',special="+post.special+" WHERE id='"+post.id+"'";   
    
  //  dbObject.query(sql, (err, result) => {     
  //     controllerCallback(err, result);      
  //   }) 
  //   //console.log('sql',sql);       
  // },

  // delete_item: function(id, controllerCallback) {    
  //   var sql = "DELETE FROM  item_master  WHERE id='"+id+"' ";            
  //   dbObject.query(sql, (err, result) => {     
  //     controllerCallback(err, result);      
  //   })        
  // },

  // get_optgroup: function(req, controllerCallback) {    
  //   var sql = "select id,name FROM  group_master order by name";            
  //   dbObject.query(sql, (err, result) => {     
  //     controllerCallback(err, result);      
  //   })        
  // },

  // list_item: function(post, controllerCallback) {  

  //   var where = ''; 
  //   var orderBy ='';
  //   if(typeof post.search != 'undefined' && post.search.value != ''){
  //     where =" AND (name like '"+post.search.value+"%' )";
  //   } 

  //   var limit = " LIMIT "+ post.start +", "+post.length
  //   var sql = "SELECT * FROM item_master WHERE 1=1 "+where

  //   if(typeof post.order[0].column != 'undefined' && post.order[0].column >= 0){
  //     orderBy = ' ORDER BY name '+post.order[0].dir
  //   }

  //   dbObject.query(sql+orderBy+limit, (err, result) => {          
  //     var sql_count = "SELECT count(id) as tot_record FROM item_master WHERE 1=1 "+where
  //     dbObject.query(sql_count, (err, result_count) => {  
  //       controllerCallback(err, result,result_count[0].tot_record); 
  //     })       
  //   })  
  // }, 

  
  // get_item: function(id, controllerCallback) {   
  //   var sql = "SELECT * FROM item_master WHERE id = '"+id+"'"; 
  //   dbObject.query(sql, (err, result) => {     
  //     controllerCallback(err, result);      
  //   })     
  // }, 

  // // Group
  // list_member_ajax: function(post, controllerCallback) {
  //   var where = ''; 
  //   var orderBy ='';
  //   if(typeof post.search != 'undefined' && post.search.value != ''){
  //     where =" AND (name like '"+post.search.value+"%' )";
  //   } 

  //   var limit = " LIMIT "+ post.start +", "+post.length
  //   var sql = "SELECT id,name,status FROM group_master WHERE 1=1 "+where

  //   if(typeof post.order[0].column != 'undefined' && post.order[0].column >= 0){
  //     orderBy = ' ORDER BY name '+post.order[0].dir
  //   }
  //   dbObject.query(sql+orderBy+limit, (err, result) => {          
  //     var sql_count = "SELECT count(id) as tot_record FROM group_master WHERE 1=1 "+where
  //     dbObject.query(sql_count, (err, result_count) => {  
  //       controllerCallback(err, result,result_count[0].tot_record); 
  //     })       
  //   })     
  // }, 
  
  // add_group: function(post, controllerCallback) {    
  //   var sql = " INSERT INTO group_master (name) "
  //           + " VALUES('"+post.group+"') ";    
  //   dbObject.query(sql, (err, result) => {     
  //     controllerCallback(err, result);      
  //   })        
  // },
  
  // get_group: function(post, controllerCallback) {    
  //   var sql = " SELECT * FROM  group_master WHERE id = '"+post.id+"' ";    
  //   dbObject.query(sql, (err, result) => {     
  //     controllerCallback(err, result);      
  //   })        
  // },
  // edit_group: function(post, controllerCallback) {    
  //   var sql = " UPDATE group_master SET name='"+post.name+"' , status='"+post.status+"' WHERE id='"+post.edit_id+"' ";            
  //   dbObject.query(sql, (err, result) => {     
  //     controllerCallback(err, result);      
  //   })        
  // },

  // delete_group: function(id, controllerCallback) {    
  //   var sql = "DELETE FROM  group_master  WHERE id='"+id+"' ";            
  //   dbObject.query(sql, (err, result) => {     
  //     controllerCallback(err, result);      
  //   })        
  // },


  //   // Wine Group
  //   list_wine_member_ajax: function(post, controllerCallback) {
  //     var where = ''; 
  //     var orderBy ='';
  //     if(typeof post.search != 'undefined' && post.search.value != ''){
  //       where =" AND (name like '"+post.search.value+"%' )";
  //     } 
  
  //     var limit = " LIMIT "+ post.start +", "+post.length
  //     var sql = "SELECT id,name,status,serial FROM wine_group_master WHERE 1=1 "+where
  
  //     if(typeof post.order[0].column != 'undefined' && post.order[0].column >= 0){
  //       orderBy = ' ORDER BY name '+post.order[0].dir
  //     }
  //     dbObject.query(sql+orderBy+limit, (err, result) => {          
  //       var sql_count = "SELECT count(id) as tot_record FROM wine_group_master WHERE 1=1 "+where
  //       dbObject.query(sql_count, (err, result_count) => {  
  //         controllerCallback(err, result,result_count[0].tot_record); 
  //       })       
  //     })     
  //   }, 
    
  //   add_wine_group: function(post, controllerCallback) {  
  //     var sql = " INSERT INTO wine_group_master (name,serial) "
  //             + " VALUES('"+post.name+"', "+post.serial+") ";
  //     dbObject.query(sql, (err, result) => {     
  //       controllerCallback(err, result);      
  //     })        
  //   },
    
  //   get_wine_group: function(post, controllerCallback) {  
  //     var sql = " SELECT * FROM  wine_group_master WHERE id = '"+post.id+"' ";    
  //     dbObject.query(sql, (err, result) => {     
  //       controllerCallback(err, result);      
  //     })        
  //   },
  //   edit_wine_group: function(post, controllerCallback) {    
  //     var sql = " UPDATE wine_group_master SET name='"+post.name+"' , serial="+post.serial+" , status='"+post.status+"' WHERE id='"+post.edit_id+"' "; 
  //     dbObject.query(sql, (err, result) => {     
  //       controllerCallback(err, result);      
  //     })        
  //   },
  
  //   delete_wine_group: function(id, controllerCallback) {    
  //     var sql = "DELETE FROM  wine_group_master  WHERE id='"+id+"' ";
  //     dbObject.query(sql, (err, result) => {     
  //       controllerCallback(err, result);      
  //     })        
  //   },



};

