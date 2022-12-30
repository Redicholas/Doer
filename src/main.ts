// import './index.css';
import { gsap } from 'gsap';

const landingPage = document.querySelector('#landingPage');
const nameDisplay = document.querySelector('#user');
const nameInput = document.querySelector('#nameInput') as HTMLInputElement;
const nameSubmit = document.querySelector('#nameSubmit');

const generalBtn = document.querySelector('#generalButton');
const personalBtn = document.querySelector('#personalButton');
const workBtn = document.querySelector('#workButton');

const sortSelector = document.querySelector('#sortSelector') as HTMLSelectElement;
const generalAmount = document.querySelector('#generalAmount');
const personalAmount = document.querySelector('#personalAmount');
const workAmount = document.querySelector('#workAmount');

const todoInput = document.querySelector('#todoInput') as HTMLInputElement;
const todoDeadlineInput = document.querySelector('#todoDeadlineInput') as HTMLInputElement;
const todoInputSubmit = document.querySelector('#todoInputSubmit');
const todoListContainer = document.querySelector('#todoListContainer');
const todoUl = document.querySelector('#todoUl');

let todoCategory: string;
let user: string;

class TodoItem {
  category: string;

  index: number;

  todoText: string;

  completed: boolean;

  timeAdded: string;

  deadline: string;

  constructor(
    category: string,
    index: number,
    todoText: string,
    completed: boolean,
    timeAdded: string,
    deadline: string,
  ) {
    this.category = category;
    this.index = index;
    this.todoText = todoText;
    this.completed = completed;
    this.timeAdded = timeAdded;
    this.deadline = deadline;
  }
}

let todoArray: TodoItem[] = [];

function hideLandingPage(): void {
  landingPage?.classList.add('visually-hidden');
}

function showTodoCounter(): void {
  let generalCounter = 0;
  let personalCounter = 0;
  let workCounter = 0;
  todoArray.forEach((item) => {
    if (item.category === 'general') {
      generalCounter += 1;
    } else if (item.category === 'personal') {
      personalCounter += 1;
    } else {
      workCounter += 1;
    }
  });
  if (generalAmount != null) {
    generalAmount.innerHTML = generalCounter.toString();
  }
  if (personalAmount != null) {
    personalAmount.innerHTML = personalCounter.toString();
  }
  if (workAmount != null) {
    workAmount.innerHTML = workCounter.toString();
  }
}

function showTodos(): void {
  const retrieved = localStorage.getItem('Todos') as string;
  let todoListHtml = '';

  if (retrieved != null) {
    todoArray = JSON.parse(retrieved) as TodoItem[];
  }
  todoArray.forEach((item, i) => {
    // eslint-disable-next-line no-param-reassign
    item.index = i;
  });
  switch (true) {
    case generalBtn?.classList.contains('selected'):
      todoCategory = 'general';
      break;
    case personalBtn?.classList.contains('selected'):
      todoCategory = 'personal';
      break;
    default:
      todoCategory = 'work';
      break;
  }
  if (todoArray.length === 0) {
    todoListHtml = '<li><p class="text-center mt-8">Dont you have anything to do?! <br> Add something!</p></li>';
  } else {
    todoArray.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.deadline = item.deadline || '';
      if (item.category === todoCategory) {
        const completed = item.completed ? 'checked' : '';
        const currentTime = new Date() as unknown as number;
        const deadlineDate = new Date(item.deadline) as unknown as number;
        const diffTimeMilliSeconds = deadlineDate - currentTime;
        const diffDays = Math.ceil(diffTimeMilliSeconds / (1000 * 60 * 60 * 24));
        let deadlineWarner = '';

        if (diffDays < 5) {
          deadlineWarner = 'text-yellow-600';
        }
        if (diffDays < 0) {
          deadlineWarner = 'text-red-800';
        }
        todoListHtml += `
          <li class="flex justify-between list-items" id="todoLi-${item.index}">
            <input type="checkbox" ${completed} class="checkboxes w-8 h-8" id="checkbox-${item.index}">
            <input type="text" readonly id="todoText-${item.index}" 
              title="Added: ${item.timeAdded}"
              value="${item.todoText}"
              class="w-full ml-2 text-sm bg-inherit border-none outline-none ${completed}">
            </input>
            <p title="Days to deadline: ${diffDays}" 
              class="mr-2 flex flex-col justify-center text-xs px-1 w-fit ${deadlineWarner}" 
              id="deadlineText-${item.index}">${item.deadline}
            </p>
            <button class="editBtn" id="editTodo-${item.index}" title="Edit">
              <span id="${item.index}" 
              class="editBtn material-symbols-outlined text-lg
              dark:text-zinc-300">
              edit
              </span>
            </button>
            <button class="deleteBtn w-8 h-8" id="delTodo-${item.index}" title="Delete">
              <span class="material-symbols-outlined text-lg w-8 h-8 deleteBtn text-red-900">
              delete
              </span>
            </button>
          </li>
          `;
      }
    });
  }
  if (todoUl != null) {
    todoUl.innerHTML = todoListHtml;
  }
  showTodoCounter();
  gsap.from('.list-items', { y: 300, duration: 0.2, stagger: 0.08 });
}

