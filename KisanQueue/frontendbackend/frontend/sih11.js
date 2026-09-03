/* =====================================================
   KISANQUEUE - SIH11 JAVASCRIPT
   Connected with Express / MongoDB Backend
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
      console.warn(`[API ${method} ${endpoint}] returned error status ${response.status}:`, result);
    }

    return result;
  } catch (err) {
    console.error(`[API Network Error] Failed to reach backend at ${API_BASE_URL}${endpoint}:`, err);
    return { success: false, message: "Could not connect to backend server. Make sure Backend is running on port 5000." };
  }
}

/* =====================================================
   ELEMENTS
===================================================== */

const loginPage = document.getElementById("loginPage");
const dashboardPage = document.getElementById("dashboardPage");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const farmerNameInput = document.getElementById("farmerName");
const aadhaarInput = document.getElementById("aadhaar");
const mobileInput = document.getElementById("mobile");

const loginLanguage = document.getElementById("loginLanguage");
const dashboardLanguage = document.getElementById("dashboardLanguage");
const topLanguage = document.getElementById("topLanguage");

const sidebarFarmerName = document.getElementById("sidebarFarmerName");
const headerFarmerName = document.getElementById("headerFarmerName");
const welcomeName = document.getElementById("welcomeName");

const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.getElementById("sidebar");

const dashboardContent = document.getElementById("dashboardContent");
const bookContent = document.getElementById("bookContent");
const queueContent = document.getElementById("queueContent");
const confirmationContent = document.getElementById("confirmationContent");
const produceContent = document.getElementById("produceContent");
const procurementContent = document.getElementById("procurementContent");
const paymentsContent = document.getElementById("paymentsContent");
const notificationsContent = document.getElementById("notificationsContent");

const confirmationToken = document.getElementById("confirmationToken");
const confirmationBookingId = document.getElementById("confirmationBookingId");
const confirmationCentre = document.getElementById("confirmationCentre");
const confirmationCrop = document.getElementById("confirmationCrop");
const confirmationQuantity = document.getElementById("confirmationQuantity");
const confirmationDate = document.getElementById("confirmationDate");
const confirmationTime = document.getElementById("confirmationTime");

const confirmationDashboardBtn = document.getElementById("confirmationDashboardBtn");
const confirmationTurnBtn = document.getElementById("confirmationTurnBtn");
const newSlotBtn = document.getElementById("newSlotBtn");
const backDashboard = document.getElementById("backDashboard");
const pageTitle = document.getElementById("pageTitle");

