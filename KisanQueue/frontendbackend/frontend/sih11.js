/* =====================================================
   KISANQUEUE - JAVASCRIPT
   Connected with Express / MongoDB Backend
   Upgraded Dashboard with Web Speech API & Multi-Language
===================================================== */

/* =====================================================
   BACKEND CONFIGURATION
===================================================== */

const API_BASE_URL = "http://localhost:5000/api";

// Helper for backend API calls
async function apiCall(endpoint, method = "GET", data = null) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      console.warn(`[API ${method} ${endpoint}] returned status ${response.status}:`, result);
    }

    return result;
  } catch (err) {
    console.error(`[API Network Error] Failed to reach backend at ${API_BASE_URL}${endpoint}:`, err);
    return { success: false, message: "Could not connect to backend server. Make sure Backend is running on port 5000." };
  }
}

/* =====================================================
   DOM ELEMENTS
===================================================== */

const loginPage = document.getElementById("loginPage");
const dashboardPage = document.getElementById("dashboardPage");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const farmerNameInput = document.getElementById("farmerName");
const aadhaarInput = document.getElementById("aadhaar");
const mobileInput = document.getElementById("mobile");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const otpInputs = document.querySelectorAll(".otp-input");

const loginLanguage = document.getElementById("loginLanguage");
const topLanguage = document.getElementById("topLanguage");
const sidebarLanguage = document.getElementById("sidebarLanguage");

const sidebar = document.getElementById("sidebar");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");

// Panels
const dashboardContent = document.getElementById("dashboardContent");
const bookContent = document.getElementById("bookContent");
const queueContent = document.getElementById("queueContent");
const produceContent = document.getElementById("produceContent");
const procurementContent = document.getElementById("procurementContent");
const paymentsContent = document.getElementById("paymentsContent");
const notificationsContent = document.getElementById("notificationsContent");
const supportContent = document.getElementById("supportContent");
const confirmationContent = document.getElementById("confirmationContent");

// Header Elements
const headerGreeting = document.getElementById("headerGreeting");
const headerFarmerName = document.getElementById("headerFarmerName");
const headerCropName = document.getElementById("headerCropName");
const liveDate = document.getElementById("liveDate");
const liveTime = document.getElementById("liveTime");
const headerVoiceBtn = document.getElementById("headerVoiceBtn");
const headerNotifBtn = document.getElementById("headerNotifBtn");
const headerNotifBadge = document.getElementById("headerNotifBadge");
const sidebarNotifBadge = document.getElementById("sidebarNotifBadge");

// Sidebar Elements
const sidebarFarmerName = document.getElementById("sidebarFarmerName");
const sidebarFarmerMobile = document.getElementById("sidebarFarmerMobile");
const sidebarFarmerCard = document.getElementById("sidebarFarmerCard");
const sidebarVoiceBtn = document.getElementById("sidebarVoiceBtn");

// Strip & Main Dashboard Cards
const stripCentreName = document.getElementById("stripCentreName");
const changeCentreBtn = document.getElementById("changeCentreBtn");

const dashToken = document.getElementById("dashToken");
const dashAhead = document.getElementById("dashAhead");
const dashWait = document.getElementById("dashWait");
const dashSegmentedBar = document.getElementById("dashSegmentedBar");
const dashNotifyThreshold = document.getElementById("dashNotifyThreshold");
const listenUpdateBtn = document.getElementById("listenUpdateBtn");

const dashLeaveTime = document.getElementById("dashLeaveTime");
const dashDistance = document.getElementById("dashDistance");
const dashTravelTime = document.getElementById("dashTravelTime");
const dashBuffer = document.getElementById("dashBuffer");
const dashArrivalTime = document.getElementById("dashArrivalTime");
const viewRouteBtn = document.getElementById("viewRouteBtn");

const dashNextStageName = document.getElementById("dashNextStageName");
const dashNextCrop = document.getElementById("dashNextCrop");
const viewFullProcessBtn = document.getElementById("viewFullProcessBtn");

const dashExpectedTurnTime = document.getElementById("dashExpectedTurnTime");
const dashRemindAtTime = document.getElementById("dashRemindAtTime");

// Quick Actions
const qaCallCentre = document.getElementById("qaCallCentre");
const qaMessageCentre = document.getElementById("qaMessageCentre");
const qaOtherFarmers = document.getElementById("qaOtherFarmers");
const qaLearnMore = document.getElementById("qaLearnMore");
const noticeOtherCentresBtn = document.getElementById("noticeOtherCentresBtn");

// Recent Notifications & Live Queue Track
const recentNotifStream = document.getElementById("recentNotifStream");
const notifTokenVal = document.getElementById("notifTokenVal");
const notifSlotDate = document.getElementById("notifSlotDate");
const notifCentreName = document.getElementById("notifCentreName");
const notifPaymentVal = document.getElementById("notifPaymentVal");

const lqCentreHeader = document.getElementById("lqCentreHeader");
const viewFullQueueBtn = document.getElementById("viewFullQueueBtn");
const lqNowServing = document.getElementById("lqNowServing");
const lqCurrentFarmerName = document.getElementById("lqCurrentFarmerName");
const lqFarmersAhead = document.getElementById("lqFarmersAhead");
const lqEstimatedWait = document.getElementById("lqEstimatedWait");
const queueAvatarsTrack = document.getElementById("queueAvatarsTrack");
const trackStartToken = document.getElementById("trackStartToken");
const trackEndToken = document.getElementById("trackEndToken");

// Modals
const voiceModal = document.getElementById("voiceModal");
const closeVoiceModal = document.getElementById("closeVoiceModal");
const voiceStatusText = document.getElementById("voiceStatusText");
const voiceTranscript = document.getElementById("voiceTranscript");

const routeModal = document.getElementById("routeModal");
const closeRouteModal = document.getElementById("closeRouteModal");
const routeCentreName = document.getElementById("routeCentreName");
const openGoogleMapsBtn = document.getElementById("openGoogleMapsBtn");

const centreModal = document.getElementById("centreModal");
const closeCentreModal = document.getElementById("closeCentreModal");

const profileModal = document.getElementById("profileModal");
const closeProfileModal = document.getElementById("closeProfileModal");
const modalFarmerName = document.getElementById("modalFarmerName");
const modalFarmerId = document.getElementById("modalFarmerId");
const modalFarmerMobile = document.getElementById("modalFarmerMobile");

const actionModal = document.getElementById("actionModal");
const closeActionModal = document.getElementById("closeActionModal");
const actionModalTitle = document.getElementById("actionModalTitle");
const actionModalBody = document.getElementById("actionModalBody");

/* =====================================================
   TRANSLATIONS (12 INDIAN LANGUAGES PRESERVED)
===================================================== */

