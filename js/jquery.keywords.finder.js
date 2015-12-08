/*!
 * jQuery Keyword Finder v1.0.0
 *
 * http://keywords.zone/
 *
 * Copyright (c) 2015 Keywords.Zone
 * Released under the Creative Commons Attribution-ShareAlike 3.0 Unported License.
 */
(function ($) {

    var hashResults = {};
    var keywordsCounter = 0;
    var toDoWork = false;
    var keywordsQuery = new Array();
    var keywordsQueryIndex = 0;
    var queryflag = false;
    var valeur = 0;
    var compareTable = [];
    var method = $("input[name='MethodOptions']").val();
    var dtable = $('#example').dataTable({
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv'
        ],
        "pageLength": 20,
        "data": compareTable,
        "columns": [{
            "title": "i",
            "width": "50px"
        }, {
            "title": "Keywords"
        }, {
            "title": "Queries",
            "class": "center"
        }
        ],
        "order": [[0, "desc"]]
    });

    $.fn.StartJobMethod1 = function () {
        method = 1;
        if (toDoWork == false) {
            hashResults = {};
            keywordsCounter = 0;
            keywordsQuery = new Array();
            keywordsQueryIndex = 0;

            hashResults[""] = 1;
            hashResults[" "] = 1;
            hashResults["  "] = 1;

            var ks = $('#search').val().split("\n");
            var i = 0;
            for (i = 0; i < ks.length; i++) {
                keywordsQuery[keywordsQuery.length] = ks[i];

                var j = 0;
                for (j = 0; j < 26; j++) {
                    var chr = String.fromCharCode(97 + j);
                    var currentx = ks[i] + ' ' + chr;
                    keywordsQuery[keywordsQuery.length] = currentx;
                    hashResults[currentx] = 1;
                }
            }
            //document.getElementById("input").value = '';
            document.getElementById("search").value += "\r\n";

            toDoWork = true;
            $('#startjob').html('Stop To Find Keywords');
        }
        else {
            toDoWork = false;
            //alert("Do you want to Stop to Find Keywords?");
            $('#startjob').html('Find Keywords');
        }
        //return this;
    }

    $.fn.StartJobMethod2 = function () {
        method = 2;
        if (toDoWork == false) {
            hashResults = {};
            keywordsCounter = 0;
            keywordsQuery = new Array();
            keywordsQueryIndex = 0;

            hashResults[""] = 1;
            hashResults[" "] = 1;
            hashResults["  "] = 1;

            var ks = $('#search').val().split("\n");
            var i = 0;
            for (i = 0; i < ks.length; i++) {
                keywordsQuery[keywordsQuery.length] = ks[i];

                var j = 0;
                for (j = 0; j < 26; j++) {
                    var chr = String.fromCharCode(97 + j);
                    var currentx = ks[i] + ' ' + chr;
                    keywordsQuery[keywordsQuery.length] = currentx;
                    hashResults[currentx] = 1;
                    for (k = 0; k < 26; k++) {
                        var chr = String.fromCharCode(97 + k);
                        var currentk = currentx + chr;
                        keywordsQuery[keywordsQuery.length] = currentk;
                        hashResults[currentk] = 1;
                    }
                }
            }
            //document.getElementById("input").value = '';
            document.getElementById("search").value += "\r\n";

            toDoWork = true;
            $('#startjob').html('Stop To Find Keywords');
        }
        else {
            toDoWork = false;
            //alert("Do you want to Stop to Find Keywords?");
            $('#startjob').html('Find Keywords');
        }
        //return this;
    }
    $.fn.DoJob = function () {
        if (toDoWork == true && queryflag == false) {
            if (keywordsQueryIndex < keywordsQuery.length) {
                var currentKw = keywordsQuery[keywordsQueryIndex];
                $().QueryKeyword(currentKw);
                keywordsQueryIndex++;
                valeur = Math.floor(100 * (keywordsQueryIndex / keywordsQuery.length))
                $("#to-do").html(keywordsQuery.length);
                $("#done").html(keywordsQueryIndex);
                $('.progress-bar').css('width', valeur + '%').attr('aria-valuenow', valeur).html(valeur + '%');
            }
            else {
                if (keywordsCounter != 0) {
                    alert("Done");
                    toDoWork = false;
                    $('#startjob').val('Start Job');
                }
                else {
                    keywordsQueryIndex = 0;
                }
            }
        }
    };
    $.fn.QueryKeyword = function (keyword) {
        var querykeyword = keyword;
        //var querykeyword = encodeURIComponent(keyword);
        var queryresult = '';
        queryflag = true;
        $("#keywordtoquery").html(querykeyword);
        var lang = $("#gg-lang").val();
        $.ajax({
            url: "http://suggestqueries.google.com/complete/search",
            jsonp: "jsonp",
            dataType: "jsonp",
            data: {
                q: querykeyword,
                client: "chrome",
                hl: lang
            },
            success: function (res) {
                var suggestList = res[1];
                var i = 0;
                var sb = '';
                for (i = 0; i < suggestList.length; i++) {
                    var currents = $().CleanValue(suggestList[i]);
                    if (hashResults[currents] != 1) {
                        hashResults[currents] = 1;
                        sb = sb + currents + '\r\n';
                        keywordsCounter++;
                        var compareRow = [];
                        compareRow.push(keywordsCounter + '');
                        compareRow.push(currents);
                        compareRow.push(querykeyword);
                        dtable.fnAddData(compareRow);
                        if (method == 1) {
                            //alert('toto');
                            keywordsQuery[keywordsQuery.length] = currents;
                            var j = 0;
                            for (j = 0; j < 26; j++) {
                                var chr = String.fromCharCode(97 + j);
                                var currentx = currents + ' ' + chr;
                                keywordsQuery[keywordsQuery.length] = currentx;
                                hashResults[currentx] = 1;
                            }
                        }
                    }
                }
                $("#keywordsCounter").html(keywordsCounter);
                $("#result").html(sb);
                //loader()
                //document.getElementById("input").value += sb;

                //var textarea = document.getElementById("input");
                //textarea.scrollTop = textarea.scrollHeight;
                queryflag = false;
            }
        });

    };
    $.fn.CleanValue = function (input) {
        var val = input;
        val = val.replace("\\u003cb\\u003e", "");
        val = val.replace("\\u003c\\/b\\u003e", "");
        val = val.replace("\\u003c\\/b\\u003e", "");
        val = val.replace("\\u003cb\\u003e", "");
        val = val.replace("\\u003c\\/b\\u003e", "");
        val = val.replace("\\u003cb\\u003e", "");
        val = val.replace("\\u003cb\\u003e", "");
        val = val.replace("\\u003c\\/b\\u003e", "");
        val = val.replace("\\u0026amp;", "&");
        val = val.replace("\\u003cb\\u003e", "");
        val = val.replace("\\u0026", "");
        val = val.replace("\\u0026#39;", "'");
        val = val.replace("#39;", "'");
        val = val.replace("\\u003c\\/b\\u003e", "");
        val = val.replace("\\u2013", "2013");
        if (val.length > 4 && val.substring(0, 4) == "http")
            val = "";
        return val;
    };
})(jQuery);
