//global variables
var sex, age, text;

//variable that holds symptom text to be sent to API for first symptom analysis
var data = { };

//first API request that sends symptom text
var firstRequest    = {
                         "async": true,
                         "crossDomain": true,
                         "url": "https://api.infermedica.com/v2/parse",
                         "method": "POST",
                         "headers": {
                              "app-id": "ba5dea22",
                              "app-key": "f4ef314cbba85fb58830593457daa783",
                              "content-type": "application/json",
                              "cache-control": "no-cache",
                              },
                         "processData": false,
                         "data":JSON.stringify(data)
                    };

//variable that holds first response from API after user submits forms
var firstResData;

//responseData will be used to POST next request to start generating questions to narrow down conditions
//responseData.evience will changed as each diagnosis question gets answered
// responseData will be sent to API each time more evidence is added to get proper diagnosis
var responseData = {
                         "sex":"",
                         "age":"" ,
                         "evidence":[{
                              "id": "",
                              "choice_id":"",
                         }],
                         "extras": {"ignore_groups":true} //ignores group questions and ONLY returns single questions
                    };

//API request(s) that triggers diagnosis questions and condition analysis
var diagnosisRequest = {
                         "async": true,
                         "crossDomain": true,
                         "url": "https://api.infermedica.com/v2/diagnosis",
                         "method": "POST",
                         "headers": {
                              "app-id": "ba5dea22",
                              "app-key": "f4ef314cbba85fb58830593457daa783",
                              "content-type": "application/json",
                              "cache-control": "no-cache",
                                   },
                         "processData": false,
                         "data": JSON.stringify(responseData),
                    };

//variable that holds second response from API which has disgnosis questions to be answered and conditions to be listed
var secondResData;


//function to dynamically render questions and answers based on secondResData
function getQuestion(){
     $('#renderedQuestion').text(secondResData.question.text);
     $('#yes').text(secondResData.question.items[0].choices[0].label);
     $('#no').text(secondResData.question.items[0].choices[1].label);
     $('#unknown').text(secondResData.question.items[0].choices[2].label);
};

//function to capture selected answer and update responseData
function  selectAnswer(){
     var answer = $("input[name=mcq]:checked").val();
     if(answer=== "yes"){
          responseData.evidence.push({
               "id": secondResData.question.items[0].id,
               "choice_id":secondResData.question.items[0].choices[0].id,
          });
          console.log(' "yes" answer for responseData variable was selected');
     };
     if(answer=== "no"){
          responseData.evidence.push({
               "id": secondResData.question.items[0].id,
               "choice_id":secondResData.question.items[0].choices[1].id,
          });
          console.log('"no" answer for  responseData variable was selected');

     };
     if(answer=== "unknown"){
          responseData.evidence.push({
               "id": secondResData.question.items[0].id,
               "choice_id":secondResData.question.items[0].choices[2].id,
          });
          console.log('"unknown" answer for  responseData variable was selected');

     };
};


//function to dynamically render conditions onto HTML
function listCondition(){
          $.each(secondResData.conditions, function (index, value) {
                    console.log(value.name);
                    console.log(value.probability);

                    var text = "<ul> "
                              + "<li>"
                              + value.name
                              + " - "
                              +  Math.round((value.probability)*100)
                              + "%"
                              + "</li>"
                              + "</ul>";

                $("#condition_list").append(text);

           });

}

function showCondition(){
     $('html, body').animate({
          scrollTop: $("#condition_list").offset().top
     }, 300);

}