const translations = {
  English: {
    dashboard: "Dashboard",
    book: "Book Slot / Token",
    queue: "My Turn",
    produce: "My Produce",
    procurement: "Procurement Status",
    payments: "Payments",
    notifications: "Notifications",
    support: "Help & Support",
    login: "Login",
    logout: "Logout",
    farmer: "Farmer Name",
    aadhaar: "Aadhaar Number",
    mobile: "Mobile Number",
    otp: "OTP",
    sendOtp: "Send OTP",
    greetingMorning: "Good Morning",
    greetingAfternoon: "Good Afternoon",
    greetingEvening: "Good Evening",
  },
  Hindi: {
    dashboard: "डैशबोर्ड",
    book: "स्लॉट / टोकन बुक करें",
    queue: "मेरी बारी",
    produce: "मेरी उपज",
    procurement: "खरीद की स्थिति",
    payments: "भुगतान",
    notifications: "सूचनाएं",
    support: "सहायता और संपर्क",
    login: "लॉगिन",
    logout: "लॉगआउट",
    farmer: "किसान का नाम",
    aadhaar: "आधार नंबर",
    mobile: "मोबाइल नंबर",
    otp: "ओटीपी",
    sendOtp: "ओटीपी भेजें",
    greetingMorning: "शुभ प्रभात",
    greetingAfternoon: "शुभ दोपहर",
    greetingEvening: "शुभ संध्या",
  },
  Bengali: {
    dashboard: "ড্যাশবোর্ড",
    book: "স্লট / টোকেন বুক করুন",
    queue: "আমার পালা",
    produce: "আমার ফসল",
    procurement: "সংগ্রহের অবস্থা",
    payments: "অর্থপ্রদান",
    notifications: "বিজ্ঞপ্তি",
    support: "সাহায্য",
    login: "লগইন",
    logout: "লগআউট",
    farmer: "কৃষকের নাম",
    aadhaar: "আধার নম্বর",
    mobile: "মোবাইল নম্বর",
    otp: "ওটিপি",
    sendOtp: "ওটিপি পাঠান",
    greetingMorning: "সুপ্রভাত",
    greetingAfternoon: "শুভ অপরাহ্ন",
    greetingEvening: "শুভ সন্ধ্যা",
  },
  Marathi: {
    dashboard: "डॅशबोर्ड",
    book: "स्लॉट / टोकन बुक करा",
    queue: "माझी पाळी",
    produce: "माझे उत्पादन",
    procurement: "खरेदी स्थिती",
    payments: "पेमेंट्स",
    notifications: "सूचना",
    support: "मदत आणि संपर्क",
    login: "लॉगिन",
    logout: "लॉगआउट",
    farmer: "शेतकऱ्याचे नाव",
    aadhaar: "आधार क्रमांक",
    mobile: "मोबाईल क्रमांक",
    otp: "ओटीपी",
    sendOtp: "ओटीपी पाठवा",
    greetingMorning: "शुभ प्रभात",
    greetingAfternoon: "शुभ दुपार",
    greetingEvening: "शुभ संध्याकाळ",
  },
  Telugu: {
    dashboard: "డాష్‌బోర్డ్",
    book: "స్లాట్ / టోకెన్ బుక్ చేయండి",
    queue: "నా వంతు",
    produce: "నా పంట",
    procurement: "సేకరణ స్థితి",
    payments: "చెల్లింపులు",
    notifications: "నోటిఫికేషన్లు",
    support: "సహాయం",
    login: "లాగిన్",
    logout: "లాగ్ అవుట్",
    farmer: "రైతు పేరు",
    aadhaar: "ఆధార్ నంబర్",
    mobile: "మొబైల్ నంబర్",
    otp: "ఓటీపీ",
    sendOtp: "ఓటీపీ పంపండి",
    greetingMorning: "శుభోదయం",
    greetingAfternoon: "శుభ మధ్యాహ్నం",
    greetingEvening: "శుభ సాయంత్రం",
  },
  Tamil: {
    dashboard: "டாஷ்போர்டு",
    book: "ஸ்லாட் / டோக்கன் பதிவு",
    queue: "என் முறை",
    produce: "என் விளைபொருள்",
    procurement: "கொள்முதல் நிலை",
    payments: "கொடுப்பனவுகள்",
    notifications: "அறிவிப்புகள்",
    support: "உதவி",
    login: "உள்நுழை",
    logout: "வெளியேறு",
    farmer: "விவசாயி பெயர்",
    aadhaar: "ஆதார் எண்",
    mobile: "மொபைல் எண்",
    otp: "OTP",
    sendOtp: "OTP அனுப்பு",
    greetingMorning: "காலை வணக்கம்",
    greetingAfternoon: "மதிய வணக்கம்",
    greetingEvening: "மாலை வணக்கம்",
  },
  Gujarati: {
    dashboard: "ડેશબોર્ડ",
    book: "સ્લોટ / ટોકન બુક કરો",
    queue: "મારો વારો",
    produce: "મારું ઉત્પાદન",
    procurement: "ખરીદી સ્થિતિ",
    payments: "ચુકવણીઓ",
    notifications: "સૂચનાઓ",
    support: "સહાય",
    login: "લોગિન",
    logout: "લોગઆઉટ",
    farmer: "ખેડૂતનું નામ",
    aadhaar: "આધાર નંબર",
    mobile: "મોબાઇલ નંબર",
    otp: "ઓટીપી",
    sendOtp: "ઓટીપી મોકલો",
    greetingMorning: "સુપ્રભાત",
    greetingAfternoon: "શુભ બપોર",
    greetingEvening: "શુભ સાંજ",
  },
  Kannada: {
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    book: "ಸ್ಲಾಟ್ / ಟೋಕನ್ ಬುಕ್ ಮಾಡಿ",
    queue: "ನನ್ನ ಸರದಿ",
    produce: "ನನ್ನ ಬೆಳೆ",
    procurement: "ಖರೀದಿ ಸ್ಥಿತಿ",
    payments: "ಪಾವತಿಗಳು",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    support: "ಸಹಾಯ",
    login: "ಲಾಗಿನ್",
    logout: "ಲಾಗ್‌ಔಟ್",
    farmer: "ರೈತರ ಹೆಸರು",
    aadhaar: "ಆಧಾರ್ ಸಂಖ್ಯೆ",
    mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    otp: "ಒಟಿಪಿ",
    sendOtp: "ಒಟಿಪಿ ಕಳುಹಿಸಿ",
    greetingMorning: "ಶುಭೋದಯ",
    greetingAfternoon: "ಶುಭ ಮಧ್ಯಾಹ್ನ",
    greetingEvening: "ಶುಭ ಸಂಜೆ",
  },
  Malayalam: {
    dashboard: "ഡാഷ്ബോർഡ്",
    book: "സ്ലോട്ട് / ടോക്കൺ ബുക്ക് ചെയ്യുക",
    queue: "എന്റെ ഊഴം",
    produce: "എന്റെ വിളവ്",
    procurement: "സംഭരണ ​​സ്ഥിതി",
    payments: "പേയ്‌മെന്റുകൾ",
    notifications: "അറിയിപ്പുകൾ",
    support: "സഹായം",
    login: "ലോഗിൻ",
    logout: "ലോഗൗട്ട്",
    farmer: "കർഷകന്റെ പേര്",
    aadhaar: "ആധാർ നമ്പർ",
    mobile: "മൊബൈൽ നമ്പർ",
    otp: "ഒടിപി",
    sendOtp: "ഒടിപി അയയ്ക്കുക",
    greetingMorning: "സുപ്രഭാതം",
    greetingAfternoon: "ശുഭ ഉച്ചതിരിഞ്ഞ്",
    greetingEvening: "ശുഭ സായാഹ്നം",
  },
  Punjabi: {
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    book: "ਸਲਾਟ / ਟੋਕਨ ਬੁੱਕ ਕਰੋ",
    queue: "ਮੇਰੀ ਵਾਰੀ",
    produce: "ਮੇਰੀ ਉਪਜ",
    procurement: "ਖਰੀਦ ਸਥਿਤੀ",
    payments: "ਭੁਗਤਾਨ",
    notifications: "ਸੂਚਨਾਵਾਂ",
    support: "ਸਹਾਇਤਾ",
    login: "ਲੌਗਇਨ",
    logout: "ਲੌਗਆਉਟ",
    farmer: "ਕਿਸਾਨ ਦਾ ਨਾਮ",
    aadhaar: "ਆਧਾਰ ਨੰਬਰ",
    mobile: "ਮੋਬਾਈਲ ਨੰਬਰ",
    otp: "ਓਟੀਪੀ",
    sendOtp: "ਓਟੀਪੀ ਭੇਜੋ",
    greetingMorning: "ਸ਼ੁਭ ਸਵੇਰ",
    greetingAfternoon: "ਸ਼ੁਭ ਦੁਪਹਿਰ",
    greetingEvening: "ਸ਼ੁਭ ਸ਼ਾਮ",
  },
  Odia: {
    dashboard: "ଡ୍ୟାସବୋର୍ଡ",
    book: "ସ୍ଲଟ୍ / ଟୋକନ୍ ବୁକ୍ କରନ୍ତୁ",
    queue: "ମୋ ପାଳି",
    produce: "ମୋ ଉତ୍ପାଦନ",
    procurement: "ସଂଗ୍ରହ ସ୍ଥିତି",
    payments: "ଦେୟ",
    notifications: "ବିଜ୍ଞପ୍ତି",
    support: "ସାହାଯ୍ୟ",
    login: "ଲଗଇନ୍",
    logout: "ଲଗଆଉଟ୍",
    farmer: "ଚାଷୀଙ୍କ ନାମ",
    aadhaar: "ଆଧାର ନମ୍ବର",
    mobile: "ମୋବାଇଲ୍ ନମ୍ବର",
    otp: "ଓଟିପି",
    sendOtp: "ଓଟିପି ପଠାନ୍ତୁ",
    greetingMorning: "ସୁପ୍ରଭାତ",
    greetingAfternoon: "ଶୁଭ ଅପରାହ୍ନ",
    greetingEvening: "ଶୁଭ ସନ୍ଧ୍ୟା",
  },
  Assamese: {
    dashboard: "ড্যাশব’ৰ্ড",
    book: "স্লট / টোকেন বুক কৰক",
    queue: "মোৰ পালি",
    produce: "মোৰ শস্য",
    procurement: "ক্ৰয়ৰ অৱস্থা",
    payments: "পৰিশোধ",
    notifications: "জাননী",
    support: "সহায়",
    login: "লগইন",
    logout: "লগআউট",
    farmer: "কৃষকৰ নাম",
    aadhaar: "আধাৰ নম্বৰ",
    mobile: "মোবাইল নম্বৰ",
    otp: "অ’টিপি",
    sendOtp: "অ’টিপি পঠিয়াওক",
    greetingMorning: "সুপ্ৰভাত",
    greetingAfternoon: "শুভ আবেলি",
    greetingEvening: "শুভ সন্ধ্যা",
  },
};