function getName(): void {
  if (user !== '' && user != null) {
    gsap.to(landingPage, { opacity: 0, duration: 0.7, onComplete: hideLandingPage });
  }
  nameInput.value = localStorage.getItem('Name') as string;
  nameInput.focus();
  showTodos();
}

function lookForName(): void {
  if (user === '' || user == null) {
    user = localStorage.getItem('Name') as string;
    user = nameInput.value;
    getName();
  }
  localStorage.setItem('Name', user);
  if (nameDisplay != null) {
    nameDisplay.innerHTML = user;
  }
}

function getTime(): string {
  const time = new Date();
  const date: Date = time.getDate() as unknown as Date;
  const month: Date = time.getMonth() + 1 as unknown as Date;
  const year: Date = time.getFullYear() as unknown as Date;
  const hour: Date = time.getHours() as unknown as Date;
  const minute: Date = time.getMinutes() as unknown as Date;
  const second: Date = time.getSeconds() as unknown as Date;

  return `
  ${year as unknown as string}/${month as unknown as string}/${date as unknown as string}
  ${hour as unknown as string}:${minute as unknown as string}:${second as unknown as string}
  `;
}

function addTodo(): void {
  const deadline = todoDeadlineInput.value;

  if (todoInput.value !== '') {
    const todoText = todoInput.value;
    switch (true) {
      case generalBtn?.classList.contains('selected'):
        todoCategory = 'general';
        break;
      case personalBtn?.classList.contains('selected'):
        todoCategory = 'personal';
        break;
      default:
        todoCategory = 'work';
    }

    const newTodo = new TodoItem(
      todoCategory,
      todoArray.length,
      todoText,
      false,
      getTime(),
      deadline,
    );

    todoArray.push(newTodo);

    localStorage.setItem('Todos', JSON.stringify(todoArray));

    showTodos();
    todoInput.value = '';
  }
}

function deleteTodo(event: MouseEvent) {
  const target = event.target as HTMLInputElement;
  const targetParent = target.parentElement as HTMLInputElement;
  const todoItem = document.querySelector(`#${targetParent.id}`) as HTMLInputElement;
  const itemId = parseInt(todoItem?.id.replace('delTodo-', ''), 10);

  todoArray.splice(itemId, 1);
  localStorage.setItem('Todos', JSON.stringify(todoArray));
  showTodos();
}

function editTodo(event: MouseEvent): void {
  const target = event.target as HTMLInputElement;
  const targetParent = target.parentElement as HTMLInputElement;
  const targetParentParent = targetParent.parentElement as HTMLInputElement;
  const todoText = targetParentParent.childNodes[3] as HTMLInputElement;
  const editIcon = targetParentParent.childNodes[7].childNodes[1] as HTMLSpanElement;
  const todoId = target.id as unknown as number;

  todoText.readOnly = !todoText.readOnly;
  todoText.focus();
  if (!todoText.readOnly) {
    editIcon.innerText = 'Ok';
  } else {
    editIcon.innerText = 'Edit';
  }
  todoArray[todoId].todoText = todoText.value;
  localStorage.setItem('Todos', JSON.stringify(todoArray));
}

