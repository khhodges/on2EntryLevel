/**
 * Activity view model
 */

var app = app || {};

app.Activity = (function () {
	'use strict'
    
	var $commentsContainer,
		$enterComment,
		listScroller, 
		$newComment,
		showComment,
		validator;
    
	var activityViewModel = (function () {
		var activityUid,
			activity,
			$activityPicture;
        
		var init = function () {
			$commentsContainer = $('#comments-listview');
			$activityPicture = $('#picture');
			validator = $('#enterComment').kendoValidator().data('kendoValidator');
			$newComment = $('#newComment');

			$newComment.on('keydown', app.helper.autoSizeTextarea);
		};
        
		var show = function (e) {
			$commentsContainer.empty();
			validator.hideMessages();
			showComment = false;
			listScroller = e.view.scroller;
			listScroller.reset();
            
			activityUid = e.view.params.uid;
			// Get current activity (based on item uid) from Activities model
			activity = app.Activities.activities.getByUid(activityUid);
			$activityPicture[0].style.display = activity.Picture ? 'block' : 'none';
            
			app.Comments.comments.filter({
											 field: 'ActivityId',
											 operator: 'eq',
											 value: activity.Id
										 });
            
			kendo.bind(e.view.element, activity, kendo.mobile.ui);
		};
        
		var removeActivity = function () {
			var activities = app.Activities.activities;
			var activity = activities.getByUid(activityUid);
            
			app.showConfirm(
				appSettings.messages.removeActivityConfirm,
				'Delete Activity',
				function (confirmed) {
					if (confirmed === true || confirmed === 1) {
						activities.remove(activity);
						activities.one('sync', function () {
							app.mobileApp.navigate('#:back');
						});
						activities.sync();
					}
				}
				);
		};
		
		var saveComment = function () {
			// Validating of the required fields
			if (validator.validate()) {
				$enterComment.style.display = 'none';
				
				// Adding new comment to Comments model
				var comments = app.Comments.comments;
				var comment = comments.add();
                
				comment.Comment = $newComment.val();
				comment.UserId = app.Users.currentUser.get('data').Id;
				comment.ActivityId = app.Activity.activity().Id;
                
				/*                comments.one('sync', function () {
				app.mobileApp.navigate('#:back');
				});*/
                
				comments.sync();
				$newComment.Val ="";
			}
		};
		var addComment = function () {
			$enterComment = document.getElementById('enterComment');
			if ($enterComment.style.display === 'block') {
				$enterComment.style.display = 'none';
			} else {
				$enterComment.style.display = 'block';
			}
			/*	var activities = app.Activities.activities;
			var activity = activities.getByUid(activityUid);
			var newComment = app.Comments.comments.add();
			newComment.ActivityId = activity.Id;
			newComment.Comment = "This is a new comment!";
			newComment.UserId = app.Users.currentUser.data.Id;
			app.Comments.comments.sync();*/
			/*            app.showConfirm(
			appSettings.messages.removeActivityConfirm,
			'Delete Activity',
			function (confirmed) {
			if (confirmed === true || confirmed === 1) {
			activities.remove(activity);
			activities.one('sync', function () {
			app.mobileApp.navigate('#:back');
			});
			activities.sync();
			}
			}
			);*/
		};        
		return {
			init: init,
			show: show,
			remove: removeActivity,
			addComment: addComment,
			saveComment: saveComment,
			activity: function () {
				return activity;
			}
		};
	}());
    
	return activityViewModel;
}());