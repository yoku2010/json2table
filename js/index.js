(function ($) {
    'use strict';
    $("#id_json2table").JSON2Table({
        json: {
            "Name": "Yogesh Kumar",
            "Age": "28 Years",
            "Address": "Ajmer, Rajasthan",
            "Company": "Excelsoft Technologies Pvt. Ltd.",
            "Friends": [
                {
                    "Name": "Ankit",
                    "Age": "29 Years",
                    "Address": "Ajmer, Rajasthan"
                },
                {
                    "Name": "Arpit",
                    "Age": "27 Years",
                    "Address": "Noida, Uttar Pradesh"
                },
                {
                    "Name": "Harish Sharma",
                    "Age": "23 Years",
                    "Address": "Gurgaon, Haryana"
                }
            ],
            "Social": {
                "Facebook": "http://www.facebook.com/yoku2010/",
                "Twitter": "https://twitter.com/yoku_2010/",
                "LinkedIn": "http://www.linkedin.com/in/yoku2010/",
                "Online Resume": "https://yoku2010.github.io/resume/"
            }
        }
    });
}(jQuery));
