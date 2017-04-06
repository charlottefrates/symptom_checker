//global variables
var name, sex, age, text;

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

//Second API reqeust that triggers diagnosis questions
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

//variable that holds second response from API which has disgnosis questions to be answered
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
          console.log('Your responseData variable has been updated to: '+ responseData);
     };
     if(answer=== "no"){
          responseData.evidence.push({
               "id": secondResData.question.items[0].id,
               "choice_id":secondResData.question.items[0].choices[1].id,
          });
          console.log('Your responseData variable has been updated to: '+ responseData);

     };
     if(answer=== "unknown"){
          responseData.evidence.push({
               "id": secondResData.question.items[0].id,
               "choice_id":secondResData.question.items[0].choices[2].id,
          });

     };
};

//variable that keeps track of condition count
var conditionCount = 0;

//function to dynamically render conditions onto HTML table
function listCondition(){
     var index = secondResData.conditions.length-1;
     if (conditionCount < secondResData.conditions.length){
          // Append results li to ul
           var html = "<ul> "
               + "<li>"
               + secondResData.conditions[index].name
               + " - "
               +  Math.round((secondResData.conditions[index].probability)*100)
               + "%"
               + "</li>"
               + "</ul>";

          $("#condition_list").append(html);
          conditionCount = secondResData.conditions.length;
     };
};


//main event handlers
$('#info_submit').on('click',function(event){
                         event.preventDefault();

                         // updates global variables based on user input
                         //assignment
                          name  = $('#patient_name').val();
                          sex   = $("input[name=gender]:checked").val();
                          age   = $('#patient_age').val();
                          text  = $('#symptoms').val();

                          // requires users to fill in form fields_highlights area and pushes an alert
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

                         // Does !text and !age work the same way?


                         // updates text variable and stringify for first request POST
                         data.text = text;
                         //updates data variable into JSON string
                         firstRequest.data = JSON.stringify(data);


                         //user entry information log
                         console.log('The patient\'s name is '+ name + '.');
                         console.log('The patient is a '+ sex + '.');
                         console.log('The patient is '+ age + ' years old.');
                         console.log('The patient\'s symptom is as follows: '+ text);

                         // first request response
                         $.ajax(firstRequest).done(function (response) {
                              // opens first accordian on enter
                              $('#secondAccordian').removeAttr('checked');
                              firstResData = eval(response); //JSON.parse() or eval

                              if(firstResData.mentions.length === 0){
                                   alert('Your symptom was not found. Please seek professional care.');
                              }

                              else{
                                   console.log('First Request Response (variable name:firstResData):'+ firstResData);
                                   console.log('This will get sent do get diagnosis questions (variable name: responseData)' + responseData);
                                   $('#main_symptom').text(firstResData.mentions[0].name);

                                   responseData.sex = sex;
                                   responseData.age = age;
                              	responseData.evidence[0].id = firstResData.mentions[0].id;
                              	responseData.evidence[0].choice_id = firstResData.mentions[0].choice_id;

                                   //updates next request's data variable into JSON string
                                   diagnosisRequest.data = JSON.stringify(responseData);

                            }


                         });

                      });

$('#start_questions').on('click',function () {

                         $('#question_container').removeClass('hidden');

                         if(diagnosisRequest.data.length === 0){
                              alert('A symptom must be recorded before getting properly diagnosed.')
                              return false;
                         } // Is this the right approach?

                         $.ajax(diagnosisRequest).done(function (response2) {
                                   // collapses accordian 1
                                   $('#firstAccordian').attr('checked',true);
                                   // opens third accordian on enter
                                   $('#thirdAccordian').removeAttr('checked');
                                   secondResData = eval(response2);
                                   console.log(secondResData);
                                   getQuestion();
                         });
                      });

//submits an answer and updates diagnosisRequest for next question
$('#submit').on('click',function(){

                         selectAnswer();

                         listCondition();

                         console.log( 'By submitting an answer, the responseData variable is now this: ' + responseData)
                         //updates new data with additional array evidence
                         diagnosisRequest.data = JSON.stringify(responseData);

                         $('input[type=radio]').prop('checked',false);//clears previosly selected answer
                         $.ajax(diagnosisRequest).done(function (response3) {
                                   console.log(response3);
                                   secondResData = eval(response3);
                                   console.log(secondResData);
                                   getQuestion();
                              });

                         //$('#next').removeClass('hidden');
                         //$('#submit').addClass('hidden');


});

/*
$('#next').on('click',function(){
                         $('input[type=radio]').prop('checked',false);//clears previosly selected answer
                         $.ajax(diagnosisRequest).done(function (response3) {
                                   console.log(response3);
                                   secondResData = eval(response3);
                                   console.log(secondResData);
                                   getQuestion();
                              });
                         $('#submit').removeClass('hidden');
                         $('#next').addClass('hidden');

});
*/


//removes red highlight on forms that get submitted
$('.required').keydown(function(){
     $('.required').removeClass('highlight');
});

//Load on page
$(document).ready(function () {
     $('#enter').on('click',function(){
          $('.container').removeClass('hidden');
          $('#introduction').addClass('hidden');
          $('.html').addClass('background');
          $('#sidebar').removeClass('hidden');
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




});
