	
	var client_help_data = '<div style="margin-bottom:50px; padding:10px;"><h3>How to import User List in CSV format?</h3><p>Click <a href="' + docs_path + '/ImportUsers.pdf" target="_blank">here</a> to view the steps involved in importing the CSV file from the System Database.</p></div>';


  	var refresh_page = false;


	$(document).ready(function(){
		$('[data-toggle="tooltip"]').tooltip();

		var newHeight = ($(window).height()) - 265;		
		$('#users-scrollable-div').css({'height': newHeight + 'px'});

		if(csv_upload_status != false){
			show_csv_upload_status();
		}

		$(function(){
			$("#users_table").tablesorter(
			{
				theme : 'dropbox',			
				sortList : [[1,0]],			 
			    headerTemplate : '{content}{icon}',
			    widgets : ["columns"],
				widgetOptions : {			      
			      columns : [ "primary", "secondary", "tertiary" ]
				}
			});		

		});

		$(document).on('click','#select_all_users_checkbox',function() {
	        if(this.checked) { // check select status
	            $('.users_checkbox').each(function() { //loop through each checkbox	
	            	if($(this).parent().parent().css('display') !="none"){
	            		this.checked = true;  //select all checkboxes with class "users_checkbox"   
	            		$("#recommend_btn").attr("disabled", false);	
	            	}	                           
	            });
	            
	        }else{
	            $('.users_checkbox').each(function() { //loop through each checkbox
	                this.checked = false; //deselect all checkboxes with class "users_checkbox"                      
	            });  

	            $("#recommend_btn").attr("disabled", true);      
	        }
	    });

	    $(document).on('click','.users_checkbox',function() {	    	
	    	if( !this.checked && document.getElementById('select_all_users_checkbox').checked ){	    		
	    		document.getElementById('select_all_users_checkbox').checked = false;
	    	}
	    });

	    $(document).on('change','.users_checkbox',function() {
	    	//$('input[name="chk[]"]:checked').length
	    	console.log( ($('input[name="users_checkbox"]:checked').length)  );
	    	if ($('input[name="users_checkbox"]:checked').length>0 ){
	    		$("#recommend_btn").attr("disabled", false);
	    	}else{
	    		$("#recommend_btn").attr("disabled", true);
	    	}

	    });

	    $(document).on('click', '#add_users_btn', function(){
	    	$("#add_users_div").fadeToggle();
	    });

	    $(document).on('click', '#import_users_btn', function(){
	    	$("#import_users_div").fadeToggle();
	    });


	    $(document).mouseup(function (e){ 
		
			var container = $("#add_users_div");
			var container_btn = $("#add_users_btn");		
			if(container.css('display') != "none"){			
			    if ((!container.is(e.target) && container.has(e.target).length === 0) && (!container_btn.is(e.target) && container_btn.has(e.target).length === 0))
			    {		    	
			        //container.hide();
			        $("#add_users_div").fadeToggle();
			    }
			}

			var container2 = $("#import_users_div");
			var container2_btn = $("#import_users_btn");
			if(container2.css('display') != "none"){			
			    if ((!container2.is(e.target) && container2.has(e.target).length === 0) && (!container2_btn.is(e.target) && container2_btn.has(e.target).length === 0) )
			    {		    	
			    	$("#import_users_div").fadeToggle();
			        //container2.hide();
			    }
			}
		
		});


	    $("input[type=text]").focus(function(){
		    $(".feedback_div").hide();
		});

	    $('#view_reco_list_modal').on('hidden.bs.modal', function () {
		    // # CODE TO EXECUTE UPON MODAL CLOSE
		    if(refresh_page) {
		    	refresh_page = false;
		    	window.location.reload(true);
		    }
		});


	    $('#userfile').change(function(){

            if ($(this).val()) {
            	$('#submit_csv_btn').attr('disabled',false);
            	/*var file_name = $(this).val();
            	if(file_name.substr( (file_name.length-4), 4 ) == ".csv"){
            		$('#submitBtn').attr('disabled',false);
            	}else{
            		$("#errorBox").fadeIn();
            	}*/
              
                // or, as has been pointed out elsewhere:
                // $('input:submit').removeAttr('disabled'); 
            } 
        });


		if(from_first_page){
			if(show_getting_started_notification){
				show_getting_started()
			}
		}


	}); //End of document ready

	$('#add_new_user_form')
	    .formValidation({

	        message: 'This value is not valid',
	        icon: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },

	        fields: {
	        	username: {
	                validators: {
	                    notEmpty: {
	                        message: 'The username is required'
	                    }
	                }
	            },	        
	            
	            first_name: {
	                validators: {
	                    notEmpty: {
	                        message: 'The first name is required'
	                    }
	                }
	            },	
	            last_name: {
	                validators: {
	                    notEmpty: {
	                        message: 'The last name is required'
	                    }
	                }
	            }
	            	            
	           
	        }
	    })	
		.on('success.form.fv', function(e) {
            //console.log('success.form.fv');
            e.preventDefault();
            add_new_user();

            // If you want to prevent the default handler (formValidation._onSuccess(e))
            // 
        });


	$(window).resize(function(){
		var newHeight = ($(window).height()) - 265;		
		$('#users-scrollable-div').css({'height': newHeight + 'px'});
	});	


	function open_user_reco_list(learner_id) {

		var learner_name = $("#show_btn_" + learner_id).attr('data-username');
		$("#reco_modal_title").html("<b>Recommended Courses For - " + learner_name + "</b>");
		
		var url = baseURL + "/manage_recommended/show_user_reco_list/" + learner_id;
		$("#reco_list_frame").attr('src', url);

	}


	function open_courses_dialog(){

		var selected_users = "";
		var selected_users_array = [];
		$.each($("input[name='users_checkbox']:checked"), function(){
		    selected_users_array.push($(this).val());
		});
		
		if(selected_users_array.length>0){
			selected_users = selected_users_array.join("_");
		}else{
			alert("Please select learners.");
			return;
		}

		//var learner_name = $("#show_btn_" + learner_id).attr('data-username');
		$("#reco_modal_title").html("<b>Recommended Content - Users</b>");
		
		var url = baseURL + "/manage_recommended/show_all_videos_for_reco/" + selected_users + "/User"; 
		$("#reco_list_frame").attr('src', url);

	}
	

	function add_new_user(){
		$("#processingDiv").show();

		$.ajax({
	        type: "POST",
	        url: baseURL + "/manage_recommended/add_new_user",
	        data: {
		        'username': $("#username").val(),
		        'first_name': $("#first_name").val(),
		        'last_name': $("#last_name").val()
	      	},
	        success: function(response)
	        {		          
	          	var responseObj = $.parseJSON(response);
	          	

				if(responseObj.status == "success"){
					
					var new_row = '<tr id="row_' + responseObj.new_user_id + '">';
					new_row += '<td style="text-align: center!important"><input type="checkbox" class="users_checkbox" value="' + responseObj.new_user_id + '" id="check_' + responseObj.new_user_id + '" name="users_checkbox"  ></input></td>';
					new_row += '<td>' + $("#username").val() + '</td>';
					new_row += '<td>' + $("#first_name").val() + '</td>';
					new_row += '<td>' + $("#last_name").val() + '</td>';
					new_row += '<td style="text-align: center!important">0 Show</td>';
					new_row += '<td><a href="javascript:delete_user(' + responseObj.new_user_id + ')" data-toggle="tooltip" data-placement="bottom" title="Delete User" ><img src="'+ img_path + '/delete.png" /></a></td>';
					new_row += '</tr>';

		          	$('#users_table > tbody').append(new_row);

		          	$("#processingDiv").hide();
		          	$("#successBox").fadeIn();
		          	$('#add_new_user_form').get(0).reset();
		          	$("#add_new_user_form").data('formValidation').resetForm();
					 
				}else{
					$("#processingDiv").hide();
					if(responseObj.reason == "duplicate"){
		          		$("#errorBox").fadeIn();
		          	}else{
		          		alert("Some error occured while adding this user. Please try again.");
		          	}
				}

	        }
	    });

	}	


	function delete_user(user_id){
		var confirm_input = window.confirm("This will remove the user from the recommendations module. Proceed?");
		if(confirm_input){
			$.ajax({
		        type: "POST",
		        url: baseURL + "/manage_recommended/delete_user",
		        data: {
			        'user_id': user_id	   
		      	},
		        success: function(response)
		        {		          
		          $("#row_" + response).remove();		          
		        }
		    });

		}

	}


	function show_getting_started(){				
		$("#reco_modal_title").html("<b>Welcome to Allscripts i-Learn</b>");

		
		var url = baseURL + "/manage_recommended/getting_started";
		$("#reco_list_frame").attr('src', url);

		$('#view_reco_list_modal').modal('show');
	}


	function show_client_help(){
		$("#small_modal_title").html("<b>Client Admin Help</b>");		
		$("#small_modal_body").html(client_help_data);

		$('#small_modal').modal('show');
	}


	function show_csv_upload_status(){
		var csv_response_message = $.parseJSON(csv_upload_status);

		$("#small_modal_title").html("<b>Import Users Status</b>");	

		var display_data = '<div style="padding:10px; margin-bottom:30px">';
		display_data += '<table class="table table-bordered">';
		display_data += '<tr>';
		display_data += '<td style="width:50%"><h4>Successfully Inserted</h4></td>';
		display_data += '<td style="width:50%"><h4>' + csv_response_message.successful + '</h4></td>';
		display_data += '</tr>';
		display_data += '<td style="width:50%"><h4>Duplicate Users</h4></td>';
		display_data += '<td style="width:50%"><h4>' + csv_response_message.duplicate + '</h4></td>';
		display_data += '</tr>';
		display_data += '<tr>';
		display_data += '<td colspan="2" ><button class="btn btn-green center-block" onclick="reload_users_page()">Done</button></td>';
		display_data += '</tr>';
		display_data += '</table>';
		display_data += '</div>';

		$("#small_modal_body").html(display_data);

		$('#small_modal').modal('show');
	}


	function reload_users_page(){
		window.location.href = baseURL + "/manage_recommended/users/";
	}