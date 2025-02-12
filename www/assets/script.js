import { db } from './firebaseConfig.js';
import { ref, set, get } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

// CONSTANTS
const CONFIG_FILE_FORMAT = "custom/{0}.conf";
const WEATHER_ICON_URL = "assets/weathericons/{0}.svg";

// VARIABLES
let _config = {};
let _helpers = {};
let _lastMinute = -1;
let _lastSecond = -1;
let _useSeconds = false;
let _lastDay = -1;
let _current_date = "";
let _diasUrl = "";
let _confName = "default";
let _confFile = "custom/default.conf";

// Function to extract slideId from the given URL or key
function extractSlideId(input) {
    const regex = /\/d\/e\/([a-zA-Z0-9-_]+)\//;
    const match = input.match(regex);
    return match ? match[1] : input;
}

// Handle form submission in key.html
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("slideForm");

    if (form) {
        form.addEventListener("submit", async function(event) {
            event.preventDefault();
            let input = document.getElementById("slideKey").value;
            let slideId = extractSlideId(input);
            let numSlides = document.getElementById("numSlides").value;
            if (slideId && numSlides) {
                try {
                    await set(ref(db, 'settings/slideKey'), { slideKey: slideId, numSlides: numSlides });
                    document.getElementById("message").textContent = "Google Slide Key and Number of Slides saved successfully!";
                    document.getElementById("message").style.display = "block";
                } catch (e) {
                    document.getElementById("message").textContent = "Error saving Google Slide Key and Number of Slides.";
                    document.getElementById("message").style.display = "block";
                    console.error("Error adding document: ", e);
                }
            }
        });
    }

    // Fetch slide key and numSlides from Realtime Database and initialize page
    const slideKeyRef = ref(db, 'settings/slideKey');
    get(slideKeyRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const slideId = data.slideKey;
            const numSlides = data.numSlides;
            localStorage.setItem("numSlides", numSlides);
            const iframe = document.querySelector('.dias-frame');
            if (iframe) {
                // Use the fetched slideId and the durationSek value from the config
                iframe.src = `https://docs.google.com/presentation/d/e/${slideId}/embed?start=true&loop=true&delayms=${_config.googleSlide.durationSek * 1000}&rm=minimal&slide=id.p`;
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error("Error fetching document: ", error);
    });
});
// Rest of your initialization and configuration code

// CONFIG
function initConfig() {
  _useSeconds = String(_config.format.labels.time).includes("{3}");

  _config.background_image = _helpers.parseSrcUrl(
    _helpers.valueOrDefault(
      _config.background_image,
      "custom/HelpDesk.jpg"
  ));
  
  _config.languageId = _helpers.getUrlParamValue("lang", _config.languageId);

  _config.widthPrc = parseInt(
    _helpers.getUrlParamValue("widtprc", _config.widthPrc)
  );

  _config.googleSlide.durationSek = parseInt(
    _helpers.getUrlParamValue("duration", _config.googleSlide.durationSek)
  );

  _config.googleSlide.reloadSlide = (parseInt(localStorage.getItem("numSlides")) || 10) * _config.googleSlide.durationSek;

  _config.weatherService.showWeather = _helpers.parseBool(
    _config.weatherService.showWeather,
    true
  );

  _config.format.time24hours = _helpers.parseBool(
    _config.format.time24hours,
    _config.languageId == "en"
  );

  _config.googleSlide.slideId = _helpers.getUrlParamValue(
    "slideid",
    _helpers.valueOrDefault(
      _config.googleSlide.slideId,
      localStorage.getItem("googleSlideKey") || "2PACX-1vSBNy-mN519II3gzObo8p32RhVHaL26vFruRj27zJMnrkyOQ1yyCjQBuYkZqlSvOaIWGQz9Woc_sFVM"
    )
  );

  _config.dateformater = new Intl.DateTimeFormat(
    _config.languageId,
    _config.format.dateformat_options
  );

  _diasUrl = encodeURI(
    "https://docs.google.com/presentation/d/e/" +
      _config.googleSlide.slideId +
      "/embed?start=true&loop=true&delayms=" +
      _config.googleSlide.durationSek * 1000 + "&rm=minimal&slide=id.p"
  );
}