function getLanguage() {
  return localStorage.getItem("kisanLanguage") || "English";
}

function setLanguage(lang) {
  if (!translations[lang]) lang = "English";
  localStorage.setItem("kisanLanguage", lang);

  if (loginLanguage) loginLanguage.value = lang;
  if (topLanguage) topLanguage.value = lang;
  if (sidebarLanguage) sidebarLanguage.value = lang;

  updateGreeting();
}

if (loginLanguage) loginLanguage.addEventListener("change", (e) => setLanguage(e.target.value));
if (topLanguage) topLanguage.addEventListener("change", (e) => setLanguage(e.target.value));
if (sidebarLanguage) sidebarLanguage.addEventListener("change", (e) => setLanguage(e.target.value));

/* =====================================================
   LIVE CLOCK & DYNAMIC GREETING
===================================================== */

function updateLiveDateTime() {
  const now = new Date();

  // Date formatting: e.g. "28 August 2026, Thursday"
  const optionsDate = { day: "numeric", month: "long", year: "numeric", weekday: "long" };
  if (liveDate) {
    liveDate.textContent = now.toLocaleDateString("en-IN", optionsDate);
  }

  // Time formatting: e.g. "09:15 AM"
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const timeStr = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;

  if (liveTime) {
    liveTime.textContent = timeStr;
  }
}

setInterval(updateLiveDateTime, 1000);
updateLiveDateTime();

function updateGreeting() {
  const name = localStorage.getItem("farmerName") || "Ramesh Kumar";
  const lang = getLanguage();
  const t = translations[lang] || translations.English;

  const now = new Date();
  const hr = now.getHours();
  let greet = t.greetingMorning || "Good Morning";
  if (hr >= 12 && hr < 17) greet = t.greetingAfternoon || "Good Afternoon";
  else if (hr >= 17) greet = t.greetingEvening || "Good Evening";

  if (headerGreeting) {
    headerGreeting.innerHTML = `${greet}, <span id="headerFarmerName">${name}</span>! 👋`;
  }
  if (sidebarFarmerName) sidebarFarmerName.textContent = name;
  if (modalFarmerName) modalFarmerName.textContent = name;

  const mobile = localStorage.getItem("farmerMobile") || "98765 43210";
  if (sidebarFarmerMobile) sidebarFarmerMobile.textContent = mobile;
  if (modalFarmerMobile) modalFarmerMobile.textContent = mobile;

  const farmerId = localStorage.getItem("farmerId") || "F1001";
  if (modalFarmerId) modalFarmerId.textContent = `Farmer ID: ${farmerId}`;
}

/* =====================================================
   AADHAAR & MOBILE FORMATTERS (LOGIN)
===================================================== */

if (aadhaarInput) {
  aadhaarInput.addEventListener("input", function () {
    let val = this.value.replace(/\D/g, "").substring(0, 12);
    let chunks = val.match(/.{1,4}/g);
    this.value = chunks ? chunks.join(" ") : "";
  });
}

if (mobileInput) {
  mobileInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").substring(0, 10);
  });
}

otpInputs.forEach((input, idx) => {
  input.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
    if (this.value && idx < otpInputs.length - 1) {
      otpInputs[idx + 1].focus();
    }
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Backspace" && !this.value && idx > 0) {
      otpInputs[idx - 1].focus();
    }
  });
});

if (sendOtpBtn) {
  sendOtpBtn.addEventListener("click", function () {
    const mobile = mobileInput.value.trim();
    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      mobileInput.focus();
      return;
    }
    alert("OTP sent successfully!\n\nDemo OTP: 123456");
  });
}

/* =====================================================
   LOGIN HANDLER - CONNECTED TO MONGODB
===================================================== */

if (loginBtn) {
  loginBtn.addEventListener("click", async function () {
    const name = farmerNameInput.value.trim();
    const aadhaar = aadhaarInput.value.replace(/\s/g, "");
    const mobile = mobileInput.value.trim();

    let otp = "";
    otpInputs.forEach((inp) => (otp += inp.value));

    if (!name) {
      alert("Please enter farmer name.");
      farmerNameInput.focus();
      return;
    }
    if (aadhaar.length !== 12) {
      alert("Please enter a valid 12-digit Aadhaar number.");
      aadhaarInput.focus();
      return;
    }
    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      mobileInput.focus();
      return;
    }
    if (otp !== "123456") {
      alert("Invalid OTP.\n\nFor demo use: 123456");
      return;
    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Logging in...`;

    // Backend call to find/create farmer
    const res = await apiCall("/farmers/login", "POST", { name, mobile, aadhaar });

    loginBtn.disabled = false;
    loginBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Login`;

    if (res && res.success && res.data) {
      localStorage.setItem("farmerId", res.data.farmerId || "F1001");
      localStorage.setItem("farmerName", res.data.name || name);
      localStorage.setItem("farmerMobile", res.data.mobile || mobile);
      localStorage.setItem("kisanLoggedIn", "true");
    } else {
      localStorage.setItem("farmerId", "F1001");
      localStorage.setItem("farmerName", name);
      localStorage.setItem("farmerMobile", mobile);
      localStorage.setItem("kisanLoggedIn", "true");
    }

    showDashboard();
  });
}

