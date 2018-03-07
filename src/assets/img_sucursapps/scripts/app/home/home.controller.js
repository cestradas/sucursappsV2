'use strict';

angular.module('SucursApps')
  .controller('HomeController', function($rootScope, $scope, $q, $state, $timeout, Auth, DevicesServices) {
	$rootScope.enSessionMF;
	$rootScope.acceso;
    $scope.user = {};
    $scope.errors = {};
    $scope.errorMessage = null;

    $scope.command = {};

    $scope.view_usr = true;
    $scope.view_pass = false;
    var usr = "";
    var sesion = "";
    var intentosFallidos = 0;
    var sucursalIdBXI = "";
    var terminalIdBXI = "";
    
    //Catalogos corporativos
    var CatCorporativosGuardados = "";
    var catalogoCorporativoAGuardar = "";
    var clientePref = false;
    var tipoSegmentoCliente = "";
    
    
    
///////////////nuevo js
    $scope.logInicioBXI = function(userid,sourceaccount,destinationaccount,payeeid,amount,reference,username,sessionid,servicecharge,transdecription,status,confirmationcode,message,transmode,terminalid){
    	//fecha
		var f = new Date();
		var ano = f.getFullYear();
		var mes = '';
		var dia = '';
	    		
		if(f.getMonth()>8){mes = (f.getMonth() +1);}else{mes = "0" +(f.getMonth() +1);}    			
		if(f.getDate()>9){dia = f.getDate();}else{dia = '0' + f.getDate();}	
		var transdate = dia + "" + mes + "" + ano;
		
    	WL.Client.invokeProcedure({
			adapter : "conndb",
			procedure : "insert_T_TRANSACTION_LOG",
//        	USERID,SOURCEACCOUNT,DESTINATIONACCOUNT,PAYEEID,AMOUNT,REFERENCE,
//        TRANSDATE,USERNAME,SESSIONID,SERVICECHARGE,TRANSDESCRIPTION,STATUS,
//        CONFIRMATIONCODE,MESSAGE,TRANSMODE,TERMINALID            
			parameters : [userid,sourceaccount,destinationaccount,payeeid,amount,reference,
			              transdate,username,sessionid,servicecharge,transdecription, status,
			              confirmationcode,message,transmode,terminalid]
		}).then(function(resp){
    	
    	//alert("isSuccessful: " + resp.invocationResult.isSuccessful);
			console.log("Insert Insert_T_TRANSACTION_LOG  correcto");
		},function(error){  // conndb
    		
			console.log("Error Insert_T_TRANSACTION_LOG");
		});  

    };
    $scope.cerrarSesionBXI = function() {
    		WL.Client.invokeProcedure({
				adapter : "bxiIdentificarUsuariojs",
				procedure : "loginBXICerrarSesionCanal",
				parameters : [sesion]
			}).then(function(resp){
    	
				var rep = resp.responseJSON;
				var obj = JSON.parse(rep.result);
    	
				console.log("Cerrar Sesion: ID: " + obj.Id + " MensajeAUsuario: " + obj.MensajeAUsuario);
				$("#modalLoginUsuario").modal('hide');
				document.getElementById("usr").value = "";
    	
			});
    };
    $scope.onUserClick3 = function() {
    	$("#_modal_please_wait").modal('show');
    	   	
    	
    	intentosFallidos = 0;
    	var usuario = document.getElementById("usr").value;
    	if(usuario.length >=6){
    	var obj = "";
    	var objMet ="";
    	var objPre = "";
    	console.log("usuario " + usuario);
    	usr = usuario;
    	
    	document.getElementById("usr").value = "";
    	document.getElementById("view_usr").style.display = 'none';
    	document.getElementById("view_pass_token_cel").style.display = 'none';
    	document.getElementById("view_pass_token").style.display = 'none';
    	document.getElementById("view_pass").style.display = 'none';   	

    	WL.Client.invokeProcedure({
            adapter : "bxiIdentificarUsuariojs",
            procedure : "loginBXIidentificarUsuario",
            parameters : [usuario]
        }).then(function(resp){
        	
        	var repLIU = resp.responseJSON;
    		obj = JSON.parse(repLIU.result);
        	
      		//$scope.userData = obj;      		
      		sesion = obj.IdSesionCanal;   
      		sucursalIdBXI = obj.sucursalId;
      		terminalIdBXI = obj.terminalId;
      		console.log("sesion: " + sesion);
      		console.log("mensajeAUsuario: " + obj.MensajeAUsuario);
      		console.log("sucursalId: " + obj.sucursalId );
      		
      		//Metodos de autenticacion
      		WL.Client.invokeProcedure({
                adapter : "bxiIdentificarUsuariojs",
                procedure : "loginBXIMetodosAutenticaUsuario",
                parameters : [sesion]
            }).then(function(respMetodos){
            	
            	var repMet = respMetodos.responseJSON;
        		objMet = JSON.parse(repMet.result);
        		
        		
            	var numMetodos = objMet.numeroMetodos;
            	
            	if(objMet.numeroMetodos == 1){ //Autenticacion 0
            		$("#_modal_please_wait").modal('hide');
            		document.getElementById("view_pass").style.display = 'block';
            		document.getElementById("imgTokenPass").src = obj.img;
                	document.getElementById("mensajeSegPass").innerHTML = obj.phr
            		
            	}else if(objMet.numeroMetodos == 2){
            		
            		if(objMet.tipoAutenticacion1 == 5){
            			
            			
            			
            			WL.Client.invokeProcedure({
                            adapter : "bxiIdentificarUsuariojs",
                            procedure : "loginBXIPrepararAutenticacion",
                            parameters : [sesion]
                        }).then(function(respPre){
                        	$("#_modal_please_wait").modal('hide');
                        	var repPre = respPre.responseJSON;
                        	objPre = JSON.parse(repPre.result);
                        	
                        	document.getElementById("view_pass_token_cel").style.display = 'block';
                        	
                        	document.getElementById("imgTokenTel").src = obj.img;
                        	document.getElementById("mensajeSegTel").innerHTML = obj.phr
                        	
                        	document.getElementById("numSeguridad").value = objPre.MensajeUsuarioUno;
                        	
                        	
                        },function(error){
                        	$("#_modal_please_wait").modal('hide');
                        	console.log("error: " + " WS PrepararAutenticacion ");
                        	$("#modalLoginUsuario").modal('hide');
                        	document.getElementById("errorMensaje").innerHTML = "Los datos proporcionados son incorrectos";
                            $('#modalErrorMessage').modal('show');
                        }); 
            			
            		}else{
            			$("#_modal_please_wait").modal('hide');                  	
            			document.getElementById("view_pass_token").style.display = 'block';
            			document.getElementById("imgToken").src = obj.img;
                    	document.getElementById("mensajeSeg").innerHTML = obj.phr
            			
            		}
            	}
            	
            },function(error){
            	$("#_modal_please_wait").modal('hide');
            	console.log("error: " + " WS MetodosAutenticarUsuario");
            	$("#modalLoginUsuario").modal('hide');
            	document.getElementById("errorMensaje").innerHTML = "Los datos proporcionados son incorrectos";
                $('#modalErrorMessage').modal('show');
            }); 
      		//fin metodos de autenticacion
      		
        },function(error){
        	$("#_modal_please_wait").modal('hide');
        	console.log("error: " + " WS LoginBXIIdentificarUsuario");
        	$("#modalLoginUsuario").modal('hide');
        	document.getElementById("errorMensaje").innerHTML = "Los datos proporcionados son incorrectos";
        	
            $('#modalErrorMessage').modal('show');
        }); 
    	
    	//document.getElementById("view_pass_token").style.display = 'block';
    	
    	}else{
    		$("#_modal_please_wait").modal('hide');
    		document.getElementById("errorMensaje").innerHTML = "El usuario debe contener mas de 5 caracteres";
    		$('#modalErrorMessage').modal('show');
    	}
    	//$scope.view_pass_token = true;
    	
    };
    $scope.onPassClick4 = function(tipoAutenticacion) {
    	
    	$("#_modal_please_wait").modal('show');
    	
    	var pss = '';
    	var token = '';
    	
    	if(tipoAutenticacion == 6){
    		
    		pss = document.getElementById("password").value;
    		
    	}else if(tipoAutenticacion == 1){
    		
    		pss = document.getElementById("passwordToken").value;
    		token = document.getElementById("token").value;
    		
    	}else if(tipoAutenticacion == 5){
    		
    		pss = document.getElementById("passwordTokenTel").value;
    		token = document.getElementById("tokenTel").value;
    		
    		
    	}
    	
    	console.log("tipoAutenticacion: " + tipoAutenticacion  + " token: " + token + " sesion: " + sesion + " intentosFallidos: " + intentosFallidos);
    	
    		WL.Client.invokeProcedure({
                adapter : "bxiIdentificarUsuariojs",
                procedure : "loginbxiAutenticaSeguridad",
                parameters : [pss,token,tipoAutenticacion]
            }).then(function(resp){
            	
            	$("#_modal_please_wait").modal('hide');
            	
            	var rep = resp.responseJSON;
            	var obj = JSON.parse(rep.result);
            	var refToken = obj.refToken;
            	
            	console.log("obj.Id: " +obj.Id);
        		console.log("obj.MensajeRespuesta: " +obj.MensajeRespuesta);
        		var status = 'NOK';
        		$rootScope.enSessionMF = obj.Id  ;
        		var sic = obj.Sic;
           		if(obj.Id == "1"){
           			status = 'OK';
           			$rootScope.acceso = "BXI";
           			
           			$("#modalLoginUsuario").modal('hide');  
           			
           			//invocacionsi es cliente preferente
   			WL.Client.invokeProcedure({
      	         adapter : "bxiIdentificarUsuariojs",
      	         procedure : "loginbxiInfoSesion",
      	         parameters : []
       		}).then(function(resp){ 
       			
       					
       				var rep = resp.responseJSON;
       				var obj = JSON.parse(rep.result);
       				
       				////****************
       				//activar edc en BXI
       				console.log(obj.activaEDC);
       				if(obj.activaEDC == 1){
       					
       					$("#navPagePort").load("pages/navbar/navbar-bxi-menu.html");
	           			$("#pagePort").load("pages/bxi-menu2EDC.html",function(){
	           				
	           				$.getScript(path + "js/nbxi/bxiMenuEDC.js", function(activaEDC) {
	           					if (currentPage.loadMenu) {
	           						currentPage.loadMenu();
	           					}
	           				});
	           			});
       				}
       				////****************
       				else{
       				console.log(obj.ctePref);
       				if(obj.ctePref=="true"){
       					//cargar menu preferente bxi
						$("#estilos").load("pages/pages_ixe/estilosIXE.html");
						$("#navPagePort").load("pages/navbar/navbar-bxi-menu.html");
						document.getElementById("loadPng").src="assets_ixe/images/loader-banorte.gif";
						$("#pagePort").load("pages/pages_ixe/bxi-menu2.html",function(){
	           				
	           				$.getScript(path + "js/nbxi/bxiMenu.js", function() {
	           					if (currentPage.loadMenu) {
	           						currentPage.loadMenu();
	           					}
	           				});
	           			});
       					
       				}else
       					{
       					
       						$("#navPagePort").load("pages/navbar/navbar-bxi-menu.html");
		           			$("#pagePort").load("pages/nbxi/bxi-menu2.html",function(){
		           				
		           				$.getScript(path + "js/nbxi/bxiMenu.js", function() {
		           					if (currentPage.loadMenu) {
		           						currentPage.loadMenu();
		           					}
		           				});
		           			});
       					}
       				}
       		});
           		}else{
           			console.log("sesion: " + sesion);
           			           			     	    		
       	    		if(tipoAutenticacion == 5){
       	    			
       	    			document.getElementById("passwordTokenTel").value = "";
       	    			document.getElementById("tokenTel").value = "";
       	    			
       	    			if(obj.RespSeg == "SEG0007"){           	    		
               				WL.Client.invokeProcedure({
               					adapter : "bxiIdentificarUsuariojs",
               					procedure : "loginBXIPrepararAutenticacion",
               					parameters : [sesion]
               				}).then(function(respPre){
                        	
               					var repPre = respPre.responseJSON;
               					var objPre = JSON.parse(repPre.result);
                        	
               					//document.getElementById("view_pass_token_cel").style.display = 'block';
               					document.getElementById("numSeguridad").value = objPre.MensajeUsuarioUno;
                        	
               				});
       	    			}
       	    			
           			}else if(tipoAutenticacion == 1){
           				
           				document.getElementById("passwordToken").value = "";
           	    		document.getElementById("token").value = "";
           	    		
           			}else if(tipoAutenticacion == 6){
           				
           				document.getElementById("password").value = "";
           	    		           	    		
           			}

           			if(intentosFallidos<=2 && tipoAutenticacion ==5){
           				$("#_modal_please_wait").modal('hide');
           				document.getElementById("errorMensaje").innerHTML = obj.MensajeAUsuario;          				
           				console.log("obj.MensajeRespuesta: " +obj.MensajeRespuesta);
           				
                        $('#modalErrorMessage').modal('show');
                        
           			}else if(intentosFallidos>2 || obj.RespSeg == "SEG0009" || tipoAutenticacion == 1 || tipoAutenticacion == 6){
           				
           				document.getElementById("view_usr").style.display = 'none';
           		    	document.getElementById("view_pass_token_cel").style.display = 'none';
           		    	document.getElementById("view_pass_token").style.display = 'none';
           		    	document.getElementById("view_pass").style.display = 'none';
           		    	$("#modalLoginUsuario").modal('hide');
           		    	
           				document.getElementById("errorMensaje").innerHTML = obj.MensajeAUsuario;
           				console.log("obj.MensajeRespuesta: " +obj.MensajeRespuesta);
               			$("#_modal_please_wait").modal('hide');   			
                        $('#modalErrorMessage').modal('show');
                        
                        WL.Client.invokeProcedure({
           					adapter : "bxiIdentificarUsuariojs",
           					procedure : "loginBXICerrarSesionCanal",
           					parameters : [sesion]
           				}).then(function(resp){
                    	
           					var rep = resp.responseJSON;
           					var obj = JSON.parse(rep.result);
                    	
           					console.log("Cerrar Sesion: ID: " + obj.Id + " MensajeAUsuario: " + obj.MensajeAUsuario);
           					
                    	
           				});
           			}
           			intentosFallidos++;
           		}
           		
           		//userid,sourceaccount,destinationaccount,payeeid,amount,reference,transdate,username,
           		//sessionid,servicecharge,transdecription,status,confirmationcode,message,transmode,terminalid
           		console.log("usr: " + usr + " sesion: " + sesion + " sic: " +sic + " usr: " + usr + " status: " + status + " sucursalIdBXI: " + terminalIdBXI);
           		$scope.logInicioBXI(sic,'','','','',refToken,usr,sesion,'0','Inicio de sesion BXI',status,'ISS01,ISS06,ISS03,CTA52,WHP01','Inicio de sesion en BXI ' + status,'MFAIO',terminalIdBXI);
            },function(error){
            	$("#_modal_please_wait").modal('hide');
            	console.log("error: " + error);
            	$("#modalLoginUsuario").modal('hide');
            	document.getElementById("errorMensaje").innerHTML = "Los datos proporcionados son incorrectos";
            	console.log("Error en ws Metodos de Autentica seguridad");
                $('#modalErrorMessage').modal('show');
            }); 
    			
    		
    	
    };
   
    ///////////////////////
   
    
   

    $scope.onPasswordBack = function() {
      $scope.command.pss = '';
      $scope.command.utk = '';
      $scope.view_usr = true;
      $scope.view_pass = false;
    };


    $scope.onLogin = function() {
    	
			
    	
    	$("#modalLoginUsuario").modal();
    	
    	document.getElementById("view_usr").style.display = 'block';
    	document.getElementById("view_pass_token_cel").style.display = 'none';
    	document.getElementById("view_pass_token").style.display = 'none';
    	document.getElementById("view_pass").style.display = 'none'; 
    };
    $scope.restriccionUsr = function() {
    	document.getElementById("botonUsr").disabled = false;

    };
    $scope.onPlasticLogin = function() {
      $("#modalLoginTarjeta").modal();
    };

    $scope.soon = function() {
      $("#modalProximamente").modal();
    };

       
    $scope.logInicio = function (){
    	
    	//alert("logInicio");
    	
    	var idSession = "";
    	var terminalId = ""; 
    	var numeroCuenta = "";
    	var idRespuesta = "";
    	var mensajeAUsuario = "";
    	var mensajeDetallado = "";
    	var tarjeta = "";
    	var nombreTitular = ""
    	var reftoken = "";
    	
    	//var req = new WLResourceRequest("/adapters/mcaLogin/users/infoCuenta",WLResourceRequest.POST);    	
    	//req.send().then(function(resp){
    		WL.Client.invokeProcedure({
                adapter : "mcaLoginjs",
                procedure : "infoCuenta",
                //(tarjeta,nip,servicio,sucursal_id,usuario_legacy,contrasena_legacy
                parameters : []
            }).then(function(resp){
    		
    		//var obj = JSON.parse(resp.responseText);   
            	var repIC = resp.responseJSON;
        		var obj = JSON.parse(repIC.result);
    		
        		idSession = obj.idSession;
        		terminalId = obj.terminalId;
        		numeroCuenta = obj.numeroCuenta;
        		if(obj.idRespuesta == 0){
        			idRespuesta = 'NOK';    			
        		}else{
        			idRespuesta = 'OK';
        		}
        		mensajeAUsuario = obj.mensajeAUsuario;
        		mensajeDetallado = obj.mensajeDetallado;
        		tarjeta = obj.tarjeta;
        		nombreTitular = obj.nombreTitular;
        		reftoken = obj.refToken;
    		
//    		alert("idSession: " + idSession + " terminalId: " + terminalId 
//    				+ " numeroCuenta: " + numeroCuenta + " idRespuestaValTDD: " + idRespuesta 
//    				+ " mensajeAUsuarioValTDD: " + mensajeAUsuario + " mensajeDetalladoValTDD: " 
//    				+ mensajeDetallado + " nombreTitular: " + nombreTitular);
    		//fecha
        		var f = new Date();
        		var ano = f.getFullYear();
        		var mes = '';
        		var dia = '';
    		    		
        		if(f.getMonth()>8){mes = (f.getMonth() +1);}else{mes = "0" +(f.getMonth() +1);}    			
        		if(f.getDate()>9){dia = f.getDate();}else{dia = '0' + f.getDate();}	
        		var fecha = dia+"" + mes + ""+ ano;
        		//alert("dia: " + dia +  " mes: " + mes +  " ano: " + ano);
    		//var fecha = '22062016';
        		
        		WL.Client.invokeProcedure({
        			adapter : "conndb",
        			procedure : "insert_T_TRANSACTION_LOG",
//                	USERID,SOURCEACCOUNT,DESTINATIONACCOUNT,PAYEEID,AMOUNT,REFERENCE,
//                TRANSDATE,USERNAME,SESSIONID,SERVICECHARGE,TRANSDESCRIPTION,STATUS,
//                CONFIRMATIONCODE,MESSAGE,TRANSMODE,TERMINALID            
        			parameters : [numeroCuenta,tarjeta,'','QGPP B162','',reftoken,
                              fecha,nombreTitular,idSession,'1','Inicio de session', idRespuesta,
                              'SUC08 CTA17',mensajeAUsuario,'MFAIO',terminalId]
        		}).then(function(resp){
            	
            	//alert("isSuccessful: " + resp.invocationResult.isSuccessful);
            	
        		},function(error){  // conndb
            		
        			console.log(error);
        		});          	
    		
    	},function(error){  // InfoCuenta
    		
			console.log(error);
		}); 
    	
    	
    };  // function
    
    //Nueva Click 4 ENP BEGIN
    $scope.onPlasticLoginClick4 = function() {

    	alert("entro click4");  
    	/////////////////llamada js

    	DevicesServices.pinpadRead().then(function (data) {////////////////////
    		var data = JSON.parse(data);
    		//alert("pinpad:" + data.tr2+" np:"+data.np+ " res" + data.res);
    		//alert("pinpad:" + data["tr2"]+" np:"+data["np"]+ " res" + data["res"]);
    		var tr2 = data["tr2"];
    		var np = data["np"];
    		
    		$("#modalLoginTarjeta").modal('show');
   	   	
    	//var req = new WLResourceRequest("/adapters/mcaLogin/users/getTerminalId",WLResourceRequest.GET);
        	WL.Client.invokeProcedure({
                adapter : "mcaLoginjs",
                procedure : "getTerminalId",
                //(tarjeta,nip,servicio,sucursal_id,usuario_legacy,contrasena_legacy
                parameters : []
            }).then(function(resp){
            	
            	alert("isSuccessful_getTerminalId: " + resp.invocationResult.isSuccessful);
            	var repTID = resp.responseJSON;
        		var obj = JSON.parse(repTID.result);

        		//var obj = JSON.parse(resp.responseText);
        		alert("terminalId: " + obj.terminalId);	
        		var terminalId = obj.terminalId;
        		
        		WL.Client.invokeProcedure({
       	         adapter : "conndb",
       	         procedure : "getSucursalIdUSRLegacy",
       	         parameters : [terminalId]
        		}).then(function(resp){   

      	    	  var PASSLEGACY = resp.invocationResult.resultSet[0].PASSLEGACY;
       	   		  var USRLEGACY = resp.invocationResult.resultSet[0].USRLEGACY;
       	   		  var SUCURSAL_ID = resp.invocationResult.resultSet[0].SUCURSAL_ID;
               	  alert("PASSLEGACY: " + PASSLEGACY);
               	  alert("USRLEGACY: " + USRLEGACY);  
       	   		  	
 
	    		  		WL.Client.invokeProcedure({
	    		  			adapter : "mcaLoginjs",
	    	            	procedure : "login",
	    	            //(tarjeta,nip,servicio,sucursal_id,usuario_legacy,contrasena_legacy
	    	            	//ED      	parameters : [tr2, np, "RP", SUCURSAL_ID, obj.USRLEGACY, obj.PASSLEGACY]
	    	              	parameters : [tr2, np, "RP", SUCURSAL_ID, USRLEGACY, PASSLEGACY]
	    		  		}).then(function(resp){
	    	        	
	    	        		alert("isSuccessful_login: " + resp.invocationResult.isSuccessful);
	    	        		
	    	        		var repLogin = resp.responseJSON;
	                		var obj = JSON.parse(repLogin.result);
    	        		
    	        			//var obj = JSON.parse(resp.responseText);
    	        		
    	        			//alert("idRespuesta: " + obj.idRespuesta + " mensajeUsuario: " +  obj.mensajeUsuario + " terminalId: " + obj.terminalId);
    	        			if(obj.idRespuesta){
    	        				$rootScope.acceso = "TDD";
    	        				$rootScope.enSessionMF = 0;
    	        				
    	        				
    	        				//invocacion de metodo menu cliente preferente
    	        				WL.Client.invokeProcedure({
    	        	                adapter : "mcaLoginjs",
    	        	                //procedure : "infoCuenta",
    	        	                procedure : "infoCuenta",
    	        	                parameters : []
    	        	            }).then(function(resp){ 
    	        	       			
    	        	       					
    	        	       				var rep = resp.responseJSON;
    	        	       				var obj = JSON.parse(rep.result);
    	        	       				
    	        	       				
    	        	       				console.log(obj.ctePref);
    	        	       				if(obj.ctePref=="true"){
    	        	       					//cargar menu preferente bxi
											$("#estilos").load("pages/pages_ixe/estilosIXE.html");
											document.getElementById("loadPng").src="assets_ixe/images/loader-banorte.gif";						           				
											$("#navPagePort").load("pages/navbar/navbar-mca-menu.html");
    		    	        				$("#pagePort").load("pages/pages_ixe/menu.html",function(){
    		    	        				
    		    	        					$.getScript(path + "js/MainPage.js", function() {
    		    	        						if (currentPage.init) {	
    		    	        							currentPage.init();
    		    	        						}
    		    	        					});
    		    	        				});
    	        	       					
    	        	       				}else
    	        	       					{
    	        	       							$("#navPagePort").load("pages/navbar/navbar-mca-menu.html");
					    	        				$("#pagePort").load("pages/menu.html",function(){
					    	        				
					    	        					$.getScript(path + "js/MainPage.js", function() {
					    	        						if (currentPage.init) {	
					    	        							currentPage.init();
					    	        						}
					    	        					});
					    	        				});
    	        	       					}
    	        	       		});
    								
    	        			}else{
    	        				$rootScope.acceso = "TDD";
    	        				$rootScope.enSessionMF = 1;
    	        				$("#modalLoginTarjeta").modal('hide');
    	        				$scope.errorMessage = obj.mensajeUsuario;
    	        				$('#modalErrorMessage').modal('show');
    	        			
    	        			}
    	        			$scope.logInicio();
    	        	
	    	        	
	    	        	},function(error){  // login
	    	    		
	    	    			console.log(error);
	    	    		});
	    	       
	    	       
              	
        		});  // condb getSucursalIdUSRLegacy
        		
            },function(error){  // getTerminalId
        		
        		console.log(error);
        	});

    	           // console.log("Pinpad error:" + data);
            $("#modalLoginTarjeta").modal('hide');    
            
              $scope.errorMessage = 'Hubo un problema al comunicacion con el servicio SucursApps Devices';            
   
            $('#modalErrorMessage').modal('show');

        });//fin lectura pinpad    	
     
    };
    //Nueva Click 4 ENP END
    
    //Nueva CLick 3 ENP
    $scope.onPlasticLoginClick3 = function() {
    	$scope.errorMessage = "Falló la autenticación";
    	
    	$("#modalLoginTarjeta").modal('show');

    	DevicesServices.pinpadRead().then(function (data) {////////////////////
    	var data = JSON.parse(data);//descomentar al publicar en servidor   		
    		
    		var tr2 = data.tr2;
    		var np = data.np;
    		
        	WL.Client.invokeProcedure({
                adapter : "mcaLoginjs",
                procedure : "getTerminalId",                
                parameters : []
            }).then(function(resp){
            	
            	
            	var repTID = resp.responseJSON;
        		var obj = JSON.parse(repTID.result);
        		
        		var terminalId = obj.terminalId;
        		var cipherActivo = obj.cipherActivo;
        		var bdUsuario = obj.bdUsuario;
        		var bdJdbcni = obj.bdJdbcni;
        		var pathProperties = obj.pathProperties;
        		
        		console.log('terminalId: ' +  terminalId + ' cipherActivo: ' + cipherActivo + " bdUsuario: " + bdUsuario + ' bdJdbcni: ' + bdJdbcni + " pathProperties: " + pathProperties);
        		WL.Client.invokeProcedure({
       	         adapter : "conndb",
       	         procedure : "getSucursalIdUSRLegacy",
       	         parameters : [terminalId]
        		}).then(function(respSLUP){   
        			
        			var repSLUP = respSLUP.responseJSON;
            		var objSLUP = JSON.parse(repSLUP.result);

      	    	  var PASSLEGACY = objSLUP.PASSLEGACY;
       	   		  var USRLEGACY = objSLUP.USRLEGACY;
       	   		  var SUCURSAL_ID = objSLUP.idSucuarsal;
       	   		  console.log("PASSLEGACY: " + PASSLEGACY);
       	   		  console.log("USRLEGACY: " + USRLEGACY);

       	   		  	

               	WL.Client.invokeProcedure({
                    adapter : "mcaLoginjs",
                    procedure : "getDecripUserLegacy",
                    parameters : [PASSLEGACY,USRLEGACY]
                }).then(function(resp){
                	
                	var repDUL = resp.responseJSON;
            		var obj = JSON.parse(repDUL.result);

  	    		  	console.log("PASSLEGACY desen: " + obj.PASSLEGACY);
  	    		  	console.log("USRLEGACY desen: " + obj.USRLEGACY);

	    		  	///////////////////////////////////////////////////////////////////////////////////////////////////

  	    		  	
  	    		//CATALOGO CORPORATIVOS
       			//catalogosCorporativos();
  	    		  //$scope.segmentoCliente();
       				
       			
       				
	    		  		WL.Client.invokeProcedure({
	    		  			adapter : "mcaLoginjs",
	    	            	procedure : "login",
	    	            //tarjeta,nip,servicio,sucursal_id,usuario_legacy,contrasena_legacy
	    	            	parameters : [tr2, np, "RP", SUCURSAL_ID, obj.USRLEGACY, obj.PASSLEGACY]
	    		  		}).then(function(resp){
	    		  			

	    	        		var repLogin = resp.responseJSON;
	                		var obj = JSON.parse(repLogin.result);
	                		console.log("idRespuesta: " + obj.idRespuesta + " mensajeUsuario: " +  obj.mensajeUsuario + " terminalId: " + obj.terminalId); 	        		
    	        			
	                		console.log("idRespuesta " + obj.idRespuesta )
	                		$rootScope.enSessionMF = obj.idRespuesta;
    	        			if(obj.idRespuesta){
    	        				$rootScope.acceso = "TDD"
    	        					
    	        					//SEGMENTO DE CLIENTES
    	        					//$scope.segmentoCliente();

    	        					  //function segmentoCliente(){
    	        						  
    	        						 
    	        					  
    	        				//CATALOGO CORPORATIVOS
    	        				
    	        				if(CatCorporativosGuardados == ""){
    	        					CatCorporativosGuardados = localStorage.getItem("catalogosCorporativos");
    	        					if(CatCorporativosGuardados == null){
    	        						$scope.catalogosCorporativos();
    	        					}else{
    	        						//CATALOGO CORPORATIVOS
            	        				CatCorporativosGuardados = localStorage.getItem("catalogosCorporativos");
            	        				
            	        				if(CatCorporativosGuardados != null){
            	        					CatCorporativosGuardados = JSON.parse(CatCorporativosGuardados);
            	        				}
    	        					}
    	        				}else{
    	        					
    	        					//CATALOGO CORPORATIVOS
        	        				CatCorporativosGuardados = localStorage.getItem("catalogosCorporativos");
        	        				
        	        				if(CatCorporativosGuardados != null){
        	        					CatCorporativosGuardados = JSON.parse(CatCorporativosGuardados);
        	        				}
    	        					
    	        				}
    	        	          	
    	    	           			
    	        					
    	        					//invocacion cliente preferente TDD
					WL.Client.invokeProcedure({
		                adapter : "mcaLoginjs",
		                procedure : "infoCuenta",
		                //(tarjeta,nip,servicio,sucursal_id,usuario_legacy,contrasena_legacy
		                parameters : []
		            }).then(function(resp){
	
    	       				var rep = resp.responseJSON;
    	       				var obj = JSON.parse(rep.result);
    	       				
    	       				
    	       				console.log(obj.ctePref);
    	       				
    	       				
    	       			
    	       				//}
    	       				//SEGMENTO DE CLIENTES
    	       				$scope.segmentoCliente();
    	       				
    	       				
    	       			});
    	        			}else{
    	        				$("#modalLoginTarjeta").modal('hide');    	        				
    	        				document.getElementById("errorMensaje").innerHTML = "Los datos proporcionados son incorrectos";    	        				
    	        				$('#modalErrorMessage').modal('show');
    	        				console.log("Error Autenticación: " + "Falló la autenticación");
    	        				
    	        			
    	        			}
    	        		//	$scope.logInicio();
    	        	
	    	        	
	    	        	},function(error){  // login	    	        		 
	    	        		
	    	    			$("#modalLoginTarjeta").modal('hide');
	    	    			document.getElementById("errorMensaje").innerHTML = "Los datos proporcionados son incorrectos";        	
	                		$('#modalErrorMessage').modal('show');
	                		console.log("Error login:" + "Falló la autenticación");
	                		
	    	    		});
	    	        	
	    	        	  	  			             
                	},function(error){  // getDecripUserLegacy
            		
            			
            			$("#modalLoginTarjeta").modal('hide');
            			document.getElementById("errorMensaje").innerHTML = "Los datos proporcionados son incorrectos";        	
                		$('#modalErrorMessage').modal('show');
                		console.log("Error getDecripUserLegacy: " + error);
            		});
              	
        		},function(error){// condb getSucursalIdUSRLegacy
        			
            		$("#modalLoginTarjeta").modal('hide');
            		document.getElementById("errorMensaje").innerHTML = "Los datos proporcionados son incorrectos";        	
            		$('#modalErrorMessage').modal('show');
            		console.log("Error condbgetSucursalIdUSRLegacy: " + error);
        		});  
        		
            },function(error){  // getTerminalId
        		
            	
        		
        		$("#modalLoginTarjeta").modal('hide');
        		document.getElementById("errorMensaje").innerHTML = "Los datos proporcionados son incorrectos";        	
        		$('#modalErrorMessage').modal('show');
        		console.log("Eror getTermina: " + error);
        		
        	});
//    	           

        },function(error){// lectura pinpad
        	$("#modalLoginTarjeta").modal('hide');
        	document.getElementById("errorMensaje").innerHTML = "Los datos proporcionados son incorrectos";
        	$('#modalErrorMessage').modal('show');
        	console.log("Error lectura PinPad: " + error);
        });//fin lectura pinpad    	
     
};   	
    
    
    $scope.bannerItems = [];

    $scope.loadAll = function() {

      // Animacion de la terminal entrada
      //BannerItemService.findAll(function(result, headers) {
      //  $scope.bannerItems = result;
      //  $('.carousel').carousel();
      //});

      $('#modalLoginUsuario').on('show.bs.modal', function(e) {
        $scope.command = {};
        $scope.view_usr = true;
        $scope.view_pass_token_cel = false;
        $scope.view_pass_token = false;
        $scope.view_pass = false;
      });

      $('.carousel').carousel();

    };

    $scope.loadAll();
    Auth.logout();
    
    $scope.loadEncuesta = function() {    	
  	  var urlEncuesta		
  	WL.Client.invokeProcedure({
				adapter:"urlEncuesta",
		    	procedure:"Encuesta",
		    	parameters: []
				}).then(function(resp){
					
				var repEncuesta = resp.responseJSON;
				var objEncuesta = JSON.parse(repEncuesta.result);				
				console.log("-------------------Datos encuesta---------------------"); 	        		
				console.log("Url: " + objEncuesta.URL); 	        		
				console.log("Bandera: " + objEncuesta.bandera); 	        		
				urlEncuesta=objEncuesta.URL;
		    	
		    	$('#iFrameContenido').attr("src",urlEncuesta);
		    	$("#encuestaModal").modal("show");
				});
  };
  
  
  $scope.catalogosCorporativos = function() {
	//function catalogosCorporativos(){
		  
		  WL.Client.invokeProcedure({
	          adapter : "mcaLoginjs",
	          procedure : "catalogosCorporativos",
	          //(tarjeta,nip,servicio,sucursal_id,usuario_legacy,contrasena_legacy
	          parameters : []
	      }).then(function(resp){

	                  
	              var rep = resp.responseJSON;
	              var obj = JSON.parse(rep.result);
	              
	              //CATALOGO CORPORATIVO DE CLIENTES
	              console.log(obj);
	              //alert(resp.responseText);
	              //trae todos los elementos del JSON
	              $(obj).each(function(key, detalle){
	            	  //alert(detalle.DetalleClave);
	              });
	              
	            //localStorage de fecha en la que se guardado en memoria local el catalogo
	          	var fechaEjecucionCatalogos = new Date();
	          	var fechaActualCatalogos = new Date();
	          	var diaActualCatalogos = fechaEjecucionCatalogos.getDate();
	          	var diaCatalogos = fechaEjecucionCatalogos.getDate();
	          	var mesCatalogos = fechaEjecucionCatalogos.getMonth();
	          	localStorage.setItem("diaEjecucionCatalogo", diaCatalogos);
	          	var fechaDiaCatalogo = localStorage.getItem("diaEjecucionCatalogo");
	          	
	          	var validaCatalogoLocalStorage = localStorage.getItem("catalogosCorporativos");
	          	
	          	//Valida el dia, si es verdadero obtiene los catalogos para ponerlos en almacenamiento local
	          	if((diaCatalogos <= diaActualCatalogos)||(diaCatalogos >= diaActualCatalogos)||(validaCatalogoLocalStorage == "")){
	          	//if((diaFact < diaActualFact)){
	          		
	          		catalogoCorporativoAGuardar = JSON.stringify(obj);
	          		console.log("entraCatalogos");
	          		
	          		localStorage.removeItem("catalogosCorporativos");
	          		localStorage.setItem("catalogosCorporativos", catalogoCorporativoAGuardar);
	          		
	          	}
	          	
	          	CatCorporativosGuardados = localStorage.getItem("catalogosCorporativos");
	          	CatCorporativosGuardados = JSON.parse(CatCorporativosGuardados);
	             
	          	
	          	

	});
	  };
  
  $scope.segmentoCliente = function() {
  //function segmentoCliente(){
	  
	  WL.Client.invokeProcedure({
          adapter : "mcaLoginjs",
          procedure : "segmentoCliente",
          //(tarjeta,nip,servicio,sucursal_id,usuario_legacy,contrasena_legacy
          parameters : []
      }).then(function(resp){

                  
              var rep = resp.responseJSON;
              var obj = JSON.parse(rep.result);
              
              //SEGMENTO DE CLIENTES
              console.log(obj);
              tipoSegmentoCliente = obj.tipoSegmento;
//              var re = /\PREFERENTE\b/gi;
              var isValid;
              var segPref = [];
              
              if(obj.tipoSegmento != ""){

            	  var cliente = CatCorporativosGuardados;
               
	               for(var i = 0; i <= cliente.length; i++ ){
	            	   var clavePreferente = cliente[i].detalleClave;
	            	   
	            	   isValid = clavePreferente.includes("PREFERENTE");
	            	   
	            	   if(isValid){
	            		  segPref[i] = cliente[i].clave.trim();
	            		  
	            	   }
	            	   //console.log(segPref);
	            	   if(i >= cliente.length - 1){
	            		   break;
	            	   }
	               }
               
	               console.log(segPref);
               
	               for(var i = 0; i <= segPref.length; i++ ){
	                	  //var clavePreferente = cliente[i].clave
	                	if(tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   	 	 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||tipoSegmentoCliente == segPref[i] ||
	                   		 tipoSegmentoCliente == segPref[i] )
	                	{
	                		  clientePref = true;
	                		  break;
	                	 }
	                		 
	                  
			              else{
			             	//cambiar a true para mostrar estilos segmento preferente
			            	   clientePref = false;
	//		            	   break;
			               }
	               }
               
	               
               cargaPag();
              }

});
 
  };
	
function cargaPag(){

		//SEGMENTO DE CLIENTES
			//segmentoCliente();
			//$scope.segmentoCliente();
			console.log("Cliente preferente"+clientePref);
		//CATALOGO CORPORATIVOS
			//catalogosCorporativos();
			
			if(clientePref == true){
				//if(obj.ctePref=="true"){
					//cargar menu preferente bxi
					$("#estilos").load("pages/pages_ixe/estilosIXE_TDD.html");
					document.getElementById("loadPng").src="assets_ixe_tdd/images/loader-banorte.gif";
       			$("#navPagePort").load("pages/navbar/navbar-mca-menu.html");
				$("#pagePort").load("pages/pages_ixe/menu_TDD.html",function(){
				
					$.getScript(path + "js/MainPage.js", function() {
						if (currentPage.init) {	
							currentPage.init();
						}
					});
				});
					
			}
				else
					{
					
						$("#navPagePort").load("pages/navbar/navbar-mca-menu.html");
    				$("#pagePort").load("pages/menu.html",function(){
    				
    					$.getScript(path + "js/MainPage.js", function() {
    						if (currentPage.init) {	
    							currentPage.init();
    						}
    					});
    				});
					}
} 
  

  
  
    

  })

