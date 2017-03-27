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
                         "data":"{\n\t\"text\": \"My head hurts\"\n}"//JSON.stringify(data)
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
                         })

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
                         "data": "{\n  \"sex\": \"female\",
                                   \n  \"age\": 30,
                                   \n  \"evidence\": [\n    {\n      \"id\": \"s_21\",
                                   \n  \"choice_id\": \"present\"\n    }\n  ]\n}"
                    }
*/

$(document).ready(function () {


/*
          // diagnosis respose
          $.ajax(diagnosisRequest).done(function (response) {
               console.log(response);

});
*/


     });

})