/* =====================================================
   TRANSLATIONS
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
    bookNew: "Book New Slot",
    login: "Login",
    logout: "Logout",
    farmer: "Farmer Name",
    aadhaar: "Aadhaar Number",
    mobile: "Mobile Number",
    otp: "OTP",
    sendOtp: "Send OTP",
  },
  Hindi: {
    dashboard: "डैशबोर्ड",
    book: "स्लॉट / टोकन बुक करें",
    queue: "मेरी बारी",
    produce: "मेरी उपज",
    procurement: "खरीद की स्थिति",
    payments: "भुगतान",
    notifications: "सूचनाएं",
    bookNew: "नया स्लॉट बुक करें",
    login: "लॉगिन",
    logout: "लॉगआउट",
    farmer: "किसान का नाम",
    aadhaar: "आधार नंबर",
    mobile: "मोबाइल नंबर",
    otp: "ओटीपी",
    sendOtp: "ओटीपी भेजें",
  },
  Bengali: {
    dashboard: "ড্যাশবোর্ড",
    book: "স্লট / টোকেন বুক করুন",
    queue: "আমার পালা",
    produce: "আমার ফসল",
    procurement: "সংগ্রহের অবস্থা",
    payments: "অর্থপ্রদান",
    notifications: "বিজ্ঞপ্তি",
    bookNew: "নতুন স্লট বুক করুন",
    login: "লগইন",
    logout: "লগআউট",
    farmer: "কৃষকের নাম",
    aadhaar: "আধার নম্বর",
    mobile: "মোবাইল নম্বর",
    otp: "ওটিপি",
    sendOtp: "ওটিপি পাঠান",
  },
  Marathi: {
    dashboard: "डॅशबोर्ड",
    book: "स्लॉट / टोकन बुक करा",
    queue: "माझी पाळी",
    produce: "माझे उत्पादन",
    procurement: "खरेदी स्थिती",
    payments: "पेमेंट्स",
    notifications: "सूचना",
    bookNew: "नवीन स्लॉट बुक करा",
    login: "लॉगिन",
    logout: "लॉगआउट",
    farmer: "शेतकऱ्याचे नाव",
    aadhaar: "आधार क्रमांक",
    mobile: "मोबाईल क्रमांक",
    otp: "ओटीपी",
    sendOtp: "ओटीपी पाठवा",
  },
  Telugu: {
    dashboard: "డాష్‌బోర్డ్",
    book: "స్లాట్ / టోకెన్ బుక్ చేయండి",
    queue: "నా వంతు",
    produce: "నా పంట",
    procurement: "సేకరణ స్థితి",
    payments: "చెల్లింపులు",
    notifications: "నోటిఫికేషన్లు",
    bookNew: "కొత్త స్లాట్ బుక్ చేయండి",
    login: "లాగిన్",
    logout: "లాగ్ అవుట్",
    farmer: "రైతు పేరు",
    aadhaar: "ఆధార్ నంబర్",
    mobile: "మొబైల్ నంబర్",
    otp: "ఓటీపీ",
    sendOtp: "ఓటీపీ పంపండి",
  },
  Tamil: {
    dashboard: "டாஷ்போர்டு",
    book: "ஸ்லாட் / டோக்கன் பதிவு",
    queue: "என் முறை",
    produce: "என் விளைபொருள்",
    procurement: "கொள்முதல் நிலை",
    payments: "கொடுப்பனவுகள்",
    notifications: "அறிவிப்புகள்",
    bookNew: "புதிய ஸ்லாட் பதிவு",
    login: "உள்நுழை",
    logout: "வெளியேறு",
    farmer: "விவசாயி பெயர்",
    aadhaar: "ஆதார் எண்",
    mobile: "மொபைல் எண்",
    otp: "OTP",
    sendOtp: "OTP அனுப்பு",
  },
  Gujarati: {
    dashboard: "ડેશબોર્ડ",
    book: "સ્લોટ / ટોકન બુક કરો",
    queue: "મારો વારો",
    produce: "મારું ઉત્પાદન",
    procurement: "ખરીદી સ્થિતિ",
    payments: "ચુકવણીઓ",
    notifications: "સૂચનાઓ",
    bookNew: "નવો સ્લોટ બુક કરો",
    login: "લોગિન",
    logout: "લોગઆઉટ",
    farmer: "ખેડૂતનું નામ",
    aadhaar: "આધાર નંબર",
    mobile: "મોબાઇલ નંબર",
    otp: "ઓટીપી",
    sendOtp: "ઓટીપી મોકલો",
  },
  Kannada: {
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    book: "ಸ್ಲಾಟ್ / ಟೋಕನ್ ಬುಕ್ ಮಾಡಿ",
    queue: "ನನ್ನ ಸರದಿ",
    produce: "ನನ್ನ ಬೆಳೆ",
    procurement: "ಖರೀದಿ ಸ್ಥಿತಿ",
    payments: "ಪಾವತಿಗಳು",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    bookNew: "ಹೊಸ ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ",
    login: "ಲಾಗಿನ್",
    logout: "ಲಾಗ್‌ಔಟ್",
    farmer: "ರೈತರ ಹೆಸರು",
    aadhaar: "ಆಧಾರ್ ಸಂಖ್ಯೆ",
    mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    otp: "ಒಟಿಪಿ",
    sendOtp: "ಒಟಿಪಿ ಕಳುಹಿಸಿ",
  },
  Malayalam: {
    dashboard: "ഡാഷ്ബോർഡ്",
    book: "സ്ലോട്ട് / ടോക്കൺ ബുക്ക് ചെയ്യുക",
    queue: "എന്റെ ഊഴം",
    produce: "എന്റെ വിളവ്",
    procurement: "സംഭരണ ​​സ്ഥിതി",
    payments: "പേയ്‌മെന്റുകൾ",
    notifications: "അറിയിപ്പുകൾ",
    bookNew: "പുതിയ സ്ലോട്ട് ബുക്ക് ചെയ്യുക",
    login: "ലോഗിൻ",
    logout: "ലോഗൗട്ട്",
    farmer: "കർഷകന്റെ പേര്",
    aadhaar: "ആധാർ നമ്പർ",
    mobile: "മൊബൈൽ നമ്പർ",
    otp: "ഒടിപി",
    sendOtp: "ഒടിപി അയയ്ക്കുക",
  },
  Punjabi: {
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    book: "ਸਲਾਟ / ਟੋਕਨ ਬੁੱਕ ਕਰੋ",
    queue: "ਮੇਰੀ ਵਾਰੀ",
    produce: "ਮੇਰੀ ਉਪਜ",
    procurement: "ਖਰੀਦ ਸਥਿਤੀ",
    payments: "ਭੁਗਤਾਨ",
    notifications: "ਸੂਚਨਾਵਾਂ",
    bookNew: "ਨਵਾਂ ਸਲਾਟ ਬੁੱਕ ਕਰੋ",
    login: "ਲੌਗਇਨ",
    logout: "ਲੌਗਆਉਟ",
    farmer: "ਕਿਸਾਨ ਦਾ ਨਾਮ",
    aadhaar: "ਆਧਾਰ ਨੰਬਰ",
    mobile: "ਮੋਬਾਈਲ ਨੰਬਰ",
    otp: "ਓਟੀਪੀ",
    sendOtp: "ਓਟੀਪੀ ਭੇਜੋ",
  },
  Odia: {
    dashboard: "ଡ୍ୟାସବୋର୍ଡ",
    book: "ସ୍ଲଟ୍ / ଟୋକନ୍ ବୁକ୍ କରନ୍ତୁ",
    queue: "ମୋ ପାଳି",
    produce: "ମୋ ଉତ୍ପାଦନ",
    procurement: "ସଂଗ୍ରହ ସ୍ଥିତି",
    payments: "ଦେୟ",
    notifications: "ବିଜ୍ଞପ୍ତି",
    bookNew: "ନୂଆ ସ୍ଲଟ୍ ବୁକ୍ କରନ୍ତୁ",
    login: "ଲଗଇନ୍",
    logout: "ଲଗଆଉଟ୍",
    farmer: "ଚାଷୀଙ୍କ ନାମ",
    aadhaar: "ଆଧାର ନମ୍ବର",
    mobile: "ମୋବାଇଲ୍ ନମ୍ବର",
    otp: "ଓଟିପି",
    sendOtp: "ଓଟିପି ପଠାନ୍ତୁ",
  },
  Assamese: {
    dashboard: "ড্যাশব’ৰ্ড",
    book: "স্লট / টোকেন বুক কৰক",
    queue: "মোৰ পালি",
    produce: "মোৰ শস্য",
    procurement: "ক্ৰয়ৰ অৱস্থা",
    payments: "পৰিশোধ",
    notifications: "জাননী",
    bookNew: "নতুন স্লট বুক কৰক",
    login: "লগইন",
    logout: "লগআউট",
    farmer: "কৃষকৰ নাম",
    aadhaar: "আধাৰ নম্বৰ",
    mobile: "মোবাইল নম্বৰ",
    otp: "অ’টিপি",
    sendOtp: "অ’টিপি পঠিয়াওক",
  },
};

/* =====================================================
   GET CURRENT LANGUAGE
===================================================== */

