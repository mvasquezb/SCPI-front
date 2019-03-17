<template>
  <div class="home todoapp">
    <Todo v-on:add-todo="addTodo" />
    <TodoList v-bind:todos="todos" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import Todo from '@/components/Todo.vue';
import TodoList from '@/components/TodoList.vue';
import { Todo as TodoModel } from '@/models.ts';
import http from '@/http.ts';

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
  todos: Array<TodoModel> = []

  created() {
    http.get("/todos").then((res) => this.todos = res.data);
  }

  addTodo(newTodo: string) {
    this.todos.push(new TodoModel(newTodo));
  }
}
</script>