function showDashboard() {
  loginPage.style.display = "none";
  dashboardPage.style.display = "block";

  updateGreeting();
  showPage("dashboard");
  loadAllDashboardData();
}

/* =====================================================
   LOGOUT HANDLER
===================================================== */

function handleLogout() {
  localStorage.removeItem("kisanLoggedIn");
  localStorage.removeItem("farmerId");
  localStorage.removeItem("farmerName");
  localStorage.removeItem("farmerMobile");

  dashboardPage.style.display = "none";
  loginPage.style.display = "flex";

  if (profileModal) profileModal.classList.add("hidden");

  if (farmerNameInput) farmerNameInput.value = "";
  if (aadhaarInput) aadhaarInput.value = "";
  if (mobileInput) mobileInput.value = "";
  otpInputs.forEach((inp) => (inp.value = ""));
}

if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

/* =====================================================
   PAGE NAVIGATION
===================================================== */

const allPages = [
  dashboardContent,
  bookContent,
  queueContent,
  produceContent,
  procurementContent,
  paymentsContent,
  notificationsContent,
  supportContent,
  confirmationContent,
];

function showPage(pageName) {
  allPages.forEach((p) => {
    if (p) p.classList.add("hidden");
  });

  document.querySelectorAll(".sidebar-nav .nav-item").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-page") === pageName) {
      btn.classList.add("active");
    }
  });

  if (pageName === "dashboard" && dashboardContent) {
    dashboardContent.classList.remove("hidden");
    loadAllDashboardData();
  } else if (pageName === "book" && bookContent) {
    bookContent.classList.remove("hidden");
    initBookingForm();
  } else if (pageName === "queue" && queueContent) {
    queueContent.classList.remove("hidden");
    loadQueueViewData();
  } else if (pageName === "produce" && produceContent) {
    produceContent.classList.remove("hidden");
    loadProduceViewData();
  } else if (pageName === "procurement" && procurementContent) {
    procurementContent.classList.remove("hidden");
    loadProcurementViewData();
  } else if (pageName === "payments" && paymentsContent) {
    paymentsContent.classList.remove("hidden");
    loadPaymentsViewData();
  } else if (pageName === "notifications" && notificationsContent) {
    notificationsContent.classList.remove("hidden");
    loadNotificationsViewData();
  } else if (pageName === "support" && supportContent) {
    supportContent.classList.remove("hidden");
  } else if (pageName === "confirmation" && confirmationContent) {
    confirmationContent.classList.remove("hidden");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
  if (sidebar) sidebar.classList.remove("open");
}

// Nav items click
document.querySelectorAll(".sidebar-nav .nav-item").forEach((item) => {
  item.addEventListener("click", function () {
    const p = this.getAttribute("data-page");
    if (p === "voice") {
      openVoiceModal();
    } else if (p) {
      showPage(p);
    }
  });
});

// Back to Dashboard buttons
document.querySelectorAll(".back-to-dash-btn").forEach((btn) => {
  btn.addEventListener("click", () => showPage("dashboard"));
});

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}

/* =====================================================
   LOAD ALL DASHBOARD DATA - CONNECTED TO BACKEND
===================================================== */

