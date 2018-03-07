
jQuery(function($) {

	//new ElementsSucursApps2.0
	$('#password').keyboard({ layout: 'qwerty' });
	
	$('#usr').keyboard({ 
		layout: 'qwerty',
		maxLength : 30
	});
	
	$('#tokenTel').keyboard({ 
		layout: 'num',
		maxLength : 30
	});
	
	$('#passwordTokenTel').keyboard({ 
		layout: 'qwerty',
		maxLength : 30
	});
	
	$('#passwordToken').keyboard({
		layout: 'qwerty',
		restrictInput : false, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});
	
	$('#token').keyboard({ 
		layout: 'num',
		maxLength : 30,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});
	
	$('#txtCuentaFacturador').keyboard({
		layout: 'num',
		maxLength : 10,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});

	$('#txtTelefono').keyboard({
		layout: 'num',
		maxLength : 10,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});

	$('#txtDigitoV').keyboard({
		layout: 'num',
		maxLength : 10,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});

	$('#txtReferencia').keyboard({
		layout: 'qwerty',
		maxLength : 10,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});

	$('#txtFechaVencimiento').keyboard({
		layout: 'qwerty',
		maxLength : 10,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});

	$('#txtImporte').keyboard({
		layout: 'num',
		maxLength : 10,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});

	

	
	
	
	
	
	
	
	
	/////////////////////////////////////////////////////////////////7
	
	//Encuesta
	$('#otros').keyboard({ layout: 'qwerty' });
	$('#otros2').keyboard({ layout: 'qwerty' });
	//Encuentas 
	$('#nombre').keyboard({ layout: 'qwerty' });
	$('#correo').keyboard({ layout: 'qwerty' });
	//Telefono ya existe 
	$('#comentario').keyboard({ layout: 'qwerty' });
	
	
	// QWERTY Text Input
	// The bottom of this file is where the autocomplete extension is added
	// ********************
	$('#description').keyboard({ layout: 'qwerty' });
	
		
	$('#email').keyboard({ layout: 'qwerty' });
	
	$('#email_confirm').keyboard({ layout: 'qwerty' });


	$('#passwordTokenTOPUP').keyboard({
		layout: 'qwerty',
		maxLength : 20,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});
	
	$('#reference').keyboard({
		layout: 'qwerty',
		maxLength : 10,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});
	


	//Numerico sin decmal para numero de tarjeta
	$('#telefono').keyboard({
		layout: 'num',
		maxLength : 10,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});
	
	
	$('#phoneNumber').keyboard({
		layout: 'num',
		maxLength : 10,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});
	
	//Numerico sin decmal para numero de tarjeta
	$('#accountNumber').keyboard({
		layout: 'num',
		maxLength : 10,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});
	
	
	//Numerico sin decmal para numero de SPEI
	$('#referenceSPEI').keyboard({
		layout: 'num',
		maxLength : 7,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});
	
	$('#numberCard').keyboard({
		layout: 'num',
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});
	
	
	//Numerico con decmal para importes
	$('#amount').keyboard({
		layout: 'decimal',
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});
	
	// QWERTY Text Input
	// The bottom of this file is where the autocomplete extension is added
	// ********************
	$('#beneficiario').keyboard({ layout: 'qwerty' });
	
	$('#descripcion').keyboard({ layout: 'qwerty' });
	
	//Numerico con decmal para importes
	$('#importe').keyboard({
		layout: 'decimal',
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});
	

	$('#rfc').keyboard({ 
		layout: 'qwerty',
		maxLength : 13
	});
	
	$('#rfcOrdenante').keyboard({ 
		layout: 'qwerty',
		maxLength : 13
	});
	
	
	$('#pss').keyboard({ 
		layout: 'qwerty',
		maxLength : 30
	});
	
	
	
	$('#passwordToken').keyboard({ 
		layout: 'qwerty',
		maxLength : 30
	});
	
	
	
	$('#fechaVencimientoPayDetail').keyboard({ 
		layout: 'numDate',
		maxLength : 10,
		restrictInput:true,
		preventPaste:true,
		autoAccept: true
	});
	
	
	$('#rfcEmisor').keyboard({ 
		layout: 'qwerty',
		maxLength : 13
	});

	//Numerico sin decmal para numero de tarjeta
	$('#clabe').keyboard({
		layout: 'num',
		maxLength : 18,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});
	
	//Numerico sin decmal para numero de tarjeta
	$('#referencia').keyboard({
		layout: 'num',
		maxLength : 7,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});
	
	$('#referenciaPS').keyboard({
		layout: 'num',
		maxLength : 10,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});
	
	$('#nv').keyboard({
		layout: 'num',
		maxLength : 1,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});
	
	
	$('#referenciaPSG').keyboard({
		layout: 'num',
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});
	
	$('#reference').keyboard({ layout: 'qwerty' });
	
	$('#clabeQuick').keyboard({
		layout: 'qwerty',
		maxLength : 18,
		restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
		preventPaste : true,  // prevent ctrl-v and right click
		autoAccept : true
	});
	
});
