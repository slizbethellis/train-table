$(document).ready(function (){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDJ8poS7nCcNJSGSppucDADtITT6v021-I",
    authDomain: "train-time07.firebaseapp.com",
    databaseURL: "https://train-time07.firebaseio.com",
    projectId: "train-time07",
    storageBucket: "train-time07.appspot.com",
    messagingSenderId: "125285862164"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  // form submission
  $("#submit").on("click", function(event) {
    event.preventDefault();
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#first-train").val().trim();
    var frequency = parseInt($("#frequency").val().trim());
    var newTrain = {
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    };
    var trainSnapshot = database.ref('/trains').push();
    trainSnapshot.set(newTrain);
    $("#form").reset();
  });

  // loads existing trains in database and adds new train records to table
  database.ref('/trains').on("child_added", function(snapshot) {
    var trainName = snapshot.val().trainName;
    var destination = snapshot.val().destination;
    var firstTrain = snapshot.val().firstTrain;
    var frequency = snapshot.val().frequency;
    var nextTrain = moment(firstTrain, "HH:mm");
    var timeNow = moment();

    // gets time of next train
    while (timeNow.diff(nextTrain) > 0) {
      nextTrain.add(frequency, 'minutes');
    }
    var minToArrival = nextTrain.diff(timeNow, 'minutes');
    var arrivalTime = nextTrain.format("hh:mm A");
    
    // Adds entry to table
    $("tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>"+ frequency+ "</td><td>" + arrivalTime + "</td><td>" + minToArrival + "</td></tr>");
    // And we were doing *so* well!
    if (destination === "Hemel Hempstead") {
      $("#footer-text").append("<span class='text-info'><small>  <i class='fa fa-music' aria-hidden='true'></i> Train set and match spied under the blind <i class='fa fa-music' aria-hidden='true'></i></small></span>");
    }
  });
});