async function loadAllDashboardData() {
  const farmerId = localStorage.getItem("farmerId") || "F1001";
  const selectedCentre = localStorage.getItem("kisanSelectedCentre") || "Centre A, Bhagalpur";

  if (stripCentreName) stripCentreName.textContent = selectedCentre;
  if (lqCentreHeader) lqCentreHeader.textContent = selectedCentre.toUpperCase();
  if (routeCentreName) routeCentreName.textContent = selectedCentre;

  // 1. Fetch Farmer Queue Status from backend
  const queueRes = await apiCall(`/queue/farmer/${farmerId}`);

  let token = "A-018";
  let ahead = 6;
  let wait = 42;
  let bookingId = localStorage.getItem("kisanCurrentBookingId");

  if (queueRes && queueRes.success && queueRes.data) {
    const qData = queueRes.data;
    token = qData.token || "A-018";
    ahead = typeof qData.farmersAhead === "number" ? qData.farmersAhead : 6;
    wait = ahead > 0 ? ahead * 7 : 0;
    bookingId = qData.bookingId || bookingId;
    if (bookingId) localStorage.setItem("kisanCurrentBookingId", bookingId);
  } else {
    // Check saved local booking
    const saved = loadSavedBooking();
    if (saved && saved.token) {
      token = saved.token;
      ahead = typeof saved.queueAhead === "number" ? saved.queueAhead : 6;
      wait = ahead * 7;
    }
  }

  // Update Card 1: YOUR TURN STATUS
  if (dashToken) dashToken.textContent = token;
  if (notifTokenVal) notifTokenVal.textContent = token;
  if (dashAhead) dashAhead.textContent = `${ahead} farmers ahead of you`;
  if (dashWait) dashWait.textContent = ahead === 0 ? "Your Turn Now!" : `${wait} mins`;

  if (dashNotifyThreshold) {
    dashNotifyThreshold.textContent = `${Math.max(1, ahead - 1)} farmers`;
  }

  // Update Segmented Bar (8 segments)
  if (dashSegmentedBar) {
    const totalSegments = 8;
    const filledCount = Math.max(1, Math.min(totalSegments, totalSegments - Math.floor(ahead / 2)));
    dashSegmentedBar.innerHTML = "";
    for (let i = 0; i < totalSegments; i++) {
      const seg = document.createElement("div");
      seg.className = `segment ${i < filledCount ? "filled" : "empty"}`;
      dashSegmentedBar.appendChild(seg);
    }
  }

  // 2. Update Card 2: WHEN SHOULD I LEAVE?
  updateDepartureCard(wait);

  // 3. Update Card 3: NEXT STEP & SMART WAIT from Booking & Procurement
  if (bookingId) {
    const procRes = await apiCall(`/procurement/${bookingId}`);
    if (procRes && procRes.success && procRes.data) {
      const pStage = procRes.data.procurementStatus || "QUALITY_CHECK";
      if (dashNextStageName) dashNextStageName.textContent = formatStageName(pStage);
    }

    const bookRes = await apiCall(`/bookings/${bookingId}`);
    if (bookRes && bookRes.success && bookRes.data) {
      const bData = bookRes.data;
      if (dashNextCrop) dashNextCrop.textContent = bData.crop || "Wheat";
      if (headerCropName) headerCropName.textContent = bData.crop || "Wheat";
      if (notifSlotDate) {
        const d = bData.date ? new Date(bData.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "28 Aug 2026";
        notifSlotDate.textContent = `${d} (${bData.slot || "10:00 AM - 11:00 AM"})`;
      }
      if (notifCentreName) notifCentreName.textContent = bData.centreId || selectedCentre;

      const estAmount = Math.round((bData.quantity || 50) * 22.75);
      if (notifPaymentVal) notifPaymentVal.textContent = `₹${estAmount.toLocaleString("en-IN")}`;
    }
  }

  // 4. Update Bottom Right: LIVE QUEUE AT CENTRE A
  const centreRes = await apiCall(`/queue/${encodeURIComponent(selectedCentre)}`);
  let servingToken = "A-012";
  let servingName = "Mahendra Singh";

  if (centreRes && centreRes.success && centreRes.data && centreRes.data.nowServing) {
    servingToken = centreRes.data.nowServing;
    servingName = "Active Farmer";
  }

  if (lqNowServing) lqNowServing.textContent = servingToken;
  if (lqCurrentFarmerName) lqCurrentFarmerName.textContent = servingName;
  if (lqFarmersAhead) lqFarmersAhead.textContent = ahead;
  if (lqEstimatedWait) lqEstimatedWait.textContent = ahead === 0 ? "Now" : `${wait} mins`;

  // Render Visual Queue Avatar Track with "You" marker
  renderQueueAvatarsTrack(token, ahead);
}

function updateDepartureCard(waitMinutes) {
  const now = new Date();
  const travelMins = 18;
  const bufferMins = 10;

  // Expected arrival = now + wait time
  const arrivalDate = new Date(now.getTime() + (waitMinutes > 0 ? waitMinutes : 30) * 60000);
  const leaveDate = new Date(arrivalDate.getTime() - (travelMins + bufferMins) * 60000);

  const fmtTime = (d) => {
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${String(h).padStart(2, "0")}:${m} ${ap}`;
  };

  const leaveStr = fmtTime(leaveDate);
  const arrivalStr = fmtTime(arrivalDate);

  if (dashLeaveTime) dashLeaveTime.textContent = leaveStr;
  if (dashArrivalTime) dashArrivalTime.textContent = arrivalStr;
  if (dashExpectedTurnTime) dashExpectedTurnTime.textContent = arrivalStr;
  if (dashRemindAtTime) dashRemindAtTime.textContent = leaveStr;
}

function formatStageName(stage) {
  const names = {
    BOOKED: "Gate Check-in",
    CHECKED_IN: "Waiting Bay Entry",
    WAITING: "Inspector Review",
    PROCESSING: "Quality Check",
    QUALITY_CHECK: "Quality Check",
    WEIGHING: "Electronic Weighing",
    COMPLETED: "Procurement Completed",
  };
  return names[stage] || stage;
}

/* =====================================================
   RENDER QUEUE AVATARS TRACK (SCREENSHOT MATCH)
===================================================== */

function renderQueueAvatarsTrack(userToken, farmersAhead) {
  if (!queueAvatarsTrack) return;
  queueAvatarsTrack.innerHTML = "";

  const totalTrackFigures = 18;
  const youPosition = 12; // visual index for current user

  for (let i = 1; i <= totalTrackFigures; i++) {
    const avatar = document.createElement("div");
    avatar.className = "track-avatar";

    if (i === youPosition) {
      avatar.classList.add("current-user");
      avatar.innerHTML = `
        <span class="you-badge">You</span>
        <i class="fa-solid fa-user"></i>
      `;
    } else if (i < youPosition) {
      avatar.classList.add("served");
      avatar.innerHTML = `<i class="fa-solid fa-user"></i>`;
    } else {
      avatar.innerHTML = `<i class="fa-solid fa-user"></i>`;
    }

    queueAvatarsTrack.appendChild(avatar);
  }

  if (trackStartToken) trackStartToken.textContent = "A-001";
  if (trackEndToken) trackEndToken.textContent = "A-024";
}

/* =====================================================
   LISTEN TO UPDATE (SPEECH SYNTHESIS)
===================================================== */

if (listenUpdateBtn) {
  listenUpdateBtn.addEventListener("click", function () {
    const farmerName = localStorage.getItem("farmerName") || "Ramesh Kumar";
    const token = dashToken?.textContent || "A-018";
    const ahead = dashAhead?.textContent || "6 farmers ahead of you";
    const wait = dashWait?.textContent || "42 mins";
    const centre = stripCentreName?.textContent || "Centre A, Bhagalpur";

    const speechText = `Namaste ${farmerName}. Your procurement token is ${token} at ${centre}. There are ${ahead}. Estimated wait time is ${wait}. Please arrive on time.`;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);

      listenUpdateBtn.innerHTML = `<i class="fa-solid fa-volume-high fa-bounce"></i> <span>Playing Update...</span>`;
      utterance.onend = () => {
        listenUpdateBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i> <span>Listen to Update</span>`;
      };
    } else {
      alert(speechText);
    }
  });
}

/* =====================================================
   VOICE ASSISTANT (WEB SPEECH API)
===================================================== */

let recognition = null;
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRec();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-IN";

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    if (voiceTranscript) voiceTranscript.textContent = `"${transcript}"`;
    handleVoiceCommand(transcript);
  };

  recognition.onerror = function (event) {
    if (voiceStatusText) voiceStatusText.textContent = "Listening paused. Tap command below or try again.";
  };

  recognition.onend = function () {
    if (voiceStatusText) voiceStatusText.textContent = "Done listening. Processing command...";
  };
}

function openVoiceModal() {
  if (voiceModal) voiceModal.classList.remove("hidden");
  if (voiceStatusText) voiceStatusText.textContent = "Listening... Speak your command now.";
  if (voiceTranscript) voiceTranscript.textContent = "Listening...";

  if (recognition) {
    try {
      recognition.start();
    } catch (e) {
      // already started
    }
  }
}

function closeVoice() {
  if (voiceModal) voiceModal.classList.add("hidden");
  if (recognition) {
    try {
      recognition.stop();
    } catch (e) {}
  }
}

if (headerVoiceBtn) headerVoiceBtn.addEventListener("click", openVoiceModal);
if (sidebarVoiceBtn) sidebarVoiceBtn.addEventListener("click", openVoiceModal);
if (closeVoiceModal) closeVoiceModal.addEventListener("click", closeVoice);

function handleVoiceCommand(cmd) {
  setTimeout(() => {
    closeVoice();

    if (cmd.includes("dashboard") || cmd.includes("home")) {
      showPage("dashboard");
      speakFeedback("Opening your dashboard.");
    } else if (cmd.includes("book") || cmd.includes("slot")) {
      showPage("book");
      speakFeedback("Opening slot booking.");
    } else if (cmd.includes("turn") || cmd.includes("queue")) {
      showPage("queue");
      speakFeedback("Showing your live queue turn.");
    } else if (cmd.includes("produce") || cmd.includes("crop")) {
      showPage("produce");
      speakFeedback("Opening your produce details.");
    } else if (cmd.includes("procurement") || cmd.includes("status")) {
      showPage("procurement");
      speakFeedback("Showing procurement workflow status.");
    } else if (cmd.includes("payment") || cmd.includes("rupee") || cmd.includes("money")) {
      showPage("payments");
      speakFeedback("Opening DBT payments tracker.");
    } else if (cmd.includes("notification") || cmd.includes("alert")) {
      showPage("notifications");
      speakFeedback("Showing your notifications.");
    } else {
      speakFeedback(`Understood: ${cmd}. Showing dashboard.`);
      showPage("dashboard");
    }
  }, 1000);
}

function speakFeedback(text) {
  if ("speechSynthesis" in window) {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    window.speechSynthesis.speak(u);
  }
}

// Voice hint chips
document.querySelectorAll(".voice-hint-chip").forEach((chip) => {
  chip.addEventListener("click", function () {
    const cmd = this.getAttribute("data-cmd");
    handleVoiceCommand(cmd);
  });
});

/* =====================================================
   VIEW ROUTE MODAL
===================================================== */

if (viewRouteBtn) {
  viewRouteBtn.addEventListener("click", () => {
    if (routeModal) routeModal.classList.remove("hidden");
  });
}

if (closeRouteModal) {
  closeRouteModal.addEventListener("click", () => {
    if (routeModal) routeModal.classList.add("hidden");
  });
}

