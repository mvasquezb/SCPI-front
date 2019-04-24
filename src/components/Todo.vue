<template>
    <header class="header">
        <h1>todos</h1>
        <input class="new-todo" autofocus autocomplete="off"
                placeholder="What needs to be done ?"
                v-model="newTodo"
                @keyup.enter="addTodo" />
    </header>
</template>

<script lang="js">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Todo extends Vue {
    newTodo = ''

    addTodo() {
        let value = this.newTodo && this.newTodo.trim();
        if (!value) {
            return;
        }
        this.$emit('add-todo', value);
        this.newTodo = '';
    }
}
</script>
