<script setup>
import {
  CheckIcon,
  PlusCircleIcon,
  TrashIcon,
  ClockIcon,
} from "@heroicons/vue/24/outline";
import { ref, onMounted } from "vue";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

//app code
let todoList = ref([]);
let todo = ref(null);
//Add Todo
const addTodo = async () => {
  if (validateTodo(todo.value)) {
    try {
      // Add the new todo to Firebase Firestore
      const docRef = await addDoc(collection(db, "todoList"), {
        todo: todo.value,
      });
      // Update the local todoList with the added todo from Firestore
      todoList.value.push({
        id: docRef.id,
        todo: todo.value,
        is_done: false,
      });
      // Clear the input field
      todo.value = null;
      alert("Item added successfully.");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }
};
let selectedTodo = ref(null);
const selectTodo = (row) => {
  selectedTodo.value = row;
  todo.value = row.todo;
};
//Update Todo
const updateTodo = async () => {
  if (validateTodo(todo.value)) {
    try {
      // Find the index of the selected todo in the local todoList
      const index = todoList.value.findIndex(
        (t) => t.id === selectedTodo.value.id
      );
      // If the selected todo is found, update it in Firebase Firestore
      if (index !== -1) {
        const todoRef = doc(db, "todoList", selectedTodo.value.id);
        await updateDoc(todoRef, { todo: todo.value });
        // Update the local todoList with the modified todo
        todoList.value[index].todo = todo.value;
      }
      // Clear the input field and selectedTodo
      todo.value = selectedTodo.value = null;
      alert("Item updated successfully.");
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }
};
//Mark as done todo
const markAsDone = async (row) => {
  if (confirm(`Are you sure you want to mark ${row.todo} as done`)) {
    try {
      // Find the index of the todo in the local todoList
      const index = todoList.value.findIndex((t) => t.id === row.id);
      // If the todo is found, update the "is_done" property in Firebase Firestore
      if (index !== -1) {
        const todoRef = doc(db, "todoList", row.id);
        await updateDoc(todoRef, { is_done: true });
        // Update the local todoList with the modified todo
        todoList.value[index].is_done = true;
      }
      alert("Item moved to Mark as Done.");
    } catch (error) {
      console.error("Error marking todo as done:", error);
    }
  }
};
//Delete Todo
const removeTode = async (row) => {
  if (confirm(`Are you sure you want to delete ${row.todo} ?`)) {
    try {
      // Find the index of the todo in the local todoList
      const index = todoList.value.findIndex((t) => t.id === row.id);
      // If the todo is found, delete it from Firebase Firestore
      if (index !== -1) {
        const todoRef = doc(db, "todoList", row.id);
        await deleteDoc(todoRef);
        // Remove the todo from the local todoList
        todoList.value.splice(index, 1);
      }
      alert("Item deleted successfully.");
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }
};
// Clear all done todos
const clearCompletedTasks = async () => {
  try {
    // Get the IDs of completed tasks
    const completedTaskIds = todoList.value
      .filter((task) => task.is_done)
      .map((task) => task.id);
    // Delete the corresponding documents from Firebase Firestore
    for (const taskId of completedTaskIds) {
      const todoRef = doc(db, "todoList", taskId);
      await deleteDoc(todoRef);
    }
    // Update the local todoList by filtering out completed tasks
    todoList.value = todoList.value.filter((task) => !task.is_done);
    alert("All Marked Item Clear successfully.");
  } catch (error) {
    console.error("Error clearing completed tasks:", error);
  }
};
// Delete All Todos
const resetTodoList = async () => {
  if (confirm("Are you sure you want to delete all todos?")) {
    try {
      // Delete all documents in the "todoList" collection in Firebase Firestore
      const querySnapshot = await getDocs(collection(db, "todoList"));
      querySnapshot.forEach(async (todoDoc) => {
        const todoRef = doc(db, "todoList", todoDoc.id);
        await deleteDoc(todoRef);
      });
      // Clear the local todoList
      todoList.value = [];
      alert("All Items Deleted successfully.");
    } catch (error) {
      console.error("Error deleting all todos:", error);
    }
  }
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
onMounted(async () => {
  await refreshData();
});

const refreshData = async () => {
  todoList.value = [];
  const querySnapshot = await getDocs(collection(db, "todoList"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    todoList.value.push({
      id: doc.id,
      todo: data.todo,
      is_done: data.is_done || false,
    });
  });
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
