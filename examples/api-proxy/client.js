import React from 'react';
import ReactDOM from 'react-dom';
import feathers from 'feathers/client';
import socketio from 'feathers-socketio/client';
import rx from 'feathers-reactive';
import RxJS from 'rxjs';

const socket = io();
const app = feathers()
  .configure(socketio(socket))
  .configure(rx(RxJS));
const todos = app.service('todos');

const TodoApp = React.createClass({
  getInitialState() {
    return {
      todos: [],
      title: ''
    };
  },

  componentDidMount() {
    this.todos = todos.find().subscribe(todos => this.setState({ todos }));
  },

  componentWillUnmount() {
    this.todos.unsubscribe();
  },

  updatetitle(ev) {
    this.setState({ title: ev.target.value });
  },

  createTodo(ev) {
    todos.create({
      title: this.state.title,
      completedd: false
    });
    this.setState({ title: '' });
    ev.preventDefault();
  },

  updateTodo(todo, ev) {
    todo.completed = ev.target.checked;
    todos.patch(todo.id, todo);
  },

  deleteTodo(todo) {
    todos.remove(todo.id);
  },

  render() {
    const renderTodo = todo =>
      <li className={`page-header checkbox ${todo.completed ? 'done' : ''}`}>
        <label>
          <input type="checkbox" onChange={this.updateTodo.bind(this, todo)}
            checked={todo.completed} />
          {todo.title}
        </label>
        <a href="javascript://" className="pull-right delete"
            onClick={this.deleteTodo.bind(this, todo)}>
          <span className="glyphicon glyphicon-remove"></span>
        </a>
      </li>;

    return <div className="container" id="todos">
      <h1>Feathers real-time Todos</h1>

      <ul className="todos list-unstyled">{this.state.todos.map(renderTodo)}</ul>
      <form role="form" className="create-todo" onSubmit={this.createTodo}>
        <div className="form-group">
          <input type="text" className="form-control" name="description"
            placeholder="Add a new Todo" onChange={this.updatetitle}
            value={this.state.title} />
        </div>
        <button type="submit" className="btn btn-info col-md-12">
          Add Todo
        </button>
      </form>
    </div>;
  }
});

ReactDOM.render(<TodoApp />, document.getElementById('app'));
