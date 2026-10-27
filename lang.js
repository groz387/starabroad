// On the home page, sends first-time visitors to their language based on where
// their device says they are (time zone), then their browser language.
// Remembers the page they last used, and any choice made in the language switch.
(function () {
  var KEY = "starabroad-lang";
  var SUPPORTED = ["en", "az", "ru", "kk"];

  var KAZAKHSTAN = ["Asia/Almaty", "Asia/Qostanay", "Asia/Qyzylorda", "Asia/Aqtobe",
    "Asia/Aqtau", "Asia/Atyrau", "Asia/Oral"];

  // Russia, Belarus, Uzbekistan, Kyrgyzstan, Tajikistan, Turkmenistan, Armenia, Georgia, Moldova
  var RUSSIAN_SPEAKING = ["Europe/Moscow", "Europe/Kaliningrad", "Europe/Samara", "Europe/Volgograd",
    "Europe/Saratov", "Europe/Ulyanovsk", "Europe/Astrakhan", "Europe/Kirov", "Asia/Yekaterinburg",
    "Asia/Omsk", "Asia/Novosibirsk", "Asia/Barnaul", "Asia/Tomsk", "Asia/Novokuznetsk",
    "Asia/Krasnoyarsk", "Asia/Irkutsk", "Asia/Chita", "Asia/Yakutsk", "Asia/Khandyga",
    "Asia/Vladivostok", "Asia/Ust-Nera", "Asia/Magadan", "Asia/Sakhalin", "Asia/Srednekolymsk",
    "Asia/Kamchatka", "Asia/Anadyr", "Europe/Minsk", "Asia/Tashkent", "Asia/Samarkand",
    "Asia/Bishkek", "Asia/Dushanbe", "Asia/Ashgabat", "Asia/Yerevan", "Asia/Tbilisi",
    "Europe/Chisinau"];

  function load() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function save(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  function detect() {
    var zone = "";
    try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}

    if (zone === "Asia/Baku") return "az";
    if (KAZAKHSTAN.indexOf(zone) > -1) return "kk";
    if (RUSSIAN_SPEAKING.indexOf(zone) > -1) return "ru";

    var prefs = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i]).slice(0, 2).toLowerCase();
      if (SUPPORTED.indexOf(code) > -1) return code;
    }
    return "en";
  }

  var current = document.documentElement.lang;
  var onHome = current === "en" && /^\/(index\.html)?$/.test(location.pathname);

  if (onHome) {
    var wanted = load() || detect();
    if (wanted !== "en" && SUPPORTED.indexOf(wanted) > -1) {
      location.replace("/" + wanted + "/");
      return;
    }
  }

  save(current);

  // Save the choice before leaving, so the home page doesn't redirect back
  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest("a[data-lang]");
    if (link) save(link.getAttribute("data-lang"));
  });
})();