function getLanguage() {
  return localStorage.getItem("kisanLanguage") || "English";
}

/* =====================================================
   SET LANGUAGE
===================================================== */

function setLanguage(language) {
  if (!translations[language]) {
    language = "English";
  }

  localStorage.setItem("kisanLanguage", language);

  /* Synchronize all dropdowns */
  if (loginLanguage) loginLanguage.value = language;
  if (dashboardLanguage) dashboardLanguage.value = language;
  if (topLanguage) topLanguage.value = language;

  const t = translations[language];

  /* Login heading */
  const loginHeading = document.querySelector(".login-heading h2");
  if (loginHeading) {
    const loginTexts = {
      English: "Welcome Back",
      Hindi: "वापसी पर स्वागत है",
      Bengali: "স্বাগতম",
      Marathi: "पुन्हा स्वागत आहे",
      Telugu: "స్వాగతం",
      Tamil: "மீண்டும் வரவேற்கிறோம்",
      Gujarati: "સ્વાગત છે",
      Kannada: "ಮತ್ತೆ ಸ್ವಾಗತ",
      Malayalam: "വീണ്ടും സ്വാഗതം",
      Punjabi: "ਜੀ ਆਇਆਂ ਨੂੰ",
      Odia: "ସ୍ୱାଗତ",
      Assamese: "স্বাগতম",
    };
    loginHeading.textContent = loginTexts[language] || "Welcome Back";
  }

  /* Farmer labels */
  const labels = document.querySelectorAll(".form-group label");
  if (labels[0]) labels[0].textContent = t.farmer;
  if (labels[1]) labels[1].textContent = t.aadhaar;
  if (labels[2]) labels[2].textContent = t.mobile;

  /* OTP */
  const otpLabel = document.querySelector(".otp-heading label");
  if (otpLabel) otpLabel.textContent = t.otp;

  /* Send OTP */
  const sendOtpBtn = document.getElementById("sendOtpBtn");
  if (sendOtpBtn) {
    sendOtpBtn.innerHTML = `<i class="fa-regular fa-paper-plane"></i> ${t.sendOtp}`;
  }

  /* Login */
  if (loginBtn) {
    loginBtn.innerHTML = `<i class="fa-solid fa-lock"></i> ${t.login}`;
  }

  /* Logout */
  if (logoutBtn) {
    logoutBtn.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> ${t.logout}`;
  }

  /* Book new slot */
  if (newSlotBtn) {
    newSlotBtn.innerHTML = `<i class="fa-regular fa-calendar"></i> ${t.bookNew}`;
  }

  updatePageTitle();
}

/* =====================================================
   PAGE TITLE
===================================================== */

function updatePageTitle() {
  const language = getLanguage();
  const t = translations[language];

  if (!dashboardContent.classList.contains("hidden")) {
    pageTitle.textContent = t.dashboard;
  } else if (!bookContent.classList.contains("hidden")) {
    pageTitle.textContent = t.book;
  } else if (!queueContent.classList.contains("hidden")) {
    pageTitle.textContent = t.queue;
  } else if (produceContent && !produceContent.classList.contains("hidden")) {
    pageTitle.textContent = t.produce || "My Produce";
  } else if (procurementContent && !procurementContent.classList.contains("hidden")) {
    pageTitle.textContent = t.procurement || "Procurement Status";
  } else if (paymentsContent && !paymentsContent.classList.contains("hidden")) {
    pageTitle.textContent = t.payments || "Payments";
  } else if (notificationsContent && !notificationsContent.classList.contains("hidden")) {
    pageTitle.textContent = t.notifications || "Notifications";
  } else if (confirmationContent && !confirmationContent.classList.contains("hidden")) {
    pageTitle.textContent = "Booking Confirmed";
  }
}

/* =====================================================
   INITIAL LANGUAGE
===================================================== */

setLanguage(getLanguage());

/* =====================================================
   LANGUAGE CHANGE
===================================================== */

if (loginLanguage) {
  loginLanguage.addEventListener("change", function () {
    setLanguage(this.value);
  });
}

if (dashboardLanguage) {
  dashboardLanguage.addEventListener("change", function () {
    setLanguage(this.value);
  });
}

if (topLanguage) {
  topLanguage.addEventListener("change", function () {
    setLanguage(this.value);
  });
}

/* =====================================================
   AADHAAR FORMAT
===================================================== */

if (aadhaarInput) {
  aadhaarInput.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, "").substring(0, 12);
    let formatted = value.match(/.{1,4}/g);
    this.value = formatted ? formatted.join(" ") : "";
  });
}

/* =====================================================
   MOBILE
===================================================== */

if (mobileInput) {
  mobileInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").substring(0, 10);
  });
}

/* =====================================================
   OTP
===================================================== */

const otpInputs = document.querySelectorAll(".otp-input");

otpInputs.forEach((input, index) => {
  input.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
    if (this.value && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Backspace" && !this.value && index > 0) {
      otpInputs[index - 1].focus();
    }
  });
});

/* =====================================================
   SEND OTP
===================================================== */

const sendOtpButton = document.getElementById("sendOtpBtn");

if (sendOtpButton) {
  sendOtpButton.addEventListener("click", function () {
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
   LOGIN - CONNECTED TO BACKEND
===================================================== */

if (loginBtn) {
  loginBtn.addEventListener("click", async function () {
    const name = farmerNameInput.value.trim();
    const aadhaar = aadhaarInput.value.replace(/\s/g, "");
    const mobile = mobileInput.value.trim();

    let otp = "";
    otpInputs.forEach((input) => {
      otp += input.value;
    });

    /* Validations */
    if (name === "") {
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

    if (otp.length !== 6) {
      alert("Please enter the 6-digit OTP.");
      otpInputs[0].focus();
      return;
    }

    /* Demo OTP verification */
    if (otp !== "123456") {
      alert("Invalid OTP.\n\nFor demo use: 123456");
      return;
    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Logging in...`;

    // Connect to backend farmer login/register endpoint
    const response = await apiCall("/farmers/login", "POST", {
      name,
      mobile,
      aadhaar,
    });

    loginBtn.disabled = false;
    loginBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Login`;

    if (response && response.success && response.data) {
      // Save farmer session
      localStorage.setItem("farmerId", response.data.farmerId || "F1001");
      localStorage.setItem("farmerName", response.data.name || name);
      localStorage.setItem("farmerMobile", response.data.mobile || mobile);
      localStorage.setItem("kisanLoggedIn", "true");

      addNotification("Login Successful", `Welcome back, ${response.data.name}! Your account is synced with MongoDB.`);
      showDashboard();
    } else {
      // Offline fallback
      console.warn("Backend login returned fallback. Proceeding with local session.");
      localStorage.setItem("farmerId", "F1001");
      localStorage.setItem("farmerName", name);
      localStorage.setItem("farmerMobile", mobile);
      localStorage.setItem("kisanLoggedIn", "true");
      showDashboard();
    }
  });
}

/* =====================================================
   SHOW DASHBOARD
===================================================== */

function showDashboard() {
  const savedName = localStorage.getItem("farmerName") || "Ramesh Kumar";

  loginPage.style.display = "none";
  dashboardPage.style.display = "block";

  welcomeName.textContent = savedName;
  sidebarFarmerName.textContent = savedName;
  headerFarmerName.textContent = savedName;

  showPage("dashboard");
  loadDashboardData();
}

/* =====================================================
   LOGOUT
===================================================== */

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("kisanLoggedIn");
    localStorage.removeItem("farmerId");
    localStorage.removeItem("farmerName");
    localStorage.removeItem("farmerMobile");

    dashboardPage.style.display = "none";
    loginPage.style.display = "flex";

    farmerNameInput.value = "";
    aadhaarInput.value = "";
    mobileInput.value = "";
    otpInputs.forEach((input) => {
      input.value = "";
    });
  });
}

/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(page) {
  const pages = [
    dashboardContent,
    bookContent,
    queueContent,
    confirmationContent,
    produceContent,
    procurementContent,
    paymentsContent,
    notificationsContent,
  ];

  pages.forEach((p) => {
    if (p) p.classList.add("hidden");
  });

  document.querySelectorAll(".nav-item").forEach((nav) => {
    nav.classList.remove("active");
    if (nav.getAttribute("data-page") === page) {
      nav.classList.add("active");
    }
  });

  if (page === "dashboard" && dashboardContent) {
    dashboardContent.classList.remove("hidden");
    loadDashboardData();
  } else if (page === "book" && bookContent) {
    bookContent.classList.remove("hidden");
  } else if (page === "queue" && queueContent) {
    queueContent.classList.remove("hidden");
    loadQueueData();
  } else if (page === "confirmation" && confirmationContent) {
    confirmationContent.classList.remove("hidden");
  } else if (page === "produce" && produceContent) {
    produceContent.classList.remove("hidden");
    loadProduceData();
  } else if (page === "procurement" && procurementContent) {
    procurementContent.classList.remove("hidden");
    loadProcurementData();
  } else if (page === "payments" && paymentsContent) {
    paymentsContent.classList.remove("hidden");
    loadPaymentsData();
  } else if (page === "notifications" && notificationsContent) {
    notificationsContent.classList.remove("hidden");
  }

  updatePageTitle();
  if (sidebar) sidebar.classList.remove("open");
}

/* Navigation Click Listeners */
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", function () {
    const page = this.getAttribute("data-page");
    if (page) {
      showPage(page);
    }
  });
});

/* Quick Actions Listeners */
document.querySelectorAll(".quick-action").forEach((item) => {
  item.addEventListener("click", function () {
    const page = this.getAttribute("data-page");
    if (page) {
      showPage(page);
    }
  });
});

/* Back to Dashboard buttons */
if (backDashboard) {
  backDashboard.addEventListener("click", () => showPage("dashboard"));
}

document.querySelectorAll(".back-dashboard-trigger").forEach((btn) => {
  btn.addEventListener("click", () => showPage("dashboard"));
});

/* Mobile Menu */
if (mobileMenu) {
  mobileMenu.addEventListener("click", function () {
    sidebar.classList.toggle("open");
  });
}

/* Book new slot button */
if (newSlotBtn) {
  newSlotBtn.addEventListener("click", function () {
    showPage("book");
  });
}

/* Time Slot Selection */
document.querySelectorAll(".time-slots button").forEach((button) => {
  button.addEventListener("click", function () {
    document.querySelectorAll(".time-slots button").forEach((btn) => {
      btn.classList.remove("selected");
    });
    this.classList.add("selected");
  });
});

/* =====================================================
   NOTIFICATION MANAGER
===================================================== */

function addNotification(title, message) {
  const list = document.getElementById("notificationsList");
  if (!list) return;

  const item = document.createElement("div");
  item.className = "update-item";
  item.innerHTML = `
    <i class="fa-solid fa-circle-check"></i>
    <div>
      <strong>${title}</strong>
      <span>${message}</span>
    </div>
  `;
  list.insertBefore(item, list.firstChild);
}

/* =====================================================
   LOAD DASHBOARD DATA - CONNECTED TO BACKEND
===================================================== */

async function loadDashboardData() {
  const farmerId = localStorage.getItem("farmerId") || "F1001";

  // Elements on Dashboard
  const dashToken = document.getElementById("dashToken");
  const dashAhead = document.getElementById("dashAhead");
  const dashWait = document.getElementById("dashWait");
  const dashProgress = document.getElementById("dashProgress");
  const dashSlotDate = document.getElementById("dashSlotDate");
  const dashSlotTime = document.getElementById("dashSlotTime");
  const dashSlotCentre = document.getElementById("dashSlotCentre");

  // Fetch queue status for this farmer from Backend
  const queueRes = await apiCall(`/queue/farmer/${farmerId}`);

  if (queueRes && queueRes.success && queueRes.data) {
    const data = queueRes.data;
    if (dashToken) dashToken.textContent = data.token;
    if (dashAhead) dashAhead.textContent = `${data.farmersAhead} farmers ahead of you`;

    const waitMins = data.farmersAhead > 0 ? `${data.farmersAhead * 7} mins` : "Your Turn Now!";
    if (dashWait) dashWait.textContent = waitMins;

    if (dashProgress) {
      const pct = Math.max(10, Math.min(100, 100 - data.farmersAhead * 15));
      dashProgress.style.width = `${pct}%`;
    }

    if (data.bookingId) {
      localStorage.setItem("kisanCurrentBookingId", data.bookingId);
      // Fetch booking details
      const bookingRes = await apiCall(`/bookings/${data.bookingId}`);
      if (bookingRes && bookingRes.success && bookingRes.data) {
        const b = bookingRes.data;
        if (dashSlotTime) dashSlotTime.textContent = b.slot || "10:00 - 11:00 AM";
        if (dashSlotCentre) dashSlotCentre.textContent = b.centreId || "Centre A, Bhagalpur";
        if (dashSlotDate && b.date) {
          const d = new Date(b.date);
          dashSlotDate.textContent = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
        }
      }
    }
  } else {
    // If no active booking from API, check localStorage backup or show idle state
    const saved = loadSavedBooking();
    if (saved) {
      if (dashToken) dashToken.textContent = saved.token;
      if (dashAhead) dashAhead.textContent = `${saved.queueAhead || 0} farmers ahead of you`;
      if (dashWait) dashWait.textContent = saved.estimatedWait || "--";
      if (dashSlotTime) dashSlotTime.textContent = saved.time || "10:00 - 11:00 AM";
      if (dashSlotCentre) dashSlotCentre.textContent = saved.centre || "Centre A, Bhagalpur";
    } else {
      if (dashToken) dashToken.textContent = "--";
      if (dashAhead) dashAhead.textContent = "No active queue token";
      if (dashWait) dashWait.textContent = "--";
      if (dashSlotTime) dashSlotTime.textContent = "No slot booked";
      if (dashSlotCentre) dashSlotCentre.textContent = "Book a slot to get started";
    }
  }
}

/* =====================================================
   LOAD QUEUE DATA - CONNECTED TO BACKEND
===================================================== */

async function loadQueueData() {
  const farmerId = localStorage.getItem("farmerId") || "F1001";
  const bookingId = localStorage.getItem("kisanCurrentBookingId");

  const queueBigToken = document.getElementById("queueBigToken");
  const queueAheadText = document.getElementById("queueAheadText");
  const queueAheadCount = document.getElementById("queueAheadCount");
  const queueEstimatedWait = document.getElementById("queueEstimatedWait");
  const queueNowServing = document.getElementById("queueNowServing");
  const queueProgressBar = document.getElementById("queueProgressBar");

  const queueRes = await apiCall(`/queue/farmer/${farmerId}`);

  if (queueRes && queueRes.success && queueRes.data) {
    const data = queueRes.data;
    if (queueBigToken) queueBigToken.textContent = data.token;
    if (queueAheadText) queueAheadText.textContent = `${data.farmersAhead} farmers are ahead of you.`;
    if (queueAheadCount) queueAheadCount.textContent = data.farmersAhead;

    const waitMins = data.farmersAhead > 0 ? `${data.farmersAhead * 7} mins` : "Your Turn!";
    if (queueEstimatedWait) queueEstimatedWait.textContent = waitMins;

    if (queueProgressBar) {
      const pct = Math.max(10, Math.min(100, 100 - data.farmersAhead * 15));
      queueProgressBar.style.width = `${pct}%`;
    }

    // Also fetch centre queue for Now Serving info
    const savedBooking = loadSavedBooking();
    const centreId = (savedBooking && savedBooking.centre) || "Centre A, Bhagalpur";
    const centreRes = await apiCall(`/queue/${encodeURIComponent(centreId)}`);

    if (centreRes && centreRes.success && centreRes.data && centreRes.data.nowServing) {
      if (queueNowServing) queueNowServing.textContent = centreRes.data.nowServing;
    } else {
      if (queueNowServing) queueNowServing.textContent = data.farmersAhead === 0 ? data.token : "A-001";
    }
  } else {
    const saved = loadSavedBooking();
    if (saved) {
      if (queueBigToken) queueBigToken.textContent = saved.token;
      if (queueAheadText) queueAheadText.textContent = `${saved.queueAhead || 0} farmers are ahead of you.`;
      if (queueAheadCount) queueAheadCount.textContent = saved.queueAhead || "0";
      if (queueEstimatedWait) queueEstimatedWait.textContent = saved.estimatedWait || "--";
      if (queueNowServing) queueNowServing.textContent = "A-001";
    } else {
      if (queueBigToken) queueBigToken.textContent = "--";
      if (queueAheadText) queueAheadText.textContent = "No active booking found. Please book a slot.";
      if (queueAheadCount) queueAheadCount.textContent = "0";
      if (queueEstimatedWait) queueEstimatedWait.textContent = "--";
      if (queueNowServing) queueNowServing.textContent = "--";
    }
  }
}

/* =====================================================
   LOAD PRODUCE DATA
===================================================== */

async function loadProduceData() {
  const cropEl = document.getElementById("produceCropName");
  const qtyEl = document.getElementById("produceQuantity");
  const centreEl = document.getElementById("produceCentre");
  const slotEl = document.getElementById("produceSlot");

  const bookingId = localStorage.getItem("kisanCurrentBookingId");
  if (bookingId) {
    const res = await apiCall(`/bookings/${bookingId}`);
    if (res && res.success && res.data) {
      const b = res.data;
      if (cropEl) cropEl.textContent = b.crop || "Wheat";
      if (qtyEl) qtyEl.textContent = `${b.quantity} kg`;
      if (centreEl) centreEl.textContent = b.centreId || "Centre A, Bhagalpur";
      if (slotEl) {
        const d = b.date ? new Date(b.date).toLocaleDateString("en-IN") : "Today";
        slotEl.textContent = `${d} (${b.slot || "10:00 - 11:00 AM"})`;
      }
      return;
    }
  }

  const saved = loadSavedBooking();
  if (saved) {
    if (cropEl) cropEl.textContent = saved.crop;
    if (qtyEl) qtyEl.textContent = saved.quantity;
    if (centreEl) centreEl.textContent = saved.centre;
    if (slotEl) slotEl.textContent = `${saved.date} (${saved.time})`;
  } else {
    if (cropEl) cropEl.textContent = "No produce registered";
    if (qtyEl) qtyEl.textContent = "--";
    if (centreEl) centreEl.textContent = "--";
    if (slotEl) slotEl.textContent = "--";
  }
}

/* =====================================================
   LOAD PROCUREMENT STATUS - CONNECTED TO BACKEND
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

const STAGE_DESCRIPTIONS = {
  BOOKED: { text: "Slot Booked", desc: "Your procurement slot is confirmed. Reach the centre on time." },
  CHECKED_IN: { text: "Checked-in at Centre", desc: "Farmer security entry and Aadhaar identity verified." },
  WAITING: { text: "Waiting in Queue", desc: "Your produce vehicle is positioned in the inspection bay." },
  PROCESSING: { text: "Processing", desc: "Centre staff are preparing your inspection record." },
  QUALITY_CHECK: { text: "Quality Check", desc: "Produce moisture and FAQ grade analysis underway." },
  WEIGHING: { text: "Electronic Weighing", desc: "Gross and tare weight measured on digital weighbridge." },
  COMPLETED: { text: "Procurement Completed", desc: "Produce accepted. Payment voucher generated." },
};

async function loadProcurementData() {
  const bookingId = localStorage.getItem("kisanCurrentBookingId");
  const badge = document.getElementById("procurementStatusBadge");
  const stageText = document.getElementById("procurementStageText");
  const stageDesc = document.getElementById("procurementStageDesc");
  const tokenEl = document.getElementById("procurementToken");
  const centreEl = document.getElementById("procurementCentreName");
  const paymentMini = document.getElementById("procurementPaymentMini");

  if (!bookingId) {
    if (stageText) stageText.textContent = "No Active Procurement";
    if (stageDesc) stageDesc.textContent = "Book a slot to start your crop procurement workflow.";
    return;
  }

  const res = await apiCall(`/procurement/${bookingId}`);

  if (res && res.success && res.data) {
    const data = res.data;
    const status = data.procurementStatus || "BOOKED";

    if (badge) badge.textContent = status;
    if (stageText) stageText.textContent = STAGE_DESCRIPTIONS[status]?.text || status;
    if (stageDesc) stageDesc.textContent = STAGE_DESCRIPTIONS[status]?.desc || "";
    if (tokenEl) tokenEl.textContent = data.token || "--";
    if (paymentMini) paymentMini.textContent = data.paymentStatus || "PENDING";

    const saved = loadSavedBooking();
    if (centreEl) centreEl.textContent = (saved && saved.centre) || "Centre A, Bhagalpur";
  }
}

/* Advance procurement status button */
const advanceStatusBtn = document.getElementById("advanceStatusBtn");
if (advanceStatusBtn) {
  advanceStatusBtn.addEventListener("click", async function () {
    const bookingId = localStorage.getItem("kisanCurrentBookingId");
    if (!bookingId) {
      alert("No active booking to advance. Please book a slot first.");
      return;
    }

    advanceStatusBtn.disabled = true;
    advanceStatusBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Updating...`;

    // Fetch current status first
    const currRes = await apiCall(`/procurement/${bookingId}`);
    let currentStatus = (currRes && currRes.data && currRes.data.procurementStatus) || "BOOKED";
    let currIdx = PROCUREMENT_STAGES.indexOf(currentStatus);
    let nextIdx = (currIdx + 1) % PROCUREMENT_STAGES.length;
    let nextStatus = PROCUREMENT_STAGES[nextIdx];

    // Call backend PUT /api/procurement/:bookingId/status
    const updateRes = await apiCall(`/procurement/${bookingId}/status`, "PUT", {
      status: nextStatus,
    });

    advanceStatusBtn.disabled = false;
    advanceStatusBtn.innerHTML = `<i class="fa-solid fa-forward-step"></i> Advance Stage (Demo)`;

    if (updateRes && updateRes.success) {
      addNotification("Procurement Updated", `Stage advanced to: ${STAGE_DESCRIPTIONS[nextStatus]?.text || nextStatus}`);
      loadProcurementData();
    } else {
      alert(updateRes?.message || "Failed to advance stage.");
    }
  });
}

