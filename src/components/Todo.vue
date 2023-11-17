<script setup>
import {
  CheckIcon,
  PlusCircleIcon,
  TrashIcon,
  ClockIcon,
} from "@heroicons/vue/24/outline";
import { ref } from "vue";
let todoList = ref([]);
let todo = ref(null);
const addTodo = () => {
  if (validateTodo(todo.value)) {
    let id = todoList.value.length;
    todoList.value.push({
      id: ++id,
      todo: todo.value,
      is_done: false,
    });
    todo.value = null;
  }
};
let selectedTodo = ref(null);
const selectTodo = (row) => {
  selectedTodo.value = row;
  todo.value = row.todo;
};
const updateTodo = () => {
  if (validateTodo(todo.value)) {
    let index = todoList.value.findIndex((t) => t.id === selectedTodo.value.id);
    index !== -1 && (todoList.value[index].todo = todo.value);
    todo.value = selectedTodo.value = null;
  }
};

const markAsDone = (row) => {
  if (confirm(`Are you sure you want to mark ${row.todo} as done`)) {
    let index = todoList.value.findIndex((t) => t.id === row.id);
    index !== -1 && (todoList.value[index].is_done = true);
  }
};
const removeTode = (row) => {
  if (confirm(`Are you sure you want to de;ete ${row.todo} ?`)) {
    let index = todoList.value.findIndex((t) => t.id === row.id);
    index !== -1 && todoList.value.splice(index, 1);
  }
};
const clearCompletedTasks = () => {
  todoList.value = todoList.value.filter((task) => !task.is_done);
};
const resetTodoList = () => {
  todoList.value = [];
};
const validateTodo = (new_todo) => {
  let index = todoList.value.findIndex((t) => t.todo === new_todo);
  if (index !== -1) {
    alert("Todo already Exit!");
    return false;
  } else {
    return true;
  }
};
</script>

<template>
  <div class="w-full h-screen bg-gray-100 pt-8">
    <div class="bg-white p-3 max-w-md mx-auto">
      <div class="text-center">
        <h1 class="text-3xl font-bold">ToDo App</h1>
        <form @submit.prevent="!selectedTodo ? addTodo() : updateTodo()">
          <div class="mt-4 flex justify-between">
            <input
              class="w-full border-2 p-2 border-green-500 text-black rounded-lg"
              type="text"
              id="todo"
              placeholder="Enter your task here"
              v-model="todo"
            />
            <button
              v-if="!selectedTodo"
              class="ml-2 border-2 border-green-500 p-2 text-green-500 hover:text-white hover:bg-green-500 rounded-lg flex"
            >
              <PlusCircleIcon class="w-7" />
            </button>
            <button
              v-else
              class="ml-2 border-2 border-green-500 p-2 text-green-500 hover:text-white hover:bg-green-500 rounded-lg flex"
            >
              <ClockIcon class="w-7" />
            </button>
          </div>
        </form>
      </div>
      <div class="mt-4">
        <ul>
          <li
            @click="selectTodo(row)"
            v-for="row in todoList"
            :key="row.id"
            :class="[
              'rounded-lg',
              'text-sm',
              'cursor-pointer',
              'w-full',
              'p-2',
              'mb-2',
              row.is_done ? 'text-white' : 'text-black',
              row.is_done ? 'bg-green-500' : 'bg-white',
            ]"
          >
            <div
              class="flex align-middle flex-row justify-between items-center"
            >
              <p class="text-lgtext-gray-400">{{ row.todo }}</p>
              <div class="flex">
                <CheckIcon
                  @click.stop="markAsDone(row)"
                  :class="[
                    'text-sm',
                    'w-7',
                    'border-2',
                    'p-1',
                    'hover:text-white',
                    'hover:bg-green-500',
                    'hover:border-green-500',
                    'rounded-lg',
                    row.is_done ? 'hidden' : 'block',
                  ]"
                />
                <TrashIcon
                  :class="[
                    'text-sm',
                    'w-7',
                    'border-2',
                    'p-1',
                    'rounded-lg',
                    'ml-2',
                    'hover:bg-red-500',
                    'hover:border-red-500',
                    ' hover:text-white',
                  ]"
                  @click.stop="removeTode(row)"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="mt-8">
        <button
          @click="clearCompletedTasks()"
          class="border-2 border-red-500 p-2 text-red-500"
        >
          Clear Completed Task
        </button>
        <button
          @click="resetTodoList()"
          class="border-2 border-indigo-500 p-2 text-indigo-500 ml-4"
        >
          Reset Todo List
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
