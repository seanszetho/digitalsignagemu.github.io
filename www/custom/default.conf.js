/**
 * ONLY EDIT VALUES [<KEY>: <VALUE>,]
 *     KEYS AND STRUCTURE MUST BE INTACT IN ORDER TO WORK
 *
 * @format
 */

let config = {
    background_image: 'custom/HelpDesk.jpg',
    /*  Width in percent
        You can set it to 100 if you want to remove border on displays with no margin */
    widthPrc: 97, // in percent
    /*  Language Id for weekdays, months and weather data
        Select between:
          ar (Arabic), bg (Bulgarian), cs (Czech), da (Danish), de (German), 
          el (Greek Modern), en (English), es (Spanish) ), fa (Farsi), fi (Finnish), 
          fr (French), he (Hebrew), hu, (Hungarian), it (Italian), ja (Japanese), 
          ko (Korean), nl (Dutch), pl (Polish), pt (Portuguese), ru (Russian), 
          sr (Serbian), sv (Swedish), tr (Turkish), uk (Ukrainian), vi (Vietnamese) 
          and zh (Chinese) 
          */
    languageId: 'en',
    format: {
        /*  You can change the format of the date by adding options. 
            weekday: 'narrow' | 'short' | 'long'
            year: 'numeric' | '2-digit',
            month: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long'
            day: 'numeric' | '2-digit'
            timeZone:
        EXAMPLE: "{ weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'}"  */
        dateformat_options: { timeZone: 'UTC' },
        /*  Show hour in 24 hours or false for 12 hours */
        time24hours: true,
        /*  Labels can be formatted as you wish, just add or remove '{?}' as needed and write any text you like */
        labels: {
            /*  Header text in left top corner, just set to empty if you don't want any.
            {0} will be replaced with the favicon found here: "custom/favicon.png"  */
            header:
                '',
            /*  Date label format, 
            {0} will be replaced with current date in selected language */
            date: '{0}',
            /*  Time label format.
            {0} will be replaced with am/pm if format.time24hours is false
            {1} will be replaced with current hour, 
            {2} will be replaced with current minute,
            {3} will be replaced with current second  */
            time: 'Time {0} {1}:{2}',
            /*  Temperature label format, 
            {0} will be replaced with current temperature in selected unit group  */
            temp: '{0}°',
            /*  Feels Like label, 
            {0} will be replaced with current feels like temperature in selected unit group  */
            feelslike: 'feels like {0}°',
            /*  Weather condition label, 
            {0} will be replaced with current weather conditions in selected languageid  */
            condition: '{0}',
            /*  Weather description label, 
            {0} will be replaced with current day weather description in selected languageid  */
            description: '{0}',
        },
    },
    googleSlide: {
        /*  Published Google Slide id  [https://support.google.com/docs/answer/183965?hl=en&co=GENIE.Platform%3DDesktop#publish] 
            In Google Slides, go to this menu: 'File' / 'Share' / 'Publish to web'
            In the embed url copy the id from "https://docs.google.com/presentation/d/e/<SLIDE_ID>/embed?start=true..."   
            Example: '2PACX-1vSBNy-mN519II3gzObo8p32RhVHaL26vFruRj27zJMnrkyOQ1yyCjQBuYkZqlSvOaIWGQz9Woc_sFVM'   */
        slideId: localStorage.getItem("googleSlideKey") || '2PACX-1vTcmj4CYKCs4XzJdqnPTiSgoJD6liD2ijoUsR2A15K8jT7ezSTWijIMhMKEaUlHwPjhWph2uhFbEQbh',
        /*  Duration between slides in seconds. Default 30   */
        durationSek: 30,
        /*  Reload Webpage after the total duration of all slides. Default is 10 slides. */
        reloadSlide: (parseInt(localStorage.getItem("numSlides")) || 10) * 30,
    },
    weatherService: {
        /*  Show or hide weather in bottom left corner */
        showWeather: true,
        /*  Your personal code for the weather api, create one here: https://www.visualcrossing.com/sign-up   */
        key: '9RSYM4XCF8NA999AJAB3X99JW',
        /*  Select the temperature unit.  https://www.visualcrossing.com/resources/documentation/weather-api/unit-groups-and-measurement-units/
            us:     Fahrenheit
            metric: Celsius   */
        unitGroup: 'us',
        /*  Location:  is the address, partial address or latitude,longitude location for which to retrieve weather data. 
        You can also use US ZIP Codes.  */
        location: 'Fremont, Nebraska',
    },
};

// DON'T EDIT BELOW THIS LINE!!!
define(function () {
    return {
        getConfig: function () {
            return config;
        },
    };
});
