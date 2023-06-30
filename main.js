const radioButtons = document.querySelectorAll('input[type="radio"]');
const contentSections = document.querySelectorAll('.content');

// Agregamos un event listener a todos los radio buttons
radioButtons.forEach((radio) => {
  radio.addEventListener('change', (event) => {
    const selectedContent = document.querySelector(`.${event.target.id.replace('radio-', 'content-')}`);

    // Ocultamos todos los contenidos
    contentSections.forEach((section) => {
      section.classList.remove('show');
    });

    // Mostramos el contenido seleccionado
    selectedContent.classList.add('show');
  });
});


document.addEventListener("DOMContentLoaded", () => {
    const optionMenu = document.querySelector(".select-menu");
    const selectBtn = optionMenu.querySelector(".select-btn");
    const options = optionMenu.querySelectorAll(".option");
    const sBtn_text = optionMenu.querySelector(".sBtn-text");
  
    options[0].classList.add("selected");
  
    selectBtn.addEventListener("click", () => {
      optionMenu.classList.toggle("active");
    });
  
    sBtn_text.parentElement.classList.add("container__country");

    // Obtén una referencia al elemento del desglose de idiomas
    const selectMenu = document.querySelector('.select-menu');

    // Agrega un event listener de clic al documento
    document.addEventListener('click', (event) => {
    // Verifica si el clic se realizó fuera del desglose de idiomas
    if (!selectMenu.contains(event.target)) {
        // Cierra el desglose de idiomas
        selectMenu.classList.remove('active');
    }
    });
  
    const selectedLanguage = getURLLanguage() || "es";
    const selectedOption = getLanguageOption(selectedLanguage);
    if (selectedOption) {
      setSelectedOption(selectedOption);
    }
  
    fetchTranslation(selectedLanguage)
      .then(translations => {
        translatePage(selectedLanguage, translations);
      })
      .catch(error => {
        console.error("Error fetching translations:", error);
      });
  
    options.forEach(option => {
      option.addEventListener("click", () => {
        const selectedOptionText = option.querySelector(".option-text").innerText;
        const selectedLanguage = getLanguageCode(selectedOptionText);
  
        setSelectedOption(option);
        optionMenu.classList.remove("active");
  
        fetchTranslation(selectedLanguage)
          .then(translations => {
            translatePage(selectedLanguage, translations);
          })
          .catch(error => {
            console.error("Error fetching translations:", error);
          });
  
        updateURLLanguage(selectedLanguage);
      });
    });
  });
  
  function getURLLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("lang");
  }
  
  function updateURLLanguage(language) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("lang", language);
    const newURL = `${window.location.pathname}?${urlParams.toString()}`;
    history.replaceState(null, "", newURL);
  }
  
  // Resto del código...
  
  // Funciones de traducción y manejo de idioma
  function fetchTranslation(language) {
    return fetch(`json/${language}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error fetching translation (${response.status} ${response.statusText})`);
        }
        return response.json();
      });
  }
  
  function translatePage(language, translations) {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(element => {
      const key = element.getAttribute("data-i18n");
      const translation = getTranslation(translations, key);
      if (translation) {
        element.innerText = translation;
      }
    });

    // Actualizar el título del documento
  const titleKey = "title"; // Clave de traducción para el título
  const titleTranslation = getTranslation(translations, titleKey);
  if (titleTranslation) {
    document.title = titleTranslation;
  }
  }
  
  function getTranslation(translations, key) {
    const keys = key.split(".");
    let value = translations;
    keys.forEach(k => {
      if (value.hasOwnProperty(k)) {
        value = value[k];
      } else {
        value = null;
      }
    });
    return value;
  }
  
  function getLanguageOption(languageCode) {
    const options = document.querySelectorAll(".option");
    return Array.from(options).find(option => {
      const optionText = option.querySelector(".option-text").innerText;
      const optionLanguageCode = getLanguageCode(optionText);
      return optionLanguageCode === languageCode;
    });
  }
  
  function setSelectedOption(option) {
    const sBtn_text = document.querySelector(".sBtn-text");
    const selectedOptionText = option.querySelector(".option-text").innerText;
    const selectedFlag = option.querySelector("img").src;
  
    sBtn_text.innerText = selectedOptionText;
    sBtn_text.previousElementSibling.src = selectedFlag;
  
    const options = document.querySelectorAll(".option");
    options.forEach(opt => {
      opt.classList.remove("selected");
    });
    option.classList.add("selected");
  
    const container = sBtn_text.parentElement;
    container.classList.add("container__country");
  }
  
  function getLanguageCode(language) {
    const languageCodes = {
      Español: "es",
      English: "en",
      Français: "fr",
      Italiano: "it",
      Português: "pt",
      Deutsch: "de", // Abreviatura para el idioma alemán
      中文: "zh" // Abreviatura para el idioma alemán
    };
    return languageCodes[language] || "es";
  }
  