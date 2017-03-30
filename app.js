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
                    }

//variable that holds first response from API after user submits forms
var firstResData;

//responseData will be used to POST next request to start generating questions to narrow down conditions
//responseData.evience will changed as each question gets answered then gets sends back to server to list possible conditions
var responseData = {
                         "sex":sex, // user generated data showing up UNDEFINED
                         "age":age, // user generated data showing up UNDEFINED
                         "evidence":[{
                              "id": "",
                              "choice_id":"",
                         }]
                    }

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
                         "data": JSON.stringify (responseData),
                         "extras": {"ignore_groups":true} //ignores group questions and ONLY returns single questions
                    }

//main event handler
$('#info_submit').on('click',function(){
                         event.preventDefault();

                         // updates global variables based on user input
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
                               alert('Please tell me about your symptoms.');
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
                                   alert('Your symtom was not found. Please seek professional care.');
                              }

                              if(firstResData.mentions.length != 0){
                                   console.log('First Request Response (variable name:firstResData):'+ firstResData);
                                   console.log('This will get sent do get diagnosis questions (variable name: responseData)' + responseData);
                                   $('#main_symptom').text(firstResData.mentions[0].name);

                                   responseData.sex = sex;
                                   responseData.age = age;
                              	responseData.evidence.id = firstResData.mentions[0].id;
                              	responseData.evidence.choice_id = firstResData.mentions[0].choice_id;

                            };


                         });

                      });

$('#start_questions').on('click',function (e) {

                         diagnosisRequest.data = JSON.stringify(responseData);// 03.30.17 it is not creating a JSON object so error

                         if(diagnosisRequest.data.length === 0){
                              alert('A symptom must be recorded before getting properly diagnosed.')
                              return false;
                         } // Is this the right approach?

                         $.ajax(diagnosisRequest).done(function (response2) {
                                   // opens third accordian on enter
                                   $('#thirdAccordian').removeAttr('checked');
                                   $('#firstAccordian').removeAttr('checked');
                                   console.log(response2); //response2 will contain new symtpm id(id_100), questions(text) and choices (yes,no,unknown) to select
                                                                             // i need to render questions into DOM
                         });



                      });


//removes red highlight on forms that get submitted
$('.required').keydown(function(){
     $('.required').removeClass('highlight');
});



$(document).ready(function () {
     $('#enter').on('click',function(){
          $('.container').removeClass('hidden');
          $('#introduction').addClass('hidden');
          $('.html').addClass('background');
          $('#sidebar').removeClass('hidden');
     });
});