function completeTodo(targetCheckbox: HTMLInputElement) {
  const retrieved = localStorage.getItem('Todos');
  const targetLi = targetCheckbox.parentNode as HTMLInputElement;
  const index = targetCheckbox.id.replace('checkbox-', '');
  const numIndex = +index;
  const todoTextLi = document.querySelector(`#${targetLi.id}`) as HTMLElement;
  const todoTextEl = todoTextLi.childNodes[3] as HTMLElement;

  if (retrieved != null) {
    todoArray = JSON.parse(retrieved) as TodoItem[];
  }
  if (todoArray[numIndex].completed) {
    todoArray[numIndex].completed = false;
    todoTextEl?.classList.toggle('checked');
  } else {
    todoArray[numIndex].completed = true;
    todoTextEl?.classList.toggle('checked');
  }

  const sortedArray = [...todoArray];
  sortedArray.sort((a, b) => {
    if (a.completed < b.completed) {
      return -1;
    }
    if (a.completed > b.completed) {
      return 1;
    }
    return 0;
  });
  localStorage.setItem('Todos', JSON.stringify(sortedArray));
  showTodos();
}

function sortbyName(): void {
  const sortedArray = [...todoArray];

  sortedArray.sort((a, b) => {
    if (a.todoText < b.todoText) {
      return -1;
    }
    if (a.todoText > b.todoText) {
      return 1;
    }
    return 0;
  });
  localStorage.setItem('Todos', JSON.stringify(sortedArray));
  showTodos();
}

function sortbyTimeAdded(): void {
  const sortedArray = [...todoArray];

  sortedArray.sort((a, b) => {
    if (a.timeAdded < b.timeAdded) {
      return 1;
    }
    if (a.timeAdded > b.timeAdded) {
      return -1;
    }
    return 0;
  });
  localStorage.setItem('Todos', JSON.stringify(sortedArray));
  showTodos();
}

function sortbyDeadline(): void {
  const sortedArray = [...todoArray];

  sortedArray.sort((a, b) => {
    if (a.deadline < b.deadline) {
      return -1;
    }
    if (a.deadline > b.deadline) {
      return 1;
    }
    return 0;
  });
  localStorage.setItem('Todos', JSON.stringify(sortedArray));
  showTodos();
}

function selectGeneralTab(): void {
  if (generalBtn?.classList.contains('selected')) {
    personalBtn?.classList.remove('selected');
    workBtn?.classList.remove('selected');
  } else {
    generalBtn?.classList.toggle('selected');
    personalBtn?.classList.remove('selected');
    workBtn?.classList.remove('selected');
  }
  showTodos();
}

function selectPersonalTab(): void {
  if (personalBtn?.classList.contains('selected')) {
    generalBtn?.classList.remove('selected');
    workBtn?.classList.remove('selected');
  } else {
    personalBtn?.classList.toggle('selected');
    generalBtn?.classList.remove('selected');
    workBtn?.classList.remove('selected');
  }
  showTodos();
}

function selectWorkTab(): void {
  if (workBtn?.classList.contains('selected')) {
    personalBtn?.classList.remove('selected');
    generalBtn?.classList.remove('selected');
  } else {
    workBtn?.classList.toggle('selected');
    personalBtn?.classList.remove('selected');
    generalBtn?.classList.remove('selected');
  }
  showTodos();
}

sortSelector?.addEventListener('change', () => {
  switch (true) {
    case sortSelector?.value === 'name':
      sortbyName();
      break;
    case sortSelector?.value === 'timeAdded':
      sortbyTimeAdded();
      break;
    case sortSelector?.value === 'deadline':
      sortbyDeadline();
      break;
    default: sortbyTimeAdded();
  }
});

// Enter key adds todo
todoInput?.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    addTodo();
  }
});

// Enter key sumbits name on landing page
nameInput?.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    lookForName();
  }
});

// Clear all todos
document.querySelector('#clearAll')?.addEventListener('click', () => {
  localStorage.clear();
  todoArray = [];
  showTodos();
});

// Runs the completeTodo function when a checkbox is clicked
todoUl?.addEventListener('change', (event: Event) => {
  const targetCheckbox = event.target as HTMLInputElement;

  completeTodo(targetCheckbox);
});

// Fetches the event and runs delete or edit function
todoListContainer?.addEventListener('click', (event: MouseEvent | Event) => {
  const mouseEvent = event as MouseEvent;
  const target = mouseEvent.target as HTMLElement;
  if (target != null && target.matches('.deleteBtn')) {
    deleteTodo(mouseEvent);
  } else if (target != null && target.matches('.editBtn')) {
    editTodo(mouseEvent);
  }
});

nameSubmit?.addEventListener('click', lookForName);
todoInputSubmit?.addEventListener('click', addTodo);
generalBtn?.addEventListener('click', selectGeneralTab);
personalBtn?.addEventListener('click', selectPersonalTab);
workBtn?.addEventListener('click', selectWorkTab);

lookForName();
showTodos();
showTodoCounter();
