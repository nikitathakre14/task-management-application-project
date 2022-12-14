const state = {
    taskList: [],
};

//DOM - document object
const taskContents = document.querySelector(".task_contents");
const taskModal = document.querySelector(".task_modal_body");

const htmlTaskContent = ({ id, title, description, type, url }) => `

<div class = 'col-md-6 col-lg-4 mt-3'id = ${id}key = ${id}>
    <div class='card shadow-sm task_card'>
        <div class='card-header d-flex gap-2 justify-content-end task_card_header'>
            <button type='button'class='btn btn-outline-info mr-2'name=${id}>
                <i class='fas-fa-pencil-alt'name=${id}></i>
            </button>
            <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick="delete.Task.apply(this, arguments)">
                <i class='fas-fa-pencil-alt' name=${id}></i>
            </button>
            <div>
                <div class='card-body'>
                    ${url && `<img width='100%' src=${url} alt='card image cap' class='card - image - top md - 3 rounded = lg'/>`}
                    <h4 class='task_card_title'>${title}</h4>
                    <p class='description trim-3-lines text-muted' data-gram_editor='false'>${description}</p>
                    <div class='tags text-white d-flex flex-wrap'>
                      <span class='badge bg-primary m-1'>${type}</span>
                    </div>
                    <div class='card-footer'>
                      <button type='button' class='btn btn-outline-primary float-right' 
                    data-bs-toggle='modal'
                    data-bs-target='#showTask'>Open Task</button>
                     </div>

                </div >
            </div >
        </div >
    </div >
    
</div >

    `;

const htmlModalContent = ({ id, title, description, url }) => {
    const date = new Date(parseInt(id));
    return ` < div id = "${id}" >
    ${url ?
            `< img width = '100 % ' src = '${url} ' alt ='card image cap' class = 'img - fluid place__holder_image mb - 3'/>
        `:
            `< img width = '100 % ' src ="https://jkfenner.com/wp-content/uploads/2019/11/default.jpg" alt ='card image cap' class = 'img - fluid place__holder_image mb - 3'/>`

        }
      <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>
    <h2 class='my-3'>${title}</h2>
    <p class='lead'>${description}</p>
    </div > `;

}

const updateLocalStorage = () => {
    localStorage.setItem('task',
        JSON.stringify({
            tasks: state.taskList,
        })
    );
};

const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.tasks);

    if (localStorageCopy) state.taskList = localStorageCopy.tasks;

    state.taskList.map((cardDate) => {
        taskContents.insertAdjacentHTML('beforeend', htmlModalContent(cardDate));
    });
};

const handleSubmit = (event) => {
    const id = `${Date.now()}`;
    const input = {
        url: document.getElementById("imageUrl").value,
        title: document.getElementById("taskTitle"), value,
        description: document.getElementById("taskDescription").value,
        type: document.getElementById("tags").value,
    };
    if (input.title === "" || input.description === "" || input.type === "") {
        return alert("Please fill all the field");
    }

    taskContents.insertAdjacentHTML(
        "beforeend",
        htmlTaskContent({
            ...input,
            id,
        })
    );

    state.taskList.push({ ...input, id });
    updateLocalStorage();
};

const deleteTask = (e) => {
    if (!e) e = window.event;
    const targetID = e.target.getAttribute("name");
    const type = e.target.tagName;
    const removeTask = state.taskList.filter(({ id }) => id !== targetID);
    state.taskList = removeTask;

    updateLocalStorage();
    if (type === "BUTTON") {
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        );
    }

    return e.target.parentNode.Date.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode.parentNode
    );
};

const editTask = (e) => {
    if (!e) e = window.event;

    const targetID = e.target.id;
    const type = e.target.tagName;

    let parentNode;
    let taskTitle;
    let taskDescription;
    let taskType;
    let submitButton;

    if (type === "BUTTON") {
        parentNode = e.target.parentNode.parentNode;
    } else {
        parentNode = e.target.parentNode.parentNode.parentNode;
    }

    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskDescription = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton = parentNode.childNodes[5].childNodes[1];

    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");

    submitButton.setAttribute("onclick", "saveEdit.apply(this,arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = "Save Changes";
};

const saveTask = (e) => {
    if (!e) e = window.event;

    const targetID = e.target.id;
    const parentNode = e.target.parentNode.parentNode;
    //console.log(parentNode.childNode);

    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskDescription = parentNode.childNodes[3].childNodes[5];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton = parentNode.childNodes[5].childNodes[1];

    const updateData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML,
    };
    let stateCopy = state.taskList;

    stateCopy = stateCopy.map((task) =>
        task.id === targetID
            ? {
                id: task.id,
                title: updateData.taskTitle,
                description: updateData.taskDescription,
                type: updateData.taskType,
                url: task.url,
            }
            : task
    );

    state.taskList = stateCopy;
    updateLocalStorage();


    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");

    submitButton.setAttribute("onclick", "openTask.apply(this,arguments)");
    submitButton.removeAttribute("data-bs-toggle", "modal");
    submitButton.removeAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML = "Open Task";
};

const searchTask = (e) => {
    if (!e) e = window.event;

    while (taskContents.firstChild) {
        taskContents.removeChild(taskContents.firstChild);
    }

    const resultData = state.taskList.filter(({ title }) => {
        return title.tolowerCase().includes(e.target.value.tolowerCase());
    });

    console.log(resultData);
    resultData.map((cardData) => {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
    });
};