var name, sex, age, text;

var data = { };



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
                         "data":"{\n\t\"text\": \"My head hurts\"\n}", //JSON.stringify(data) 03.27.2017 RITIKA TO CHECK ON WHY THIS ISNT WORKING
                    }



//main event handler
$('#info_submit').on('click',function(){
                         event.preventDefault();
                          name  = $('#patient_name').val();
                          sex   = $("input[name=gender]:checked").val();
                          age   = $('#patient_age').val();
                          text  = $('#symptoms').val();

                         data.text = text;

                         //user entry information log
                         console.log('The patient\'s name is '+ name + '.');
                         console.log('The patient is a '+ sex + '.');
                         console.log('The patient is '+ age + ' years old.');
                         console.log('The patient\'s symptom is as follows: '+ text);

                         // first request response
                         $.ajax(firstRequest).done(function (response) {
                           console.log('First Request Response:'+ response);
                           $('#main_symptom').text(response); // ASK RITIKA HOW TO STORE RESPONSE INTO VARIABLE AND RENDER ONLY CERTAIN VALUES INTO DOM
                         })
});

//responseData will be used to POST next request to start generating questions to narrow down conditions
//responseData.evience will changed as each question gets answered then gets sends back to server to list possible conditions
var responseData = {
     "sex":sex, // user generated data
     "age":age, // user generated data
     "evidence":[{
          //"id":"" this portion is what is includef in first response
          //"choice_id":"" this portion is what is includef in first response
     }]
}

/*
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
                         "data": "{\n  \"sex\": \"female\",\n  \"age\": 30,\n  \"evidence\": [\n    {\n      \"id\": \"s_21\",\n  \"choice_id\": \"present\"\n    }\n  ]\n}", //responseData
                         "extras": {"ignore_groups":true} //ignores group questions and ONLY returns single questions
                    }


                    $.ajax(diagnosisRequest).done(function (response2) {
                         console.log(response2); //response2 will contain new symtpm id(id_100), questions(text) and choices (yes,no,unknown) to select
                                                  // I need to push new evidenve (id and choice_id) into responseData object
                    })


*/

$(document).ready(function () {
     $('#enter').on('click',function(){
          $('.container').removeClass('hidden');
          $('#introduction').addClass('hidden');
          $('.html').addClass('background');
          $('#sidebar').removeClass('hidden');
     })
});
