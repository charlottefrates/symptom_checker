var name, sex, age, text;

var data = { };
var firstResData;


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
                         "data": JSON.stringify(responseData),
                         "extras": {"ignore_groups":true} //ignores group questions and ONLY returns single questions
                    }

//main event handler
$('#info_submit').on('click',function(){
                         event.preventDefault();
                         $('#secondAccordian').removeAttr('checked');
                          name  = $('#patient_name').val();
                          sex   = $("input[name=gender]:checked").val();
                          age   = $('#patient_age').val();
                          text  = $('#symptoms').val();

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

                         // Does !text work the same way?



                          data.text = text;
                          firstRequest.data = JSON.stringify(data);

                         //03.29.17 didnt work either
                         //var obj = { };
                         //obj.text = text;
                         //data = JSON.stringify({obj:obj});

                         //user entry information log
                         console.log('The patient\'s name is '+ name + '.');
                         console.log('The patient is a '+ sex + '.');
                         console.log('The patient is '+ age + ' years old.');
                         console.log('The patient\'s symptom is as follows: '+ text);

                         // first request response
                         $.ajax(firstRequest).done(function (response) {
                           firstResData = eval(response); //JSON.parse() or eval
                           console.log('First Request Response:'+ firstResData);
                           console.log('This will get sent do get diagnosis questions' + responseData);
                           $('#main_symptom').text(firstResData.mentions[0].name);

                           //update responseData with new response
                           responseData.evidence.id = firstResData.mentions[0].id;
                           responseData.evidence.id = firstResData.mentions[0].choice_id;


                      });

                         // second request
                        $.ajax(diagnosisRequest).done(function (response2) {
                           console.log(response2); //response2 will contain new symtpm id(id_100), questions(text) and choices (yes,no,unknown) to select
                                                  // i need to render questions into DOM
                      })

});


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
