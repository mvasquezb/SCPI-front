<template>
  <div class="home todoapp col-md-offset-4">
    <Todo v-on:add-todo="addTodo" />
    <TodoList v-bind:todos="todos" />
  </div>
</template>

<script lang="js">
import { Component, Vue } from 'vue-property-decorator';
import Todo from '@/components/Todo.vue';
import TodoList from '@/components/TodoList.vue';
import { Todo as TodoModel } from '@/models';
import http from '@/http';

@Component({
  components: {
    Todo,
    TodoList
  },
  watch: {
    todos: {
      handler: (todos) => {
        http.put('/todos', todos).then(() => {
          console.log("saved to server");
        })
      }
    }
  }
})
export default class Home extends Vue {
  todos = []

  created() {
    http.get("/todos").then((res) => this.todos = res.data);
  }

  addTodo(newTodo) {
    this.todos.push(new TodoModel(newTodo));
  }
}
</script>
