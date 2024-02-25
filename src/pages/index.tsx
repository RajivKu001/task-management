import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Task {
  id: string;
  title: string;
  description: string;
}

interface TaskCreat {
  title: string;
  description: string;
}

function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<TaskCreat>({ title: '', description: '' });
  const [task, setTask] = useState<TaskCreat>({ title: '', description: '' });
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string | undefined>();
  const onCloseModal = () => setOpen(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    handleEditTask
  }, [task]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>('http://localhost:3001/api/tasks');
      if (response.status === 200) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post<Task>('http://localhost:3001/api/task', newTask);
      if (response.status === 200) {
        setTasks([...tasks, response.data]);
        setNewTask({ title: '', description: '' });
        toast.success("Task is added successfully!");
        fetchTasks();
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error("Something went wrong");
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      if (window.confirm("Are you sure want to delete task")) {
        const response = await axios.delete(`http://localhost:3001/api/task/${id}`);
        if (response.status === 200) {
          setTasks(tasks.filter(task => task.id !== id));
          toast.success("Task is deleted successfully!")
        }
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error("Something went wrong");
    }
  };

  const handleUpdateTask = async (id: string) => {
    try {
      setOpen(true);
      const taskData = tasks.filter((task) => task.id === id);
      setTask({ title: taskData[0].title, description: taskData[0].description });
      setId(id);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleChangeTask = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTask({ ...task, [name]: value });
  };

  const handleEditTask = async (event: FormEvent) => {
    event.preventDefault();
    try {
      axios.put<Task>(`http://localhost:3001/api/task/${id}`, task);
      setTask({ title: '', description: '' });
      setOpen(false);
      fetchTasks();
      toast.success("Task is updated successfully!")
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error("Something went wrong");
    }
  };
  const handleTaskData = tasks?.map(task => {
    return (
      <div className="row" key={task.id}>
        <div className="cell" data-title="ID">
          {task.id}
        </div>
        <div className="cell" data-title="title">
          {task.title}
        </div>
        <div className="cell" data-title="description">
          {task.description}
        </div>
        <div className="cell buttons-wrapper" data-title="">
          <div className='buttons'>
            <button className='edit' onClick={() => handleUpdateTask(task.id)}>Edit</button>
            <button className='delete' onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </div>
        </div>
      </div>
    )
  })

  return (
    <div className="wrapper">
      <div className='createTask'>
        <h3>Create Task</h3>
        <form onSubmit={handleAddTask}>
          <div className="grid-container">
            <div className="inputWrapper">
              <input
                type="text"
                name="title"
                placeholder="Task title"
                value={newTask.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="inputWrapper">
              <input
                type="text"
                name="description"
                placeholder="Task description"
                value={newTask.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="inputWrapper">
              <button type="submit">Add Task</button>
            </div>
          </div>

        </form>
      </div>
      <h3>Task List</h3>
      <div className="table">
        <div className="row header blue">
          <div className="cell">
            ID
          </div>
          <div className="cell">
            Title
          </div>
          <div className="cell">
            Description
          </div>
          <div className="cell">
          </div>
        </div>
        {handleTaskData}
      </div>
      <Modal open={open} onClose={onCloseModal} center>
        <div className='createTask'>
          <h3>Edit Task</h3>
          <form>
            <div className="grid-container">
              <div className="inputWrapper">
                <input
                  type="text"
                  name="title"
                  placeholder="Task title"
                  value={task.title}
                  onChange={handleChangeTask}
                  required
                />
              </div>
              <div className="inputWrapper">
                <input
                  type="text"
                  name="description"
                  placeholder="Task description"
                  value={task.description}
                  onChange={handleChangeTask}
                  required
                />
              </div>
              <div className="inputWrapper">
                <button type="submit" onClick={handleEditTask}>Save</button>
              </div>
            </div>

          </form>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default Home;