function initStyle() {
  let bImg = _helpers.valueOrDefault(_config.background_image, false);
  let lvw = parseFloat(_config.widthPrc);
  let wmin = 20;
  let wmax = 100;

  if (wmin > lvw) lvw = wmin;
  if (lvw > wmax) lvw = wmax;

  let lvh = Math.round(lvw * 0.98 * 1000) / 1000;

  $(":root").css({
    "--frameWidth":
      "max(calc(min(" + lvw + "lvw, calc(" + lvh + "lvh / 0.5625))), 300px)",
  });
  $(".bodycontainer").fadeIn();
  if (bImg) {
    if (String(bImg).length > 4) {
      $('.bodycontainer').css({'background-image': 'url("'+bImg+'")'});
    }
  };
  $(".header_label").html(
    _helpers.dynamicStringFormat(
      _config.format.labels.header,
      '<div class="favicon">&nbsp;</div>'
    )
  );
}

function initPage() {
  if (!_helpers.checkUrlOnline(_diasUrl)) {
    setTimeout(initSlide, 1000 * 60);
    return;
  }

  let ifrm = $(".dias-frame");
  if (!ifrm.length) return false;

  ifrm.on("load", function () {
    setTimeout($(".faded").fadeIn(2000), 10000);
  });

  ifrm.attr("src", _diasUrl);

  _helpers.runAfterXminutes(_helpers.reloadBrowser);

  updateDateTime();
  // Time Refresh //
  if (_useSeconds) {
    setInterval(updateDateTime, 1000);
  } else {
    let now = new Date();
    let sec = now.getSeconds();
    setTimeout(function () {
      updateDateTime();
      setInterval(updateDateTime, 1000 * 60);
    }, 1000 * (60 - sec));
  }

  if (!_config.weatherService.showWeather) return;

  _helpers.getCurrentWeather();

  // Set update weather banner timer
  if (_config.googleSlide.reloadSlide > 120) {
    setInterval(_helpers.getCurrentWeather(), 1000 * 60 * 90);
  }
}

// DATETIME
function updateDateTime() {
  let now = new Date();
  let day = now.getDay();
  let ampm = "";
  let hour = now.getHours();
  let minute = now.getMinutes();
  let strSeconds = "";

  if (_lastDay != day) {
    _lastDay = day;
    _current_date = _config.dateformater.format(now);
    $(".date_label").html(
      _helpers.dynamicStringFormat(_config.format.labels.date, _current_date)
    );
  }

  if (!_useSeconds) {
    if (_lastMinute == minute) return;
  } else {
    strSeconds = String(now.getSeconds()).padStart(2, "0");
  }
  if (!_config.format.time24hours) {
    // AM = Ante meridiem: Before noon  00:00:01 to 11:59:59
    // PM = Post meridiem: After noon   12:00:01 to 23:59:59
    // Midnight       00:00:00
    // Noon           12:00:00
    if (hour < 12) {
      ampm = "am";
      if (hour == 0) hour = 12;
    } else {
      ampm = "pm";
      if (hour > 12) hour = hour - 12;
    }
  }

  _lastMinute = minute;

  $(".time_label").html(
    _helpers.dynamicStringFormat(
      _config.format.labels.time,
      ampm,
      hour,
      String(minute).padStart(2, "0"),
      strSeconds
    )
  );
}

// WEATHER
function updateWeatherBanner(weather) {
  $(".weather_icon").attr(
    "src",
    _helpers.dynamicStringFormat(WEATHER_ICON_URL, weather.icon)
  );
  $(".weather_temp").html(
    _helpers.dynamicStringFormat(
      _config.format.labels.temp,
      Math.round(weather.temp)
    )
  );
  $(".weather_feel").html(
    _helpers.dynamicStringFormat(
      _config.format.labels.feelslike,
      Math.round(weather.feelslike)
    )
  );
  $(".weather_cond").html(
    _helpers.dynamicStringFormat(
      _config.format.labels.condition,
      weather.conditions
    )
  );
  $(".weather_text").html(
    _helpers.dynamicStringFormat(
      _config.format.labels.description,
      weather.description
    )
  );
}

// Example initialization function from previous scripts
function initialize() {
  // REQUIRE SETUP
  requirejs.config({
    baseUrl: "./",
  });
  requirejs(["assets/jquery", "assets/helpers"], function (jquery, helpers) {
    $(".faded").hide(1);
    _helpers = helpers.getHelpers();
    _confName = _helpers.getUrlParamValue("conf", _confName);
    _confFile = _helpers.dynamicStringFormat(CONFIG_FILE_FORMAT, _confName);

    // Loads the configuration file and initializes the configuration and slide.
    requirejs([_confFile], function (conf) {
      _config = conf.getConfig();
      initConfig();
      initStyle();
      initPage();
    });
  });
}

// Call initialize to start the process
initialize();
