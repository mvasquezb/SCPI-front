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

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Todo as TodoModel } from "@/models.ts";
import Router from 'vue-router'

const filters: { [key: string]: (todos: TodoModel[]) => TodoModel[] } = {
  all: (todos: TodoModel[]) => todos,
  completed: (todos: TodoModel[]) => todos.filter(t => t.completed),
  active: (todos: Array<TodoModel>) => todos.filter(t => !t.completed)
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
    pluralize: (num: number) => {
      return num == 1 ? "item" : "items";
    }
  }
})
export default class TodoList extends Vue {
  @Prop() todos!: TodoModel[];
  visibility: string = "all";
  editedTodo?: TodoModel | null = null;
  beforeEdit: string = "";

  get allDone() {
    return this.remaining == 0;
  }

  set allDone(value: boolean) {
    this.todos.forEach(t => (t.completed = value));
  }

  get remaining() {
    return this.todos.filter(t => !t.completed).length;
  }

  get filteredTodos() {
    return filters[this.visibility](this.todos);
  }

  editTodo(todo: TodoModel) {
    this.beforeEdit = todo.title;
    this.editedTodo = todo;
  }

  removeTodo(todo: TodoModel) {
    this.todos.splice(this.todos.indexOf(todo), 1);
  }

  doneEdit(todo: TodoModel) {
    if (!this.editedTodo) {
      return;
    }
    this.editedTodo = null;
    todo.title = todo.title.trim();
    if (!todo.title) {
      this.removeTodo(todo);
    }
  }

  cancelEdit(todo: TodoModel) {
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