/* Refresh procurement status button */
const refreshStatusBtn = document.getElementById("refreshStatusBtn");
if (refreshStatusBtn) {
  refreshStatusBtn.addEventListener("click", function () {
    loadProcurementData();
  });
}

/* =====================================================
   LOAD PAYMENTS DATA - CONNECTED TO BACKEND
===================================================== */

async function loadPaymentsData() {
  const bookingId = localStorage.getItem("kisanCurrentBookingId");
  const amountDisplay = document.getElementById("paymentAmountDisplay");
  const statusBadge = document.getElementById("paymentStatusBadge");
  const statusDesc = document.getElementById("paymentStatusDesc");
  const qtyDisplay = document.getElementById("paymentQuantityDisplay");
  const txnDisplay = document.getElementById("paymentTxnDisplay");

  if (!bookingId) {
    if (amountDisplay) amountDisplay.textContent = "₹0";
    if (statusBadge) statusBadge.textContent = "PENDING";
    if (statusDesc) statusDesc.textContent = "Book a slot to view and claim DBT procurement payments.";
    return;
  }

  // Fetch procurement & payment status
  const procRes = await apiCall(`/procurement/${bookingId}`);
  const bookRes = await apiCall(`/bookings/${bookingId}`);

  let quantity = 50;
  if (bookRes && bookRes.success && bookRes.data) {
    quantity = bookRes.data.quantity || 50;
  } else {
    const saved = loadSavedBooking();
    if (saved && saved.quantity) {
      quantity = parseInt(saved.quantity, 10) || 50;
    }
  }

  if (qtyDisplay) qtyDisplay.textContent = `${quantity} kg`;

  // MSP rate ₹22.75 / kg
  const calculatedAmount = Math.round(quantity * 22.75);

  if (procRes && procRes.success && procRes.data) {
    const data = procRes.data;
    const finalAmount = data.amount > 0 ? data.amount : calculatedAmount;

    if (amountDisplay) amountDisplay.textContent = `₹${finalAmount.toLocaleString("en-IN")}`;
    if (statusBadge) statusBadge.textContent = data.paymentStatus || "PENDING";

    if (data.paymentStatus === "CREDITED") {
      if (statusDesc) statusDesc.textContent = "Funds transferred successfully via DBT into your registered bank account.";
      if (txnDisplay) txnDisplay.textContent = `TXN-${Date.now().toString().slice(-6)}`;
    } else if (data.paymentStatus === "INITIATED") {
      if (statusDesc) statusDesc.textContent = "Payment transfer initiated with NPCI / Public Financial Management System.";
      if (txnDisplay) txnDisplay.textContent = "Processing...";
    } else {
      if (statusDesc) statusDesc.textContent = "Payment will be credited directly to your bank account after produce weighing.";
      if (txnDisplay) txnDisplay.textContent = "Pending";
    }
  }
}

