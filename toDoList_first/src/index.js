const toDoForm = document.querySelector(".js-toDoForm");
const toDoInput = document.querySelector("input");
const toDoPending = document.querySelector(".js-toDoPending");
const toFinished = document.querySelector(".js-toFinished");

const TODO_PENDING = "Pendings";
const TODO_FINISH = "Finished";
let Pendings = [];
let Finished = [];

function moveFinishTask(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const text = li.childNodes[0].innerText;
  RemoveLocalStorage(li);
  if (li.parentNode === toDoPending) {
    paintToFinished(text);
    toDoPending.removeChild(li);
  } else {
    paintToPanding(text);
    toFinished.removeChild(li);
  }
}
function paintToFinished(text) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const delBtn = document.createElement("button");
  const backBtn = document.createElement("button");
  const newId = Finished.length + 1;
  span.innerText = text;
  delBtn.innerText = "❌";
  backBtn.innerText = "⏪";
  delBtn.addEventListener("click", deleteTask);
  backBtn.addEventListener("click", moveFinishTask);
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(backBtn);
  toFinished.appendChild(li);
  li.id = newId;
  const toFinishObj = {
    text: text,
    id: newId,
  };
  Finished.push(toFinishObj);
  saveToFinish();
}

function deleteTask(event) {
  const btn = event.target;
  const li = btn.parentNode;
  RemoveLocalStorage(li);
  if (li.parentNode === toDoPending) {
    toDoPending.removeChild(li);
  } else {
    toFinished.removeChild(li);
  }
}

function RemoveLocalStorage(li) {
  if (li.parentNode === toDoPending) {
    const cleanToPending = Pendings.filter(function (toPending) {
      return toPending.id !== parseInt(li.id);
    });
    Pendings = cleanToPending;
    saveToPending();
  } else {
    const cleanToFinish = Finished.filter(function (toFinish) {
      return toFinish.id !== parseInt(li.id);
    });
    Finished = cleanToFinish;
    saveToFinish();
  }
}

function saveToPending() {
  localStorage.setItem(TODO_PENDING, JSON.stringify(Pendings));
}
function saveToFinish() {
  localStorage.setItem(TODO_FINISH, JSON.stringify(Finished));
}

function paintToPanding(text) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const delBtn = document.createElement("button");
  const finishBtn = document.createElement("button");
  const newId = Pendings.length + 1;
  span.innerText = text;
  delBtn.innerText = "❌";
  finishBtn.innerText = "✅";
  delBtn.addEventListener("click", deleteTask);
  finishBtn.addEventListener("click", moveFinishTask);
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(finishBtn);
  toDoPending.appendChild(li);
  li.id = newId;

  const toPendingObj = {
    text: text,
    id: newId,
  };

  Pendings.push(toPendingObj);
  saveToPending();
}

function handleSubmit(event) {
  event.preventDefault();
  const currentValue = toDoInput.value;
  paintToPanding(currentValue);
  toDoInput.value = "";
}

function loadToPendings() {
  const loadedtoPending = localStorage.getItem(TODO_PENDING);
  if (loadedtoPending !== null) {
    const parsedToPendings = JSON.parse(loadedtoPending);
    parsedToPendings.forEach(function (toPending) {
      paintToPanding(toPending.text);
    });
  }
}

function loadToFinishs() {
  const loadedToFinish = localStorage.getItem(TODO_FINISH);
  if (loadedToFinish !== null) {
    const parsedToFinished = JSON.parse(loadedToFinish);
    parsedToFinished.forEach(function (toFinish) {
      paintToFinished(toFinish.text);
    });
  }
}

function init() {
  loadToPendings();
  loadToFinishs();
  toDoForm.addEventListener("submit", handleSubmit);
}

init();