if (openGoogleMapsBtn) {
  openGoogleMapsBtn.addEventListener("click", () => {
    const centre = stripCentreName?.textContent || "Bhagalpur Mandi";
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(centre)}`, "_blank");
  });
}

/* =====================================================
   CHANGE CENTRE MODAL
===================================================== */

function openCentreModal() {
  if (centreModal) centreModal.classList.remove("hidden");
}

if (changeCentreBtn) changeCentreBtn.addEventListener("click", openCentreModal);
if (noticeOtherCentresBtn) noticeOtherCentresBtn.addEventListener("click", openCentreModal);
if (closeCentreModal) closeCentreModal.addEventListener("click", () => centreModal.classList.add("hidden"));

document.querySelectorAll(".centre-option").forEach((opt) => {
  opt.addEventListener("click", function () {
    const newCentre = this.getAttribute("data-centre");
    localStorage.setItem("kisanSelectedCentre", newCentre);

    document.querySelectorAll(".centre-option").forEach((o) => o.classList.remove("active"));
    this.classList.add("active");

    centreModal.classList.add("hidden");
    loadAllDashboardData();
  });
});

/* =====================================================
   FARMER PROFILE MODAL
===================================================== */

if (sidebarFarmerCard) {
  sidebarFarmerCard.addEventListener("click", () => {
    updateGreeting();
    if (profileModal) profileModal.classList.remove("hidden");
  });
}

if (closeProfileModal) {
  closeProfileModal.addEventListener("click", () => {
    if (profileModal) profileModal.classList.add("hidden");
  });
}

/* =====================================================
   QUICK ACTION BUTTONS
===================================================== */

if (qaCallCentre) {
  qaCallCentre.addEventListener("click", () => {
    showActionModal("Call Centre", `
      <p>Direct Mandi Support Desk: <a href="tel:18001801551" style="color:#079447; font-weight:700;">1800-180-1551</a> (Toll Free)</p>
      <p>Centre A Duty Officer: <a href="tel:+919876543210" style="color:#079447; font-weight:700;">+91 98765 43210</a></p>
      <p style="margin-top:10px; font-size:12px; color:#64748b;">Available from 06:00 AM to 10:00 PM daily for gate, weighing, and token support.</p>
    `);
  });
}

if (qaMessageCentre) {
  qaMessageCentre.addEventListener("click", () => {
    showActionModal("Message Centre", `
      <p>Send an SMS or WhatsApp inquiry regarding your produce batch or gate clearance.</p>
      <textarea style="width:100%; height:70px; border-radius:8px; border:1px solid #cbd5e1; padding:8px; margin:10px 0; font-family:inherit;" placeholder="Type your query for Mandi Officer..."></textarea>
      <button class="primary-green-btn" onclick="alert('Message sent to Mandi Support Desk!'); actionModal.classList.add('hidden');">Send Query</button>
    `);
  });
}

if (qaOtherFarmers) {
  qaOtherFarmers.addEventListener("click", () => {
    showActionModal("Other Farmers Community", `
      <p>Connect with other farmers currently queued at <strong>${stripCentreName?.textContent || "Centre A"}</strong>.</p>
      <div style="background:#f8fafc; padding:12px; border-radius:8px; margin-top:10px;">
        <p style="margin:0; font-weight:600;">🌾 Wheat unloading running smoothly at Weighbridge 2.</p>
        <small style="color:#94a3b8;">Shared by Suraj Singh (10 mins ago)</small>
      </div>
    `);
  });
}

if (qaLearnMore) {
  qaLearnMore.addEventListener("click", () => {
    showActionModal("Procurement Guide & Standards", `
      <h4>Mandatory Mandi Requirements:</h4>
      <ul style="margin:10px 0 10px 20px; font-size:13px; color:#334155;">
        <li>Produce moisture below 12% for Wheat & Maize.</li>
        <li>Carry original Aadhaar and bank passbook photocopy.</li>
        <li>Present token QR code or SMS at security gate.</li>
        <li>Payments processed electronically through PFMS portal.</li>
      </ul>
    `);
  });
}

function showActionModal(title, contentHtml) {
  if (actionModalTitle) actionModalTitle.textContent = title;
  if (actionModalBody) actionModalBody.innerHTML = contentHtml;
  if (actionModal) actionModal.classList.remove("hidden");
}

if (closeActionModal) {
  closeActionModal.addEventListener("click", () => actionModal.classList.add("hidden"));
}

/* =====================================================
   VIEW FULL PROCESS & FULL QUEUE LINKS
===================================================== */

if (viewFullProcessBtn) {
  viewFullProcessBtn.addEventListener("click", () => showPage("procurement"));
}

if (viewFullQueueBtn) {
  viewFullQueueBtn.addEventListener("click", () => showPage("queue"));
}

if (headerNotifBtn) {
  headerNotifBtn.addEventListener("click", () => showPage("notifications"));
}

/* =====================================================
   BOOKING VIEW INITIALIZATION & SUBMIT
===================================================== */

function initBookingForm() {
  const dateInput = document.getElementById("bookingDateInput");
  if (dateInput && !dateInput.value) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }
}

// Crop Chips Click
document.querySelectorAll(".crop-chip").forEach((chip) => {
  chip.addEventListener("click", function () {
    document.querySelectorAll(".crop-chip").forEach((c) => c.classList.remove("selected"));
    this.classList.add("selected");
    const crop = this.getAttribute("data-crop");
    const hiddenCrop = document.getElementById("bookingCropSelect");
    if (hiddenCrop) hiddenCrop.value = crop;
  });
});

// Time Slot Buttons Click
document.querySelectorAll(".time-slot-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".time-slot-btn").forEach((b) => b.classList.remove("selected"));
    this.classList.add("selected");
  });
});

// Confirm Slot Button
const confirmSlotBtn = document.getElementById("confirmSlotBtn");
if (confirmSlotBtn) {
  confirmSlotBtn.addEventListener("click", async function () {
    const centre = document.getElementById("bookingCentreSelect")?.value || "Centre A, Bhagalpur";
    const crop = document.getElementById("bookingCropSelect")?.value || "Wheat";
    const quantity = document.getElementById("bookingQuantityInput")?.value || "50";
    const selectedDate = document.getElementById("bookingDateInput")?.value;
    const selectedSlotBtn = document.querySelector(".time-slot-btn.selected");
    const slotText = selectedSlotBtn ? selectedSlotBtn.textContent.trim() : "10:00 - 11:00 AM";

    if (!selectedDate) {
      alert("Please select a procurement date.");
      return;
    }
    if (Number(quantity) <= 0) {
      alert("Please enter a valid produce quantity in kg.");
      return;
    }

    confirmSlotBtn.disabled = true;
    confirmSlotBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Confirming...`;

    const farmerId = localStorage.getItem("farmerId") || "F1001";
    const payload = {
      farmerId,
      centreId: centre,
      crop,
      quantity: Number(quantity),
      date: selectedDate,
      slot: slotText,
    };

    const res = await apiCall("/bookings", "POST", payload);

    confirmSlotBtn.disabled = false;
    confirmSlotBtn.innerHTML = `<i class="fa-solid fa-calendar-check"></i> <span>Confirm Slot & Generate Token</span>`;

    let token = "A-018";
    let bookingId = `KQ-${Date.now().toString().slice(-8)}`;

    if (res && res.success && res.data) {
      token = res.data.token || token;
      bookingId = res.data.bookingId || bookingId;
      localStorage.setItem("kisanCurrentBookingId", bookingId);
    }

    const bookingRecord = {
      bookingId,
      token,
      farmerName: localStorage.getItem("farmerName") || "Farmer",
      centre,
      crop,
      quantity: `${quantity} kg`,
      date: selectedDate,
      time: slotText,
      queueAhead: res?.data?.position ? res.data.position - 1 : 6,
      estimatedWait: res?.data?.position ? `${(res.data.position - 1) * 7} mins` : "42 mins",
    };

    localStorage.setItem("kisanBooking", JSON.stringify(bookingRecord));
    localStorage.setItem("kisanSelectedCentre", centre);

    // Update Confirmation Slip
    const confToken = document.getElementById("confirmationToken");
    const confId = document.getElementById("confirmationBookingId");
    const confCentre = document.getElementById("confirmationCentre");
    const confCrop = document.getElementById("confirmationCrop");
    const confQty = document.getElementById("confirmationQuantity");
    const confDate = document.getElementById("confirmationDate");
    const confTime = document.getElementById("confirmationTime");

    if (confToken) confToken.textContent = token;
    if (confId) confId.textContent = bookingId;
    if (confCentre) confCentre.textContent = centre;
    if (confCrop) confCrop.textContent = crop;
    if (confQty) confQty.textContent = `${quantity} kg`;
    if (confDate) confDate.textContent = selectedDate;
    if (confTime) confTime.textContent = slotText;

    showPage("confirmation");
  });
}

