import { itemsHouse, arrayNameAndNumber, arrayPositionBG } from "./houses.js";

async function fetchHouses() {
  const response = await fetch("1c_bel_site.json");
  const data = await response.json();
  return data;
}

window.addEventListener("DOMContentLoaded", () => {
  // menu selectors

  const menuOpenBytton = document.querySelector(".menu__Open");
  const menu = document.querySelector(".menu");
  const overlay = document.querySelector(".overlay");

  // fifth block selectors

  const fifthBlockButtonWrapper = document.querySelector(".fifthBlock__items");

  // nav selectors

  const navElem = document.querySelector(".nav");
  const navElemHeight = navElem.offsetHeight / 2;

  // houses and houses field selectors

  const allItemsField = document.querySelector(".fourthAndThirdBlockTogether__inner");

  // house filtering controls

  const selectionButtonsMenu = document.querySelector(".fourthAndThirdBlockTogether__menuWrapper");
  const buttonsSelectionButtonsMenu = document.querySelectorAll(".fourthAndThirdBlockTogether__text");

  // form feedback selectors

  const buttonModalFeedBack = document.querySelector(".firstBlock__buttonMediaMin940px");
  const feedBackMenu = document.querySelector(".feedBack__menu");
  const feedBackWindow = document.querySelector(".feedBack");
  const crestik = document.querySelector(".crestik");
  const formButtonWrapper = document.querySelector(".feedBack__menu-buttons");
  const flag = document.querySelector(".feedBack__menu-flag");
  const numberText = document.querySelector(".feedBack__menu-number");
  const input = document.querySelector(".feedBack__from-inputPhone");
  const form = document.querySelector(".feedBack__form");
  const loader = document.querySelector(".loader");
  const btnText = document.querySelector(".feedBack__form-submitText");
  const feedBackModal = document.querySelector(".feedBackModal");
  const btnCLoseBlackCrestik = document.querySelector(".crestikBlack");

  const FORM_STATUS_MESSAGE = {
    loading: "Загрузка...",
    success: "Спасибо! Скоро мы с вами свяжемся",
    failure: "Что-то пошло не так...",
  };

  // phone mask selectors

  const formInputMask = document.querySelector(".feedBack__from-inputPhone");

  const mask = new IMask(formInputMask, {
    mask: "(000) 000-00-00",
    lazy: true,
  });

  // modal selectors

  const slidesFieldActionOpen = document.querySelector(".fifthBlock__imgs");
  const modal = document.querySelector(".modalImgSlider");
  const buttonCloseModal = document.querySelector(".modalImgSlider__close");
  const slideModalField = document.querySelector(".modalImgSlider__field");
  const slidesModal = document.querySelectorAll(".modalImgSlider__img");
  const prevModal = document.querySelector(".modalImgSlider__button-left");
  const nextModal = document.querySelector(".modalImgSlider__button-right");

  let slideIndex = 1;

  // actions on the dropdown menu

  function hideMenu() {
    menu.classList.remove("visible");
    overlay.classList.remove("block");
    document.body.style.overflow = "";
  }

  function showMenu() {
    menu.classList.add("visible");
    overlay.classList.add("block");
    document.body.style.overflow = "hidden";
  }

  function checkTheTargetInTheMenu(event) {
    const target = event.target.className;

    switch (target) {
      case "menu__Close":
        hideMenu();
        break;
      case "overlay":
        hideMenu();
        break;
      case "menu__link":
        hideMenu();
        break;
    }
  }

  //detailed information fifth block

  function changesHeightAndPadding(target, rotate) {
    switch (rotate) {
      case false:
        target.nextElementSibling.style.maxHeight = "0px";
        target.nextElementSibling.style.marginBottom = "0px";
        target.classList.remove("rotate");
        break;
      case true:
        target.nextElementSibling.style.maxHeight = "190px";
        target.nextElementSibling.style.marginBottom = "20px";
        target.classList.add("rotate");
        break;
    }
  }

  function actionOnFifthBLockButton(event) {
    let target = event.target;
    if (target.classList.contains("fifthBlock__item-plus")) {
      switch (target.classList.length) {
        case 1:
          changesHeightAndPadding(target, true);
          break;
        case 2:
          changesHeightAndPadding(target, false);
          break;
      }
    }
  }

  //animation nav at scroll

  function changesBGColorInNav() {
    if (window.scrollY > navElemHeight) {
      navElem.style.backgroundColor = "#074097";
    } else {
      navElem.style.backgroundColor = "rgba(255, 255, 255, 0)";
    }
  }

  // create new array and filtration types and houses

  function findHouseTypes(houses) {
    let typesHouseArray = [];

    houses.forEach((item) => {
      if (typesHouseArray.indexOf(item.typeHouse) == -1) {
        typesHouseArray.push(item.typeHouse);
      }
    });

    return typesHouseArray;
  }

  function getActiveTypeHouses(target) {
    let activeAllCatalog = [];

    if (target.dataset.modal != "all") {
      createEntireCatalogOfHouses(itemsHouse).forEach((item) => {
        if (item.type === target.dataset.modal) {
          if (activeAllCatalog.indexOf(item.typeHouse) == -1) {
            activeAllCatalog.push(item.typeHouse);
          }
          activeAllCatalog.push(item);
        }
      });
    } else {
      activeAllCatalog = [...createEntireCatalogOfHouses(itemsHouse)];
    }

    return activeAllCatalog;
  }

  // create entire catalog of houses

  function createEntireCatalogOfHouses(houses) {
    const entireCatalogOfHouses = [];

    findHouseTypes(houses).forEach((type) => {
      entireCatalogOfHouses.push(type);

      houses.forEach((item) => {
        if (item.typeHouse == type) {
          entireCatalogOfHouses.push(item);
        }
      });
    });

    return entireCatalogOfHouses;
  }

  // modal house, bathhouse and typeName

  function modalHouse(img, alt, size, square, code, coust, mortgage, link) {
    return `
            <div class="fourthAndThirdBlockTogether__tile">
                <img class="fourthAndThirdBlockTogether__tile-img" src=${img} alt=${alt}>
                <div class="fourthAndThirdBlockTogether__tile-text">${size}</div>
                <div class="fourthAndThirdBlockTogether__tile-text">${square}</div>
                <div class="fourthAndThirdBlockTogether__tile-text"  id="${code}">${coust}</div>
                <a href=${link} class="fourthAndThirdBlockTogether__link">
                    <img src="./assets/icons/textSvg.svg" alt="link">
                </a>
            </div>
        `;
  }

  function modalBathHouse(img, alt, size, square, code, coust, link) {
    return `
            <div class="fourthAndThirdBlockTogether__tile">
                <img class="fourthAndThirdBlockTogether__tile-img" src=${img} alt=${alt}>
                <div class="fourthAndThirdBlockTogether__tile-text">${size}</div>
                <div class="fourthAndThirdBlockTogether__tile-text">${square}</div>
                <div class="fourthAndThirdBlockTogether__tile-text"  id="${code}">${coust}</div>
                <a href=${link} class="fourthAndThirdBlockTogether__link">
                    <img src="./assets/icons/textSvg.svg" alt="link">
                </a>
            </div>
        `;
  }

  function modalTypeHousesOrBathHouses(typeName) {
    return `
            <div class="fourthBlock__headers">
                ${typeName}
                <div class='fullScreenLine'></div>
            </div>
        `;
  }

  // open and close modal

  function openModal(event) {
    const target = event.target;

    const parent = target.parentElement;

    if (target.className === "fifthBlock__img") {
      modal.style.visibility = "visible";
      modal.classList.remove("none");
      slideIndex = Array.from(parent.children).indexOf(target) + 1;
      showSlides(slideIndex);
    }
  }

  function closeModal() {
    modal.style.visibility = "hidden";
    modal.classList.add("none");
  }

  // show slides in modal

  function showSlides(n) {
    if (n > slidesModal.length) {
      slideIndex = 1;
    }

    if (n < 1) {
      slideIndex = slidesModal.length;
    }

    slidesModal.forEach((slide) => (slide.style.display = "none"));

    slidesModal[slideIndex - 1].style.display = "block";
  }

  function plusSlides(n) {
    showSlides((slideIndex += n));
  }

  // zoom in, zoom out in modal slide

  function zoomModalSlide(event) {
    const target = event.target;
    switch (target.style.scale) {
      case "1.3":
        target.style.scale = "1.0";
        target.style.cursor = "zoom-in";
        break;
      default:
        target.style.scale = "1.3";
        target.style.cursor = "zoom-out";
    }
  }

  //catalog of baths, houses

  function createAllElem(arr) {
    allItemsField.innerHTML = arr
      .map((task) => {
        switch (typeof task) {
          case "object":
            switch (Object.keys(task).length) {
              case 10:
                return modalHouse(task.img, task.alt, task.size, task.square, task.code, task.coust, task.mortgage, task.link);
              case 9:
                return modalBathHouse(task.img, task.alt, task.size, task.square, task.code, task.coust, task.link);
            }
          case "string":
            return modalTypeHousesOrBathHouses(task);
        }
      })
      .join("");
    updateCost();
  }

  //changes backgorund color in selections buttons

  function changesBgColorInSelectionsButtons(target) {
    buttonsSelectionButtonsMenu.forEach((button) => {
      button.classList.remove("changesBg");
    });

    target.classList.add("changesBg");
  }

  // redraw houses field due to filtering

  function redrawHousesFieldDueToFilter(event) {
    let target = event.target;

    changesBgColorInSelectionsButtons(target);

    allItemsField.innerHTML = getActiveTypeHouses(target)
      .map((task) => {
        switch (target.dataset.modal) {
          case "all":
            switch (typeof task) {
              case "object":
                switch (Object.keys(task).length) {
                  case 10:
                    return modalHouse(
                      task.img,
                      task.alt,
                      task.size,
                      task.square,
                      task.code,
                      task.coust,
                      task.mortgage,
                      task.link
                    );
                  case 9:
                    return modalBathHouse(task.img, task.alt, task.size, task.square, task.code, task.coust, task.link);
                }
              case "string":
                return modalTypeHousesOrBathHouses(task);
            }
          default:
            switch (typeof task) {
              case "object":
                switch (task.type) {
                  case "bathhouse":
                    return modalBathHouse(task.img, task.alt, task.size, task.square, task.code, task.coust, task.link);
                  case "two-storey house":
                  case "cottage":
                    return modalHouse(
                      task.img,
                      task.alt,
                      task.size,
                      task.square,
                      task.code,
                      task.coust,
                      task.mortgage,
                      task.link
                    );
                }
              case "string":
                return modalTypeHousesOrBathHouses(task);
            }
        }
      })
      .join("");

    updateCost();
  }

  // open or close form modal

  function showFormModal() {
    feedBackWindow.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function hideFormModal() {
    form.reset();
    feedBackWindow.style.display = "none";
    document.body.style.overflow = "";
  }

  // create array by using position , name and number

  function createArrCountryCatalog() {
    const countryCatalog = [];

    for (let i = 0; i < arrayNameAndNumber.length; i++) {
      const indexPosition = arrayPositionBG.indexOf(arrayNameAndNumber[i]);

      if (indexPosition != -1) {
        let task = {
          name: arrayNameAndNumber[i + 1],
          number: arrayNameAndNumber[i + 2],
          position: `${arrayPositionBG[indexPosition + 1]} ${arrayPositionBG[indexPosition + 2]}`,
        };

        countryCatalog.push(task);
      }
    }

    return countryCatalog;
  }

  // modal item choice country

  function modalChoiceCountry(name, position, number) {
    return `
            <div class="feedBack__menu-button">
                <div class="feedBack__menu-buttonLeft">${name}</div>
                <div class="feedBack__menu-buttonRight">
                    <div class="feedBack__menu-buttonNumber" data-position='${position}'>${number}</div>
                    <div class="img" style='background-position:${position}'></div>
                </div>
            </div>
        `;
  }

  // create items form choice country

  function createFormChoiceCountry() {
    formButtonWrapper.innerHTML = createArrCountryCatalog()
      .map((task) => modalChoiceCountry(task.name, task.position, task.number))
      .join("");
  }

  function openOrCloseFeedbackMenu(event) {
    switch (formButtonWrapper.style.display) {
      case "none":
        formButtonWrapper.style.display = "flex";
        break;
      default:
        formButtonWrapper.style.display = "none";
        break;
    }
  }

  function changesCountryItem(number) {
    let width = window.getComputedStyle(number).width;
    width = +width.slice(0, width.length - 2);
    input.style.paddingLeft = `${width - 17 + 100}` + "px";
    flag.style.backgroundPosition = number.dataset.position;
    numberText.textContent = number.textContent;
    formButtonWrapper.style.display = "none";
  }

  function switchCountry(event) {
    let target = event.target;
    let number;
    switch (target.className) {
      case "feedBack__menu-button":
        number = target.querySelector(".feedBack__menu-buttonNumber");
        input.dataset.phonemask = number.textContent;
        changesCountryItem(number);
        break;
      case "feedBack__menu-buttonRight":
      case "feedBack__menu-buttonLeft":
      case "feedBack__menu-buttonNumber":
      case "img":
        const parent = target.parentElement;
        number = parent.querySelector(".feedBack__menu-buttonNumber");
        changesCountryItem(number);
        break;
    }
  }

  // sending form

  async function postData(form, event) {
    event.preventDefault();

    let error = formValidate();

    const indexNumber = document.querySelector(".feedBack__menu-number").textContent;
    const inputTel = document.querySelector(".feedBack__from-inputPhone").value;

    btnText.classList.add("block");
    btnText.classList.remove("none");
    loader.classList.remove("block");
    loader.classList.add("none");

    if (error === 0) {
      const formData = new FormData(form);

      const phone = indexNumber + inputTel;

      formData.set("user_phone", phone);

      const response = await fetch("sendmail.php", {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        showThanksModal();
        form.reset();
      } else {
        alert(FORM_STATUS_MESSAGE.failure);
      }
    }
  }

  function formValidate() {
    let error = 0;

    let formReq = document.querySelectorAll("._req");
    let errorInfo = document.querySelectorAll(".error");
    let errorInfoTel = document.querySelector(".errorTel");
    let errorInfoBig = document.querySelector(".errorBig");

    formRemoveError(input, errorInfoTel);
    formRemoveError(input, errorInfoBig);

    for (let index = 0; index < formReq.length; index++) {
      const input = formReq[index];
      const errorCar = errorInfo[index];
      formRemoveError(input, errorCar);

      if (input.name === "user_name") {
        if (input.value.length > 25) {
          formAddError(input, errorInfoBig);
          error++;
        }

        if (input.value.trim() === "") {
          formAddError(input, errorCar);
          error++;
        }
      }

      if (input.name === "user_phone") {
        if (input.value === "") {
          formAddError(input, errorCar);
          error++;
        }

        if (input.value.length !== 15 && input.value.length > 0) {
          formAddError(input, errorInfoTel);
          error++;
        }
      }
    }

    return error;
  }

  function formAddError(input, error) {
    input.parentElement.classList.add("_error");
    input.classList.add("_error");
    error.classList.add("show");
    error.classList.remove("notVisible");
  }

  function formRemoveError(input, error) {
    input.parentElement.classList.remove("_error");
    input.classList.remove("_error");
    error.classList.remove("show");
    error.classList.add("notVisible");
  }

  function hideThanksModal() {
    const thanksModal = document.querySelector(".feedBackModal");
    thanksModal.classList.add("none");
    thanksModal.classList.remove("block");
  }

  function showThanksModal() {
    const thanksModal = document.querySelector(".feedBackModal");
    thanksModal.classList.remove("none");
    thanksModal.classList.add("block");

    setTimeout(hideThanksModal, 4000);
  }

  function closeFeedbackModal(event) {
    if (!e.target.classList.contains("feedBackModal__wrapper")) {
      feedBackModal.classList.add("none");
      feedBackModal.classList.remove("block");
    }
  }

  async function updateCost() {
    const data = await fetchHouses();

    data["Дома"].forEach((house) => {
      const code = house["ДомКод"];

      const codeElement = document.getElementById(`${code}`);
      if (!codeElement) {
        return;
      }

      let children = codeElement.children[0];

      if (children == undefined) {
        return;
      }
      let nextSib = codeElement.nextElementSibling.children[0];
      let cost = 0;

      house["Разделы"].forEach((subsection) => {
        switch (subsection["Раздел"]) {
          case "Строительство дома в базовой комплектации":
            cost += subsection["Подразделы"][0]["Стоимость"];
          case "Отделка фасада":
            subsection["Подразделы"].forEach((item) => {
              if (item["Подраздел"] == "Имитация бруса") {
                cost += item["Стоимость"];
              }
            });
          case "Внутренняя отделка и комфорт":
            subsection["Подразделы"].forEach((item) => {
              if (item["Подраздел"] == "Стены и потолки: имитация бруса") {
                cost += item["Стоимость"];
              }
            });
        }
      });

      children.textContent = cost;
      nextSib.textContent = cost / 5;
    });
  }

  createAllElem(createEntireCatalogOfHouses(itemsHouse));

  createFormChoiceCountry();

  menuOpenBytton.addEventListener("click", () => showMenu());

  menu.addEventListener("click", (event) => checkTheTargetInTheMenu(event));

  overlay.addEventListener("click", () => hideMenu());

  fifthBlockButtonWrapper.addEventListener("click", (event) => actionOnFifthBLockButton(event));

  window.addEventListener("scroll", () => changesBGColorInNav());

  selectionButtonsMenu.addEventListener("click", (event) => redrawHousesFieldDueToFilter(event));

  slidesFieldActionOpen.addEventListener("click", (event) => openModal(event));

  prevModal.addEventListener("click", () => plusSlides(-1));

  nextModal.addEventListener("click", () => plusSlides(1));

  buttonCloseModal.addEventListener("click", () => closeModal());

  slideModalField.addEventListener("click", (event) => zoomModalSlide(event));

  buttonModalFeedBack.addEventListener("click", () => showFormModal());

  crestik.addEventListener("click", () => hideFormModal());

  feedBackMenu.addEventListener("click", (event) => openOrCloseFeedbackMenu(event));

  formButtonWrapper.addEventListener("click", (event) => switchCountry(event));

  btnCLoseBlackCrestik.addEventListener("click", () => hideThanksModal());

  feedBackModal.addEventListener("click", (event) => closeFeedbackModal(event));

  form.addEventListener("submit", (event) => postData(form, event));
});
