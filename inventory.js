/**
 * Created by fgratton on 7/2/2014.
 */

$(document).ready(function(){
    $.ajax({

        //when loaded
        type: "GET",
        url: "http://ideas.fuyuko.net/xml-parse-jquery/auto-inventory.xml",
        dataType: "xml",
        success: function(xml) {
            var makes = [];
            var models = {};
            var newinventory = [];
            var make, model, date_string;
            var results;

            //new inventory specific
            var today = new Date();
            var yard_date;
            today.setDate(today.getDate() - 7);
            var test, test_month;
            $(xml).find('ASSET').each(function(){
                //new inventory specific

                var date_string = $(this).find('YARD_DATE').text();	// 2014-01-10T13:24:16.363
                test_month = parseInt(date_string.substr(5,2));
                if(date_string.length > 0){ //if YARD_DATE data exists
                    yard_date = new Date(
                        parseInt(date_string.substr(0,4)),
                        parseInt(date_string.substr(5,2))-1,
                        parseInt(date_string.substr(8,2)),
                        parseInt(date_string.substr(11,2)),
                        parseInt(date_string.substr(14,2)),
                        parseInt(date_string.substr(17,2)), 0
                    );
                    test = (yard_date > today);
                    if( yard_date > today){ //within last seven days
                        newinventory.push($(this));
                        test_month = parseInt(date_string.substr(5,2));
                    }

                }//end of if YARD_DATE tag exists

                var make = $(this).find('MAKE').text();
                var model = $(this).find('MODEL').text();

                if((jQuery.inArray(make, makes)) == -1){
                    makes.push(make);
                    models[make] = new Array();
                    models[make].push(model);
                }
                else{
                    if((jQuery.inArray(model, models[make])) == -1){
                        models[make].push(model);
                    }
                }
            });

            //new inventory print out
            if(newinventory.length > 0) {


                newinventory.sort(function(a,b){ //sort the asset by YARD_DATE new to old
                    a_date = a.find('YARD_DATE').text();
                    b_date = b.find('YARD_DATE').text();
                    if(a_date > b_date) return -1; //descending order
                    if(a_date < b_date) return 1;
                    return 0;
                });


                results = '<table><tr><th>Year</th><th>Make</th><th>Model</th><th>Vehicle Row</th></tr>';
                $(newinventory).each(function () {

                    var year_temp = $(this).find('iYEAR').text();
                    var row_temp = $(this).find('VEHICLE_ROW').text();
                    var make_temp = $(this).find('MAKE').text();
                    var model_temp = $(this).find('MODEL').text();

                    results = results + '<tr><td>' + year_temp + '</td>' + '<td>' + make_temp + '</td>' + '<td>' + model_temp + '</td>' + '<td>' + row_temp + '</td></tr>';

                });

                results = results + '</table>';

            }else{
                results = '<p>No new inventory added in last 7 days.</p>';
            }

            $('#new-list').empty();
            $(results).appendTo('#new-list');

            //end of new inventory print out

            makes.sort();
            $('<option>Select Model</option>').appendTo('#make-select');

            jQuery.each(makes, function(key, value){
                $('<option>'+value+'</option>').appendTo('#make-select');
                models[value].sort();
            });


            //when Make is selected
            $("#make-select" ).change(function() {
                make = $( "#make-select option:selected" ).text();
                model = "";
                var selections = '<label>Select Model:</label><select name="model-select" id="model-select"><option>Select Model</option>';

                jQuery.each(models[make], function(key, value){
                    selections = selections + '<option>' + value + '</option>';
                });

                selections = selections + '</select>';
                $('#model-list').empty();
                $(selections).appendTo('#model-list');

                //when Model is selected
                $("#model-select").change(function() {
                    model = $( "#model-select option:selected" ).text();

                    results = '<table><tr><th>Year</th><th>Make</th><th>Model</th><th>Vehicle Row</th></tr>';
                    $(xml).find('ASSET').each(function(){

                        var year_temp = $(this).find('iYEAR').text();
                        var row_temp = $(this).find('VEHICLE_ROW').text();
                        var make_temp = $(this).find('MAKE').text();
                        var model_temp = $(this).find('MODEL').text();

                        if((make == make_temp) && (model == model_temp)){
                            results = results + '<tr><td>'+year_temp+'</td>'+'<td>'+make_temp+'</td>'+'<td>'+model_temp+'</td>'+'<td>'+row_temp+'</td></tr>';
                        }

                    });

                    results = results + '</table>';
                    $('#result').empty();
                    $(results).appendTo('#result');

                });

            });






        } //end of success
    });
});