const confDashBtn = document.getElementById("confirmationDashboardBtn");
if (confDashBtn) confDashBtn.addEventListener("click", () => showPage("dashboard"));

const confTurnBtn = document.getElementById("confirmationTurnBtn");
if (confTurnBtn) confTurnBtn.addEventListener("click", () => showPage("queue"));

/* =====================================================
   MY TURN VIEW DATA
===================================================== */

async function loadQueueViewData() {
  const farmerId = localStorage.getItem("farmerId") || "F1001";
  const selectedCentre = localStorage.getItem("kisanSelectedCentre") || "Centre A, Bhagalpur";

  const queueRes = await apiCall(`/queue/farmer/${farmerId}`);
  let token = "A-018";
  let ahead = 6;
  let wait = 42;

  if (queueRes && queueRes.success && queueRes.data) {
    token = queueRes.data.token || token;
    ahead = typeof queueRes.data.farmersAhead === "number" ? queueRes.data.farmersAhead : ahead;
    wait = ahead * 7;
  }

  const qBigToken = document.getElementById("queueBigToken");
  const qAheadText = document.getElementById("queueAheadText");
  const qAheadCount = document.getElementById("queueAheadCount");
  const qEstWait = document.getElementById("queueEstimatedWait");
  const qProgress = document.getElementById("queueProgressBar");
  const qNowServing = document.getElementById("queueNowServing");
  const rosterUser = document.getElementById("rosterUserName");

  if (qBigToken) qBigToken.textContent = token;
  if (qAheadText) qAheadText.textContent = `${ahead} farmers are ahead of you.`;
  if (qAheadCount) qAheadCount.textContent = ahead;
  if (qEstWait) qEstWait.textContent = ahead === 0 ? "Now" : `${wait} mins`;

  if (qProgress) {
    const pct = Math.max(10, Math.min(100, 100 - ahead * 12));
    qProgress.style.width = `${pct}%`;
  }

  const centreRes = await apiCall(`/queue/${encodeURIComponent(selectedCentre)}`);
  if (centreRes && centreRes.success && centreRes.data && centreRes.data.nowServing) {
    if (qNowServing) qNowServing.textContent = centreRes.data.nowServing;
  }

  const name = localStorage.getItem("farmerName") || "Ramesh Kumar";
  if (rosterUser) rosterUser.textContent = `${name} (You)`;
}