//main event handlers
$('#info_submit').on('click',function(event){
                         event.preventDefault();

                         // updates global variables based on user input
                         //assignment
                          name  = $('#patient_name').val();
                          sex   = $("input[name=gender]:checked").val();
                          age   = $('#patient_age').val();
                          text  = $('#symptoms').val();

                          // conditionals that requires users to fill in form fields - highlights area and pushes an alert if form not filled
                          if ((age === null) || (age === undefined) || (age.length === 0 )){
                               $('#patient_age').addClass('highlight');
                               alert('Please let me know how old you are.');
                               return false;
                         };

                         if (!sex){
                              alert('Please select a gender.');
                              return false;
                                       };

                          if ((text === null) || (text === undefined) || (text.length === 0 )){
                               $('#symptoms').addClass('highlight');
                               alert('Please tell me about your main symptom.');
                               return false;
                         };


                         // updates text variable with user inputted text
                         data.text = text;

                         //updates data variable into JSON string
                         firstRequest.data = JSON.stringify(data);


                         //user entry information log
                         console.log('The patient is a '+ sex + '.');
                         console.log('The patient is '+ age + ' years old.');
                         console.log('The patient\'s symptom is as follows: '+ text);

                         // API response completion - first request response with symptom diagnosis
                         $.ajax(firstRequest).done(function (response) {

                              firstResData = eval(response); //JSON.parse() or eval


                              if(firstResData.mentions.length === 0){
                                   alert('Your symptom was not found. Please seek professional care.');
                              }

                              else{
                                   // collapses accordian 1
                                   $('#firstAccordian').attr('checked',true);
                                   // opens first accordian on enter
                                   $('#secondAccordian').removeAttr('checked');
                                   // reveals start diagnosis questions
                                   $('#start_questions').removeClass('hidden');


                                   console.log('First Request Response (variable name:firstResData):'+ firstResData);
                                   console.log('This will get sent do get diagnosis questions (variable name: responseData)' + responseData);
                                   $('#main_symptom').text(firstResData.mentions[0].name);

                                   //updates responseData objects
                                   responseData.sex = sex;
                                   responseData.age = age;
                              	responseData.evidence[0].id = firstResData.mentions[0].id;
                              	responseData.evidence[0].choice_id = firstResData.mentions[0].choice_id;

                                   //updates next request's data variable into JSON string
                                   diagnosisRequest.data = JSON.stringify(responseData);

                            }


                         });

                      });

//starts diagnosis questions for better condition analysis
$('#start_questions').on('click',function () {

                         // reveals diagnosis questions
                         $('#question_container').removeClass('hidden');

                         if(diagnosisRequest.data.length === 0){
                              alert('A symptom must be recorded before getting properly diagnosed.')
                              return false;
                         }

                         // API response completion - returns response with 1st symptom questions and 1st condition diagnosis
                         $.ajax(diagnosisRequest).done(function (response2) {
                                   secondResData = eval(response2);

                                   console.log('The API responded with: '+ secondResData);

                                   getQuestion();
                         });

                         //removes start question button
                         $('#start_questions').addClass('hidden');
});

//submits an answer to symptom questions and updates diagnosisRequest for next question
$('#submit').on('click',function(){

                         selectAnswer();

                         console.log( 'By submitting an answer, the responseData variable is now this: ' + responseData)

                         //updates new data with additional array evidence
                         diagnosisRequest.data = JSON.stringify(responseData);

                         $('input[type=radio]').prop('checked',false);//clears previosly selected answer

                         // API response completion - returns more questions based on user answers
                         $.ajax(diagnosisRequest).done(function (response3) {
                                   secondResData = eval(response3);
                                   console.log(secondResData)
                                   getQuestion();
                              });

                         // opens third accordian on enter
                         $('#thirdAccordian').removeAttr('checked');

                         //clear previosly added conditions
                         $("#condition_list").empty();

                         //renders new conditions into DOM
                         listCondition();

                         //scroll in to view conditions
                         showCondition();

                         //reveals morequestions button
                         $('#moreQuestions').removeClass('hidden');
});

$('#moreQuestions').on('click',function(){
                         //scroll in to view more questions
                         $('html, body').animate({
                              scrollTop: $("#question_container").offset().top
                         }, 300);

})

//removes red highlight on forms that get submitted
$('.required').keydown(function(){
     $('.required').removeClass('highlight');
});

//Load on page
$(document).ready(function () {

     //landing page hide
     $('#enter').on('click',function(){
          $('.container').removeClass('hidden');
          $('#introduction').addClass('hidden');
          $('.wrapper').addClass('background');
          $('.footer').removeClass('hidden');
     });

     // Get the modal
     var modal = document.getElementById('myModal');

     // Get the <span> element that closes the modal
     var span = document.getElementsByClassName("close")[0];

     // When the user clicks the button, open the modal
     $('#about').on('click', function() {
         modal.style.display = "block";
    });

     // When the user clicks on <span> (x), close the modal
     span.onclick = function() {
         modal.style.display = "none";
    };

     // When the user clicks anywhere outside of the modal, close it
     window.onclick = function(event) {
         if (event.target == modal) {
             modal.style.display = "none";
         }
    };

    //Play Again
    $("#home").click(function() {
         location.reload(true);
    });
});