/* Process / Claim Payment Button */
const processPaymentBtn = document.getElementById("processPaymentBtn");
if (processPaymentBtn) {
  processPaymentBtn.addEventListener("click", async function () {
    const bookingId = localStorage.getItem("kisanCurrentBookingId");
    if (!bookingId) {
      alert("No active booking found. Please book a slot first.");
      return;
    }

    const qtyText = document.getElementById("paymentQuantityDisplay")?.textContent || "50 kg";
    const qty = parseInt(qtyText, 10) || 50;
    const amount = Math.round(qty * 22.75);

    processPaymentBtn.disabled = true;
    processPaymentBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;

    // Connect to backend POST /api/procurement/payment
    const res = await apiCall("/procurement/payment", "POST", {
      bookingId,
      amount,
    });

    processPaymentBtn.disabled = false;
    processPaymentBtn.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i> Process / Claim Payment`;

    if (res && res.success) {
      addNotification("Payment Initiated", `DBT payout of ₹${amount} initiated for booking.`);
      loadPaymentsData();

      // Backend simulates credit after 2s; refresh to show updated status
      setTimeout(() => {
        loadPaymentsData();
        addNotification("Payment Credited", `₹${amount} credited directly to your registered bank account!`);
      }, 2500);
    } else {
      alert(res?.message || "Failed to process payment.");
    }
  });
}

/* =====================================================
   LOAD SAVED BOOKING
===================================================== */

function loadSavedBooking() {
  const savedBooking = localStorage.getItem("kisanBooking");
  if (!savedBooking) return null;
  try {
    return JSON.parse(savedBooking);
  } catch (error) {
    return null;
  }
}

/* =====================================================
   UPDATE CONFIRMATION PAGE
===================================================== */

function updateConfirmationPage(booking) {
  if (!booking) return;

  if (confirmationToken) confirmationToken.textContent = booking.token;
  if (confirmationBookingId) confirmationBookingId.textContent = booking.bookingId;
  if (confirmationCentre) confirmationCentre.textContent = booking.centre;
  if (confirmationCrop) confirmationCrop.textContent = booking.crop;
  if (confirmationQuantity) confirmationQuantity.textContent = booking.quantity;

  if (confirmationDate) {
    const dateParts = booking.date.split("-");
    if (dateParts.length === 3) {
      confirmationDate.textContent = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    } else {
      confirmationDate.textContent = booking.date;
    }
  }

  if (confirmationTime) confirmationTime.textContent = booking.time;
}

/* =====================================================
   CONFIRM SLOT - CONNECTED TO BACKEND
===================================================== */

const bookingForm = document.querySelector(".booking-form");

if (bookingForm) {
  const centreSelect = document.getElementById("bookingCentreSelect") || bookingForm.querySelectorAll("select")[0];
  const cropSelect = document.getElementById("bookingCropSelect") || bookingForm.querySelectorAll("select")[1];
  const quantityInput = document.getElementById("bookingQuantityInput") || bookingForm.querySelector('input[type="number"]');
  const dateInput = document.getElementById("bookingDateInput") || bookingForm.querySelector('input[type="date"]');
  const confirmBtn = document.getElementById("confirmSlotBtn") || bookingForm.querySelector(".confirm-btn");

  if (confirmBtn) {
    confirmBtn.addEventListener("click", async function () {
      const centre = centreSelect.value.trim();
      const crop = cropSelect.value.trim();
      const quantity = quantityInput.value.trim();
      const selectedDate = dateInput.value;
      const selectedSlot = bookingForm.querySelector(".time-slots button.selected");

      /* Validations */
      if (!centre || !crop || !quantity || !selectedDate) {
        alert("Please fill all booking details before confirming the slot.");
        return;
      }

      if (Number(quantity) <= 0) {
        alert("Please enter a valid quantity.");
        quantityInput.focus();
        return;
      }

      if (!selectedSlot) {
        alert("Please select a time slot.");
        return;
      }

      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Confirming...`;

      const farmerId = localStorage.getItem("farmerId") || "F1001";
      const slotTimeText = selectedSlot.textContent.trim();

      // Connect to Backend POST /api/bookings
      const bookingPayload = {
        farmerId,
        centreId: centre,
        crop,
        quantity: Number(quantity),
        date: selectedDate,
        slot: slotTimeText,
      };

      const response = await apiCall("/bookings", "POST", bookingPayload);

      confirmBtn.disabled = false;
      confirmBtn.innerHTML = `<i class="fa-solid fa-calendar-check"></i> Confirm Slot`;

      let token = "A-001";
      let bookingId = `KQ-${Date.now().toString().slice(-8)}`;

      if (response && response.success && response.data) {
        token = response.data.token;
        bookingId = response.data.bookingId;
        localStorage.setItem("kisanCurrentBookingId", bookingId);
      } else {
        console.warn("Backend booking response fallback. Generated local token.");
        let lastToken = parseInt(localStorage.getItem("kisanLastToken") || "18", 10) + 1;
        token = `A-${String(lastToken).padStart(3, "0")}`;
        localStorage.setItem("kisanLastToken", String(lastToken));
      }

      const booking = {
        bookingId,
        token,
        farmerName: localStorage.getItem("farmerName") || "Farmer",
        centre,
        crop,
        quantity: `${quantity} kg`,
        date: selectedDate,
        time: slotTimeText,
        queueAhead: response?.data?.position ? response.data.position - 1 : 0,
        estimatedWait: response?.data?.position ? `${(response.data.position - 1) * 7} mins` : "15 mins",
      };

      // Save to localStorage
      localStorage.setItem("kisanBooking", JSON.stringify(booking));

      // Update Confirmation Page & Navigation
      updateConfirmationPage(booking);
      addNotification("Slot Booked", `Token ${token} assigned for ${crop} (${quantity} kg) at ${centre}.`);

      showPage("confirmation");
    });
  }
}

/* Confirmation Dashboard Button */
if (confirmationDashboardBtn) {
  confirmationDashboardBtn.addEventListener("click", function () {
    showPage("dashboard");
  });
}

/* Confirmation My Turn Button */
if (confirmationTurnBtn) {
  confirmationTurnBtn.addEventListener("click", function () {
    showPage("queue");
  });
}

/* =====================================================
   AUTO INITIALIZATION
===================================================== */

const savedBooking = loadSavedBooking();
if (savedBooking) {
  updateConfirmationPage(savedBooking);
}

const existingFarmer = localStorage.getItem("farmerName");
const loggedIn = localStorage.getItem("kisanLoggedIn");

if (loggedIn === "true" && existingFarmer) {
  showDashboard();
}
