<template>
  <section class="main" v-show="todos.length" v-cloak>
    <input class="toggle-all" type="checkbox" v-model="allDone">
    <ul class="todo-list">
      <li
        v-for="todo in filteredTodos"
        class="todo"
        :key="todo.id"
        :class="{ completed: todo.completed, editing: todo === editedTodo }"
      >
        <div class="view">
          <input class="toggle" type="checkbox" v-model="todo.completed">
          <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
          <button class="destroy" @click="removeTodo(todo)"></button>
        </div>

        <input
          type="text"
          class="edit"
          v-model="todo.title"
          v-todo-focus="todo === editedTodo"
          @blur="doneEdit(todo)"
          @keyup.enter="doneEdit(todo)"
          @keyup.esc="cancelEdit(todo)"
        >
      </li>
    </ul>
    <footer class="footer" v-show="todos.length" v-cloak>
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ remaining | pluralize }} left
      </span>

      <ul class="filters">
        <li>
          <a href="#" @click="() => visibility = 'all'" :class="{ selected: visibility == 'all' }">All</a>
        </li>
        <li>
          <a href="#" @click="() => visibility = 'active'" :class="{ selected: visibility == 'active' }">Active</a>
        </li>
        <li>
          <a href="#" @click="() => visibility = 'completed'" :class="{ selected: visibility == 'completed' }">Completed</a>
        </li>
      </ul>
      <button
        class="clear-completed"
        @click="removeCompleted"
        v-show="todos.length > remaining"
      >Clear completed</button>
    </footer>
  </section>
</template>

<script lang="js">
import { Component, Vue } from "vue-property-decorator";

const filters = {
  all: (todos) => todos,
  completed: (todos) => todos.filter(t => t.completed),
  active: (todos) => todos.filter(t => !t.completed)
};

@Component({
  directives: {
    "todo-focus": (el, binding) => {
      if (binding.value) {
        el.focus();
      }
    }
  },
  filters: {
    pluralize: (num) => {
      return num == 1 ? "item" : "items";
    }
  },
  props: {
    todos: {
      default: []
    },
  }
})
export default class TodoList extends Vue {
  visibility = "all";
  editedTodo = null;
  beforeEdit = "";

  get allDone() {
    return this.remaining == 0;
  }

  set allDone(value) {
    this.todos.forEach(t => (t.completed = value));
  }

  get remaining() {
    return this.todos.filter(t => !t.completed).length;
  }

  get filteredTodos() {
    return filters[this.visibility](this.todos);
  }

  editTodo(todo) {
    this.beforeEdit = todo.title;
    this.editedTodo = todo;
  }

  removeTodo(todo) {
    this.todos.splice(this.todos.indexOf(todo), 1);
  }

  doneEdit(todo) {
    if (!this.editedTodo) {
      return;
    }
    this.editedTodo = null;
    todo.title = todo.title.trim();
    if (!todo.title) {
      this.removeTodo(todo);
    }
  }

  cancelEdit(todo) {
    this.editedTodo = null;
    todo.title = this.beforeEdit;
  }

  removeCompleted() {
    console.log(this.todos);
    this.todos = this.todos.filter((t) => !t.completed);
    console.log(this.todos);
  }
}
</script>
