	
	var client_help_data = '<div style="margin-bottom:50px; padding:10px;"><h3>How to import User List in CSV format?</h3><p>Click <a href="' + docs_path + '/ImportUsers.pdf" target="_blank">here</a> to view the steps involved in importing the CSV file from the System Database.</p></div>';

  	var refresh_page = false;

	$(document).ready(function(){
		
		$('[data-toggle="tooltip"]').tooltip();

		var newHeight = ($(window).height()) - 265;		
		$('#users-scrollable-div').css({'height': newHeight + 'px'});

		$(function(){
			$("#groups_table").tablesorter(
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

		$(document).on('click','#select_all_groups_checkbox',function() {
	        if(this.checked) { // check select status
	            $('.groups_checkbox').each(function() { //loop through each checkbox	
	            	if($(this).parent().parent().css('display') !="none"){
	            		this.checked = true;  //select all checkboxes with class "groups_checkbox"   	
	            	}	
	            	 $("#recommend_btn").attr("disabled", false);                           
	            });
	           
	        }else{
	            $('.groups_checkbox').each(function() { //loop through each checkbox
	                this.checked = false; //deselect all checkboxes with class "groups_checkbox"                      
	            });  
	            $("#recommend_btn").attr("disabled", true);      
	        }
	    });

	    $(document).on('click','.groups_checkbox',function() {	    	
	    	if( !this.checked && document.getElementById('select_all_groups_checkbox').checked ){	    		
	    		document.getElementById('select_all_groups_checkbox').checked = false;
	    	}
	    });

	    $(document).on('change','.groups_checkbox',function() {
	    	//$('input[name="chk[]"]:checked').length
	    	console.log( ($('input[name="groups_checkbox"]:checked').length)  );
	    	if ($('input[name="groups_checkbox"]:checked').length>0 ){
	    		$("#recommend_btn").attr("disabled", false);
	    	}else{
	    		$("#recommend_btn").attr("disabled", true);
	    	}

	    });

	   
	    $("#group_name").bind("change paste keyup", function() {		   

		   if( ($.trim($("#group_name").val())=="") || ($.trim($("#group_name").val())=="") ){
		   		$("#add_group_btn").attr("disabled", true);
		   }else{
		   		$("#add_group_btn").attr("disabled", false);
		   }
		   
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


	    $('#view_reco_list_modal').on('hidden.bs.modal', function () {
		    // # CODE TO EXECUTE UPON MODAL CLOSE		    
		    if(refresh_page) {		    
		    	refresh_page = false;
		    	window.location.reload(true);
		    }
		});

	}); //End of document ready


	$(window).resize(function(){
		var newHeight = ($(window).height()) - 265;		
		$('#users-scrollable-div').css({'height': newHeight + 'px'});
	});	


	function open_group_reco_list(group_id) {

		var group_name = $("#show_btn_" + group_id).attr('data-groupname');
		$("#reco_modal_title").html("<b>Recommended Courses For - " + group_name + "</b>");
		
		var url = baseURL + "/manage_recommended/show_group_reco_list/" + group_id;
		$("#reco_list_frame").attr('src', url);

	}


	function open_manage_users_modal(group_id){
		
		var group_name = $("#manage_btn_" + group_id).attr('data-groupname');		
		$("#reco_modal_title").html("<b>Manage Group - " + group_name + "</b>");

		var url = baseURL + "/manage_recommended/show_manage_group_modal/" + group_id
		$("#reco_list_frame").attr('src', url);
	}


	function open_courses_dialog(){

		var selected_groups = "";
		var selected_groups_array = [];
		$.each($("input[name='groups_checkbox']:checked"), function(){
		    selected_groups_array.push($(this).val());
		});
		
		if(selected_groups_array.length>0){
			selected_groups = selected_groups_array.join("_");
		}else{
			alert("Please select learners.");
			return;
		}

		//var learner_name = $("#show_btn_" + learner_id).attr('data-username');
		$("#reco_modal_title").html("<b>Recommended Content - Groups</b>");
		
		var url = baseURL + "/manage_recommended/show_all_videos_for_reco/" + selected_groups + "/Group";
		$("#reco_list_frame").attr('src', url);


	}


	function deselect_all_checkboxes(){
		$('.programs_checkbox').each(function() { //loop through each checkbox
           if($(this).parent().parent().css('display') !="none"){
        		this.checked = false;  //select all checkboxes with class "programs_checkbox"   	
        	}             
        });
        document.getElementById('select_all_programs_checkbox').checked = false;
	}
	


	function add_new_group(){
		$.ajax({
	        type: "POST",
	        url: baseURL + "/manage_recommended/add_new_group",
	        data: {
		        'group_name': $.trim($("#group_name").val())	   
	      	},
	        success: function(response)
	        {		        	

	          var responseObj = $.parseJSON(response);
	          if(responseObj.status == "success"){

	          	var new_group_row = '<tr id="row_' + responseObj.new_group_id + '">'; 
	          	new_group_row += '<td style="text-align: center!important"><input type="checkbox" class="groups_checkbox" value="' + responseObj.new_group_id + '" id="check_'+ responseObj.new_group_id + '" name="groups_checkbox"  ></input></td>';
	          	new_group_row += '<td>' + $.trim($("#group_name").val()) + '</td>';
	          	new_group_row += '<td>0</td>';
	          	new_group_row += '<td style="text-align: center!important"><a id="manage_btn_' + responseObj.new_group_id + '" href="#" onclick="open_manage_users_modal(' + responseObj.new_group_id + ')" data-toggle="modal" data-target="#view_reco_list_modal" data-groupname="' + responseObj.new_group_id + '">Add/Remove Users</a></td>';
	          	new_group_row += '<td style="text-align: center!important">0 Show</td>';
	          	new_group_row += '<td><a href="javascript:delete_group(' + responseObj.new_group_id + ')" data-toggle="tooltip" data-placement="bottom" title="Delete Group" ><img src="'+ img_path + '/delete.png" /></a></td>';
	          	new_group_row += '</tr>';

	          	$('#groups_table > tbody').append(new_group_row);
	          	$("#group_name").val("");


	          }	
	          else{

	          	if(responseObj.reason == "duplicate"){
	          		alert("A group with this name already exists. Please use another name.")
	          	}else{
	          		alert("Some error occured while adding this group. Please try again.")
	          	}

	          }	

	          	          
	        }
	    });
	}


	function delete_group(group_id){
		var confirm_input = window.confirm("This will delete this group and all the recommendations made to the group users. Proceed?");
		if(confirm_input){
			$.ajax({
		        type: "POST",
		        url: baseURL + "/manage_recommended/delete_group",
		        data: {
			        'group_id': group_id	   
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