const refreshQueueBtn = document.getElementById("refreshQueueBtn");
if (refreshQueueBtn) {
  refreshQueueBtn.addEventListener("click", function () {
    refreshQueueBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate fa-spin"></i> Refreshing...`;
    loadQueueViewData().then(() => {
      setTimeout(() => {
        refreshQueueBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> Refresh`;
      }, 500);
    });
  });
}

/* =====================================================
   MY PRODUCE VIEW DATA
===================================================== */

async function loadProduceViewData() {
  const bookingId = localStorage.getItem("kisanCurrentBookingId");
  const cropEl = document.getElementById("produceCropName");
  const qtyEl = document.getElementById("produceQuantity");
  const centreEl = document.getElementById("produceCentre");
  const valEl = document.getElementById("produceValuation");

  let crop = "Wheat (Kalyan Sona)";
  let qty = 50;
  let centre = localStorage.getItem("kisanSelectedCentre") || "Centre A, Bhagalpur";

  if (bookingId) {
    const res = await apiCall(`/bookings/${bookingId}`);
    if (res && res.success && res.data) {
      crop = res.data.crop || crop;
      qty = res.data.quantity || qty;
      centre = res.data.centreId || centre;
    }
  }

  if (cropEl) cropEl.textContent = crop;
  if (qtyEl) qtyEl.textContent = `${qty} kg`;
  if (centreEl) centreEl.textContent = centre;
  const valuation = Math.round(qty * 22.75);
  if (valEl) valEl.textContent = `₹${valuation.toLocaleString("en-IN")}`;
}

/* =====================================================
   PROCUREMENT STATUS (7-STAGE STEPPER)
===================================================== */

const PROCUREMENT_STAGES = [
  "BOOKED",
  "CHECKED_IN",
  "WAITING",
  "PROCESSING",
  "QUALITY_CHECK",
  "WEIGHING",
  "COMPLETED",
];

async function loadProcurementViewData() {
  const bookingId = localStorage.getItem("kisanCurrentBookingId");
  let currentStage = "QUALITY_CHECK";

  if (bookingId) {
    const res = await apiCall(`/procurement/${bookingId}`);
    if (res && res.success && res.data) {
      currentStage = res.data.procurementStatus || currentStage;
    }
  }

  updateProcurementStepperUI(currentStage);
}

function updateProcurementStepperUI(stage) {
  const badge = document.getElementById("procurementStatusBadge");
  const heading = document.getElementById("procurementStageText");
  const desc = document.getElementById("procurementStageDesc");

  if (badge) badge.textContent = stage;

  const stageDescriptions = {
    BOOKED: {
      title: "Slot Booked Successfully",
      desc: "Your procurement slot is confirmed in the centralized database. Arrive on time.",
    },
    CHECKED_IN: {
      title: "Security Gate Entry Verified",
      desc: "Farmer entry logged at mandi gate. Aadhaar and vehicle verification completed.",
    },
    WAITING: {
      title: "Positioned in Inspection Queue",
      desc: "Produce vehicle is lined up in inspection bay. Awaiting quality lab technician.",
    },
    PROCESSING: {
      title: "Produce Inspection in Progress",
      desc: "Quality inspection samples collected for grain analysis and moisture test.",
    },
    QUALITY_CHECK: {
      title: "Quality Check Underway",
      desc: "Moisture content and Fair Average Quality (FAQ) grading being measured.",
    },
    WEIGHING: {
      title: "Electronic Weighbridge Weighing",
      desc: "Gross and tare weight measured digitally. Official weighment slip generated.",
    },
    COMPLETED: {
      title: "Procurement Successfully Completed",
      desc: "Produce accepted into Central Pool stock. Direct Benefit Transfer initiated.",
    },
  };

  if (heading && stageDescriptions[stage]) heading.textContent = stageDescriptions[stage].title;
  if (desc && stageDescriptions[stage]) desc.textContent = stageDescriptions[stage].desc;

  // Update Stepper Nodes
  const stageIdx = PROCUREMENT_STAGES.indexOf(stage);
  document.querySelectorAll(".lifecycle-stepper .step-node").forEach((node, idx) => {
    if (idx <= stageIdx) {
      node.classList.add("active");
    } else {
      node.classList.remove("active");
    }
  });
}

const advanceStatusBtn = document.getElementById("advanceStatusBtn");
if (advanceStatusBtn) {
  advanceStatusBtn.addEventListener("click", async function () {
    const bookingId = localStorage.getItem("kisanCurrentBookingId");
    if (!bookingId) {
      alert("No active booking found. Please book a slot first.");
      return;
    }

    advanceStatusBtn.disabled = true;
    advanceStatusBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Advancing...`;

    // Fetch current stage
    const currRes = await apiCall(`/procurement/${bookingId}`);
    let currStage = currRes?.data?.procurementStatus || "BOOKED";
    let currIdx = PROCUREMENT_STAGES.indexOf(currStage);
    let nextIdx = (currIdx + 1) % PROCUREMENT_STAGES.length;
    let nextStage = PROCUREMENT_STAGES[nextIdx];

    const updateRes = await apiCall(`/procurement/${bookingId}/status`, "PUT", { status: nextStage });

    advanceStatusBtn.disabled = false;
    advanceStatusBtn.innerHTML = `<i class="fa-solid fa-forward-step"></i> <span>Advance Stage (Demo Simulation)</span>`;

    if (updateRes && updateRes.success) {
      updateProcurementStepperUI(nextStage);
    } else {
      alert("Status updated.");
      updateProcurementStepperUI(nextStage);
    }
  });
}

const refreshStatusBtn = document.getElementById("refreshStatusBtn");
if (refreshStatusBtn) {
  refreshStatusBtn.addEventListener("click", loadProcurementViewData);
}

/* =====================================================
   PAYMENTS VIEW DATA & DBT CLAIM
===================================================== */

async function loadPaymentsViewData() {
  const bookingId = localStorage.getItem("kisanCurrentBookingId");
  const amtDisplay = document.getElementById("paymentAmountDisplay");
  const badge = document.getElementById("paymentStatusBadge");
  const desc = document.getElementById("paymentStatusDesc");
  const qtyDisplay = document.getElementById("paymentQuantityDisplay");
  const txnDisplay = document.getElementById("paymentTxnDisplay");
  const bankName = document.getElementById("bankFarmerName");

  const farmerName = localStorage.getItem("farmerName") || "Ramesh Kumar";
  if (bankName) bankName.textContent = farmerName;

  let qty = 50;
  let status = "PENDING";
  let amount = 1138;
  let txnId = "Pending";

  if (bookingId) {
    const bookRes = await apiCall(`/bookings/${bookingId}`);
    if (bookRes && bookRes.success && bookRes.data) {
      qty = bookRes.data.quantity || 50;
      amount = Math.round(qty * 22.75);
    }

    const procRes = await apiCall(`/procurement/${bookingId}`);
    if (procRes && procRes.success && procRes.data) {
      status = procRes.data.paymentStatus || status;
      if (procRes.data.amount > 0) amount = procRes.data.amount;
    }
  }

  if (qtyDisplay) qtyDisplay.textContent = `${qty} kg`;
  if (amtDisplay) amtDisplay.textContent = `₹${amount.toLocaleString("en-IN")}`;
  if (badge) badge.textContent = status;

  if (status === "CREDITED") {
    if (desc) desc.textContent = "Funds transferred successfully via DBT into your State Bank of India account.";
    if (txnDisplay) txnDisplay.textContent = `TXN-${Date.now().toString().slice(-8)}`;
  } else if (status === "INITIATED") {
    if (desc) desc.textContent = "Electronic payment initiated with Public Financial Management System (PFMS).";
    if (txnDisplay) txnDisplay.textContent = "Processing...";
  } else {
    if (desc) desc.textContent = "Funds will be credited via PFMS directly to your linked bank account after weighing.";
    if (txnDisplay) txnDisplay.textContent = "Pending";
  }
}

const processPaymentBtn = document.getElementById("processPaymentBtn");
if (processPaymentBtn) {
  processPaymentBtn.addEventListener("click", async function () {
    const bookingId = localStorage.getItem("kisanCurrentBookingId");
    if (!bookingId) {
      alert("No active booking found. Please book a slot first.");
      return;
    }

    const amtText = document.getElementById("paymentAmountDisplay")?.textContent || "1138";
    const amount = parseInt(amtText.replace(/\D/g, ""), 10) || 1138;

    processPaymentBtn.disabled = true;
    processPaymentBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing DBT...`;

    const res = await apiCall("/procurement/payment", "POST", { bookingId, amount });

    processPaymentBtn.disabled = false;
    processPaymentBtn.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i> <span>Process / Claim DBT Payment</span>`;

    if (res && res.success) {
      loadPaymentsViewData();
      alert("Payment initiated! Backend will simulate direct credit in 2 seconds.");

      setTimeout(() => {
        loadPaymentsViewData();
      }, 2500);
    }
  });
}

/* =====================================================
   NOTIFICATIONS VIEW DATA
===================================================== */

function loadNotificationsViewData() {
  const list = document.getElementById("fullNotifList");
  if (!list) return;

  const token = dashToken?.textContent || "A-018";
  const centre = stripCentreName?.textContent || "Centre A, Bhagalpur";

  list.innerHTML = `
    <div class="stream-item">
      <div class="stream-icon yellow"><i class="fa-solid fa-bell"></i></div>
      <div class="stream-body">
        <strong class="stream-title">Your turn is approaching (${token})</strong>
        <span class="stream-desc">Only 5 farmers remain ahead of you at ${centre}.</span>
      </div>
      <span class="stream-time">2 mins ago</span>
    </div>
    <div class="stream-item">
      <div class="stream-icon blue"><i class="fa-solid fa-calendar-check"></i></div>
      <div class="stream-body">
        <strong class="stream-title">Procurement Slot Confirmed</strong>
        <span class="stream-desc">Designated bay: Weighbridge 2 at ${centre}.</span>
      </div>
      <span class="stream-time">15 mins ago</span>
    </div>
    <div class="stream-item">
      <div class="stream-icon gold"><i class="fa-solid fa-indian-rupee-sign"></i></div>
      <div class="stream-body">
        <strong class="stream-title">Government MSP Advisory</strong>
        <span class="stream-desc">Wheat MSP rate fixed at ₹2,275 per quintal. 100% electronic clearance active.</span>
      </div>
      <span class="stream-time">1 day ago</span>
    </div>
  `;
}

// Notification filters
document.querySelectorAll(".filter-pill").forEach((pill) => {
  pill.addEventListener("click", function () {
    document.querySelectorAll(".filter-pill").forEach((p) => p.classList.remove("active"));
    this.classList.add("active");
  });
});

/* =====================================================
   HELPER: LOAD LOCAL SAVED BOOKING
===================================================== */

function loadSavedBooking() {
  const s = localStorage.getItem("kisanBooking");
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch (e) {
    return null;
  }
}

/* =====================================================
   INITIALIZATION ON PAGE LOAD
===================================================== */

const isUserLoggedIn = localStorage.getItem("kisanLoggedIn");
const savedFarmerName = localStorage.getItem("farmerName");

setLanguage(getLanguage());

if (isUserLoggedIn === "true" && savedFarmerName) {
  showDashboard();
}
